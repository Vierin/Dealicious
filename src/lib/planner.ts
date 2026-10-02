import { addISODays, nextShopDate } from "./dates";
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
  if (profile.isVegan && !recipe.isVegan) return false;
  if (!profile.isVegan && profile.meatPref !== "any") {
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
    const cost = ingredient.qtyPerPerson * product.regularPricePln;
    regular += cost;
    if (activePromo(product.id, catalog.promotions, shopDate)) onPromo += cost;
  }

  return regular === 0 ? 0 : onPromo / regular;
}

function productById(catalog: Catalog, productId: string): Product {
  const product = catalog.products.find((item) => item.id === productId);
  if (!product) throw new Error(`Нет продукта ${productId}`);
  return product;
}

export function pickWeek(profile: Profile, catalog: Catalog, from = new Date()) {
  const shopDate = nextShopDate(profile.shopWeekday, from);
  const pool = catalog.recipes.filter((recipe) => allows(profile, recipe));
  const picked: Recipe[] = [];

  while (picked.length < 7 && pool.length > 0) {
    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    pool.forEach((recipe, index) => {
      const repeats = picked.filter(
        (item) => primaryProtein(item) === primaryProtein(recipe),
      ).length;
      const score = promoShare(recipe, catalog, shopDate) + styleBonus(profile, recipe) - repeats * 0.22;
      const better =
        score > bestScore || (score === bestScore && recipe.id < pool[bestIndex].id);
      if (better) {
        bestScore = score;
        bestIndex = index;
      }
    });

    picked.push(pool.splice(bestIndex, 1)[0]);
  }

  if (picked.length < 7) {
    throw new Error("Не хватает блюд под эти ограничения");
  }

  return { shopDate, recipeIds: picked.map((recipe) => recipe.id) };
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
    const unitPrice = promo ? promo.promoPricePln : product.regularPricePln;
    lines.push({
      productId,
      namePl: product.namePl,
      category: product.category,
      qty: rounded,
      unit: product.unit,
      unitPrice,
      lineTotal: money(rounded * unitPrice),
      regularLineTotal: money(rounded * product.regularPricePln),
      onPromo: Boolean(promo),
    });
  }

  return lines.sort((a, b) => {
    const categoryDelta = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (categoryDelta !== 0) return categoryDelta;
    return a.namePl.localeCompare(b.namePl, "pl");
  });
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
    meals: input.recipeIds.map((recipeId, dayIndex) => {
      const recipe = input.catalog.recipes.find((item) => item.id === recipeId);
      if (!recipe) throw new Error(`Нет рецепта ${recipeId}`);
      return {
        dayIndex,
        date: addISODays(input.shopDate, dayIndex),
        recipeId,
        title: recipe.title,
      };
    }),
    lines,
    total,
    regularTotal,
    saved: money(regularTotal - total),
  };
}
