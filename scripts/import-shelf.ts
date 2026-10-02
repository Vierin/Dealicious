import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { PRODUCTS } from "../src/lib/catalog";
import { SHELF_URLS } from "../src/lib/shelf-urls";
import type { Unit } from "../src/lib/types";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "shelf.json");

const SALES =
  /price-product__sales[\s\S]{0,600}?(\d+)\s*<span class="price-product__currency">\s*<span class="price-product__decimal">(\d{2})<\/span>\s*<span class="price-product__suffix">([^<]*)<\/span>/i;

type ShelfItem = {
  productId: string;
  regularPricePln: number;
  unit: Unit;
  url: string;
  checkedAt: string;
};

function siteUnit(suffix: string): Unit | null {
  const raw = suffix.trim().toLowerCase().replace(/^\//, "").replace(/\.$/, "");
  if (raw === "kg" || raw === "szt" || raw === "l" || raw === "opak") return raw;
  return null;
}

function parseSales(html: string): { price: number; unit: Unit } | null {
  const match = SALES.exec(html);
  if (!match) return null;
  const unit = siteUnit(match[3]);
  if (!unit) return null;
  const price = Number(`${match[1]}.${match[2]}`);
  if (!Number.isFinite(price) || price <= 0) return null;
  return { price, unit };
}

async function main(): Promise<void> {
  const checkedAt = new Date().toISOString();
  const items: ShelfItem[] = [];

  for (const [productId, url] of Object.entries(SHELF_URLS)) {
    const product = PRODUCTS.find((item) => item.id === productId);
    if (!product) {
      console.log(`SKIP ${productId}: нет в каталоге`);
      continue;
    }
    const response = await fetch(url, { headers: { "user-agent": "Dealicious/shelf" } });
    if (!response.ok) {
      console.log(`SKIP ${productId}: HTTP ${response.status}`);
      continue;
    }
    const parsed = parseSales(await response.text());
    if (!parsed) {
      console.log(`SKIP ${productId}: нет цены`);
      continue;
    }
    if (parsed.unit !== product.unit) {
      console.log(`SKIP ${productId}: сайт ${parsed.unit}, у нас ${product.unit} (${parsed.price})`);
      continue;
    }
    items.push({
      productId,
      regularPricePln: parsed.price,
      unit: parsed.unit,
      url,
      checkedAt,
    });
    console.log(`OK ${productId}: ${parsed.price} / ${parsed.unit}`);
  }

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify({ checkedAt, items }, null, 2)}\n`, "utf8");
  console.log(`wrote ${items.length} → ${OUT}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
