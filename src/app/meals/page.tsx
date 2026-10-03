import { redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getCatalog, getProfile, getSessionUser } from "@/lib/store";
import { Page } from "@/components/page";
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
  const catalog = await getCatalog();

  const meals = catalog.recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    cuisine: recipe.cuisines[0] ?? "polish",
    vibes: recipe.vibes,
    minutes: catalog.cooking[recipe.id]?.minutes ?? 0,
    photo: recipe.image ?? recipePhoto(recipe.id),
  }));

  return (
    <Page>
      <BackLink href="/week" />
      <MealBrowser meals={meals} favoritesOnly={favoritesOnly} />
    </Page>
  );
}
