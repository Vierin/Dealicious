import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { INGREDIENTS, PRODUCTS, RECIPES } from "@/lib/catalog";
import { COOKING, kcal } from "@/lib/cooking";
import { formatQty, roundQty } from "@/lib/money";
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
      <h1 className="mt-3 font-serif text-4xl">{recipe.title}</h1>
      <p className="mt-2 text-muted">
        {portions} {portions === 1 ? "порция" : portions < 5 ? "порции" : "порций"} · {cooking.minutes} мин
      </p>

      <section className="mt-6 grid grid-cols-4 gap-2 rounded-3xl bg-ink p-5 text-cream">
        <Macro label="ккал" value={String(kcal(cooking) * portions)} />
        <Macro label="белки" value={`${cooking.protein * portions} г`} />
        <Macro label="жиры" value={`${cooking.fat * portions} г`} />
        <Macro label="углеводы" value={`${cooking.carbs * portions} г`} />
      </section>
      <p className="mt-2 text-sm text-muted">
        На 1 порцию: {kcal(cooking)} ккал · Б {cooking.protein} · Ж {cooking.fat} · У {cooking.carbs}
      </p>

      <RecipeTabs ingredients={ingredients} steps={cooking.steps} />
    </main>
  );
}

function Macro({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs tracking-wide text-cream/70 uppercase">{label}</div>
      <div className="mt-2 font-serif text-lg sm:text-xl">{value}</div>
    </div>
  );
}
