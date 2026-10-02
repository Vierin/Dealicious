import { savingLines, trialOpen, type TrialWeek } from "../billing";
import { applyLivePromos, INGREDIENTS, PRODUCTS, RECIPES } from "../catalog";
import { pickWeek, placeRecipe, presentPlan, repickWeek, swapRecipeIds } from "../planner";
import type { Catalog, PlanView, Profile } from "../types";
import { createClient } from "../supabase/server";
import { cookDaysOrAll } from "../profile";

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
  diet_style: Profile["dietStyle"];
  household_size: number;
  shop_weekday: number;
  weekly_budget_pln: number | string;
  daily_kcal?: number | string | null;
  cook_days?: number[] | null;
};

function num(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

type ProfileMeta = {
  diet?: Profile["diet"];
  appliances?: Profile["appliances"];
  weeklyBudgetPln?: number;
  dailyKcal?: number;
  cookDays?: number[];
};

function profileMeta(value: unknown): ProfileMeta {
  if (!value || typeof value !== "object") return {};
  return value as ProfileMeta;
}

function mapProfile(row: ProfileRow, meta: ProfileMeta): Profile {
  const appliances = row.appliances ?? (Array.isArray(meta.appliances) ? meta.appliances : []);
  return {
    userId: row.user_id,
    name: row.name,
    city: row.city,
    store: "biedronka",
    allergies: row.allergies ?? [],
    appliances,
    meatPref: row.meat_pref,
    diet: row.diet ?? meta.diet ?? (row.is_vegan ? "vegan" : "none"),
    dietStyle: row.diet_style,
    householdSize: row.household_size,
    shopWeekday: row.shop_weekday,
    weeklyBudgetPln:
      row.weekly_budget_pln == null
        ? typeof meta.weeklyBudgetPln === "number"
          ? meta.weeklyBudgetPln
          : 250
        : num(row.weekly_budget_pln),
    dailyKcal: row.daily_kcal == null ? (typeof meta.dailyKcal === "number" ? meta.dailyKcal : 2000) : num(row.daily_kcal),
    cookDays: cookDaysOrAll(row.cook_days ?? meta.cookDays),
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

function missingColumn(message: string): boolean {
  return /schema cache|does not exist|Could not find the/i.test(message);
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

export async function signUp(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw new Error(error.message);
  if (!data.user || !data.session || !data.user.email) {
    throw new Error("Подтверди почту. Для локальной разработки выключи Confirm email в Supabase.");
  }
  return { id: data.user.id, email: data.user.email };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error || !data.user?.email) throw new Error("Неверная почта или пароль");
  return { id: data.user.id, email: data.user.email };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

async function rememberProfile(profile: Profile): Promise<void> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const { error } = await supabase.auth.updateUser({
    data: {
      ...profileMeta(data.user?.user_metadata),
      diet: profile.diet,
      appliances: profile.appliances,
      weeklyBudgetPln: profile.weeklyBudgetPln,
      dailyKcal: profile.dailyKcal,
      cookDays: profile.cookDays,
    },
  });
  if (error) throw new Error(error.message);
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const [{ data, error }, user] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.auth.getUser(),
  ]);
  if (error) throw new Error(error.message);
  if (!data || !data.name) return null;
  return mapProfile(data as ProfileRow, profileMeta(user.data.user?.user_metadata));
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
  };
  const saved = await supabase.from("profiles").upsert(row);
  if (!saved.error) {
    await rememberProfile(profile);
    return;
  }
  if (!missingColumn(saved.error.message)) throw new Error(saved.error.message);

  const { daily_kcal: _kcal, cook_days: _days, ...withoutNew } = row;
  const mid = await supabase.from("profiles").upsert(withoutNew);
  if (!mid.error) {
    await rememberProfile(profile);
    return;
  }
  if (!missingColumn(mid.error.message)) throw new Error(mid.error.message);

  const retry = await supabase.from("profiles").upsert({
    user_id: row.user_id,
    name: row.name,
    city: row.city,
    store: row.store,
    allergies: row.allergies,
    meat_pref: row.meat_pref,
    is_vegan: row.is_vegan,
    diet_style: row.diet_style,
    household_size: row.household_size,
    shop_weekday: row.shop_weekday,
  });
  if (retry.error) throw new Error(retry.error.message);
  await rememberProfile(profile);
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

async function insertPlan(userId: string, shopDate: string, recipeIds: string[]): Promise<{ id: string; storedIds: boolean }> {
  const supabase = await createClient();
  const withIds = await supabase
    .from("meal_plans")
    .insert({ user_id: userId, shop_date: shopDate, recipe_ids: recipeIds })
    .select("id")
    .single();
  if (!withIds.error && withIds.data) return { id: withIds.data.id, storedIds: true };
  if (withIds.error && !missingColumn(withIds.error.message)) throw new Error(withIds.error.message);

  const plain = await supabase.from("meal_plans").insert({ user_id: userId, shop_date: shopDate }).select("id").single();
  if (plain.error || !plain.data) throw new Error(plain.error?.message ?? "Не удалось сохранить план");
  return { id: plain.data.id, storedIds: false };
}

async function writeItems(planId: string, recipeIds: string[], storedIds: boolean): Promise<void> {
  const supabase = await createClient();
  const wiped = await supabase.from("meal_plan_items").delete().eq("meal_plan_id", planId);
  if (wiped.error) throw new Error(wiped.error.message);
  const rows = recipeIds.flatMap((recipeId, dayIndex) =>
    recipeId ? [{ meal_plan_id: planId, day_index: dayIndex, recipe_id: recipeId }] : [],
  );
  if (rows.length === 0) return;
  const inserted = await supabase.from("meal_plan_items").insert(rows);
  if (!inserted.error) return;
  if (storedIds && foreignRecipe(inserted.error.message)) return;
  throw new Error(inserted.error.message);
}

export async function savePlan(userId: string, profile: Profile, keep?: number[]): Promise<PlanView> {
  const startedAt = await trialStartedAt(userId);
  if (!trialOpen(startedAt)) {
    throw new Error("Триал кончился. Следующую неделю соберём после подписки.");
  }

  const catalog = await getCatalog();
  const current = keep == null ? null : await getLatestPlan(userId, profile.householdSize);
  const picked =
    keep == null || current == null
      ? pickWeek(profile, catalog)
      : {
          shopDate: current.shopDate,
          recipeIds: repickWeek(profile, catalog, slotsFromMeals(current.meals), current.shopDate, keep),
        };
  const supabase = await createClient();

  const wiped = await supabase.from("meal_plans").delete().eq("user_id", userId).eq("shop_date", picked.shopDate);
  if (wiped.error) throw new Error(wiped.error.message);
  const plan = await insertPlan(userId, picked.shopDate, picked.recipeIds);
  await writeItems(plan.id, picked.recipeIds, plan.storedIds);

  return presentPlan({
    id: plan.id,
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
  if (!current) throw new Error("Нет недели");
  const catalog = await getCatalog();
  const currentIds = slotsFromMeals(current.meals);
  const recipeIds =
    dayIndex == null
      ? swapRecipeIds(profile, catalog, currentIds, recipeId, current.shopDate)
      : placeRecipe(currentIds, recipeId, dayIndex);
  const supabase = await createClient();
  const updated = await supabase.from("meal_plans").update({ recipe_ids: recipeIds }).eq("id", current.id);
  if (updated.error && !missingColumn(updated.error.message)) throw new Error(updated.error.message);
  await writeItems(current.id, recipeIds, !updated.error);
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
const planSelectLegacy = "id, shop_date, created_at, meal_plan_items(day_index, recipe_id)";

async function loadPlans(userId: string): Promise<PlanRow[]> {
  const supabase = await createClient();
  const full = await supabase.from("meal_plans").select(planSelect).eq("user_id", userId).order("created_at", { ascending: true });
  if (!full.error) return (full.data ?? []) as PlanRow[];
  if (!missingColumn(full.error.message)) throw new Error(full.error.message);
  const legacy = await supabase
    .from("meal_plans")
    .select(planSelectLegacy)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (legacy.error) throw new Error(legacy.error.message);
  return (legacy.data ?? []) as PlanRow[];
}

function viewFromRow(row: PlanRow, householdSize: number, catalog: Catalog): PlanView {
  const items = [...(row.meal_plan_items ?? [])].sort((a, b) => a.day_index - b.day_index);
  return presentPlan({
    id: row.id,
    shopDate: String(row.shop_date).slice(0, 10),
    householdSize,
    recipeIds: recipeIdsFrom(items, row.recipe_ids),
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

function foreignRecipe(message: string): boolean {
  return message.includes("meal_plan_items_recipe_id_fkey");
}
