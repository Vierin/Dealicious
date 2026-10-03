import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { RECIPES } from "@/lib/catalog";
import { COOKING } from "@/lib/cooking";
import { CUISINE_OPTIONS } from "@/lib/options";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import type { Cuisine } from "@/lib/types";
import { Page } from "@/components/page";
import { CuisineMeals } from "./cuisine-meals";

export const dynamic = "force-dynamic";

function asCuisine(value: string): Cuisine | null {
  return CUISINE_OPTIONS.some((item) => item.id === value) ? (value as Cuisine) : null;
}

export default async function CuisinePage({ params }: { params: Promise<{ cuisine: string }> }) {
  const cuisine = asCuisine((await params).cuisine);
  if (!cuisine) notFound();
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  const meals = RECIPES.filter((recipe) => recipe.cuisines.includes(cuisine)).map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    cuisine,
    vibes: recipe.vibes,
    minutes: COOKING[recipe.id]?.minutes ?? 0,
    photo: recipe.image ?? recipePhoto(recipe.id),
  }));
  const title = (await getTranslations("cuisine"))(cuisine);

  return (
    <Page>
      <BackLink href="/meals" />
      <CuisineMeals title={title} meals={meals} />
    </Page>
  );
}
