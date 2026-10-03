"use client";

import { useTranslations } from "next-intl";
import { SHOP_DAYS } from "@/lib/options";

const dayKey = {
  0: "0",
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
} as const;

export function DayPills({ selected, onPick }: { selected: number[]; onPick: (day: number) => void }) {
  const t = useTranslations("days");
  return (
    <div className="flex gap-1.5">
      {SHOP_DAYS.map((day) => {
        const on = selected.includes(day.value);
        const key = dayKey[day.value as keyof typeof dayKey];
        return (
          <button
            key={day.value}
            type="button"
            aria-pressed={on}
            aria-label={t(key)}
            onClick={() => onPick(day.value)}
            className={`h-11 min-w-0 flex-1 rounded-full border text-sm ${on ? "border-olive bg-olive text-paper" : "border-line bg-paper text-ink"}`}
          >
            {t(`short${key}`)}
          </button>
        );
      })}
    </div>
  );
}
