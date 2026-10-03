export const PANTRY_PRODUCT_IDS = new Set(["oliwa", "maslo"]);

type UnitKind = "g" | "ml";

type Staple = {
  id: string;
  name: string;
  unit: UnitKind;
  pack: number;
  productId: string | null;
};

const SPICE_USE: Record<string, { id: string; grams: number }> = {
  Sól: { id: "sol", grams: 2 },
  Pieprz: { id: "perec", grams: 1 },
  Oregano: { id: "oregano", grams: 1 },
  "Papryka mielona": { id: "papryka-miel", grams: 2 },
  Curry: { id: "curry", grams: 2 },
  Kumin: { id: "kumin", grams: 2 },
  Chili: { id: "chili", grams: 1 },
  "Garam masala": { id: "garam", grams: 2 },
  Kurkuma: { id: "kurkuma", grams: 1 },
  Zioła: { id: "ziolka", grams: 1 },
  Bazylia: { id: "bazylia", grams: 2 },
  Pietruszka: { id: "pietruszka", grams: 3 },
  Koperek: { id: "koperek", grams: 2 },
  Szczypiorek: { id: "szczypiorek", grams: 5 },
  Imbir: { id: "imbir", grams: 8 },
  Sezam: { id: "sezam", grams: 5 },
  "Olej sezamowy": { id: "olej-sezam", grams: 5 },
  Skrobia: { id: "skrobia", grams: 5 },
  Mąka: { id: "maka", grams: 20 },
  "Liść laurowy": { id: "laurowy", grams: 1 },
  Kminek: { id: "kminek", grams: 1 },
  "Sos sojowy": { id: "soja", grams: 15 },
  "Glazura balsamiczna": { id: "balsamic", grams: 10 },
};

export const STAPLES: Staple[] = [
  { id: "oliwa", name: "Oliwa z oliwek", unit: "ml", pack: 500, productId: "oliwa" },
  { id: "maslo", name: "Masło ekstra", unit: "g", pack: 200, productId: "maslo" },
  { id: "maka", name: "Mąka", unit: "g", pack: 1000, productId: null },
  { id: "sol", name: "Sól", unit: "g", pack: 1000, productId: null },
  { id: "perec", name: "Pieprz", unit: "g", pack: 50, productId: null },
  { id: "oregano", name: "Oregano", unit: "g", pack: 15, productId: null },
  { id: "papryka-miel", name: "Papryka mielona", unit: "g", pack: 40, productId: null },
  { id: "curry", name: "Curry", unit: "g", pack: 50, productId: null },
  { id: "kumin", name: "Kumin", unit: "g", pack: 30, productId: null },
  { id: "chili", name: "Chili", unit: "g", pack: 30, productId: null },
  { id: "garam", name: "Garam masala", unit: "g", pack: 40, productId: null },
  { id: "kurkuma", name: "Kurkuma", unit: "g", pack: 40, productId: null },
  { id: "ziolka", name: "Zioła", unit: "g", pack: 15, productId: null },
  { id: "bazylia", name: "Bazylia", unit: "g", pack: 15, productId: null },
  { id: "pietruszka", name: "Pietruszka", unit: "g", pack: 20, productId: null },
  { id: "koperek", name: "Koperek", unit: "g", pack: 20, productId: null },
  { id: "szczypiorek", name: "Szczypiorek", unit: "g", pack: 20, productId: null },
  { id: "imbir", name: "Imbir", unit: "g", pack: 50, productId: null },
  { id: "sezam", name: "Sezam", unit: "g", pack: 50, productId: null },
  { id: "olej-sezam", name: "Olej sezamowy", unit: "ml", pack: 150, productId: null },
  { id: "skrobia", name: "Skrobia", unit: "g", pack: 200, productId: null },
  { id: "laurowy", name: "Liść laurowy", unit: "g", pack: 10, productId: null },
  { id: "kminek", name: "Kminek", unit: "g", pack: 30, productId: null },
  { id: "soja", name: "Sos sojowy", unit: "ml", pack: 150, productId: null },
  { id: "balsamic", name: "Glazura balsamiczna", unit: "g", pack: 150, productId: null },
];

export type PantryNeed = Staple & {
  need: number;
  packPrice: number | null;
  regularPackPrice: number | null;
};

export function packsToBuy(stock: number, need: number, pack: number): number {
  if (need <= stock) return 0;
  return Math.ceil((need - stock) / pack);
}

export function pantryNeeds(
  recipeIds: string[],
  householdSize: number,
  ingredients: { recipeId: string; productId: string; qtyPerPerson: number }[],
  pantryNames: { recipeId: string; name: string; grams?: number }[],
  prices: Record<string, { pay: number; regular: number } | undefined>,
): PantryNeed[] {
  const ids = new Set(recipeIds);
  const need = new Map<string, number>();

  for (const ingredient of ingredients) {
    if (!ids.has(ingredient.recipeId)) continue;
    if (ingredient.productId === "oliwa") {
      need.set("oliwa", (need.get("oliwa") ?? 0) + ingredient.qtyPerPerson * householdSize * 1000);
    }
    if (ingredient.productId === "maslo") {
      need.set("maslo", (need.get("maslo") ?? 0) + ingredient.qtyPerPerson * householdSize * 200);
    }
  }
  for (const item of pantryNames) {
    if (!ids.has(item.recipeId)) continue;
    const spice = SPICE_USE[item.name];
    if (!spice) continue;
    const grams = item.grams ?? spice.grams;
    need.set(spice.id, (need.get(spice.id) ?? 0) + grams * householdSize);
  }

  return STAPLES.map((staple) => {
    const price = staple.productId ? prices[staple.productId] : undefined;
    return {
      ...staple,
      need: Math.round(need.get(staple.id) ?? 0),
      packPrice: price ? price.pay : null,
      regularPackPrice: price ? price.regular : null,
    };
  });
}

export function pantryUseLabel(productId: string, qtyPerPerson: number, householdSize: number): string | null {
  if (productId === "oliwa") return `${Math.round(qtyPerPerson * householdSize * 1000)} ml`;
  if (productId === "maslo") return `${Math.round(qtyPerPerson * householdSize * 200)} g`;
  return null;
}
