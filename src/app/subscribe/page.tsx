import { redirect } from "next/navigation";
import { SUBSCRIPTION_PLN } from "@/lib/billing";
import { formatRuDate } from "@/lib/dates";
import { formatPln } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { getProfile, getSessionUser, getTrial } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const trial = await getTrial(user.id, profile.householdSize);
  const until = formatRuDate(localDate(trial.endsAt));
  const covers = trial.saved >= SUBSCRIPTION_PLN;

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <a href="/week" className="text-sm text-muted">
        Неделя
      </a>
      <h1 className="mt-3 font-serif text-4xl">Подписка</h1>
      <p className="mt-3 text-sm text-muted">
        {trial.open
          ? `Триал ещё ${dayWord(trial.daysLeft)}, до ${until.dayMonth}.`
          : `Триал кончился ${until.dayMonth}. Уже собранная неделя остаётся.`}
      </p>

      <section className="mt-8 flex flex-col gap-4">
        {trial.weeks.length === 0 ? (
          <p className="text-sm text-muted">Собранных недель в триале ещё нет. Сравнивать с подпиской не из чего.</p>
        ) : (
          trial.weeks.map((week, index) => {
            const date = formatRuDate(week.shopDate);
            return (
              <article key={week.shopDate} className="rounded-3xl border border-line bg-paper p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-2xl">
                    Неделя {index + 1}
                    <span className="mt-1 block text-sm font-sans text-muted">
                      {date.weekday}, {date.dayMonth}
                    </span>
                  </h2>
                  <p className="font-serif text-2xl">{formatPln(week.saved)}</p>
                </div>
                {week.lines.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-1 text-sm text-muted">
                    {week.lines.map((line) => (
                      <li key={line.namePl} className="flex justify-between gap-4">
                        <span>{line.namePl}</span>
                        <span>{formatPln(line.saved)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-muted">На эту закупку акций, которые дешевле полки, нет.</p>
                )}
              </article>
            );
          })
        )}
        {trial.open && trial.weeks.length === 1 ? (
          <p className="text-sm text-muted">Вторая закупка в эти 14 дней ещё не собрана.</p>
        ) : null}
      </section>

      {trial.weeks.length > 0 ? (
        <section className="mt-4 rounded-3xl bg-ink p-5 text-cream">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs tracking-wide text-cream/70 uppercase">Вместе за триал</span>
            <span className="font-serif text-3xl">{formatPln(trial.saved)}</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <span className="text-xs tracking-wide text-cream/70 uppercase">Подписка</span>
            <span className="font-serif text-3xl">{formatPln(SUBSCRIPTION_PLN)} / мес</span>
          </div>
          <p className="mt-5 text-sm text-cream/80">
            {covers
              ? `Акции за триал дали ${formatPln(trial.saved)}. Подписка ${formatPln(SUBSCRIPTION_PLN)} в месяц.`
              : `Эти недели подписку не отбили: ${formatPln(trial.saved)} против ${formatPln(SUBSCRIPTION_PLN)}.`}
          </p>
        </section>
      ) : null}

      {!trial.open ? (
        <p className="mt-6 text-sm text-muted">Следующую корзину без подписки не соберём.</p>
      ) : null}
    </main>
  );
}

function localDate(iso: string): string {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function dayWord(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return `${days} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${days} дня`;
  return `${days} дней`;
}
