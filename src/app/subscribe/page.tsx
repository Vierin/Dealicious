import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("subscribe");
  const price = formatPln(SUBSCRIPTION_PLN);
  const timesText = timesLabel(times);

  return (
    <Page>
      <BackLink href="/week" />
      <h1 className="mt-3 font-serif text-4xl">{t("title")}</h1>
      <p className="mt-3 font-serif text-5xl">{formatPln(trial.saved)}</p>
      <p className="mt-3 text-lg">
        {trial.saved <= 0
          ? t("payoffNone")
          : times < 1
            ? t("payoffNotYet", { price })
            : t("payoffYes", { price, times: timesText })}
      </p>
      <p className="mt-2 text-sm text-muted">
        {trial.open
          ? t("trialLeft", { days: trial.daysLeft, date: until.dayMonth })
          : t("trialOver", { date: until.dayMonth })}
      </p>

      <section className="mt-8 flex flex-col gap-4">
        {trial.weeks.length === 0 ? (
          <p className="text-sm text-muted">{t("noWeeks")}</p>
        ) : (
          trial.weeks.map((week, index) => {
            const date = formatRuDate(week.shopDate);
            return (
              <article key={week.shopDate} className="rounded-3xl border border-line bg-paper p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-serif text-2xl">
                    {t("week", { count: index + 1 })}
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
                  <p className="mt-4 text-sm text-muted">{t("noDeals")}</p>
                )}
              </article>
            );
          })
        )}
        {trial.open && trial.weeks.length === 1 ? (
          <p className="text-sm text-muted">{t("secondMissing")}</p>
        ) : null}
      </section>

      {trial.weeks.length > 0 ? (
        <section className="mt-4 rounded-3xl bg-ink p-5 text-cream">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-xs tracking-wide text-cream/70 uppercase">{t("together")}</span>
            <span className="font-serif text-3xl">{formatPln(trial.saved)}</span>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <span className="text-xs tracking-wide text-cream/70 uppercase">{t("plan")}</span>
            <span className="font-serif text-3xl">{t("perMonth", { price })}</span>
          </div>
          {times >= 1 ? (
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <span className="text-xs tracking-wide text-cream/70 uppercase">{t("paidOff")}</span>
              <span className="font-serif text-3xl">×{timesLabel(times)}</span>
            </div>
          ) : null}
        </section>
      ) : null}

      {!trial.open ? (
        <p className="mt-6 text-sm text-muted">{t("closed")}</p>
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

