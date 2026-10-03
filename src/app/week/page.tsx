import Link from "next/link";
import { Clock, CreditCard, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { VibePills } from "@/components/pills";
import { kcal } from "@/lib/cooking";
import { recipePhoto } from "@/lib/recipes";
import { formatRuDate } from "@/lib/dates";
import { formatPln, money } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { getCatalog, getLatestPlan, getOffers, getProfile, getSessionUser, getTrial } from "@/lib/store";
import { SavedRow } from "./cook-smarter";
import { RefreshWeek } from "./refresh-week";
import { ReplaceMeal } from "./replace-meal";
import { WeekActions } from "./week-actions";
import { Page } from "@/components/page";
import { ShopCard } from "./shop-card";

export const dynamic = "force-dynamic";

export default async function WeekPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const [plan, trial, catalog] = await Promise.all([
    getLatestPlan(user.id, profile.householdSize),
    getTrial(user.id, profile.householdSize),
    getCatalog(),
  ]);
  const offers = plan ? await getOffers(plan.shopDate) : null;
  const stale = plan?.meals.some((meal) => !catalog.recipes.some((recipe) => recipe.id === meal.recipeId)) ?? false;
  const noLeaflet = plan != null && plan.saved === 0 && (offers?.leaflets.length ?? 0) === 0;
  const approx = plan?.lines.some((line) => line.approx) ?? false;
  const shop = plan ? formatRuDate(plan.shopDate) : null;
  const dealCount = offers?.deals.length ?? 0;
  const t = await getTranslations("week");
  const recipeT = await getTranslations("recipe");
  const cuisine = await getTranslations("cuisine");

  return (
    <Page width="wide">
      <header className="flex items-start justify-between gap-4">
        <p className="font-serif text-3xl">Dealicious</p>
        <WeekActions trialOpen={trial.open} />
      </header>

      <p className="mt-4 text-sm text-muted">
        {trial.open ? t("trialLeft", { days: trial.daysLeft }) : t("trialOver")}
      </p>
      <SavedRow amount={formatPln(trial.saved)} cook={plan != null} />

      {plan ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
            <div>
              <WeekTotals
                total={plan.total}
                regularTotal={plan.regularTotal}
                saved={plan.saved}
                budget={profile.weeklyBudgetPln}
                approx={approx}
              />
            </div>
            <div className="flex h-full flex-col gap-4">
              <div className="min-h-0 flex-1">
                <ShopCard planId={plan.id} productIds={plan.lines.map((line) => line.productId)} />
              </div>
              <Link
                href="/deals"
                className="flex shrink-0 items-center justify-between gap-4 rounded-3xl border border-line bg-paper px-5 py-5"
              >
                <span>
                  <span className="block font-serif text-2xl">{t("deals")}</span>
                  {shop ? (
                    <span className="mt-1 block text-sm text-muted capitalize">
                      {shop.weekday}, {shop.dayMonth}
                    </span>
                  ) : null}
                </span>
                <span className="font-serif text-3xl">{dealCount}</span>
              </Link>
            </div>
          </div>

          {noLeaflet ? (
            <p className="mt-4 text-sm text-muted">
              {t("noLeaflet", { date: formatRuDate(plan.shopDate).dayMonth })}
            </p>
          ) : null}

          {stale && trial.open ? (
            <p className="mt-4 text-sm text-olive">{t("stale")}</p>
          ) : null}

          <section className="mt-8 max-w-2xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-serif text-2xl">{t("lunches")}</h2>
              {trial.open ? <RefreshWeek /> : null}
            </div>
            <ol className="mt-4 flex flex-col gap-3">
              {plan.meals.map((meal) => {
                const date = formatRuDate(meal.date);
                const cooking = catalog.cooking[meal.recipeId];
                const minutes = cooking?.minutes;
                const recipe = catalog.recipes.find((item) => item.id === meal.recipeId);
                const photo = recipe ? (recipe.image ?? recipePhoto(recipe.id)) : null;
                const card = (
                    <div className="block overflow-hidden rounded-3xl border border-line bg-paper">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt="" className="aspect-[16/7] w-full object-cover" />
                      ) : null}
                      <div className={`px-5 py-4 ${photo ? "" : "pr-16"}`}>
                      <p className="text-sm text-muted capitalize">{date.weekday}</p>
                      <h3 className="mt-1 font-serif text-2xl">{meal.title}</h3>
                      {recipe ? (
                        <div className="mt-3 flex flex-col gap-2">
                          <p className="text-xs tracking-wide text-muted uppercase">{recipe.cuisines.map((id) => cuisine(id)).join(" · ")}</p>
                          <VibePills styles={recipe.vibes} />
                        </div>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                        {minutes != null ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={16} strokeWidth={1.75} />
                            {t("minutes", { count: minutes })}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <Users size={16} strokeWidth={1.75} />
                          {recipeT("portions", { count: plan.householdSize })}
                        </span>
                        {cooking ? (
                          <span>{t("kcal", { count: kcal(cooking) })}</span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <CreditCard size={16} strokeWidth={1.75} />
                          {formatPln(meal.cost)}
                        </span>
                      </div>
                      </div>
                    </div>
                );
                return (
                  <li key={meal.dayIndex} className="relative">
                    {recipe ? (
                      <Link href={`/recipe/${meal.recipeId}`} className="block">
                        {card}
                      </Link>
                    ) : (
                      card
                    )}
                    <ReplaceMeal recipeId={meal.recipeId} />
                  </li>
                );
              })}
            </ol>
          </section>
        </>
      ) : (
        <p className="mt-10 text-muted">{t("empty")}</p>
      )}
    </Page>
  );
}

async function WeekTotals({
  total,
  regularTotal,
  saved,
  budget,
  approx,
}: {
  total: number;
  regularTotal: number;
  saved: number;
  budget: number;
  approx: boolean;
}) {
  const t = await getTranslations("week");
  const left = money(budget - total);
  const ratio = budget <= 0 ? (total > 0 ? 1 : 0) : Math.min(total / budget, 1);
  const pay = `${approx ? "≈ " : ""}${formatPln(total)}`;
  return (
    <section className="overflow-hidden rounded-3xl border border-line bg-paper">
      <div className="bg-ink px-5 py-5 text-cream">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs tracking-wide text-cream/70 uppercase">{t("toPay")}</p>
          <p className="font-serif text-3xl">{pay}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-cream/15 pt-4">
          <div>
            <p className="text-xs tracking-wide text-cream/70 uppercase">{t("withoutDeals")}</p>
            <p className="mt-1 font-serif text-xl">{formatPln(regularTotal)}</p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-cream/70 uppercase">{t("savedAmount")}</p>
            <p className="mt-1 font-serif text-xl text-[#d7e7c8]">{formatPln(saved)}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm text-muted">{t("weekBudget")}</p>
          <p className="font-serif text-2xl">{formatPln(budget)}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
          <div
            className={`h-full rounded-full ${left < 0 ? "bg-[#8a3d32]" : "bg-olive"}`}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          {left < 0 ? t("over", { amount: formatPln(-left) }) : t("left", { amount: formatPln(left) })}
        </p>
      </div>
    </section>
  );
}
