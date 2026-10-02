import { mkdir, writeFile } from "fs/promises";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { matchProductId } from "../src/lib/aliases";
import type { Promotion } from "../src/lib/types";

const SHOP_URL = "https://blix.pl/sklep/biedronka";
const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "promos.json");

type Leaflet = {
  id: string;
  name: string;
  validFrom: string;
  validTo: string;
};

type LiveFile = {
  importedAt: string;
  leaflets: Leaflet[];
  promotions: Promotion[];
};

function loadEnv(): void {
  const file = path.join(ROOT, ".env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    if (process.env[key]) continue;
    process.env[key] = match[2].trim().replace(/^["']|["']$/g, "");
  }
}

function decode(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function isoDate(blix: string): string {
  const date = new Date(blix);
  if (Number.isNaN(date.getTime())) throw new Error(`Bad Blix date: ${blix}`);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function parsePrice(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) return Number(trimmed) / 100;
  const value = Number(trimmed.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : null;
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept-Language": "pl",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function foodLeaflets(html: string): { id: string; name: string }[] {
  const re =
    /data-leaflet-id="(\d+)" data-leaflet-name="(Od (?:poniedziałku|czwartku)[^"]*)"(?=[^>]*data-availability-message="aktualna")/g;
  const byId = new Map<string, string>();
  for (const match of html.matchAll(re)) {
    byId.set(match[1], decode(match[2]));
  }
  return [...byId.entries()].map(([id, name]) => ({ id, name }));
}

function regularFromChunk(chunk: string): number | null {
  const struck =
    chunk.match(/offer__price--old[\s\S]{0,180}?(\d[\d\s]*[,.]\d{2})\s*(?:&nbsp;)?zł/i) ??
    chunk.match(/<(?:s|del)(?:\s[^>]*)?>\s*(\d[\d\s]*[,.]\d{2})/i) ??
    chunk.match(/najniższa cena[\s\S]{0,80}?(\d[\d\s]*[,.]\d{2})\s*(?:&nbsp;)?zł/i);
  if (!struck) return null;
  return parsePrice(struck[1]);
}

type MatchedOffer = Promotion & { offerName: string };

function leafletSpan(html: string, leafletId: string): { validFrom: string; validTo: string } | null {
  const re = new RegExp(
    `data-leaflet-id="${leafletId}"[^>]*data-date-start="([^"]+)" data-date-end="([^"]+)"`,
    "g",
  );
  let validFrom = "";
  let validTo = "";
  for (const match of html.matchAll(re)) {
    const start = isoDate(match[1]);
    const end = isoDate(match[2]);
    if (!validFrom || start < validFrom) validFrom = start;
    if (!validTo || end > validTo) validTo = end;
  }
  return validFrom ? { validFrom, validTo } : null;
}

function offersFromLeaflet(html: string, leaflet: { id: string; name: string }): MatchedOffer[] {
  const re =
    /<div class="offer section-n__item" data-name="([^"]*)" data-price="([^"]*)" data-leaflet-id="(\d+)"[^>]*data-date-start="([^"]*)" data-date-end="([^"]*)"([\s\S]*?)(?=<div class="offer section-n__item"|$)/g;
  const best = new Map<string, MatchedOffer>();

  for (const match of html.matchAll(re)) {
    const offerName = decode(match[1]);
    const promoPricePln = parsePrice(match[2]);
    if (promoPricePln == null || match[3] !== leaflet.id) continue;
    const productId = matchProductId(offerName);
    if (!productId) continue;

    const validFrom = isoDate(match[4]);
    const validTo = isoDate(match[5]);
    const regularPricePln = regularFromChunk(match[6]);
    const next: MatchedOffer = {
      id: `blix-${leaflet.id}-${productId}`,
      productId,
      promoPricePln,
      regularPricePln,
      validFrom,
      validTo,
      label: leaflet.name,
      offerName,
    };
    const prev = best.get(productId);
    if (
      !prev ||
      next.promoPricePln < prev.promoPricePln ||
      (next.promoPricePln === prev.promoPricePln && prev.regularPricePln == null && next.regularPricePln != null)
    ) {
      best.set(productId, next);
    }
  }

  return [...best.values()];
}

function unmatchedNames(html: string): string[] {
  const re = /data-name="([^"]*)" data-price="([^"]*)"/g;
  const names = new Set<string>();
  for (const match of html.matchAll(re)) {
    if (!match[2]) continue;
    const name = decode(match[1]);
    if (!matchProductId(name)) names.add(name);
  }
  return [...names].sort((a, b) => a.localeCompare(b, "pl"));
}

function dbLabel(name: string): string {
  if (/czwart/i.test(name)) return "gazetka-czw";
  if (/poniedział/i.test(name)) return "gazetka-pon";
  return name;
}

async function rest(url: string, key: string, pathname: string, init: RequestInit): Promise<string | null> {
  const response = await fetch(`${url}/rest/v1/${pathname}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
      ...(init.headers ?? {}),
    },
  });
  if (response.ok) return null;
  return `${response.status} ${await response.text()}`;
}

async function pushSupabase(promotions: Promotion[]): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.log("supabase: no env, skipped");
    return;
  }

  const rows = promotions.map((promo) => ({
    id: promo.id,
    product_id: promo.productId,
    promo_price_pln: promo.promoPricePln,
    valid_from: promo.validFrom,
    valid_to: promo.validTo,
    label: promo.label,
  }));

  let error = await rest(url, key, "promotions", { method: "POST", body: JSON.stringify(rows) });
  if (error?.includes("promotions_label_chk")) {
    const fallback = rows.map((row) => ({ ...row, label: dbLabel(row.label) }));
    error = await rest(url, key, "promotions", { method: "POST", body: JSON.stringify(fallback) });
  }
  if (error) {
    console.log(`supabase promotions: ${error}`);
    console.log("app reads data/promos.json. DB write needs SUPABASE_SERVICE_ROLE_KEY; anon key is read-only.");
    return;
  }

  const regulars = new Map<string, number>();
  for (const promo of promotions) {
    if (typeof promo.regularPricePln === "number") regulars.set(promo.productId, promo.regularPricePln);
  }
  for (const [id, regular_price_pln] of regulars) {
    const updateError = await rest(url, key, `products?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify({ regular_price_pln }),
    });
    if (updateError) {
      console.log(`supabase product ${id}: ${updateError}`);
      return;
    }
  }
  console.log(`supabase: upserted ${rows.length} promotions`);
}

async function main(): Promise<void> {
  loadEnv();
  const shop = await fetchHtml(SHOP_URL);
  const leaflets = foodLeaflets(shop);
  if (leaflets.length === 0) throw new Error("No active Biedronka food leaflets on Blix");

  const promotions: MatchedOffer[] = [];
  const dated: Leaflet[] = [];
  const unmatched = new Set<string>();

  for (const leaflet of leaflets) {
    const html = await fetchHtml(`https://blix.pl/sklep/biedronka/gazetka/${leaflet.id}/`);
    const parsed = offersFromLeaflet(html, leaflet);
    promotions.push(...parsed);
    for (const name of unmatchedNames(html)) unmatched.add(name);
    const span = leafletSpan(html, leaflet.id);
    dated.push({
      id: leaflet.id,
      name: leaflet.name,
      validFrom: span?.validFrom ?? "",
      validTo: span?.validTo ?? "",
    });
    console.log(`${leaflet.id} ${leaflet.name}: ${parsed.length} matched`);
  }

  const file: LiveFile = {
    importedAt: new Date().toISOString(),
    leaflets: dated.filter((leaflet) => leaflet.validFrom && leaflet.validTo),
    promotions: promotions.map((item) => ({
      id: item.id,
      productId: item.productId,
      promoPricePln: item.promoPricePln,
      regularPricePln: item.regularPricePln,
      validFrom: item.validFrom,
      validTo: item.validTo,
      label: item.label,
    })),
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(file, null, 2)}\n`, "utf8");
  await writeFile(path.join(ROOT, "data", "blix-unmatched.txt"), `${[...unmatched].sort((a, b) => a.localeCompare(b, "pl")).join("\n")}\n`, "utf8");

  console.log(`wrote ${path.relative(ROOT, OUT)} (${promotions.length} promotions, ${unmatched.size} unmatched names)`);
  for (const promo of promotions) {
    const regular = promo.regularPricePln == null ? "regular unknown" : `regular ${promo.regularPricePln}`;
    console.log(`  ${promo.productId} <= ${promo.offerName} @ ${promo.promoPricePln} ${regular} ${promo.validFrom}..${promo.validTo}`);
  }
  await pushSupabase(promotions);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
