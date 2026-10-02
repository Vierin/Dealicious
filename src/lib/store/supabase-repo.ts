import { savingLines, trialOpen, type TrialWeek } from "../billing";
import { applyLivePromos, INGREDIENTS, PRODUCTS, RECIPES } from "../catalog";
import { pickWeek, presentPlan } from "../planner";
import type { Catalog, PlanView, Profile } from "../types";
import { readTrial, startTrial } from "./trial";
import { createClient } from "../supabase/server";
import { readProfileExtras, writeProfileExtras, type ProfileExtras } from "./profile-extras";
import { readPlanRecipes, writePlanRecipes } from "./plan-recipes";

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
};

function num(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function mapProfile(row: ProfileRow, extras: ProfileExtras | null): Profile {
  return {
    userId: row.user_id,
    name: row.name,
    city: row.city,
    store: "biedronka",
    allergies: row.allergies ?? [],
    appliances: extras?.appliances ?? row.appliances ?? [],
    meatPref: row.meat_pref,
    diet: extras?.diet ?? row.diet ?? (row.is_vegan ? "vegan" : "none"),
    dietStyle: row.diet_style,
    householdSize: row.household_size,
    shopWeekday: row.shop_weekday,
    weeklyBudgetPln:
      extras?.weeklyBudgetPln ?? (row.weekly_budget_pln == null ? 250 : num(row.weekly_budget_pln)),
    dailyKcal: extras?.dailyKcal ?? 2000,
  };
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

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data || !data.name) return null;
  return mapProfile(data as ProfileRow, await readProfileExtras(userId));
}

export async function saveProfile(profile: Profile) {
  const supabase = await createClient();
  const extras: ProfileExtras = {
    diet: profile.diet,
    appliances: profile.appliances,
    weeklyBudgetPln: profile.weeklyBudgetPln,
    dailyKcal: profile.dailyKcal,
  };
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
  };
  const { error } = await supabase.from("profiles").upsert(row);
  if (!error) {
    await writeProfileExtras(profile.userId, { dailyKcal: profile.dailyKcal });
    return;
  }
  if (!missingColumn(error.message)) throw new Error(error.message);

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
  await writeProfileExtras(profile.userId, extras);
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

export async function savePlan(userId: string, profile: Profile): Promise<PlanView> {
  const startedAt = (await readTrial(userId)) ?? (await startTrial(userId, new Date().toISOString()));
  if (!trialOpen(startedAt)) {
    throw new Error("Триал кончился. Следующую неделю соберём после подписки.");
  }

  const catalog = await getCatalog();
  const picked = pickWeek(profile, catalog);
  const supabase = await createClient();

  const wiped = await supabase.from("meal_plans").delete().eq("user_id", userId).eq("shop_date", picked.shopDate);
  if (wiped.error) throw new Error(wiped.error.message);
  const { data, error } = await supabase
    .from("meal_plans")
    .insert({ user_id: userId, shop_date: picked.shopDate })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Не удалось сохранить план");

  const rows = picked.recipeIds.map((recipeId, dayIndex) => ({
    meal_plan_id: data.id,
    day_index: dayIndex,
    recipe_id: recipeId,
  }));
  const inserted = await supabase.from("meal_plan_items").insert(rows);
  if (inserted.error && foreignRecipe(inserted.error.message)) {
    const stub = await supabase.from("recipes").select("id").limit(1).maybeSingle();
    const stubId = stub.data?.id;
    if (stub.error || !stubId) throw new Error(inserted.error.message);
    const fallback = await supabase.from("meal_plan_items").insert(
      rows.map((row) => ({ ...row, recipe_id: stubId })),
    );
    if (fallback.error) throw new Error(fallback.error.message);
    await writePlanRecipes(data.id, picked.recipeIds);
  } else if (inserted.error) {
    throw new Error(inserted.error.message);
  }

  return presentPlan({
    id: data.id,
    shopDate: picked.shopDate,
    householdSize: profile.householdSize,
    recipeIds: picked.recipeIds,
    catalog,
  });
}

export async function getLatestPlan(userId: string, householdSize: number): Promise<PlanView | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, shop_date, meal_plan_items(day_index, recipe_id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;

  const items = (data.meal_plan_items ?? []) as { day_index: number; recipe_id: string }[];
  items.sort((a, b) => a.day_index - b.day_index);
  const stored = await readPlanRecipes(data.id);

  return presentPlan({
    id: data.id,
    shopDate: String(data.shop_date).slice(0, 10),
    householdSize,
    recipeIds: stored ?? items.map((item) => item.recipe_id),
    catalog: await getCatalog(),
  });
}

type PlanListRow = {
  id: string;
  shop_date: string;
  created_at: string;
  meal_plan_items: { day_index: number; recipe_id: string }[] | null;
};

export async function listPlans(userId: string, householdSize: number): Promise<TrialWeek[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meal_plans")
    .select("id, shop_date, created_at, meal_plan_items(day_index, recipe_id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);

  const catalog = await getCatalog();
  const weeks: TrialWeek[] = [];
  for (const row of (data ?? []) as PlanListRow[]) {
    const items = [...(row.meal_plan_items ?? [])].sort((a, b) => a.day_index - b.day_index);
    const stored = await readPlanRecipes(row.id);
    const view = presentPlan({
      id: row.id,
      shopDate: String(row.shop_date).slice(0, 10),
      householdSize,
      recipeIds: stored ?? items.map((item) => item.recipe_id),
      catalog,
    });
    weeks.push({
      shopDate: view.shopDate,
      createdAt: row.created_at,
      saved: view.saved,
      lines: savingLines(view.lines),
    });
  }
  return weeks;
}

function foreignRecipe(message: string): boolean {
  return message.includes("meal_plan_items_recipe_id_fkey");
}
