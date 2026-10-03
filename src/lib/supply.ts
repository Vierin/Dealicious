import type { Cuisine, DietStyle } from "./types";

/** Recipe amounts and packs. kg/l convert into g/ml. pc does not mix with mass or volume. */
export type MeasureUnit = "g" | "kg" | "ml" | "l" | "pc";
export type AvailabilityType = "standard" | "seasonal";
export type SaleMode = "package" | "weight";

export type CanonicalProduct = {
  id: string;
  name: string;
  category: string;
  defaultUnit: MeasureUnit;
  availabilityType: AvailabilityType;
  isPantryStaple: boolean;
};

export type Store = {
  id: string;
  name: string;
};

export type SupplyRecipe = {
  id: string;
  name: string;
  description: string;
  servings: number;
  prepTime: number;
  calories: number;
  protein: number;
  cuisines: Cuisine[];
  vibes: DietStyle[];
};

export type SupplyIngredient = {
  id: string;
  recipeId: string;
  productId: string;
  quantity: number;
  unit: MeasureUnit;
  isPantryIngredient: boolean;
};

export type StoreProduct = {
  id: string;
  productId: string;
  storeId: string;
  name: string;
  brand: string | null;
  packageQuantity: number;
  packageUnit: MeasureUnit;
  sku: string | null;
  saleMode: SaleMode;
};

export type PricePoint = {
  id: string;
  storeProductId: string;
  price: number;
  validFrom: string;
  /** null = still current. Older rows stay in the list. */
  validTo: string | null;
};

export type StorePromotion = {
  id: string;
  storeProductId: string;
  regularPrice: number;
  promotionPrice: number;
  validFrom: string;
  validTo: string;
};

export type UserPantryItem = {
  productId: string;
  quantity: number;
  unit: MeasureUnit;
};

export type Requirement = {
  productId: string;
  quantity: number;
  unit: MeasureUnit;
};

export type PickedPackage = {
  productId: string;
  requiredQuantity: number;
  requiredUnit: MeasureUnit;
  storeProductId: string;
  packages: number;
  purchasedQuantity: number;
  packageUnit: MeasureUnit;
  payPrice: number;
  regularPrice: number;
  lineTotal: number;
  onPromo: boolean;
  waste: number;
};

type Dimension = "mass" | "volume" | "count";

const MEASURE: Record<MeasureUnit, { dimension: Dimension; toBase: number }> = {
  g: { dimension: "mass", toBase: 1 },
  kg: { dimension: "mass", toBase: 1000 },
  ml: { dimension: "volume", toBase: 1 },
  l: { dimension: "volume", toBase: 1000 },
  pc: { dimension: "count", toBase: 1 },
};

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function convert(quantity: number, from: MeasureUnit, to: MeasureUnit): number {
  const source = MEASURE[from];
  const target = MEASURE[to];
  if (source.dimension !== target.dimension) {
    throw new Error(`Нельзя перевести ${from} в ${to}`);
  }
  return (quantity * source.toBase) / target.toBase;
}

export function aggregateIngredients(
  picks: { recipeId: string; portions?: number }[],
  recipes: SupplyRecipe[],
  ingredients: SupplyIngredient[],
  options?: { excludePantry?: boolean; pantry?: UserPantryItem[] },
): Requirement[] {
  const excludePantry = options?.excludePantry !== false;
  const totals = new Map<string, { amount: number; unit: MeasureUnit }>();

  for (const pick of picks) {
    const recipe = recipes.find((item) => item.id === pick.recipeId);
    if (!recipe) throw new Error(`Нет рецепта ${pick.recipeId}`);
    if (recipe.servings <= 0) throw new Error(`Порции ${recipe.id}`);
    const scale = (pick.portions ?? recipe.servings) / recipe.servings;
    for (const item of ingredients) {
      if (item.recipeId !== recipe.id) continue;
      if (excludePantry && item.isPantryIngredient) continue;
      const unit = baseUnit(item.unit);
      const amount = convert(item.quantity * scale, item.unit, unit);
      const current = totals.get(item.productId);
      if (!current) {
        totals.set(item.productId, { amount, unit });
        continue;
      }
      if (MEASURE[current.unit].dimension !== MEASURE[item.unit].dimension) {
        throw new Error(`Разные единицы у ${item.productId}`);
      }
      current.amount += amount;
    }
  }

  for (const stock of options?.pantry ?? []) {
    const current = totals.get(stock.productId);
    if (!current) continue;
    if (MEASURE[current.unit].dimension !== MEASURE[stock.unit].dimension) {
      throw new Error(`Кладовая: единицы ${stock.productId}`);
    }
    current.amount = Math.max(0, current.amount - convert(stock.quantity, stock.unit, current.unit));
  }

  return [...totals.entries()]
    .filter(([, row]) => row.amount > 0.0001)
    .map(([productId, row]) => ({
      productId,
      unit: row.unit,
      quantity: round(row.amount, 3),
    }))
    .sort((a, b) => a.productId.localeCompare(b.productId));
}

function baseUnit(unit: MeasureUnit): MeasureUnit {
  if (MEASURE[unit].dimension === "mass") return "g";
  if (MEASURE[unit].dimension === "volume") return "ml";
  return "pc";
}

export function currentPrice(storeProductId: string, prices: PricePoint[], on: string): PricePoint | null {
  const open = prices.filter(
    (row) => row.storeProductId === storeProductId && row.validFrom <= on && (row.validTo == null || row.validTo >= on),
  );
  open.sort((a, b) => b.validFrom.localeCompare(a.validFrom) || b.id.localeCompare(a.id));
  return open[0] ?? null;
}

export function activeStorePromotion(
  storeProductId: string,
  promotions: StorePromotion[],
  on: string,
): StorePromotion | null {
  const open = promotions.filter(
    (row) => row.storeProductId === storeProductId && row.validFrom <= on && row.validTo >= on,
  );
  open.sort((a, b) => a.promotionPrice - b.promotionPrice);
  return open[0] ?? null;
}

/** Seasonal products are preferred only when a pack has a current price or an active promo. */
export function seasonalPreferred(
  product: CanonicalProduct,
  storeProducts: StoreProduct[],
  prices: PricePoint[],
  promotions: StorePromotion[],
  on: string,
): boolean {
  if (product.availabilityType === "standard") return true;
  return storeProducts.some((item) => {
    if (item.productId !== product.id) return false;
    if (activeStorePromotion(item.id, promotions, on)) return true;
    return currentPrice(item.id, prices, on) != null;
  });
}

export function selectPackages(input: {
  requirements: Requirement[];
  storeProducts: StoreProduct[];
  prices: PricePoint[];
  promotions: StorePromotion[];
  storeId: string;
  on: string;
}): PickedPackage[] {
  const lines: PickedPackage[] = [];
  for (const need of input.requirements) {
    let best: PickedPackage | null = null;
    for (const item of input.storeProducts) {
      if (item.productId !== need.productId || item.storeId !== input.storeId) continue;
      const listed = currentPrice(item.id, input.prices, input.on);
      const promo = activeStorePromotion(item.id, input.promotions, input.on);
      const regular = promo?.regularPrice ?? listed?.price;
      const pay = promo?.promotionPrice ?? listed?.price;
      if (regular == null || pay == null) continue;
      const required = convert(need.quantity, need.unit, item.packageUnit);
      const packages =
        item.saleMode === "weight" ? required / item.packageQuantity : Math.ceil(required / item.packageQuantity - 1e-9);
      const purchased = item.saleMode === "weight" ? required : packages * item.packageQuantity;
      const line: PickedPackage = {
        productId: need.productId,
        requiredQuantity: need.quantity,
        requiredUnit: need.unit,
        storeProductId: item.id,
        packages: round(packages, 3),
        purchasedQuantity: round(purchased, 3),
        packageUnit: item.packageUnit,
        payPrice: pay,
        regularPrice: regular,
        lineTotal: round(packages * pay, 2),
        onPromo: promo != null && pay < regular,
        waste: round(Math.max(0, purchased - required), 3),
      };
      if (
        !best ||
        line.lineTotal < best.lineTotal - 0.001 ||
        (Math.abs(line.lineTotal - best.lineTotal) < 0.001 && line.waste < best.waste)
      ) {
        best = line;
      }
    }
    if (best) lines.push(best);
  }
  return lines;
}

export function buildShoppingList(input: {
  picks: { recipeId: string; portions?: number }[];
  recipes: SupplyRecipe[];
  ingredients: SupplyIngredient[];
  pantry?: UserPantryItem[];
  excludePantry?: boolean;
  storeProducts: StoreProduct[];
  prices: PricePoint[];
  promotions: StorePromotion[];
  storeId: string;
  on: string;
}): { requirements: Requirement[]; lines: PickedPackage[] } {
  const requirements = aggregateIngredients(input.picks, input.recipes, input.ingredients, {
    excludePantry: input.excludePantry,
    pantry: input.pantry,
  });
  return {
    requirements,
    lines: selectPackages({
      requirements,
      storeProducts: input.storeProducts,
      prices: input.prices,
      promotions: input.promotions,
      storeId: input.storeId,
      on: input.on,
    }),
  };
}
