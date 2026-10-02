import Link from "next/link";
import { Clock, CreditCard, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { VibePills, cuisineLabel } from "@/components/pills";
import { leafletsOn, RECIPES } from "@/lib/catalog";
import { COOKING, kcal } from "@/lib/cooking";
import { recipePhoto } from "@/lib/recipes";
import { formatRuDate } from "@/lib/dates";
import { formatPln, money } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { getLatestPlan, getProfile, getSessionUser, getTrial } from "@/lib/store";
import { RebuildPlan } from "./rebuild-plan";
import { WeekActions } from "./week-actions";
import { ShopCard } from "./shop-card";

export const dynamic = "force-dynamic";

export default async function WeekPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const plan = await getLatestPlan(user.id, profile.householdSize);
  const trial = await getTrial(user.id, profile.householdSize);
  const stale = plan?.meals.some((meal) => !RECIPES.some((recipe) => recipe.id === meal.recipeId)) ?? false;
  const noLeaflet = plan != null && plan.saved === 0 && leafletsOn(plan.shopDate).length === 0;

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-8">
      <header className="flex items-start justify-between gap-4">
        <p className="font-serif text-3xl">Dealicious</p>
        <WeekActions trialOpen={trial.open} />
      </header>

      <p className="mt-4 text-sm text-muted">
        {trial.open
          ? `Триал ещё ${dayWord(trial.daysLeft)}.`
          : "Триал кончился. Эта неделя остаётся. Следующую без подписки не соберём."}
      </p>
      <Link
        href="/subscribe"
        className="mt-4 flex items-baseline justify-between rounded-2xl border border-ink px-4 py-3"
      >
        <span className="text-sm">Уже сэкономлено</span>
        <span className="font-serif text-2xl">{formatPln(trial.saved)}</span>
      </Link>

      {plan ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
            <div>
              <section className="grid grid-cols-3 gap-3 rounded-3xl bg-ink p-5 text-cream">
                <Stat label="К оплате" value={formatPln(plan.total)} />
                <Stat label="Без акций" value={formatPln(plan.regularTotal)} />
                <Stat label="Сэкономили" value={formatPln(plan.saved)} accent />
              </section>
              <BudgetSpend spent={plan.total} budget={profile.weeklyBudgetPln} />
            </div>
            <ShopCard planId={plan.id} productIds={plan.lines.map((line) => line.productId)} />
          </div>

          {noLeaflet ? (
            <p className="mt-4 text-sm text-muted">
              На {formatRuDate(plan.shopDate).dayMonth} газетки нет, поэтому сэкономили 0.
            </p>
          ) : null}

          {stale && trial.open ? (
            <p className="mt-4 text-sm text-olive">Каталог обновился. Нажми Rebuild plan, чтобы собрать неделю заново.</p>
          ) : null}

          <section className="mt-8 max-w-2xl">
            <h2 className="font-serif text-2xl">Обеды</h2>
            <ol className="mt-4 flex flex-col gap-3">
              {plan.meals.map((meal) => {
                const date = formatRuDate(meal.date);
                const minutes = COOKING[meal.recipeId]?.minutes;
                const recipe = RECIPES.find((item) => item.id === meal.recipeId);
                const photo = recipe ? (recipe.image ?? recipePhoto(recipe.id)) : null;
                const card = (
                    <div className="block overflow-hidden rounded-3xl border border-line bg-paper">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt="" className="aspect-[16/7] w-full object-cover" />
                      ) : null}
                      <div className="px-5 py-4">
                      <p className="text-sm text-muted capitalize">{date.weekday}</p>
                      <h3 className="mt-1 font-serif text-2xl">{meal.title}</h3>
                      {recipe ? (
                        <div className="mt-3 flex flex-col gap-2">
                          <p className="text-xs tracking-wide text-muted uppercase">{cuisineLabel(recipe.cuisine)}</p>
                          <VibePills styles={recipe.dietStyles} />
                        </div>
                      ) : null}
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                        {minutes != null ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={16} strokeWidth={1.75} />
                            {minutes} мин
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <Users size={16} strokeWidth={1.75} />
                          {plan.householdSize}
                        </span>
                        {COOKING[meal.recipeId] ? (
                          <span>{kcal(COOKING[meal.recipeId])} ккал</span>
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
                  <li key={meal.dayIndex}>
                    {recipe ? (
                      <Link href={`/recipe/${meal.recipeId}`} className="block">
                        {card}
                      </Link>
                    ) : (
                      card
                    )}
                  </li>
                );
              })}
            </ol>
            <RebuildPlan
              meals={plan.meals.map((meal) => ({
                dayIndex: meal.dayIndex,
                title: meal.title,
                weekday: formatRuDate(meal.date).weekday,
              }))}
            />
          </section>
        </>
      ) : (
        <p className="mt-10 text-muted">Неделя ещё не собрана. Открой анкету и дойди до конца.</p>
      )}
    </main>
  );
}

function dayWord(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return `${days} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${days} дня`;
  return `${days} дней`;
}

function BudgetSpend({ spent, budget }: { spent: number; budget: number }) {
  const ratio = budget <= 0 ? 0 : Math.min(spent / budget, 1);
  const left = money(budget - spent);
  return (
    <section className="mt-4 rounded-3xl border border-line bg-paper px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted">Потрачено из бюджета</p>
        <p className="font-serif text-2xl">{formatPln(spent)}</p>
      </div>
      <p className="mt-1 text-sm text-muted">из {formatPln(budget)} на неделю</p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${left < 0 ? "bg-[#8a3d32]" : "bg-olive"}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-muted">
        {left < 0 ? `Выше бюджета на ${formatPln(-left)}` : `Осталось ${formatPln(left)}`}
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
