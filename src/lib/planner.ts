import { addISODays, cookOffsets, nextShopDate, parseISODate } from "./dates";
import { ALL_COOK_DAYS } from "./profile";
import { PANTRY_PRODUCT_IDS } from "./pantry";
import { money, roundQty } from "./money";
import { kcal } from "./cooking";
import { inLunchBand, recipeScore, type RecipeRatings } from "./score";
import type {
  BasketLine,
  Catalog,
  PlanView,
  Product,
  Profile,
  Promotion,
  Recipe,
} from "./types";
import { CATEGORY_ORDER } from "./types";

function knownRegular(promo: Promotion, product: Product): number | null {
  if (typeof promo.regularPricePln === "number") return promo.regularPricePln;
  if (product.priceConfirmed) return product.regularPricePln;
  return null;
}

export function isDiscount(promo: Promotion, product: Product): boolean {
  const regular = knownRegular(promo, product);
  return regular != null && regular > promo.promoPricePln;
}

export type ShopDeal = {
  id: string;
  namePl: string;
  pack: string;
  regularPricePln: number;
  promoPricePln: number;
  /** Обычная цена не снята с полки и не указана в газетке. */
  approx: boolean;
};

export function dealsOn(catalog: Catalog, shopDate: string): ShopDeal[] {
  const rows: ShopDeal[] = [];
  for (const product of catalog.products) {
    const promo = activePromo(product.id, catalog.promotions, shopDate);
    if (!promo) continue;
    const known = knownRegular(promo, product);
    const regular = known ?? product.regularPricePln;
    if (!(regular > promo.promoPricePln)) continue;
    rows.push({
      id: product.id,
      namePl: product.namePl,
      pack: product.pack,
      regularPricePln: regular,
      promoPricePln: promo.promoPricePln,
      approx: known == null,
    });
  }
  return rows.sort((a, b) => a.namePl.localeCompare(b.namePl, "pl"));
}

function priced(promo: Promotion | undefined, product: Product): {
  unitPrice: number;
  regularUnit: number;
  onPromo: boolean;
  approx: boolean;
} {
  const regular = promo ? knownRegular(promo, product) : product.priceConfirmed ? product.regularPricePln : null;
  if (promo && regular != null && regular > promo.promoPricePln) {
    return { unitPrice: promo.promoPricePln, regularUnit: regular, onPromo: true, approx: false };
  }
  if (promo && regular == null) {
    return { unitPrice: promo.promoPricePln, regularUnit: promo.promoPricePln, onPromo: false, approx: true };
  }
  return {
    unitPrice: product.regularPricePln,
    regularUnit: product.regularPricePln,
    onPromo: false,
    approx: !product.priceConfirmed,
  };
}

export function packQuote(productId: string, catalog: Catalog, shopDate: string): { pay: number; regular: number } {
  const product = productById(catalog, productId);
  const promo = activePromo(productId, catalog.promotions, shopDate);
  const { unitPrice, regularUnit } = priced(promo, product);
  return { pay: unitPrice, regular: regularUnit };
}

export function activePromo(
  productId: string,
  promotions: Promotion[],
  shopDate: string,
): Promotion | undefined {
  return promotions
    .filter(
      (promo) =>
        promo.productId === productId &&
        promo.validFrom <= shopDate &&
        promo.validTo >= shopDate,
    )
    .sort((a, b) => a.promoPricePln - b.promoPricePln)[0];
}

function stocked(product: Product, catalog: Catalog, shopDate: string, depth = 0): boolean {
  const promo = activePromo(product.id, catalog.promotions, shopDate);
  if (product.kind === "specialty") {
    if (product.priceConfirmed || promo) return true;
    if (depth < 2 && product.substituteId) {
      const substitute = catalog.products.find((item) => item.id === product.substituteId);
      return substitute ? stocked(substitute, catalog, shopDate, depth + 1) : false;
    }
    return false;
  }
  if (product.kind !== "seasonal") return true;
  if (promo) return true;
  if (!product.priceConfirmed) return false;
  return product.estimatePricePln > 0 && product.regularPricePln <= product.estimatePricePln * 1.15;
}

export function recipeAllowed(profile: Profile, recipe: Recipe, catalog: Catalog, shopDate: string): boolean {
  if (recipe.allergens.some((allergen) => profile.allergies.includes(allergen))) return false;
  if (recipe.appliances.some((appliance) => !profile.appliances.includes(appliance))) return false;
  if (profile.diet !== "none" && !recipe.diets.includes(profile.diet)) return false;
  const cooking = catalog.cooking[recipe.id];
  if (!cooking || !inLunchBand(kcal(cooking), profile.dailyKcal)) return false;
  return catalog.ingredients
    .filter((item) => item.recipeId === recipe.id)
    .every((item) => stocked(productById(catalog, item.productId), catalog, shopDate));
}

function promoShare(recipe: Recipe, catalog: Catalog, shopDate: string): number {
  const ingredients = catalog.ingredients.filter((item) => item.recipeId === recipe.id);
  let regular = 0;
  let onPromo = 0;

  for (const ingredient of ingredients) {
    const product = productById(catalog, ingredient.productId);
    const promo = activePromo(product.id, catalog.promotions, shopDate);
    const price = priced(promo, product);
    regular += ingredient.qtyPerPerson * price.regularUnit;
    if (price.onPromo) onPromo += ingredient.qtyPerPerson * price.regularUnit;
  }

  return regular === 0 ? 0 : onPromo / regular;
}

function productById(catalog: Catalog, productId: string): Product {
  const product = catalog.products.find((item) => item.id === productId);
  if (!product) throw new Error("errors.missingProduct");
  return product;
}

function judge(
  recipe: Recipe,
  picked: Recipe[],
  profile: Profile,
  catalog: Catalog,
  shopDate: string,
  weekday: number | null,
  ratings: RecipeRatings,
): { score: number; over: number } {
  const beforeIds = picked.map((item) => item.id);
  const before = beforeIds.length === 0 ? 0 : basketSpend(beforeIds, profile.householdSize, catalog, shopDate);
  const after = basketSpend([...beforeIds, recipe.id], profile.householdSize, catalog, shopDate);
  const over = Math.max(0, money(after) - money(profile.weeklyBudgetPln));
  return {
    over,
    score: recipeScore({
      profile,
      recipe,
      picked,
      catalog,
      marginalCost: after - before,
      basketOver: over,
      promoShare: promoShare(recipe, catalog, shopDate),
      weekday,
      rating: ratings[recipe.id] ?? null,
    }),
  };
}

function takeBest(
  pool: Recipe[],
  picked: Recipe[],
  profile: Profile,
  catalog: Catalog,
  shopDate: string,
  weekday: number | null,
  ratings: RecipeRatings,
): Recipe | null {
  if (pool.length === 0) return null;
  let best: Recipe | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const recipe of pool) {
    const { score, over } = judge(recipe, picked, profile, catalog, shopDate, weekday, ratings);
    if (over > 0) continue;
    if (!best || score > bestScore || (score === bestScore && recipe.id < best.id)) {
      best = recipe;
      bestScore = score;
    }
  }
  return best;
}

function fillSlots(
  pool: Recipe[],
  locked: Recipe[],
  profile: Profile,
  catalog: Catalog,
  shopDate: string,
  count: number,
  weekdays: number[],
  ratings: RecipeRatings,
): Recipe[] {
  const picked = [...locked];
  const fresh: Recipe[] = [];
  while (fresh.length < count && pool.length > 0) {
    const best = takeBest(pool, picked, profile, catalog, shopDate, weekdays[fresh.length] ?? null, ratings);
    if (!best) break;
    pool.splice(pool.indexOf(best), 1);
    picked.push(best);
    fresh.push(best);
  }
  if (fresh.length < count) throw new Error("errors.notEnoughMeals");
  return fresh;
}

function activeCookDays(profile: Profile): number[] {
  return profile.cookDays?.length ? profile.cookDays : ALL_COOK_DAYS;
}

function weekdaysFor(shopDate: string, offsets: number[]): number[] {
  return offsets.map((offset) => parseISODate(addISODays(shopDate, offset)).getDay());
}

export function pickWeek(profile: Profile, catalog: Catalog, from = new Date(), ratings: RecipeRatings = {}) {
  const shopDate = nextShopDate(profile.shopWeekday, from);
  const offsets = cookOffsets(shopDate, activeCookDays(profile));
  if (offsets.length === 0) throw new Error("errors.pickCookDay");
  const pool = catalog.recipes.filter((recipe) => recipeAllowed(profile, recipe, catalog, shopDate));
  const picked = fillSlots(pool, [], profile, catalog, shopDate, offsets.length, weekdaysFor(shopDate, offsets), ratings);
  const recipeIds = Array.from({ length: 7 }, () => "");
  offsets.forEach((offset, index) => {
    recipeIds[offset] = picked[index].id;
  });
  return { shopDate, recipeIds };
}

export function repickWeek(
  profile: Profile,
  catalog: Catalog,
  currentIds: string[],
  shopDate: string,
  keep: number[],
  ratings: RecipeRatings = {},
): string[] {
  const offsets = cookOffsets(shopDate, activeCookDays(profile));
  if (offsets.length === 0) throw new Error("errors.pickCookDay");
  const active = new Set(offsets);
  const base = Array.from({ length: 7 }, (_, index) => currentIds[index] ?? "");
  const keepSet = new Set<number>();
  const locked: Recipe[] = [];
  for (const index of keep) {
    if (!active.has(index) || keepSet.has(index) || !base[index]) continue;
    const recipe = catalog.recipes.find((item) => item.id === base[index]);
    if (!recipe || !recipeAllowed(profile, recipe, catalog, shopDate)) continue;
    keepSet.add(index);
    locked.push(recipe);
  }
  const openIndexes = offsets.filter((index) => !keepSet.has(index));
  const next = Array.from({ length: 7 }, () => "");
  for (const index of keepSet) next[index] = base[index];
  if (openIndexes.length === 0) return next;

  const lockedIds = new Set(locked.map((recipe) => recipe.id));
  const avoid = new Set(openIndexes.map((index) => base[index]).filter((id) => id.length > 0));
  const allowed = catalog.recipes.filter((recipe) => recipeAllowed(profile, recipe, catalog, shopDate) && !lockedIds.has(recipe.id));
  const fresh = allowed.filter((recipe) => !avoid.has(recipe.id));
  const pool = fresh.length >= openIndexes.length ? [...fresh] : [...allowed];
  const added = fillSlots(
    pool,
    locked,
    profile,
    catalog,
    shopDate,
    openIndexes.length,
    weekdaysFor(shopDate, openIndexes),
    ratings,
  );
  openIndexes.forEach((index, cursor) => {
    next[index] = added[cursor].id;
  });
  return next;
}

function recipesFrom(ids: string[], catalog: Catalog): Recipe[] {
  return ids.flatMap((id) => {
    const recipe = catalog.recipes.find((item) => item.id === id);
    return recipe ? [recipe] : [];
  });
}

export function replacementFor(
  profile: Profile,
  catalog: Catalog,
  recipeIds: string[],
  index: number,
  shopDate: string,
  ratings: RecipeRatings = {},
): string {
  const used = new Set(recipeIds);
  const pool = catalog.recipes.filter((recipe) => recipeAllowed(profile, recipe, catalog, shopDate) && !used.has(recipe.id));
  if (pool.length === 0) throw new Error("errors.nothingToSwap");

  const kept = recipesFrom(
    recipeIds.filter((id, itemIndex) => itemIndex !== index && id),
    catalog,
  );
  const weekday = parseISODate(addISODays(shopDate, index)).getDay();
  let best: Recipe | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const recipe of pool) {
    const { score, over } = judge(recipe, kept, profile, catalog, shopDate, weekday, ratings);
    if (over > 0) continue;
    if (!best || score > bestScore || (score === bestScore && recipe.id < best.id)) {
      best = recipe;
      bestScore = score;
    }
  }
  if (!best) throw new Error("errors.overBudget");
  return best.id;
}

export function placeRecipe(recipeIds: string[], recipeId: string, dayIndex: number): string[] {
  if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex >= recipeIds.length) {
    throw new Error("errors.noSuchDay");
  }
  if (recipeIds.some((id) => id === recipeId)) throw new Error("errors.alreadyInWeek");
  const next = [...recipeIds];
  next[dayIndex] = recipeId;
  return next;
}

export function swapRecipeIds(
  profile: Profile,
  catalog: Catalog,
  recipeIds: string[],
  recipeId: string,
  shopDate: string,
  ratings: RecipeRatings = {},
): string[] {
  const next = [...recipeIds];
  const index = next.indexOf(recipeId);
  if (index >= 0) {
    next[index] = replacementFor(profile, catalog, next, index, shopDate, ratings);
    return next;
  }
  let slot = 0;
  let worst = Number.POSITIVE_INFINITY;
  next.forEach((id, itemIndex) => {
    if (!id) return;
    const recipe = catalog.recipes.find((item) => item.id === id);
    const others = recipesFrom(
      next.filter((other, otherIndex) => otherIndex !== itemIndex && other),
      catalog,
    );
    const score = recipe
      ? judge(recipe, others, profile, catalog, shopDate, parseISODate(addISODays(shopDate, itemIndex)).getDay(), ratings).score
      : Number.NEGATIVE_INFINITY;
    if (score < worst) {
      worst = score;
      slot = itemIndex;
    }
  });
  next[slot] = recipeId;
  assertWithinBudget(profile, catalog, next, shopDate);
  return next;
}

export function assertWithinBudget(
  profile: Profile,
  catalog: Catalog,
  recipeIds: string[],
  shopDate: string,
): void {
  const spend = basketSpend(
    recipeIds.filter((id) => id),
    profile.householdSize,
    catalog,
    shopDate,
  );
  if (money(spend) > money(profile.weeklyBudgetPln)) throw new Error("errors.overBudget");
}

function basketSpend(
  recipeIds: string[],
  householdSize: number,
  catalog: Catalog,
  shopDate: string,
): number {
  return buildBasket(recipeIds, householdSize, catalog, shopDate).reduce(
    (sum, line) => sum + line.lineTotal,
    0,
  );
}

export function buildBasket(
  recipeIds: string[],
  householdSize: number,
  catalog: Catalog,
  shopDate: string,
): BasketLine[] {
  const rawQty = new Map<string, number>();

  for (const recipeId of recipeIds) {
    for (const ingredient of catalog.ingredients.filter((item) => item.recipeId === recipeId)) {
      rawQty.set(
        ingredient.productId,
        (rawQty.get(ingredient.productId) ?? 0) + ingredient.qtyPerPerson * householdSize,
      );
    }
  }

  const lines: BasketLine[] = [];

  for (const [productId, qty] of rawQty) {
    const product = productById(catalog, productId);
    const rounded = roundQty(qty, product.unit);
    const promo = activePromo(productId, catalog.promotions, shopDate);
    const price = priced(promo, product);
    if (PANTRY_PRODUCT_IDS.has(productId)) continue;
    lines.push({
      productId,
      namePl: product.namePl,
      category: product.category,
      qty: rounded,
      unit: product.unit,
      unitPrice: price.unitPrice,
      regularUnitPrice: price.regularUnit,
      lineTotal: money(rounded * price.unitPrice),
      regularLineTotal: money(rounded * price.regularUnit),
      onPromo: price.onPromo,
      approx: price.approx,
    });
  }

  return lines.sort((a, b) => {
    const categoryDelta = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (categoryDelta !== 0) return categoryDelta;
    return a.namePl.localeCompare(b.namePl, "pl");
  });
}

function mealCost(recipeId: string, householdSize: number, catalog: Catalog, shopDate: string): number {
  let total = 0;
  for (const ingredient of catalog.ingredients.filter((item) => item.recipeId === recipeId)) {
    const product = productById(catalog, ingredient.productId);
    if (PANTRY_PRODUCT_IDS.has(ingredient.productId)) continue;
    const qty = roundQty(ingredient.qtyPerPerson * householdSize, product.unit);
    const promo = activePromo(ingredient.productId, catalog.promotions, shopDate);
    total += qty * priced(promo, product).unitPrice;
  }
  return money(total);
}

export function presentPlan(input: {
  id: string;
  shopDate: string;
  householdSize: number;
  recipeIds: string[];
  catalog: Catalog;
}): PlanView {
  const lines = buildBasket(input.recipeIds, input.householdSize, input.catalog, input.shopDate);
  const total = money(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const regularTotal = money(lines.reduce((sum, line) => sum + line.regularLineTotal, 0));
  const saved = money(
    lines.reduce((sum, line) => (line.onPromo && !line.approx ? sum + (line.regularLineTotal - line.lineTotal) : sum), 0),
  );

  return {
    id: input.id,
    shopDate: input.shopDate,
    householdSize: input.householdSize,
    meals: input.recipeIds.flatMap((recipeId, dayIndex) => {
      if (!recipeId) return [];
      const recipe = input.catalog.recipes.find((item) => item.id === recipeId);
      const date = addISODays(input.shopDate, dayIndex);
      if (!recipe) {
        return [{ dayIndex, date, recipeId, title: "Блюдо больше не в каталоге", cost: 0 }];
      }
      return [
        {
          dayIndex,
          date,
          recipeId,
          title: recipe.title,
          cost: mealCost(recipeId, input.householdSize, input.catalog, input.shopDate),
        },
      ];
    }),
    lines,
    total,
    regularTotal,
    saved,
  };
}
