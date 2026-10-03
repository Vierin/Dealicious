import { redirect } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { SUBSCRIPTION_PLN } from "@/lib/billing";
import { formatRuDate } from "@/lib/dates";
import { formatPln } from "@/lib/money";
import { isProfileComplete } from "@/lib/profile";
import { Page } from "@/components/page";
import { getProfile, getSessionUser, getTrial } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SubscribePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const trial = await getTrial(user.id, profile.householdSize);
  const until = formatRuDate(localDate(trial.endsAt));
  const times = Math.round((trial.saved / SUBSCRIPTION_PLN) * 10) / 10;

  return (
    <Page>
      <BackLink href="/week" label="Неделя" />
      <h1 className="mt-3 font-serif text-4xl">Уже сэкономлено</h1>
      <p className="mt-3 font-serif text-5xl">{formatPln(trial.saved)}</p>
      <p className="mt-3 text-lg">{payoff(trial.saved, times)}</p>
      <p className="mt-2 text-sm text-muted">
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
          {times >= 1 ? (
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-xs tracking-wide text-cream/70 uppercase">Окупилась</span>
              <span className="font-serif text-3xl">×{timesLabel(times)}</span>
            </div>
          ) : null}
        </section>
      ) : null}

      {!trial.open ? (
        <p className="mt-6 text-sm text-muted">Следующую корзину без подписки не соберём.</p>
      ) : null}
    </Page>
  );
}

function localDate(iso: string): string {
  const date = new Date(iso);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function timesLabel(times: number): string {
  return Number.isInteger(times) ? String(times) : times.toFixed(1).replace(".", ",");
}

function timesWord(times: number): string {
  if (!Number.isInteger(times)) return "раза";
  const mod10 = times % 10;
  const mod100 = times % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "раза";
  return "раз";
}

function payoff(saved: number, times: number): string {
  if (saved <= 0) return "Пока скидки не дали разницы с полкой.";
  if (times < 1) {
    return `Подписка ${formatPln(SUBSCRIPTION_PLN)} в месяц. Эти недели её ещё не отбили.`;
  }
  return `Подписка ${formatPln(SUBSCRIPTION_PLN)} в месяц уже окупилась в ${timesLabel(times)} ${timesWord(times)}.`;
}

function dayWord(days: number): string {
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return `${days} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${days} дня`;
  return `${days} дней`;
}
