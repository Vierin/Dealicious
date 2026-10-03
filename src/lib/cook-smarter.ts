import { shopDeals, readLivePromos } from "./catalog";
import { kcal } from "./cooking";
import { activePromo, assertWithinBudget, isDiscount, presentPlan, recipeAllowed } from "./planner";
import { PANTRY_PRODUCT_IDS } from "./pantry";
import type { Catalog, PlanView, Profile, Recipe } from "./types";

const SYSTEM = `You replan dinners for a Polish grocery app.
Return JSON only: {"recipeIds":["id or empty", ...]} with exactly 7 strings.
Copy candidate ids exactly. Keep empty slots empty. Keep locked day indexes unchanged. Fill every other occupied day. Use each recipe at most once.
Lower what the household pays. Do not reduce promo savings.
Do not drop food quality: protein, calories, cuisine variety, and the user's diet style stay in the same range. A faster meal is fine. A much longer one is not.
A leaflet row changes the bill only when it has a productId and a candidate uses that product. Starred ingredients are already on a catalog discount for this shop date. Prefer meals that reuse the same starred products across days.
The server prices the whole basket and rejects a menu that does not get cheaper, saves less, breaks diet or appliances, or loses quality.
If nothing qualifies, return the current recipeIds unchanged.`;

export function cookBrief(input: {
  profile: Profile;
  catalog: Catalog;
  shopDate: string;
  recipeIds: string[];
  lockedDays: number[];
}): { system: string; user: string } {
  const plan = priced(input.recipeIds, input.profile, input.catalog, input.shopDate);
  const deals = filteredDeals(input.catalog, input.shopDate);
  const current = new Set(input.recipeIds.filter(Boolean));
  const allowed = input.catalog.recipes.filter((recipe) =>
    recipeAllowed(input.profile, recipe, input.catalog, input.shopDate),
  );
  const ranked = [...allowed].sort(
    (a, b) => promoIngredients(b, input.catalog, input.shopDate) - promoIngredients(a, input.catalog, input.shopDate),
  );
  const pool = ranked.filter((recipe) => current.has(recipe.id) || promoIngredients(recipe, input.catalog, input.shopDate) > 0);
  const candidates = (pool.length >= input.recipeIds.filter(Boolean).length ? pool : ranked).slice(0, 80);
  for (const id of current) {
    const recipe = allowed.find((item) => item.id === id);
    if (recipe && !candidates.some((item) => item.id === id)) candidates.push(recipe);
  }

  const lines = [
    `people ${input.profile.householdSize}`,
    `budget ${input.profile.weeklyBudgetPln}`,
    `diet ${input.profile.diet}`,
    `meat ${input.profile.meatPref}`,
    `style ${input.profile.dietStyle}`,
    `dailyKcal ${input.profile.dailyKcal}`,
    `shop ${input.shopDate}`,
    `pay ${plan.total} saved ${plan.saved}`,
    `locked ${input.lockedDays.join(",") || "-"}`,
    `current ${JSON.stringify(input.recipeIds)}`,
    "",
    "deals name | promo | regular | productId",
    ...deals.map((deal) =>
      [deal.name, deal.promo, deal.regular ?? "", deal.productId ?? ""].join(" | "),
    ),
    "",
    "candidates id | title | cuisine | vibes | proteins | min | kcal | P F C | ingredients",
    ...candidates.map((recipe) => plateLine(recipe, input.catalog, input.shopDate)),
  ];

  return { system: SYSTEM, user: lines.join("\n") };
}

export function recipeIdsFromModel(value: unknown): string[] {
  if (!value || typeof value !== "object") throw new Error("errors.cookBad");
  const ids = (value as { recipeIds?: unknown }).recipeIds;
  if (!Array.isArray(ids) || ids.length !== 7 || ids.some((id) => typeof id !== "string")) {
    throw new Error("errors.cookBad");
  }
  return ids.map((id) => id.trim());
}

export function acceptWeek(input: {
  profile: Profile;
  catalog: Catalog;
  shopDate: string;
  currentIds: string[];
  proposedIds: string[];
  lockedDays: number[];
}): string[] {
  const current = normalizeSlots(input.currentIds);
  const locked = new Set(input.lockedDays.filter((day) => day >= 0 && day < 7));
  const next = input.proposedIds.map((id, day) => {
    if (!current[day]) {
      if (id) throw new Error("errors.cookBad");
      return "";
    }
    if (locked.has(day)) return current[day];
    if (!id) throw new Error("errors.cookBad");
    return id;
  });

  const seen = new Set<string>();
  for (let day = 0; day < next.length; day += 1) {
    const id = next[day];
    if (!id) continue;
    if (seen.has(id)) throw new Error("errors.cookBad");
    seen.add(id);
    if (locked.has(day)) continue;
    const recipe = input.catalog.recipes.find((item) => item.id === id);
    if (!recipe || !recipeAllowed(input.profile, recipe, input.catalog, input.shopDate)) {
      throw new Error("errors.cookBad");
    }
  }

  if (next.every((id, day) => id === current[day])) throw new Error("errors.cookNoGain");
  assertWithinBudget(input.profile, input.catalog, next, input.shopDate);

  const before = priced(current, input.profile, input.catalog, input.shopDate);
  const after = priced(next, input.profile, input.catalog, input.shopDate);
  if (!(after.total + 0.009 < before.total)) throw new Error("errors.cookNoGain");
  if (after.saved + 0.009 < before.saved) throw new Error("errors.cookNoGain");
  if (!sameQuality(input.profile, input.catalog, current, next)) throw new Error("errors.cookQuality");
  return next;
}

function priced(recipeIds: string[], profile: Profile, catalog: Catalog, shopDate: string): PlanView {
  return presentPlan({
    id: "week",
    shopDate,
    householdSize: profile.householdSize,
    recipeIds,
    catalog,
  });
}

function normalizeSlots(ids: string[]): string[] {
  return Array.from({ length: 7 }, (_, day) => ids[day] ?? "");
}

function filteredDeals(catalog: Catalog, shopDate: string) {
  const live = readLivePromos();
  const byId = new Map((live?.promotions ?? []).map((promo) => [promo.id, promo.productId]));
  const known = new Set(catalog.products.map((product) => product.id));
  return shopDeals(shopDate).map((deal) => {
    const productId = byId.get(deal.id);
    return {
      name: deal.namePl,
      promo: deal.promoPricePln,
      regular: deal.regularPricePln,
      productId: productId && known.has(productId) ? productId : null,
    };
  });
}

function promoIngredients(recipe: Recipe, catalog: Catalog, shopDate: string): number {
  return catalog.ingredients.filter((item) => item.recipeId === recipe.id && onPromo(item.productId, catalog, shopDate)).length;
}

function onPromo(productId: string, catalog: Catalog, shopDate: string): boolean {
  const product = catalog.products.find((item) => item.id === productId);
  if (!product) return false;
  const promo = activePromo(productId, catalog.promotions, shopDate);
  return promo != null && isDiscount(promo, product);
}

function plateLine(recipe: Recipe, catalog: Catalog, shopDate: string): string {
  const cooking = catalog.cooking[recipe.id];
  const plate = cooking ? kcal(cooking) : 0;
  const ingredients = catalog.ingredients
    .filter((item) => item.recipeId === recipe.id && !PANTRY_PRODUCT_IDS.has(item.productId))
    .map((item) => {
      const product = catalog.products.find((row) => row.id === item.productId);
      const name = product?.namePl ?? item.productId;
      return `${name}${onPromo(item.productId, catalog, shopDate) ? "*" : ""}`;
    })
    .join(", ");
  return [
    recipe.id,
    recipe.title,
    recipe.cuisines.join("+"),
    recipe.vibes.join("+"),
    recipe.proteins.join("+"),
    cooking?.minutes ?? 0,
    plate,
    `${cooking?.protein ?? 0} ${cooking?.fat ?? 0} ${cooking?.carbs ?? 0}`,
    ingredients,
  ].join(" | ");
}

function sameQuality(profile: Profile, catalog: Catalog, current: string[], next: string[]): boolean {
  const before = plates(current, catalog);
  const after = plates(next, catalog);
  if (before.length === 0 || after.length !== before.length) return false;
  if (mean(after, "protein") < mean(before, "protein") - 3 && mean(after, "protein") < mean(before, "protein") * 0.92) {
    return false;
  }
  const kcalBefore = mean(before, "kcal");
  const kcalAfter = mean(after, "kcal");
  if (kcalBefore > 0 && Math.abs(kcalAfter - kcalBefore) / kcalBefore > 0.08) return false;
  if (styleHits(after, profile) < styleHits(before, profile)) return false;
  if (uniqueCuisines(after) < uniqueCuisines(before)) return false;
  const proteinKey = (plate: Plate) => plate.recipe.proteins.find((item) => item !== "veg") ?? "veg";
  if (maxCount(after, proteinKey) > maxCount(before, proteinKey) + 1) return false;
  const minutesBefore = mean(before, "minutes");
  const minutesAfter = mean(after, "minutes");
  if (minutesAfter > minutesBefore * 1.4 && minutesAfter > minutesBefore + 15) return false;
  if (
    (profile.dietStyle === "low-calories" || profile.dietStyle === "healthy-comfort") &&
    mean(after, "fat") > mean(before, "fat") * 1.2 &&
    mean(after, "fat") > mean(before, "fat") + 4
  ) {
    return false;
  }
  for (let day = 0; day < 7; day += 1) {
    if (!current[day] || current[day] === next[day]) continue;
    const prev = catalog.cooking[current[day]];
    const proposed = catalog.cooking[next[day]];
    if (!prev || !proposed) return false;
    if (proposed.protein < prev.protein - 4 && proposed.protein < prev.protein * 0.85) return false;
  }
  return true;
}

type Plate = {
  recipe: Recipe;
  protein: number;
  fat: number;
  kcal: number;
  minutes: number;
};

function plates(ids: string[], catalog: Catalog): Plate[] {
  return ids.flatMap((id) => {
    if (!id) return [];
    const recipe = catalog.recipes.find((item) => item.id === id);
    const cooking = catalog.cooking[id];
    if (!recipe || !cooking) return [];
    return [
      {
        recipe,
        protein: cooking.protein,
        fat: cooking.fat,
        kcal: kcal(cooking),
        minutes: cooking.minutes,
      },
    ];
  });
}

function mean(rows: Plate[], key: "protein" | "fat" | "kcal" | "minutes"): number {
  return rows.reduce((sum, row) => sum + row[key], 0) / rows.length;
}

function styleHits(rows: Plate[], profile: Profile): number {
  return rows.filter((row) => row.recipe.vibes.includes(profile.dietStyle)).length;
}

function uniqueCuisines(rows: Plate[]): number {
  return new Set(rows.flatMap((row) => row.recipe.cuisines)).size;
}

function maxCount(rows: Plate[], key: (plate: Plate) => string): number {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const value = key(row);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Math.max(0, ...counts.values());
}
