import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { VibePills, cuisineLabel } from "@/components/pills";
import { INGREDIENTS, PANTRY, PRODUCTS, RECIPES } from "@/lib/catalog";
import { COOKING, kcal } from "@/lib/cooking";
import { formatQty, roundQty } from "@/lib/money";
import { recipePhoto } from "@/lib/recipes";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser } from "@/lib/store";
import { RecipeTabs } from "./tabs";

export const dynamic = "force-dynamic";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");

  const recipe = RECIPES.find((item) => item.id === id);
  const cooking = COOKING[id];
  if (!recipe || !cooking) notFound();

  const portions = profile.householdSize;
  const photo = recipe.image ?? recipePhoto(recipe.id);
  const pantry = PANTRY.filter((item) => item.recipeId === recipe.id).map((item) => item.name);
  const ingredients = INGREDIENTS.filter((item) => item.recipeId === recipe.id).map((item) => {
    const product = PRODUCTS.find((entry) => entry.id === item.productId);
    if (!product) throw new Error(`Нет продукта ${item.productId}`);
    return {
      name: product.namePl,
      qty: formatQty(roundQty(item.qtyPerPerson * portions, product.unit), product.unit),
    };
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <Link href="/week" className="text-sm text-muted">
        Неделя
      </Link>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="" className="mt-4 aspect-[4/3] w-full rounded-3xl object-cover" />
      ) : (
        <div className="mt-4 aspect-[4/3] w-full rounded-3xl bg-paper" />
      )}
      <p className="mt-4 text-xs tracking-wide text-muted uppercase">{cuisineLabel(recipe.cuisine)}</p>
      <h1 className="mt-1 font-serif text-4xl">{recipe.title}</h1>
      <div className="mt-3">
        <VibePills styles={recipe.dietStyles} />
      </div>
      <p className="mt-3 text-muted">
        {portions} {portions === 1 ? "порция" : portions < 5 ? "порции" : "порций"} · {cooking.minutes} мин
      </p>

      <section className="mt-6 rounded-3xl bg-ink p-5 text-cream">
        <p className="text-center text-xs tracking-wide text-cream/70 uppercase">На 1 порцию</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <Macro label="ккал" value={String(kcal(cooking))} />
          <Macro label="белки" value={`${cooking.protein} г`} />
          <Macro label="жиры" value={`${cooking.fat} г`} />
          <Macro label="углеводы" value={`${cooking.carbs} г`} />
        </div>
      </section>

      <RecipeTabs ingredients={ingredients} pantry={pantry} steps={cooking.steps} />
    </main>
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
