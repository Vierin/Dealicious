import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { VibePills } from "@/components/pills";
import { INGREDIENTS, PANTRY, PRODUCTS, RECIPES } from "@/lib/catalog";
import { COOKING, kcal } from "@/lib/cooking";
import { formatRuDate } from "@/lib/dates";
import { formatQty, roundQty } from "@/lib/money";
import { pantryUseLabel } from "@/lib/pantry";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getCookedDays, getLatestPlan, getProfile, getRatings, getSessionUser } from "@/lib/store";
import { RecipeBar } from "@/components/recipe-bar";
import type { DietNeed } from "@/lib/types";
import { FavoriteButton } from "@/components/favorite-button";
import { MealPhoto } from "@/components/meal-photo";
import { RememberView } from "@/components/recent-view";
import { SwapMeal } from "./swap-meal";
import { Page } from "@/components/page";
import { RecipeTabs } from "./tabs";

export const dynamic = "force-dynamic";

function dietLine(diets: DietNeed[], t: Awaited<ReturnType<typeof getTranslations<"recipe">>>): string {
  const names = diets
    .map((diet) =>
      diet === "vegan" ? t("dietVegan") : diet === "vegetarian" ? t("dietVegetarian") : diet === "pescatarian" ? t("dietPescatarian") : "",
    )
    .filter(Boolean);
  return names.length === 0 ? t("onlyUnrestricted") : t("suits", { diets: names.join(", ") });
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  const recipe = RECIPES.find((item) => item.id === id);
  const cooking = COOKING[id];
  if (!recipe || !cooking) notFound();

  const plan = await getLatestPlan(user.id, profile.householdSize);
  const ratings = await getRatings(user.id);
  const cookedDays = plan ? await getCookedDays(user.id, plan.id) : [];
  const inWeek = plan?.meals.some((meal) => meal.recipeId === recipe.id) ?? false;
  const cookedSlots =
    plan?.meals.filter((meal) => meal.recipeId === recipe.id).map((meal) => ({
      dayIndex: meal.dayIndex,
      weekday: formatRuDate(meal.date).weekday,
      cooked: cookedDays.includes(meal.dayIndex),
    })) ?? [];
  const portions = profile.householdSize;
  const photo = recipe.image ?? recipePhoto(recipe.id);
  const pantry = PANTRY.filter((item) => item.recipeId === recipe.id).map((item) => item.name);
  const ingredients = INGREDIENTS.filter((item) => item.recipeId === recipe.id).map((item) => {
    const product = PRODUCTS.find((entry) => entry.id === item.productId);
    if (!product) throw new Error("errors.missingProduct");
    return {
      name: product.namePl,
      qty:
        pantryUseLabel(item.productId, item.qtyPerPerson, portions) ??
        formatQty(roundQty(item.qtyPerPerson * portions, product.unit), product.unit),
    };
  });

  const t = await getTranslations("recipe");
  const cuisine = await getTranslations("cuisine");

  return (
    <Page>
      <RememberView recipeId={recipe.id} />
      <div className="relative -mt-3">
        <MealPhoto src={photo} className="aspect-[4/3] w-full rounded-3xl" />
        <BackLink href="/week" overlay />
        <FavoriteButton recipeId={recipe.id} />
      </div>
      <p className="mt-4 text-xs tracking-wide text-muted uppercase">{recipe.cuisines.map((id) => cuisine(id)).join(" · ")}</p>
      <h1 className="mt-1 font-serif text-4xl">{recipe.title}</h1>
      <div className="mt-3">
        <VibePills styles={recipe.vibes} />
      </div>
      <p className="mt-3 text-sm text-muted">{dietLine(recipe.diets, t)}</p>
      <RecipeBar
        minutes={cooking.minutes}
        portions={portions}
        recipeId={recipe.id}
        score={ratings[recipe.id] ?? null}
        cooked={cookedSlots.map((slot) => ({
          planId: plan?.id ?? "",
          dayIndex: slot.dayIndex,
          cooked: slot.cooked,
          weekday: cookedSlots.length > 1 ? slot.weekday : undefined,
        }))}
      />

      <section className="mt-6 rounded-3xl bg-ink p-5 text-cream">
        <p className="text-center text-xs tracking-wide text-cream/70 uppercase">{t("perPortion")}</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <Macro label={t("kcal")} value={String(kcal(cooking))} />
          <Macro label={t("protein")} value={t("grams", { count: cooking.protein })} />
          <Macro label={t("fat")} value={t("grams", { count: cooking.fat })} />
          <Macro label={t("carbs")} value={t("grams", { count: cooking.carbs })} />
        </div>
      </section>

      <RecipeTabs ingredients={ingredients} pantry={pantry} steps={cooking.steps} />
      <SwapMeal
        recipeId={recipe.id}
        inWeek={inWeek}
        week={
          plan?.meals.map((meal) => ({
            dayIndex: meal.dayIndex,
            title: meal.title,
            weekday: formatRuDate(meal.date).weekday,
          })) ?? []
        }
      />
    </Page>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-3xl sm:text-4xl">{value}</div>
      <div className="mt-1 text-xs tracking-wide text-cream/70 uppercase">{label}</div>
    </div>
  );
}
