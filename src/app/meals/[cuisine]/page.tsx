import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { RECIPES } from "@/lib/catalog";
import { COOKING } from "@/lib/cooking";
import { CUISINE_OPTIONS } from "@/lib/options";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import type { Cuisine } from "@/lib/types";
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

  const meals = RECIPES.filter((recipe) => recipe.cuisine === cuisine).map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisine,
    dietStyles: recipe.dietStyles,
    minutes: COOKING[recipe.id]?.minutes ?? 0,
    photo: recipe.image ?? recipePhoto(recipe.id),
  }));
  const title = CUISINE_OPTIONS.find((item) => item.id === cuisine)?.label ?? cuisine;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <Link href="/meals" className="text-sm text-muted">
        Блюда
      </Link>
      <CuisineMeals title={title} meals={meals} />
    </main>
  );
}
