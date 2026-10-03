import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import { addDays, formatISODate, mondayOnOrBefore } from "./dates";
import type { Catalog, Product, Promotion } from "./types";

const SEASONAL = new Set([
  "pomidory",
  "cukinia",
  "brokuly",
  "szpinak",
  "awokado",
]);

function packOf(id: string, unit: Product["unit"]): string {
  if (id === "jaja") return "10 szt";
  if (id === "tortilla" || id === "tortilla-kukurydza") return "6 szt";
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
  product("indyk", "Mięso mielone z indyka", "meat", "kg", 27.99),
  product("udka", "Udka z kurczaka", "meat", "kg", 14.99),
  product("wolowina", "Wołowina na patelnię", "meat", "kg", 42.99),
  product("kielbasa", "Kiełbasa z kurczaka", "meat", "kg", 19.99),
  product("batat", "Batat", "vegetables", "kg", 6.99),
  product("pieczarki", "Pieczarki", "vegetables", "kg", 11.99),
  product("kapusta", "Kapusta biała", "vegetables", "kg", 3.49),
  product("seler", "Seler naciowy", "vegetables", "kg", 7.99),
  product("jablko", "Jabłka", "vegetables", "kg", 4.49),
  product("baklazan", "Bakłażan", "vegetables", "kg", 8.99),
  product("kalafior", "Kalafior", "vegetables", "szt", 6.99),
  product("rzodkiewka", "Rzodkiewka", "vegetables", "szt", 2.99),
  product("limonka", "Limonka", "vegetables", "szt", 1.99),
  product("tunczyk", "Tuńczyk w wodzie", "fish", "szt", 5.99),
  product("jogurt-grecki", "Jogurt grecki", "dairy", "szt", 3.99),
  product("cheddar", "Ser cheddar", "dairy", "kg", 36.99),
  product("parmezan", "Parmezan", "dairy", "kg", 69.99),
  product("mozzarella", "Mozzarella", "dairy", "kg", 32.99),
  product("ricotta", "Ricotta", "dairy", "kg", 24.99),
  product("twarog", "Twaróg półtłusty", "dairy", "kg", 16.99),
  product("smietanka", "Śmietanka 30%", "dairy", "szt", 3.79),
  product("gnocchi", "Gnocchi", "grocery", "kg", 11.99),
  product("kuskus", "Kuskus", "grocery", "kg", 7.99),
  product("peczak", "Pęczak", "grocery", "kg", 4.99),
  product("quinoa", "Komosa ryżowa", "grocery", "kg", 14.99),
  product("makaron", "Makaron jajeczny", "grocery", "kg", 9.99),
  product("udon", "Makaron udon", "grocery", "kg", 12.99),
  product("ramen", "Makaron ramen", "grocery", "kg", 11.99),
  product("fasola-czarna", "Fasola czarna", "grocery", "szt", 3.49),
  product("fasola-biala", "Fasola biała", "grocery", "szt", 3.49),
  product("kiszona", "Kapusta kiszona", "grocery", "kg", 6.49),
  product("mleczko", "Mleko kokosowe", "grocery", "szt", 4.99),
  product("salsa", "Salsa pomidorowa", "grocery", "szt", 5.49),
  product("pesto", "Pesto bazyliowe", "grocery", "szt", 8.99),
  product("oliwki", "Oliwki", "grocery", "szt", 6.49),
  product("groch", "Groszek", "grocery", "kg", 7.99),
  product("bulka-tarta", "Bułka tarta", "grocery", "kg", 5.99),
  product("panko", "Panko", "grocery", "kg", 12.99),
  product("pita", "Pita", "grocery", "szt", 1.49),
  product("bulka-burger", "Bułka burgerowa", "grocery", "szt", 2.29),
  product("tortilla-kukurydza", "Tortilla kukurydziana", "grocery", "opak", 6.49),
  product("chipsy", "Chipsy tortilla", "grocery", "szt", 5.49),
  product("bulion", "Bulion warzywny", "grocery", "l", 3.99),
  product("teriyaki", "Sos teriyaki", "grocery", "szt", 7.49),
  product("chili-sos", "Sos słodkie chili", "grocery", "szt", 6.99),
  product("ostryga", "Sos ostrygowy", "grocery", "szt", 8.49),
  product("gochujang", "Gochujang", "grocery", "szt", 9.99),
  product("maslo-orzechowe", "Masło orzechowe", "grocery", "szt", 8.99),
  product("orzechy", "Orzechy nerkowca", "grocery", "kg", 46.99),
  product("miod", "Miód", "grocery", "szt", 12.99),
  product("hummus", "Hummus", "grocery", "szt", 5.49),
  product("tahini", "Tahini", "grocery", "szt", 9.99),
  product("majonez", "Majonez lekki", "grocery", "szt", 5.99),
  product("sriracha", "Sriracha", "grocery", "szt", 8.49),
  product("ogorki-kiszone", "Ogórki kiszone", "grocery", "kg", 7.99),
  product("sos-burger", "Sos burgerowy", "grocery", "szt", 4.99),
  product("musztarda", "Musztarda", "grocery", "szt", 3.49),
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
    recipes: [],
    ingredients: [],
    cooking: {},
    pantry: [],
    promotions: buildPromotions(from),
  });
}
