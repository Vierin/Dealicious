"use client";

import { useTranslations } from "next-intl";

export function WeekActions({ trialOpen }: { trialOpen: boolean }) {
  const t = useTranslations("nav");
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      {trialOpen ? null : (
        <a href="/subscribe" className="text-olive">
          {t("subscribe")}
        </a>
      )}
      <a href="/meals" className="hidden text-muted md:inline">
        {t("meals")}
      </a>
      <a href="/profile" className="hidden text-muted md:inline">
        {t("profile")}
      </a>
    </div>
  );
}
