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
  Соль: { id: "sol", grams: 3 },
  Перец: { id: "perec", grams: 1 },
  Орегано: { id: "oregano", grams: 1 },
  "Паприка молотая": { id: "papryka-miel", grams: 2 },
  Карри: { id: "curry", grams: 3 },
  Зира: { id: "kumin", grams: 1 },
  "Соевый соус": { id: "soja", grams: 15 },
};

export const STAPLES: Staple[] = [
  { id: "oliwa", name: "Oliwa z oliwek", unit: "ml", pack: 500, productId: "oliwa" },
  { id: "maslo", name: "Masło ekstra", unit: "g", pack: 200, productId: "maslo" },
  { id: "maka", name: "Mąka", unit: "g", pack: 1000, productId: null },
  { id: "sol", name: "Соль", unit: "g", pack: 1000, productId: null },
  { id: "perec", name: "Перец", unit: "g", pack: 50, productId: null },
  { id: "oregano", name: "Орегано", unit: "g", pack: 15, productId: null },
  { id: "papryka-miel", name: "Паприка молотая", unit: "g", pack: 40, productId: null },
  { id: "curry", name: "Карри", unit: "g", pack: 50, productId: null },
  { id: "kumin", name: "Зира", unit: "g", pack: 30, productId: null },
  { id: "soja", name: "Соевый соус", unit: "ml", pack: 150, productId: null },
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
  pantryNames: { recipeId: string; name: string }[],
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
    need.set(spice.id, (need.get(spice.id) ?? 0) + spice.grams * householdSize);
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
