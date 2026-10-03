import { kcal } from "./cooking";
import { menuLevelOf } from "./profile";
import type { Catalog, Profile, Recipe } from "./types";

export type RecipeRatings = Record<string, number>;

const STAPLES = new Set(["cebula", "czosnek", "oliwa", "cytryna"]);
const SIDES = new Set(["ryz", "penne", "spaghetti", "kasza", "ziemniaki"]);

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function plateIds(recipeId: string, catalog: Catalog): string[] {
  return catalog.ingredients
    .filter((item) => item.recipeId === recipeId && !STAPLES.has(item.productId))
    .map((item) => item.productId);
}

function minuteFit(minutes: number, min: number, max: number): number {
  if (minutes >= min && minutes <= max) return 1;
  const distance = minutes < min ? min - minutes : minutes - max;
  return 1 - distance / 10;
}

function complexity(level: number, recipe: Recipe, catalog: Catalog): number {
  const minutes = catalog.cooking[recipe.id]?.minutes ?? 30;
  const oven = recipe.appliances.includes("oven");
  const cold = recipe.appliances.length === 0;
  const parts = plateIds(recipe.id, catalog).length;
  if (level === 1) {
    return minuteFit(minutes, 15, 25) + (cold ? 0.15 : 0) - (oven ? 0.4 : 0) - (parts > 6 ? 0.15 : 0);
  }
  if (level === 5) {
    return minuteFit(minutes, 35, 50) + (oven ? 0.2 : 0) - (cold ? 0.55 : 0) + (parts >= 5 ? 0.12 : 0);
  }
  return minuteFit(minutes, 25, 40) + (oven ? 0.15 : 0) - (cold ? 0.4 : 0);
}

function sharedPacks(recipe: Recipe, picked: Recipe[], catalog: Catalog): number {
  const mine = new Set(plateIds(recipe.id, catalog));
  const seen = new Set<string>();
  let shared = 0;
  for (const item of picked) {
    for (const id of plateIds(item.id, catalog)) {
      if (!mine.has(id) || seen.has(id)) continue;
      seen.add(id);
      shared += 1;
    }
  }
  return shared;
}

export function inLunchBand(plateKcal: number, dailyKcal: number): boolean {
  return plateKcal * 20 >= dailyKcal * 6 && plateKcal * 20 <= dailyKcal * 7;
}

export function recipeScore(input: {
  profile: Profile;
  recipe: Recipe;
  picked: Recipe[];
  catalog: Catalog;
  marginalCost: number;
  basketOver: number;
  promoShare: number;
  weekday: number | null;
  rating: number | null;
}): number {
  const { profile, recipe, picked, catalog } = input;
  const cooking = catalog.cooking[recipe.id];
  const plate = cooking ? kcal(cooking) : profile.dailyKcal * 0.325;
  const low = profile.dailyKcal * 0.3;
  const high = profile.dailyKcal * 0.35;
  const kcalGap =
    plate < low ? (low - plate) / Math.max(high, 1) : plate > high ? (plate - high) / Math.max(high, 1) : 0;

  const protein = cooking?.protein ?? 30;
  const proteinTarget = profile.dietStyle === "protein-packed" ? 40 : 32;
  const proteinFit = clamp((protein - proteinTarget) / 14, -1, 1);
  const proteinWeight = profile.dietStyle === "protein-packed" ? 0.55 : 0.1;

  let macro = 0;
  if (cooking && (profile.dietStyle === "healthy-comfort" || profile.dietStyle === "low-calories")) {
    const share = plate === 0 ? 0 : (cooking.fat * 9) / plate;
    macro = clamp((profile.dietStyle === "low-calories" ? 0.28 : 0.4) - share, -0.4, 0.35);
  } else if (cooking && profile.dietStyle === "home-style") {
    macro = cooking.fat >= 18 ? 0.12 : 0;
  }

  const style = recipe.vibes.includes(profile.dietStyle) ? 0.4 : profile.dietStyle === "family-favs" ? 0.05 : 0;

  const slots = Math.max(1, profile.cookDays?.length ?? 7);
  const slotBudget = profile.weeklyBudgetPln / slots;
  const costFit = slotBudget <= 0 ? 0 : clamp(1 - input.marginalCost / slotBudget, -1, 1);

  const minutes = cooking?.minutes ?? 30;
  const weekend = input.weekday === 0 || input.weekday === 6;
  const timeFit =
    input.weekday == null ? 0 : weekend ? clamp((45 - minutes) / 40, -0.3, 0.2) : clamp((32 - minutes) / 20, -1, 0.7);

  const proteinKey = recipe.proteins.find((item) => item !== "veg") ?? "veg";
  const sameProtein = picked.filter(
    (item) => (item.proteins.find((value) => value !== "veg") ?? "veg") === proteinKey,
  ).length;
  const sameCuisine = picked.filter((item) => item.cuisines.some((cuisine) => recipe.cuisines.includes(cuisine))).length;
  const proteinPenalty = sameProtein <= 1 ? sameProtein * 0.08 : 0.08 + (sameProtein - 1) * 0.72;
  const side = plateIds(recipe.id, catalog).find((id) => SIDES.has(id));
  const sameSide = side
    ? picked.filter((item) => plateIds(item.id, catalog).includes(side)).length
    : 0;
  const sidePenalty = sameSide <= 1 ? sameSide * 0.05 : 0.05 + (sameSide - 1) * 0.5;
  const freshIds = plateIds(recipe.id, catalog).filter((id) => {
    const product = catalog.products.find((item) => item.id === id);
    return product?.kind === "seasonal";
  });
  const already = new Set(picked.flatMap((item) => plateIds(item.id, catalog)));
  const loneSeasonal = freshIds.filter((id) => !already.has(id)).length;
  const variety = proteinPenalty + sameCuisine * 0.32 + sidePenalty + loneSeasonal * 0.22;

  const shared = sharedPacks(recipe, picked, catalog);
  const share = shared === 0 ? 0 : shared === 1 ? 0.28 : shared === 2 ? 0.06 : -0.4;

  const rating = input.rating == null ? 0 : (input.rating - 3) / 2 - (input.rating <= 2 ? 0.35 : 0);
  const over = profile.weeklyBudgetPln <= 0 ? 0 : input.basketOver / profile.weeklyBudgetPln;

  return (
    costFit * 0.5 +
    share +
    input.promoShare * 0.35 +
    style +
    macro * 0.35 +
    proteinFit * proteinWeight -
    kcalGap * 0.7 -
    variety +
    timeFit * 0.3 +
    complexity(menuLevelOf(profile.menuLevel), recipe, catalog) * 1.05 +
    rating * 0.95 -
    over * 1.1
  );
}
