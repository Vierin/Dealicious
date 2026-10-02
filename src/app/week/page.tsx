import { redirect } from "next/navigation";
import { formatRuDate } from "@/lib/dates";
import { formatPln, formatQty } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { getLatestPlan, getProfile, getSessionUser } from "@/lib/store";
import type { BasketLine } from "@/lib/types";
import { SHOP_DAYS } from "@/lib/options";
import { WeekActions } from "./week-actions";

export const dynamic = "force-dynamic";

export default async function WeekPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const plan = await getLatestPlan(user.id, profile.householdSize);
  const shop = plan ? formatRuDate(plan.shopDate) : null;
  const shopLabel = SHOP_DAYS.find((day) => day.value === profile.shopWeekday)?.label;

  const groups: { category: string; lines: BasketLine[] }[] = [];
  for (const line of plan?.lines ?? []) {
    const group = groups.find((item) => item.category === line.category);
    if (group) group.lines.push(line);
    else groups.push({ category: line.category, lines: [line] });
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-serif text-3xl">Dealicious</p>
          <p className="mt-2 text-muted">
            {profile.name} · {profile.city} · Biedronka · на {profile.householdSize} чел.
          </p>
          <p className="text-muted">Закупка: {shopLabel}</p>
        </div>
        <WeekActions />
      </header>

      {plan && shop ? (
        <>
          <section className="mt-8 grid grid-cols-3 gap-3 rounded-3xl bg-ink p-5 text-cream">
            <Stat label="К оплате" value={formatPln(plan.total)} />
            <Stat label="Без акций" value={formatPln(plan.regularTotal)} />
            <Stat label="Сэкономили" value={formatPln(plan.saved)} accent />
          </section>
          <p className="mt-3 text-sm text-muted">
            Семь обедов с {shop.dayMonth}. Цены по газете, которая действует в день закупки.
          </p>

          <section className="mt-8">
            <h2 className="font-serif text-2xl">Обеды</h2>
            <ol className="mt-2">
              {plan.meals.map((meal) => {
                const date = formatRuDate(meal.date);
                return (
                  <li key={meal.dayIndex} className="flex gap-4 border-b border-line py-4">
                    <div className="w-32 shrink-0 text-sm text-muted">
                      <div className="capitalize">{date.weekday}</div>
                      <div>{date.dayMonth}</div>
                    </div>
                    <div>
                      <div className="font-serif text-xl">{meal.title}</div>
                      <div className="text-sm text-muted">на {plan.householdSize} чел.</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl">Список покупок</h2>
            {groups.map((group) => (
              <div key={group.category} className="mt-6">
                <h3 className="text-sm tracking-wide text-muted uppercase">{group.category}</h3>
                <ul className="mt-2">
                  {group.lines.map((line) => {
                    const pct = line.onPromo
                      ? Math.round((1 - line.unitPrice / (line.regularLineTotal / line.qty)) * 100)
                      : 0;
                    return (
                      <li key={line.productId} className="flex items-start justify-between gap-4 border-b border-line py-3">
                        <div>
                          <div>{line.namePl}</div>
                          <div className="text-sm text-muted">{formatQty(line.qty, line.unit)}</div>
                        </div>
                        <div className="text-right">
                          <div>{formatPln(line.lineTotal)}</div>
                          {line.onPromo ? (
                            <div className="text-sm text-olive">−{pct}% · было {formatPln(line.regularLineTotal)}</div>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </section>
        </>
      ) : (
        <p className="mt-10 text-muted">Неделя ещё не собрана. Открой анкету и дойди до конца.</p>
      )}
    </main>
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
