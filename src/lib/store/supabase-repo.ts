import { savingLines, trialOpen, type TrialWeek } from "../billing";
import { applyLivePromos, INGREDIENTS, PRODUCTS, RECIPES } from "../catalog";
import { assertWithinBudget, pickWeek, placeRecipe, presentPlan, repickWeek, swapRecipeIds } from "../planner";
import type { RecipeRatings } from "../score";
import type { Catalog, PlanView, Profile } from "../types";
import { createClient } from "../supabase/server";
import { cookDaysOrAll, menuLevelOf, vibeOf } from "../profile";

type PromotionRow = {
  id: string;
  product_id: string;
  promo_price_pln: number | string;
  valid_from: string;
  valid_to: string;
  label: string;
};

type ProfileRow = {
  user_id: string;
  name: string;
  city: string;
  store: "biedronka";
  allergies: Profile["allergies"];
  appliances: Profile["appliances"];
  meat_pref: Profile["meatPref"];
  is_vegan: boolean;
  diet: Profile["diet"];
  diet_style: string;
  household_size: number;
  shop_weekday: number;
  weekly_budget_pln: number | string;
  daily_kcal?: number | string | null;
  cook_days?: number[] | null;
  menu_level?: number | string | null;
};

function num(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function mapProfile(row: ProfileRow): Profile {
  return {
    userId: row.user_id,
    name: row.name,
    city: row.city,
    store: "biedronka",
    allergies: row.allergies ?? [],
    appliances: row.appliances ?? [],
    meatPref: row.meat_pref,
    diet: row.diet ?? (row.is_vegan ? "vegan" : "none"),
    dietStyle: vibeOf(row.diet_style),
    householdSize: row.household_size,
    shopWeekday: row.shop_weekday,
    weeklyBudgetPln: row.weekly_budget_pln == null ? 250 : num(row.weekly_budget_pln),
    dailyKcal: row.daily_kcal == null ? 2000 : num(row.daily_kcal),
    cookDays: cookDaysOrAll(row.cook_days ?? undefined),
    menuLevel: menuLevelOf(row.menu_level),
  };
}

function recipeIdsFrom(
  items: { day_index: number; recipe_id: string }[],
  stored: string[] | null | undefined,
): string[] {
  if (stored && stored.length === 7) return stored.map((id) => id || "");
  const recipeIds = Array.from({ length: 7 }, () => "");
  for (const item of items) {
    if (item.day_index >= 0 && item.day_index < 7) recipeIds[item.day_index] = item.recipe_id;
  }
  return recipeIds;
}

async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.email) return { supabase, user: null };
  return { supabase, user: { id: data.user.id, email: data.user.email } };
}

export async function getSessionUser() {
  const { user } = await requireUser();
  return user;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || !data.name) return null;
  return mapProfile(data as ProfileRow);
}

export async function saveProfile(profile: Profile) {
  const supabase = await createClient();
  const row = {
    user_id: profile.userId,
    name: profile.name,
    city: profile.city,
    store: profile.store,
    allergies: profile.allergies,
    appliances: profile.appliances,
    meat_pref: profile.meatPref,
    is_vegan: profile.diet === "vegan",
    diet: profile.diet,
    diet_style: profile.dietStyle,
    household_size: profile.householdSize,
    shop_weekday: profile.shopWeekday,
    weekly_budget_pln: profile.weeklyBudgetPln,
    daily_kcal: profile.dailyKcal,
    cook_days: profile.cookDays,
    menu_level: profile.menuLevel,
  };
  const saved = await supabase.from("profiles").upsert(row);
  if (saved.error) throw new Error(saved.error.message);
}

export async function getCatalog(): Promise<Catalog> {
  const supabase = await createClient();
  const promotions = await supabase.from("promotions").select("*");
  if (promotions.error) throw new Error(promotions.error.message);

  return applyLivePromos({
    products: PRODUCTS,
    promotions: (promotions.data as PromotionRow[]).map((row) => ({
      id: row.id,
      productId: row.product_id,
      promoPricePln: num(row.promo_price_pln),
      validFrom: String(row.valid_from).slice(0, 10),
      validTo: String(row.valid_to).slice(0, 10),
      label: row.label,
    })),
    recipes: RECIPES,
    ingredients: INGREDIENTS,
  });
}

async function trialStartedAt(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plans")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.created_at ?? new Date().toISOString();
}

function slotsFromMeals(meals: { dayIndex: number; recipeId: string }[]): string[] {
  const recipeIds = Array.from({ length: 7 }, () => "");
  for (const meal of meals) {
    if (meal.dayIndex >= 0 && meal.dayIndex < 7) recipeIds[meal.dayIndex] = meal.recipeId;
  }
  return recipeIds;
}

async function insertPlan(userId: string, shopDate: string, recipeIds: string[]): Promise<string> {
  const supabase = await createClient();
  const inserted = await supabase
    .from("meal_plans")
    .insert({ user_id: userId, shop_date: shopDate, recipe_ids: recipeIds })
    .select("id")
    .single();
  if (inserted.error || !inserted.data) throw new Error(inserted.error?.message ?? "errors.planSave");
  return inserted.data.id;
}

async function writeItems(planId: string, recipeIds: string[]): Promise<void> {
  const supabase = await createClient();
  const wiped = await supabase.from("meal_plan_items").delete().eq("meal_plan_id", planId);
  if (wiped.error) throw new Error(wiped.error.message);
  const rows = recipeIds.flatMap((recipeId, dayIndex) =>
    recipeId ? [{ meal_plan_id: planId, day_index: dayIndex, recipe_id: recipeId }] : [],
  );
  if (rows.length === 0) return;
  const inserted = await supabase.from("meal_plan_items").insert(rows);
  if (inserted.error) throw new Error(inserted.error.message);
}

function ratingsMissing(message: string): boolean {
  return /recipe_ratings|schema cache|does not exist|Could not find the/i.test(message);
}

function cookedMissing(message: string): boolean {
  return /cooked_meals|schema cache|does not exist|Could not find the/i.test(message);
}

export async function getRatings(userId: string): Promise<RecipeRatings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("recipe_ratings").select("recipe_id, score").eq("user_id", userId);
  if (error) {
    if (ratingsMissing(error.message)) return {};
    throw new Error(error.message);
  }
  const ratings: RecipeRatings = {};
  for (const row of data ?? []) {
    const score = Number(row.score);
    if (row.recipe_id && score >= 1 && score <= 5) ratings[row.recipe_id] = score;
  }
  return ratings;
}

export async function setRating(userId: string, recipeId: string, score: number): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("recipe_ratings").upsert({
    user_id: userId,
    recipe_id: recipeId,
    score,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    if (ratingsMissing(error.message)) throw new Error("errors.ratingsMigration");
    throw new Error(error.message);
  }
}

export async function getCookedDays(userId: string, planId: string): Promise<number[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cooked_meals")
    .select("day_index")
    .eq("user_id", userId)
    .eq("meal_plan_id", planId);
  if (error) {
    if (cookedMissing(error.message)) return [];
    throw new Error(error.message);
  }
  return (data ?? [])
    .map((row) => Number(row.day_index))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
}

export async function setCooked(userId: string, planId: string, dayIndex: number, cooked: boolean): Promise<void> {
  const current = await getLatestPlan(userId, 1);
  if (!current || current.id !== planId) throw new Error("errors.noWeek");
  if (!current.meals.some((meal) => meal.dayIndex === dayIndex)) throw new Error("errors.noSuchDay");
  const supabase = await createClient();
  const query = cooked
    ? supabase.from("cooked_meals").upsert({ user_id: userId, meal_plan_id: planId, day_index: dayIndex })
    : supabase.from("cooked_meals").delete().eq("user_id", userId).eq("meal_plan_id", planId).eq("day_index", dayIndex);
  const { error } = await query;
  if (error) {
    if (cookedMissing(error.message)) throw new Error("errors.cookedMigration");
    throw new Error(error.message);
  }
}

export async function savePlan(userId: string, profile: Profile, keep?: number[]): Promise<PlanView> {
  const startedAt = await trialStartedAt(userId);
  if (!trialOpen(startedAt)) {
    throw new Error("errors.trial");
  }

  const catalog = await getCatalog();
  const ratings = await getRatings(userId);
  const current = keep == null ? null : await getLatestPlan(userId, profile.householdSize);
  const picked =
    keep == null || current == null
      ? pickWeek(profile, catalog, new Date(), ratings)
      : {
          shopDate: current.shopDate,
          recipeIds: repickWeek(profile, catalog, slotsFromMeals(current.meals), current.shopDate, keep, ratings),
        };
  const supabase = await createClient();

  const wiped = await supabase.from("meal_plans").delete().eq("user_id", userId).eq("shop_date", picked.shopDate);
  if (wiped.error) throw new Error(wiped.error.message);
  const planId = await insertPlan(userId, picked.shopDate, picked.recipeIds);
  await writeItems(planId, picked.recipeIds);

  return presentPlan({
    id: planId,
    shopDate: picked.shopDate,
    householdSize: profile.householdSize,
    recipeIds: picked.recipeIds,
    catalog,
  });
}

export async function replaceMeal(
  userId: string,
  profile: Profile,
  recipeId: string,
  dayIndex?: number,
): Promise<PlanView> {
  const current = await getLatestPlan(userId, profile.householdSize);
  if (!current) throw new Error("errors.noWeek");
  const catalog = await getCatalog();
  const ratings = await getRatings(userId);
  const currentIds = slotsFromMeals(current.meals);
  const recipeIds =
    dayIndex == null
      ? swapRecipeIds(profile, catalog, currentIds, recipeId, current.shopDate, ratings)
      : placeRecipe(currentIds, recipeId, dayIndex);
  assertWithinBudget(profile, catalog, recipeIds, current.shopDate);
  const changedDays = recipeIds.flatMap((id, day) => (currentIds[day] === id ? [] : [day]));
  const supabase = await createClient();
  if (changedDays.length > 0) {
    const cleared = await supabase
      .from("cooked_meals")
      .delete()
      .eq("user_id", userId)
      .eq("meal_plan_id", current.id)
      .in("day_index", changedDays);
    if (cleared.error && !cookedMissing(cleared.error.message)) throw new Error(cleared.error.message);
  }
  const updated = await supabase.from("meal_plans").update({ recipe_ids: recipeIds }).eq("id", current.id);
  if (updated.error) throw new Error(updated.error.message);
  await writeItems(current.id, recipeIds);
  return presentPlan({
    id: current.id,
    shopDate: current.shopDate,
    householdSize: profile.householdSize,
    recipeIds,
    catalog,
  });
}

type PlanRow = {
  id: string;
  shop_date: string;
  created_at?: string;
  recipe_ids?: string[] | null;
  meal_plan_items: { day_index: number; recipe_id: string }[] | null;
};

const planSelect = "id, shop_date, created_at, recipe_ids, meal_plan_items(day_index, recipe_id)";

async function loadPlans(userId: string): Promise<PlanRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plans")
    .select(planSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as PlanRow[];
}

function viewFromRow(row: PlanRow, householdSize: number, catalog: Catalog): PlanView {
  const items = [...(row.meal_plan_items ?? [])].sort((a, b) => a.day_index - b.day_index);
  const fromColumn = row.recipe_ids && row.recipe_ids.length === 7 ? row.recipe_ids : null;
  return presentPlan({
    id: row.id,
    shopDate: String(row.shop_date).slice(0, 10),
    householdSize,
    recipeIds: recipeIdsFrom(items, fromColumn),
    catalog,
  });
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  const rows = await loadPlans(userId);
  const row = rows[rows.length - 1];
  if (!row) return null;
  return viewFromRow(row, householdSize, await getCatalog());
}

export async function listPlans(userId: string, householdSize: number): Promise<TrialWeek[]> {
  const rows = await loadPlans(userId);
  const catalog = await getCatalog();
  return rows.map((row) => {
    const view = viewFromRow(row, householdSize, catalog);
    return {
      shopDate: view.shopDate,
      createdAt: row.created_at ?? view.shopDate,
      saved: view.saved,
      lines: savingLines(view.lines),
    };
  });
}
