import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { addDays, formatISODate, mondayOnOrBefore } from "./dates";
import type { Catalog, Product, Promotion } from "./types";
import { INGREDIENTS, RECIPES } from "./recipes";

export { INGREDIENTS, PANTRY, RECIPES } from "./recipes";

const SEASONAL = new Set([
  "pomidory",
  "ogorki",
  "papryka",
  "salata",
  "cukinia",
  "brokuly",
  "szpinak",
  "awokado",
  "baklazan",
  "kalafior",
  "rzodkiewka",
]);

function packOf(id: string, unit: Product["unit"]): string {
  if (id === "jaja") return "10 szt";
  if (id === "tortilla") return "6 szt";
  if (unit === "kg") return "1 kg";
  if (unit === "l") return "1 l";
  if (unit === "opak") return "1 opak";
  return "1 szt";
}

function product(
  id: string,
  namePl: string,
  category: string,
  unit: Product["unit"],
  regularPricePln: number,
  extra?: Pick<Product, "kind" | "substituteId">,
): Product {
  return {
    id,
    namePl,
    category,
    unit,
    pack: packOf(id, unit),
    kind: extra?.kind ?? (SEASONAL.has(id) ? "seasonal" : "core"),
    substituteId: extra?.substituteId,
    estimatePricePln: regularPricePln,
    regularPricePln,
    priceConfirmed: false,
  };
}

export const PRODUCTS: Product[] = [
  product("pomidory", "Pomidory", "vegetables", "kg", 9.99),
  product("ogorki", "Ogórki", "vegetables", "kg", 6.99),
  product("cebula", "Cebula", "vegetables", "kg", 2.99),
  product("marchew", "Marchew", "vegetables", "kg", 2.99),
  product("ziemniaki", "Ziemniaki", "vegetables", "kg", 2.99),
  product("papryka", "Papryka czerwona", "vegetables", "kg", 12.99),
  product("salata", "Sałata masłowa", "vegetables", "szt", 3.99),
  product("cukinia", "Cukinia", "vegetables", "kg", 6.49),
  product("brokuly", "Brokuły", "vegetables", "szt", 5.49),
  product("szpinak", "Szpinak baby", "vegetables", "szt", 5.49),
  product("czosnek", "Czosnek", "vegetables", "szt", 1.79),
  product("cytryna", "Cytryna", "vegetables", "szt", 1.69),
  product("awokado", "Awokado", "vegetables", "szt", 5.99),
  product("kurczak", "Filet z kurczaka", "meat", "kg", 25.49),
  product("mielone", "Mięso mielone wołowe", "meat", "kg", 34.99),
  product("schab", "Schab wieprzowy", "meat", "kg", 19.99),
  product("tofu", "Tofu naturalne", "meat", "szt", 6.99),
  product("losos", "Łosoś filet", "fish", "kg", 62.99),
  product("dorsz", "Dorsz filet", "fish", "kg", 39.99),
  product("mleko", "Mleko 2%", "dairy", "l", 3.49),
  product("jogurt", "Jogurt naturalny", "dairy", "szt", 3.49),
  product("gouda", "Ser gouda", "dairy", "kg", 34.99),
  product("smietana", "Śmietana 18%", "dairy", "szt", 2.89),
  product("jaja", "Jaja M 10 szt.", "dairy", "opak", 12.49),
  product("feta", "Ser feta", "dairy", "szt", 6.99),
  product("maslo", "Masło ekstra", "dairy", "szt", 7.99),
  product("ryz", "Ryż jaśminowy", "grocery", "kg", 5.99),
  product("penne", "Makaron penne", "grocery", "szt", 3.79),
  product("spaghetti", "Makaron spaghetti", "grocery", "szt", 3.49),
  product("kasza", "Kasza gryczana", "grocery", "kg", 6.99),
  product("soczewica", "Soczewica czerwona", "grocery", "kg", 8.49),
  product("ciecierzyca", "Ciecierzyca konserwowa", "grocery", "szt", 2.99),
  product("pomidory-puszka", "Pomidory krojone", "grocery", "szt", 3.29),
  product("passata", "Passata pomidorowa", "grocery", "szt", 4.79),
  product("oliwa", "Oliwa z oliwek", "grocery", "szt", 18.99),
  product("tortilla", "Tortilla pszenna", "grocery", "opak", 5.49),
  product("fasola", "Fasola czerwona", "grocery", "szt", 3.29),
  product("kukurydza", "Kukurydza konserwowa", "grocery", "szt", 2.99),
  product("chleb", "Chleb żytni", "grocery", "szt", 4.29),
  product("bulka", "Bułka kajzerka", "grocery", "szt", 0.55),
];

export const MON_PROMO: { productId: string; price: number }[] = [
  { productId: "kurczak", price: 16.99 },
  { productId: "ryz", price: 4.49 },
  { productId: "pomidory", price: 6.99 },
  { productId: "penne", price: 2.49 },
  { productId: "jogurt", price: 2.49 },
  { productId: "ziemniaki", price: 1.99 },
  { productId: "cebula", price: 1.79 },
  { productId: "marchew", price: 1.99 },
  { productId: "jaja", price: 8.99 },
  { productId: "soczewica", price: 5.99 },
  { productId: "pomidory-puszka", price: 2.29 },
  { productId: "kasza", price: 4.99 },
];

export const THU_PROMO: { productId: string; price: number }[] = [
  { productId: "losos", price: 44.99 },
  { productId: "brokuly", price: 3.99 },
  { productId: "feta", price: 4.99 },
  { productId: "schab", price: 13.99 },
  { productId: "gouda", price: 24.99 },
  { productId: "ciecierzyca", price: 1.99 },
  { productId: "szpinak", price: 3.99 },
  { productId: "smietana", price: 1.99 },
  { productId: "awokado", price: 3.99 },
  { productId: "cukinia", price: 3.99 },
  { productId: "tofu", price: 4.99 },
  { productId: "dorsz", price: 27.99 },
];

export function buildPromotions(from = new Date()): Promotion[] {
  const monday = mondayOnOrBefore(from);
  const promotions: Promotion[] = [];

  for (const week of [0, 1]) {
    const start = addDays(monday, week * 7);
    const monFrom = formatISODate(start);
    const monTo = formatISODate(addDays(start, 5));
    const thuFrom = formatISODate(addDays(start, 3));
    const thuTo = formatISODate(addDays(start, 6));

    for (const item of MON_PROMO) {
      promotions.push({
        id: `gazetka-pon-${week}-${item.productId}`,
        productId: item.productId,
        promoPricePln: item.price,
        validFrom: monFrom,
        validTo: monTo,
        label: "gazetka-pon",
      });
    }

    for (const item of THU_PROMO) {
      promotions.push({
        id: `gazetka-czw-${week}-${item.productId}`,
        productId: item.productId,
        promoPricePln: item.price,
        validFrom: thuFrom,
        validTo: thuTo,
        label: "gazetka-czw",
      });
    }
  }

  return promotions;
}

export type LiveLeaflet = {
  id: string;
  name: string;
  validFrom: string;
  validTo: string;
};

export type LivePromos = {
  importedAt: string;
  leaflets: LiveLeaflet[];
  promotions: Promotion[];
};

function livePromosPath(): string {
  return path.join(process.cwd(), "data", "promos.json");
}

export function readLivePromos(): LivePromos | null {
  const file = livePromosPath();
  if (!existsSync(file)) return null;
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as LivePromos;
    if (!Array.isArray(parsed.promotions) || !Array.isArray(parsed.leaflets)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasLivePromos(): boolean {
  return readLivePromos() != null;
}

export function leafletsOn(shopDate: string): LiveLeaflet[] {
  const live = readLivePromos();
  if (!live) return [];
  const seen = new Set<string>();
  return live.leaflets.filter((leaflet) => {
    if (leaflet.validFrom > shopDate || leaflet.validTo < shopDate) return false;
    if (seen.has(leaflet.id)) return false;
    seen.add(leaflet.id);
    return true;
  });
}

type ShelfItem = {
  productId: string;
  regularPricePln: number;
  unit: string;
  url: string;
  checkedAt: string;
};

let shelfCache: { mtimeMs: number; byId: Map<string, ShelfItem> } | null = null;

function shelfById(): Map<string, ShelfItem> {
  const file = path.join(process.cwd(), "data", "shelf.json");
  if (!existsSync(file)) return new Map();
  const mtimeMs = statSync(file).mtimeMs;
  if (shelfCache?.mtimeMs === mtimeMs) return shelfCache.byId;
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as { items?: ShelfItem[] };
    const byId = new Map<string, ShelfItem>();
    for (const item of parsed.items ?? []) byId.set(item.productId, item);
    shelfCache = { mtimeMs, byId };
    return byId;
  } catch {
    return new Map();
  }
}

export function confirmedShelf(productId: string): ShelfItem | undefined {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return undefined;
  const row = shelfById().get(productId);
  if (!row || row.unit !== product.unit || row.regularPricePln <= 0) return undefined;
  return row;
}

export function shelfPrice(productId: string): number | undefined {
  const confirmed = confirmedShelf(productId);
  if (confirmed) return confirmed.regularPricePln;
  return PRODUCTS.find((item) => item.id === productId)?.regularPricePln;
}

export function plausiblePromo(productId: string, price: number): boolean {
  const shelf = shelfPrice(productId);
  if (shelf == null || shelf <= 0) return false;
  const ratio = price / shelf;
  return ratio >= 0.55 && ratio <= 1.35;
}

function applyShelfPrices(catalog: Catalog): Catalog {
  return {
    ...catalog,
    products: catalog.products.map((product) => {
      const row = confirmedShelf(product.id);
      if (!row) return { ...product, priceConfirmed: false };
      return {
        ...product,
        regularPricePln: row.regularPricePln,
        priceConfirmed: true,
        priceCheckedAt: row.checkedAt,
      };
    }),
  };
}

export function applyLivePromos(catalog: Catalog): Catalog {
  const priced = applyShelfPrices(catalog);
  const live = readLivePromos();
  if (!live) return priced;
  return {
    ...priced,
    promotions: live.promotions.filter((promo) => plausiblePromo(promo.productId, promo.promoPricePln)),
  };
}

export function buildCatalog(from = new Date()): Catalog {
  return applyLivePromos({
    products: PRODUCTS,
    recipes: RECIPES,
    ingredients: INGREDIENTS,
    promotions: buildPromotions(from),
  });
}
