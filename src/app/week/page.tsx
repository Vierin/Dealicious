import Link from "next/link";
import { redirect } from "next/navigation";
import { VibePills, cuisineLabel } from "@/components/pills";
import { leafletsOn, RECIPES } from "@/lib/catalog";
import { COOKING, kcal } from "@/lib/cooking";
import type { BasketLine, Unit } from "@/lib/types";
import { recipePhoto } from "@/lib/recipes";
import { formatRuDate } from "@/lib/dates";
import { formatPln, money } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { getLatestPlan, getProfile, getSessionUser, getTrial } from "@/lib/store";
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
        {trial.open ? (
          <>
            Триал ещё {dayWord(trial.daysLeft)}.{" "}
            <a href="/subscribe" className="text-olive">
              Экономия за эти недели
            </a>
          </>
        ) : (
          <>
            Триал кончился. Эта неделя остаётся.{" "}
            <a href="/subscribe" className="text-olive">
              Следующую без подписки не соберём
            </a>
          </>
        )}
      </p>

      {plan ? (
        <>
          <div className="mt-8 grid gap-4 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
            <div>
              <section className="grid grid-cols-3 gap-3 rounded-3xl bg-ink p-5 text-cream">
                <Stat label="К оплате" value={formatPln(plan.total)} />
                <Stat label="Без акций" value={formatPln(plan.regularTotal)} />
                <Stat label="Сэкономили" value={formatPln(plan.saved)} accent />
              </section>
              <SavingsLines lines={plan.lines} />
            </div>
            <ShopCard planId={plan.id} productIds={plan.lines.map((line) => line.productId)} />
          </div>

          {noLeaflet ? (
            <p className="mt-4 text-sm text-muted">
              На {formatRuDate(plan.shopDate).dayMonth} газетки нет, поэтому сэкономили 0.
            </p>
          ) : null}

          {stale && trial.open ? (
            <p className="mt-4 text-sm text-olive">Каталог обновился. Нажми «Пересчитать», чтобы собрать неделю заново.</p>
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
                            <ClockIcon />
                            {minutes} мин
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <PeopleIcon />
                          {plan.householdSize}
                        </span>
                        {COOKING[meal.recipeId] ? (
                          <span>{kcal(COOKING[meal.recipeId])} ккал</span>
                        ) : null}
                        <span className="inline-flex items-center gap-1.5">
                          <PriceIcon />
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
          </section>
        </>
      ) : (
        <p className="mt-10 text-muted">Неделя ещё не собрана. Открой анкету и дойди до конца.</p>
      )}
    </main>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.5V8.2L10.4 9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="6" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 12.5c.4-2 1.8-3 3.5-3s3.1 1 3.5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="11" cy="5.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11 8.6c1.4.2 2.4 1.1 2.7 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function SavingsLines({ lines }: { lines: BasketLine[] }) {
  const deals = lines
    .filter((line) => line.onPromo && line.regularLineTotal > line.lineTotal)
    .map((line) => ({ line, saved: money(line.regularLineTotal - line.lineTotal) }))
    .sort((a, b) => b.saved - a.saved);
  if (deals.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-col gap-2 text-sm">
      {deals.map(({ line, saved }) => (
        <li key={line.productId} className="flex items-baseline justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate">{line.namePl}</span>
            <span className="text-muted">
              {formatUnitPrice(line.regularUnitPrice)} → {formatUnitPrice(line.unitPrice)} {priceUnit(line.unit)}
            </span>
          </span>
          <span className="shrink-0 text-olive">−{formatPln(saved)}</span>
        </li>
      ))}
    </ul>
  );
}

function formatUnitPrice(value: number): string {
  return new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function priceUnit(unit: Unit): string {
  if (unit === "kg") return "zł/kg";
  if (unit === "l") return "zł/l";
  if (unit === "opak") return "zł/opak";
  return "zł/szt";
}

function dayWord(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return `${days} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${days} дня`;
  return `${days} дней`;
}

function PriceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="2.25" y="3.75" width="11.5" height="8.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.25 6.5h11.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
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
