import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BackLink } from "@/components/back-link";
import { Page } from "@/components/page";
import { buildCatalog } from "@/lib/catalog";
import { formatRuDate, nextLeafletDate, nextShopDate } from "@/lib/dates";
import { formatPln } from "@/lib/money";
import { dealsOn } from "@/lib/planner";
import { isProfileComplete } from "@/lib/profile";
import { getLatestPlan, getProfile, getSessionUser } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfile(user.id);
  if (!isProfileComplete(profile)) redirect("/onboarding");
  const plan = await getLatestPlan(user.id, profile.householdSize);
  const shopDate = plan?.shopDate ?? nextShopDate(profile.shopWeekday);
  const date = formatRuDate(shopDate);
  const leaflet = formatRuDate(nextLeafletDate());
  const deals = dealsOn(buildCatalog(), shopDate);
  const t = await getTranslations("deals");

  return (
    <Page>
      <BackLink href="/week" />
      <p className="mt-6 text-sm tracking-wide text-muted uppercase">{t("label")}</p>
      <h1 className="mt-1 font-serif text-4xl capitalize">
        {date.weekday}, {date.dayMonth}
      </h1>
      {deals.length === 0 ? (
        <div className="mt-8 max-w-md text-muted">
          <p>{t("empty")}</p>
          <p className="mt-2">{t("leaflet", { weekday: leaflet.weekday, dayMonth: leaflet.dayMonth })}</p>
        </div>
      ) : (
        <ul className="mt-8">
          <li className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] gap-3 pb-2 text-xs tracking-wide text-muted uppercase">
            <span>{t("product")}</span>
            <span className="text-right">{t("regular")}</span>
            <span className="text-right">{t("promo")}</span>
          </li>
          {deals.map((deal) => (
            <li key={deal.id} className="grid grid-cols-[minmax(0,1fr)_5.5rem_5.5rem] items-baseline gap-3 border-t border-line py-4">
              <span className="min-w-0">
                <span className="block font-serif text-xl">{deal.namePl}</span>
                <span className="mt-1 block text-sm text-muted">{deal.pack}</span>
              </span>
              <span className="text-right text-sm text-muted line-through">
                {deal.approx ? `≈ ${formatPln(deal.regularPricePln)}` : formatPln(deal.regularPricePln)}
              </span>
              <span className="text-right font-serif text-xl text-olive">{formatPln(deal.promoPricePln)}</span>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
