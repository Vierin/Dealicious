import { kcal } from "./cooking";
import { activePromo, assertWithinBudget, isDiscount, presentPlan, recipeAllowed } from "./planner";
import { PANTRY_PRODUCT_IDS } from "./pantry";
import type { Catalog, PlanView, Profile, Recipe } from "./types";

const NEIGHBORS = 6;

const SYSTEM = `You replan dinners for a Polish grocery app.
Return JSON only: {"recipeIds":["id or empty", ...]} with exactly 7 strings.
For each occupied unlocked day pick exactly one id from that day's list. Do not invent ids. Keep empty slots empty. Keep locked day indexes unchanged. Use each recipe at most once.
Lower what the household pays. Do not reduce promo savings.
Do not drop food quality: protein, calories, cuisine variety, and the user's diet style stay in the same range. The same protein and the same cuisine may each appear on at most two days. A faster meal is fine. A much longer one is not.
A listed deal changes the bill only when a chosen recipe uses that productId. Starred ingredients are already on a catalog discount for this shop date. Prefer meals that reuse the same starred products across days.
The server prices the whole basket and rejects a menu that does not get cheaper, saves less, breaks diet or appliances, leaves the day's list, or loses quality.
If nothing qualifies, return the current recipeIds unchanged.`;

export function cookBrief(input: {
  profile: Profile;
  catalog: Catalog;
  shopDate: string;
  recipeIds: string[];
  lockedDays: number[];
}): { system: string; user: string } {
  const plan = priced(input.recipeIds, input.profile, input.catalog, input.shopDate);
  const choices = dayChoices(input);
  const listed = listedRecipes(input.catalog, choices);
  const lines = [
    `people ${input.profile.householdSize}`,
    `budget ${input.profile.weeklyBudgetPln}`,
    `diet ${input.profile.diet}`,
    `style ${input.profile.dietStyle}`,
    `dailyKcal ${input.profile.dailyKcal}`,
    `shop ${input.shopDate}`,
    `pay ${plan.total} saved ${plan.saved}`,
    `locked ${input.lockedDays.join(",") || "-"}`,
    `current ${JSON.stringify(normalizeSlots(input.recipeIds))}`,
    "",
    "days",
  ];
  for (const [day, ids] of choices) {
    if (input.lockedDays.includes(day)) continue;
    lines.push(`day ${day}`);
    for (const id of ids) {
      const recipe = input.catalog.recipes.find((item) => item.id === id);
      if (recipe) lines.push(plateLine(recipe, input.catalog, input.shopDate));
    }
  }
  lines.push("", "deals name | promo | regular | productId", ...dealLines(listed, input.catalog, input.shopDate));
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
  const choices = dayChoices({ ...input, recipeIds: current, lockedDays: [...locked] });
  const next = input.proposedIds.map((id, day) => {
    if (!current[day]) {
      if (id) throw new Error("errors.cookBad");
      return "";
    }
    if (locked.has(day)) return current[day];
    if (!id || !choices.get(day)?.includes(id)) throw new Error("errors.cookBad");
    return id;
  });

  const seen = new Set<string>();
  for (let day = 0; day < next.length; day += 1) {
    const id = next[day];
    if (!id) continue;
    if (seen.has(id)) throw new Error("errors.cookBad");
    seen.add(id);
    if (locked.has(day) || id === current[day]) continue;
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

function dayChoices(input: {
  profile: Profile;
  catalog: Catalog;
  shopDate: string;
  recipeIds: string[];
  lockedDays: number[];
}): Map<number, string[]> {
  const current = normalizeSlots(input.recipeIds);
  const locked = new Set(input.lockedDays);
  const placed = new Set(current.filter(Boolean));
  const open: { day: number; recipe: Recipe }[] = [];
  for (let day = 0; day < 7; day += 1) {
    const id = current[day];
    if (!id || locked.has(day)) continue;
    const recipe = input.catalog.recipes.find((item) => item.id === id);
    if (recipe) open.push({ day, recipe });
  }

  const ranked = input.catalog.recipes
    .filter(
      (recipe) =>
        !placed.has(recipe.id) &&
        recipeAllowed(input.profile, recipe, input.catalog, input.shopDate) &&
        promoIngredients(recipe, input.catalog, input.shopDate) > 0,
    )
    .sort(
      (a, b) =>
        promoIngredients(b, input.catalog, input.shopDate) - promoIngredients(a, input.catalog, input.shopDate) ||
        a.id.localeCompare(b.id),
    );

  const neighbors = new Map<number, string[]>();
  const claimed = new Set<string>();
  for (const candidate of ranked) {
    const fits = open
      .map((slot) => ({ day: slot.day, score: plateFit(slot.recipe, candidate, input) }))
      .filter((row) => row.score > 0 && (neighbors.get(row.day)?.length ?? 0) < NEIGHBORS)
      .sort((a, b) => b.score - a.score || a.day - b.day);
    const pick = fits[0];
    if (!pick) continue;
    neighbors.set(pick.day, [...(neighbors.get(pick.day) ?? []), candidate.id]);
    claimed.add(candidate.id);
  }

  for (const slot of open) {
    if ((neighbors.get(slot.day)?.length ?? 0) > 0) continue;
    const extra = ranked.filter((recipe) => !claimed.has(recipe.id)).slice(0, NEIGHBORS);
    for (const recipe of extra) claimed.add(recipe.id);
    if (extra.length > 0) neighbors.set(slot.day, extra.map((recipe) => recipe.id));
  }

  return new Map(open.map((slot) => [slot.day, [slot.recipe.id, ...(neighbors.get(slot.day) ?? [])]]));
}

function plateFit(
  current: Recipe,
  recipe: Recipe,
  input: { catalog: Catalog; shopDate: string },
): number {
  const cuisine = current.cuisines.some((item) => recipe.cuisines.includes(item)) ? 2 : 0;
  const vibe = current.vibes.some((item) => recipe.vibes.includes(item)) ? 1 : 0;
  if (cuisine + vibe === 0) return 0;
  const needy = promoIngredients(current, input.catalog, input.shopDate) === 0 ? 1 : 0;
  return cuisine * 10 + vibe * 5 + needy;
}

function listedRecipes(catalog: Catalog, choices: Map<number, string[]>): Recipe[] {
  const ids = new Set([...choices.values()].flat());
  return catalog.recipes.filter((recipe) => ids.has(recipe.id));
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

function dealLines(recipes: Recipe[], catalog: Catalog, shopDate: string): string[] {
  const ids = new Set<string>();
  for (const recipe of recipes) {
    for (const item of catalog.ingredients) {
      if (item.recipeId !== recipe.id) continue;
      if (onPromo(item.productId, catalog, shopDate)) ids.add(item.productId);
    }
  }
  return [...ids].sort().map((id) => {
    const product = catalog.products.find((item) => item.id === id);
    const promo = activePromo(id, catalog.promotions, shopDate);
    return [product?.namePl ?? id, promo?.promoPricePln ?? "", product?.regularPricePln ?? "", id].join(" | ");
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
  if (!varietyOk(profile, after)) return false;
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

function varietyOk(profile: Profile, rows: Plate[]): boolean {
  if (maxCount(rows, (plate) => plate.recipe.cuisines[0] ?? "") > 2) return false;
  if (profile.diet === "vegetarian" || profile.diet === "vegan") return true;
  return maxCount(rows, proteinKey) <= 2;
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

function proteinKey(plate: Plate): string {
  return plate.recipe.proteins.find((item) => item !== "veg") ?? "veg";
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
