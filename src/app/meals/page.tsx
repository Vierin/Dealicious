import { redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { RECIPES } from "@/lib/catalog";
import { COOKING } from "@/lib/cooking";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import { MealBrowser } from "./meal-browser";

export const dynamic = "force-dynamic";

export default async function MealsPage({
  searchParams,
}: {
  searchParams: Promise<{ favorites?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const favoritesOnly = (await searchParams).favorites === "1";

  const meals = RECIPES.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisine,
    dietStyles: recipe.dietStyles,
    minutes: COOKING[recipe.id]?.minutes ?? 0,
    photo: recipe.image ?? recipePhoto(recipe.id),
  }));

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <BackLink href="/week" label="Неделя" />
      <MealBrowser meals={meals} favoritesOnly={favoritesOnly} />
    </main>
  );
}
