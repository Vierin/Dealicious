import { COOKING, kcal } from "./cooking";
import { addISODays, cookOffsets, nextShopDate } from "./dates";
import { ALL_COOK_DAYS } from "./profile";
import { PANTRY_PRODUCT_IDS } from "./pantry";
import { money, roundQty } from "./money";
import type {
  BasketLine,
  Catalog,
  PlanView,
  Product,
  Profile,
  Promotion,
  Protein,
  Recipe,
} from "./types";
import { CATEGORY_ORDER } from "./types";

function knownRegular(promo: Promotion, product: Product): number {
  return typeof promo.regularPricePln === "number" ? promo.regularPricePln : product.regularPricePln;
}

export function isDiscount(promo: Promotion, product: Product): boolean {
  return product.regularPricePln > promo.promoPricePln && knownRegular(promo, product) > promo.promoPricePln;
}

function priced(promo: Promotion | undefined, product: Product): {
  unitPrice: number;
  regularUnit: number;
  onPromo: boolean;
} {
  const shelf = product.regularPricePln;
  if (!promo || !isDiscount(promo, product)) {
    return { unitPrice: shelf, regularUnit: shelf, onPromo: false };
  }
  return { unitPrice: promo.promoPricePln, regularUnit: knownRegular(promo, product), onPromo: true };
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

function primaryProtein(recipe: Recipe): Protein {
  return recipe.proteins.find((protein) => protein !== "veg") ?? "veg";
}

function allows(profile: Profile, recipe: Recipe): boolean {
  if (recipe.allergens.some((allergen) => profile.allergies.includes(allergen))) return false;
  if (recipe.appliances.some((appliance) => !profile.appliances.includes(appliance))) return false;
  if (profile.diet === "vegan" && !recipe.isVegan) return false;
  if (profile.diet === "vegetarian" && recipe.proteins.some((protein) => protein !== "veg")) {
    return false;
  }
  if (
    profile.diet === "pescatarian" &&
    recipe.proteins.some((protein) => protein !== "veg" && protein !== "fish")
  ) {
    return false;
  }
  if (profile.diet === "none" && profile.meatPref !== "any") {
    const ok = recipe.proteins.every(
      (protein) => protein === "veg" || protein === profile.meatPref,
    );
    if (!ok) return false;
  }
  return true;
}

function styleBonus(profile: Profile, recipe: Recipe): number {
  if (profile.dietStyle === "balanced") return 0.05;
  return recipe.dietStyles.includes(profile.dietStyle) ? 0.35 : 0;
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
  if (!product) throw new Error(`Нет продукта ${productId}`);
  return product;
}

const STAPLES = new Set(["cebula", "czosnek", "oliwa", "cytryna"]);

function plateProducts(recipeId: string, catalog: Catalog): string[] {
  return catalog.ingredients
    .filter((item) => item.recipeId === recipeId && !STAPLES.has(item.productId))
    .map((item) => item.productId);
}

function tooLight(recipe: Recipe, target: number): boolean {
  const cooking = COOKING[recipe.id];
  if (!cooking) return false;
  return kcal(cooking) < target * 0.75;
}

function repeatsProduct(recipe: Recipe, picked: Recipe[], catalog: Catalog): boolean {
  const used = new Map<string, number>();
  for (const item of picked) {
    for (const productId of plateProducts(item.id, catalog)) {
      used.set(productId, (used.get(productId) ?? 0) + 1);
    }
  }
  return plateProducts(recipe.id, catalog).some((productId) => (used.get(productId) ?? 0) >= 2);
}

function takeBest(
  pool: Recipe[],
  picked: Recipe[],
  profile: Profile,
  catalog: Catalog,
  shopDate: string,
): Recipe | null {
  if (pool.length === 0) return null;
  const target = profile.dailyKcal * 0.35;
  const varied = pool.filter((recipe) => !repeatsProduct(recipe, picked, catalog));
  const sized = pool.filter((recipe) => !tooLight(recipe, target));
  const variedSized = varied.filter((recipe) => !tooLight(recipe, target));
  const candidates =
    variedSized.length > 0 ? variedSized : sized.length > 0 ? sized : varied.length > 0 ? varied : pool;
  let best = candidates[0];
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const recipe of candidates) {
    const repeats = picked.filter((item) => primaryProtein(item) === primaryProtein(recipe)).length;
    const cuisineRepeats = picked.filter((item) => item.cuisine === recipe.cuisine).length;
    const total = basketSpend(
      [...picked.map((item) => item.id), recipe.id],
      profile.householdSize,
      catalog,
      shopDate,
    );
    const over = Math.max(0, total - profile.weeklyBudgetPln);
    const plate = COOKING[recipe.id] ? kcal(COOKING[recipe.id]) : target;
    const gap = Math.abs(plate - target) / target;
    const score =
      promoShare(recipe, catalog, shopDate) +
      styleBonus(profile, recipe) -
      gap * 0.45 -
      repeats * 0.22 -
      cuisineRepeats * 0.08 -
      over / profile.weeklyBudgetPln;
    if (score > bestScore || (score === bestScore && recipe.id < best.id)) {
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
): Recipe[] {
  const picked = [...locked];
  const fresh: Recipe[] = [];
  while (fresh.length < count && pool.length > 0) {
    const best = takeBest(pool, picked, profile, catalog, shopDate);
    if (!best) break;
    pool.splice(pool.indexOf(best), 1);
    picked.push(best);
    fresh.push(best);
  }
  if (fresh.length < count) throw new Error("Не хватает блюд под эти ограничения");
  return fresh;
}

function activeCookDays(profile: Profile): number[] {
  return profile.cookDays?.length ? profile.cookDays : ALL_COOK_DAYS;
}

export function pickWeek(profile: Profile, catalog: Catalog, from = new Date()) {
  const shopDate = nextShopDate(profile.shopWeekday, from);
  const offsets = cookOffsets(shopDate, activeCookDays(profile));
  if (offsets.length === 0) throw new Error("Выбери хотя бы один день готовки");
  const pool = catalog.recipes.filter((recipe) => allows(profile, recipe));
  const picked = fillSlots(pool, [], profile, catalog, shopDate, offsets.length);
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
): string[] {
  const offsets = cookOffsets(shopDate, activeCookDays(profile));
  if (offsets.length === 0) throw new Error("Выбери хотя бы один день готовки");
  const active = new Set(offsets);
  const base = Array.from({ length: 7 }, (_, index) => currentIds[index] ?? "");
  const keepSet = new Set<number>();
  const locked: Recipe[] = [];
  for (const index of keep) {
    if (!active.has(index) || keepSet.has(index) || !base[index]) continue;
    const recipe = catalog.recipes.find((item) => item.id === base[index]);
    if (!recipe || !allows(profile, recipe)) continue;
    keepSet.add(index);
    locked.push(recipe);
  }
  const openIndexes = offsets.filter((index) => !keepSet.has(index));
  const next = Array.from({ length: 7 }, () => "");
  for (const index of keepSet) next[index] = base[index];
  if (openIndexes.length === 0) return next;

  const lockedIds = new Set(locked.map((recipe) => recipe.id));
  const avoid = new Set(openIndexes.map((index) => base[index]).filter((id) => id.length > 0));
  const allowed = catalog.recipes.filter((recipe) => allows(profile, recipe) && !lockedIds.has(recipe.id));
  const fresh = allowed.filter((recipe) => !avoid.has(recipe.id));
  const pool = fresh.length >= openIndexes.length ? [...fresh] : [...allowed];
  const added = fillSlots(pool, locked, profile, catalog, shopDate, openIndexes.length);
  openIndexes.forEach((index, cursor) => {
    next[index] = added[cursor].id;
  });
  return next;
}

export function replacementFor(
  profile: Profile,
  catalog: Catalog,
  recipeIds: string[],
  index: number,
  shopDate: string,
): string {
  const used = new Set(recipeIds);
  const pool = catalog.recipes.filter((recipe) => allows(profile, recipe) && !used.has(recipe.id));
  const target = profile.dailyKcal * 0.35;
  const sized = pool.filter((recipe) => !tooLight(recipe, target));
  const candidates = sized.length > 0 ? sized : pool;
  if (candidates.length === 0) throw new Error("Нечем заменить");

  let best = candidates[0];
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const recipe of candidates) {
    const plate = COOKING[recipe.id] ? kcal(COOKING[recipe.id]) : target;
    const gap = Math.abs(plate - target) / target;
    const score = promoShare(recipe, catalog, shopDate) + styleBonus(profile, recipe) - gap * 0.45;
    if (score > bestScore || (score === bestScore && recipe.id < best.id)) {
      best = recipe;
      bestScore = score;
    }
  }
  return best.id;
}

export function placeRecipe(recipeIds: string[], recipeId: string, dayIndex: number): string[] {
  if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex >= recipeIds.length) {
    throw new Error("Нет такого дня");
  }
  if (recipeIds.some((id) => id === recipeId)) throw new Error("Уже в неделе");
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
): string[] {
  const next = [...recipeIds];
  const index = next.indexOf(recipeId);
  if (index >= 0) {
    next[index] = replacementFor(profile, catalog, next, index, shopDate);
    return next;
  }
  let slot = 0;
  let worst = Number.POSITIVE_INFINITY;
  next.forEach((id, itemIndex) => {
    if (!id) return;
    const recipe = catalog.recipes.find((item) => item.id === id);
    const score = recipe ? promoShare(recipe, catalog, shopDate) : -1;
    if (score < worst) {
      worst = score;
      slot = itemIndex;
    }
  });
  next[slot] = recipeId;
  return next;
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
    const { unitPrice, regularUnit, onPromo } = priced(promo, product);
    if (PANTRY_PRODUCT_IDS.has(productId)) continue;
    lines.push({
      productId,
      namePl: product.namePl,
      category: product.category,
      qty: rounded,
      unit: product.unit,
      unitPrice,
      regularUnitPrice: regularUnit,
      lineTotal: money(rounded * unitPrice),
      regularLineTotal: money(rounded * regularUnit),
      onPromo,
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
    saved: money(regularTotal - total),
  };
}
