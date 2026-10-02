import Link from "next/link";
import { redirect } from "next/navigation";
import { RECIPES } from "@/lib/catalog";
import { COOKING } from "@/lib/cooking";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import { MealBrowser } from "./meal-browser";

export const dynamic = "force-dynamic";

export default async function MealsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

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
      <Link href="/week" className="text-sm text-muted">
        Неделя
      </Link>
      <h1 className="mt-3 font-serif text-4xl">Блюда</h1>
      <p className="mt-2 text-muted">Кухня и вайб. Неделю по-прежнему собирают скидки.</p>
      <MealBrowser meals={meals} />
    </main>
  );
}
