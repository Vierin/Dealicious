import { pickWeek, presentPlan } from "../planner";
import type { Catalog, PlanView, Profile } from "../types";
import { createClient } from "../supabase/server";

type ProductRow = {
  id: string;
  name_pl: string;
  category: string;
  unit: Catalog["products"][number]["unit"];
  regular_price_pln: number | string;
};

type PromotionRow = {
  id: string;
  product_id: string;
  promo_price_pln: number | string;
  valid_from: string;
  valid_to: string;
  label: "gazetka-pon" | "gazetka-czw";
};

type RecipeRow = {
  id: string;
  title: string;
  diet_styles: Profile["dietStyle"][];
  allergens: Profile["allergies"];
  proteins: Catalog["recipes"][number]["proteins"];
  is_vegan: boolean;
  appliances: Profile["appliances"];
};

type IngredientRow = {
  recipe_id: string;
  product_id: string;
  qty_per_person: number | string;
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
    dietStyle: row.diet_style,
    householdSize: row.household_size,
    shopWeekday: row.shop_weekday,
    weeklyBudgetPln: num(row.weekly_budget_pln),
  };
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
  return mapProfile(data as ProfileRow);
}

export async function saveProfile(profile: Profile) {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert({
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
  });
  if (error) throw new Error(error.message);
}

export async function getCatalog(): Promise<Catalog> {
  const supabase = await createClient();
  const [products, promotions, recipes, ingredients] = await Promise.all([
    supabase.from("products").select("*"),
    supabase.from("promotions").select("*"),
    supabase.from("recipes").select("*"),
    supabase.from("recipe_ingredients").select("*"),
  ]);
  if (products.error) throw new Error(products.error.message);
  if (promotions.error) throw new Error(promotions.error.message);
  if (recipes.error) throw new Error(recipes.error.message);
  if (ingredients.error) throw new Error(ingredients.error.message);

  return {
    products: (products.data as ProductRow[]).map((row) => ({
      id: row.id,
      namePl: row.name_pl,
      category: row.category,
      unit: row.unit,
      regularPricePln: num(row.regular_price_pln),
    })),
    promotions: (promotions.data as PromotionRow[]).map((row) => ({
      id: row.id,
      productId: row.product_id,
      promoPricePln: num(row.promo_price_pln),
      validFrom: String(row.valid_from).slice(0, 10),
      validTo: String(row.valid_to).slice(0, 10),
      label: row.label,
    })),
    recipes: (recipes.data as RecipeRow[]).map((row) => ({
      id: row.id,
      title: row.title,
      dietStyles: row.diet_styles,
      allergens: row.allergens,
      proteins: row.proteins,
      isVegan: row.is_vegan,
      appliances: row.appliances ?? [],
    })),
    ingredients: (ingredients.data as IngredientRow[]).map((row) => ({
      recipeId: row.recipe_id,
      productId: row.product_id,
      qtyPerPerson: num(row.qty_per_person),
    })),
  };
}

export async function savePlan(userId: string, profile: Profile): Promise<PlanView> {
  const catalog = await getCatalog();
  const picked = pickWeek(profile, catalog);
  const supabase = await createClient();

  await supabase.from("meal_plans").delete().eq("user_id", userId);
  const { data, error } = await supabase
    .from("meal_plans")
    .insert({ user_id: userId, shop_date: picked.shopDate })
    .select("id")
    .single();
  if (error || !data) throw new Error(error?.message ?? "Не удалось сохранить план");

  const { error: itemsError } = await supabase.from("meal_plan_items").insert(
    picked.recipeIds.map((recipeId, dayIndex) => ({
      meal_plan_id: data.id,
      day_index: dayIndex,
      recipe_id: recipeId,
    })),
  );
  if (itemsError) throw new Error(itemsError.message);

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

  return presentPlan({
    id: data.id,
    shopDate: String(data.shop_date).slice(0, 10),
    householdSize,
    recipeIds: items.map((item) => item.recipe_id),
    catalog: await getCatalog(),
  });
}
