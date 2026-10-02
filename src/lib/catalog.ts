import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { addDays, formatISODate, mondayOnOrBefore } from "./dates";
import type { Catalog, Product, Promotion } from "./types";
import { INGREDIENTS, RECIPES } from "./recipes";

export { INGREDIENTS, PANTRY, RECIPES } from "./recipes";

export const PRODUCTS: Product[] = [
  { id: "pomidory", namePl: "Pomidory", category: "Овощи", unit: "kg", regularPricePln: 9.99 },
  { id: "ogorki", namePl: "Ogórki", category: "Овощи", unit: "kg", regularPricePln: 6.99 },
  { id: "cebula", namePl: "Cebula", category: "Овощи", unit: "kg", regularPricePln: 2.99 },
  { id: "marchew", namePl: "Marchew", category: "Овощи", unit: "kg", regularPricePln: 2.99 },
  { id: "ziemniaki", namePl: "Ziemniaki", category: "Овощи", unit: "kg", regularPricePln: 2.99 },
  { id: "papryka", namePl: "Papryka czerwona", category: "Овощи", unit: "kg", regularPricePln: 12.99 },
  { id: "salata", namePl: "Sałata masłowa", category: "Овощи", unit: "szt", regularPricePln: 3.99 },
  { id: "cukinia", namePl: "Cukinia", category: "Овощи", unit: "kg", regularPricePln: 6.49 },
  { id: "brokuly", namePl: "Brokuły", category: "Овощи", unit: "szt", regularPricePln: 5.49 },
  { id: "szpinak", namePl: "Szpinak baby", category: "Овощи", unit: "szt", regularPricePln: 5.49 },
  { id: "czosnek", namePl: "Czosnek", category: "Овощи", unit: "szt", regularPricePln: 1.79 },
  { id: "cytryna", namePl: "Cytryna", category: "Овощи", unit: "szt", regularPricePln: 1.69 },
  { id: "awokado", namePl: "Awokado", category: "Овощи", unit: "szt", regularPricePln: 5.99 },
  { id: "kurczak", namePl: "Filet z kurczaka", category: "Мясо", unit: "kg", regularPricePln: 25.49 },
  { id: "mielone", namePl: "Mięso mielone wołowe", category: "Мясо", unit: "kg", regularPricePln: 34.99 },
  { id: "schab", namePl: "Schab wieprzowy", category: "Мясо", unit: "kg", regularPricePln: 19.99 },
  { id: "tofu", namePl: "Tofu naturalne", category: "Мясо", unit: "szt", regularPricePln: 6.99 },
  { id: "losos", namePl: "Łosoś filet", category: "Рыба", unit: "kg", regularPricePln: 62.99 },
  { id: "dorsz", namePl: "Dorsz filet", category: "Рыба", unit: "kg", regularPricePln: 39.99 },
  { id: "mleko", namePl: "Mleko 2%", category: "Молочка", unit: "l", regularPricePln: 3.49 },
  { id: "jogurt", namePl: "Jogurt naturalny", category: "Молочка", unit: "szt", regularPricePln: 3.49 },
  { id: "gouda", namePl: "Ser gouda", category: "Молочка", unit: "kg", regularPricePln: 34.99 },
  { id: "smietana", namePl: "Śmietana 18%", category: "Молочка", unit: "szt", regularPricePln: 2.89 },
  { id: "jaja", namePl: "Jaja M 10 szt.", category: "Молочка", unit: "opak", regularPricePln: 12.49 },
  { id: "feta", namePl: "Ser feta", category: "Молочка", unit: "szt", regularPricePln: 6.99 },
  { id: "maslo", namePl: "Masło ekstra", category: "Молочка", unit: "szt", regularPricePln: 7.99 },
  { id: "ryz", namePl: "Ryż jaśminowy", category: "Бакалея", unit: "kg", regularPricePln: 5.99 },
  { id: "penne", namePl: "Makaron penne", category: "Бакалея", unit: "szt", regularPricePln: 3.79 },
  { id: "spaghetti", namePl: "Makaron spaghetti", category: "Бакалея", unit: "szt", regularPricePln: 3.49 },
  { id: "kasza", namePl: "Kasza gryczana", category: "Бакалея", unit: "kg", regularPricePln: 6.99 },
  { id: "soczewica", namePl: "Soczewica czerwona", category: "Бакалея", unit: "kg", regularPricePln: 8.49 },
  { id: "ciecierzyca", namePl: "Ciecierzyca konserwowa", category: "Бакалея", unit: "szt", regularPricePln: 2.99 },
  { id: "pomidory-puszka", namePl: "Pomidory krojone", category: "Бакалея", unit: "szt", regularPricePln: 3.29 },
  { id: "passata", namePl: "Passata pomidorowa", category: "Бакалея", unit: "szt", regularPricePln: 4.79 },
  { id: "oliwa", namePl: "Oliwa z oliwek", category: "Бакалея", unit: "szt", regularPricePln: 18.99 },
  { id: "tortilla", namePl: "Tortilla pszenna", category: "Бакалея", unit: "opak", regularPricePln: 5.49 },
  { id: "fasola", namePl: "Fasola czerwona", category: "Бакалея", unit: "szt", regularPricePln: 3.29 },
  { id: "kukurydza", namePl: "Kukurydza konserwowa", category: "Бакалея", unit: "szt", regularPricePln: 2.99 },
  { id: "chleb", namePl: "Chleb żytni", category: "Бакалея", unit: "szt", regularPricePln: 4.29 },
  { id: "bulka", namePl: "Bułka kajzerka", category: "Бакалея", unit: "szt", regularPricePln: 0.55 },
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

export function shelfPrice(productId: string): number | undefined {
  const product = PRODUCTS.find((item) => item.id === productId);
  if (!product) return undefined;
  const row = shelfById().get(productId);
  if (row && row.unit === product.unit && row.regularPricePln > 0) return row.regularPricePln;
  return product.regularPricePln;
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
      const regular = shelfPrice(product.id);
      return regular == null ? product : { ...product, regularPricePln: regular };
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
