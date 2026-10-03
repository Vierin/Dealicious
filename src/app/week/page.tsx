import Link from "next/link";
import { Clock, CreditCard, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { VibePills } from "@/components/pills";
import { leafletsOn } from "@/lib/catalog";
import { kcal } from "@/lib/cooking";
import { recipePhoto } from "@/lib/recipes";
import { formatRuDate } from "@/lib/dates";
import { formatPln, money } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { getCatalog, getLatestPlan, getProfile, getSessionUser, getTrial } from "@/lib/store";
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
  const plan = await getLatestPlan(user.id, profile.householdSize);
  const trial = await getTrial(user.id, profile.householdSize);
  const catalog = await getCatalog();
  const stale = plan?.meals.some((meal) => !catalog.recipes.some((recipe) => recipe.id === meal.recipeId)) ?? false;
  const noLeaflet = plan != null && plan.saved === 0 && leafletsOn(plan.shopDate).length === 0;
  const approx = plan?.lines.some((line) => line.approx) ?? false;
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
      <Link
        href="/subscribe"
        className="mt-4 flex items-baseline justify-between rounded-2xl border border-ink px-4 py-3"
      >
        <span className="text-sm">{t("saved")}</span>
        <span className="font-serif text-2xl">{formatPln(trial.saved)}</span>
      </Link>

      {plan ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
            <div>
              <section className="grid grid-cols-3 gap-3 rounded-3xl bg-ink p-5 text-cream">
                <Stat label={t("toPay")} value={`${approx ? "≈ " : ""}${formatPln(plan.total)}`} />
                <Stat label={t("withoutDeals")} value={formatPln(plan.regularTotal)} />
                <Stat label={t("savedAmount")} value={formatPln(plan.saved)} accent />
              </section>
              <BudgetSpend spent={plan.total} budget={profile.weeklyBudgetPln} />
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
                  <span className="mt-1 block text-sm text-muted">{t("dealsHint")}</span>
                </span>
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
            <h2 className="font-serif text-2xl">{t("lunches")}</h2>
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

async function BudgetSpend({ spent, budget }: { spent: number; budget: number }) {
  const t = await getTranslations("week");
  const ratio = budget <= 0 ? 0 : Math.min(spent / budget, 1);
  const left = money(budget - spent);
  return (
    <section className="mt-4 rounded-3xl border border-line bg-paper px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted">{t("spent")}</p>
        <p className="font-serif text-2xl">{formatPln(spent)}</p>
      </div>
      <p className="mt-1 text-sm text-muted">{t("ofWeek", { budget: formatPln(budget) })}</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${left < 0 ? "bg-[#8a3d32]" : "bg-olive"}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-muted">
        {left < 0 ? t("over", { amount: formatPln(-left) }) : t("left", { amount: formatPln(left) })}
      </p>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs tracking-wide text-cream/70 uppercase">{label}</div>
      <div className={`mt-2 font-serif text-xl sm:text-2xl ${accent ? "text-[#d7e7c8]" : ""}`}>{value}</div>
    </div>
  );
}
