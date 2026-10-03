"use client";

import { useTranslations } from "next-intl";
import { Choice } from "@/components/choice";
import { MENU_LEVELS } from "@/lib/profile";

const copy = {
  1: { label: "1", minutes: "1minutes", hint: "1hint" },
  3: { label: "3", minutes: "3minutes", hint: "3hint" },
  5: { label: "5", minutes: "5minutes", hint: "5hint" },
} as const;

export function MenuLevelCards({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const t = useTranslations("menu");
  return (
    <div className="flex flex-col gap-2">
      {MENU_LEVELS.map((level) => {
        const on = value === level;
        const text = copy[level];
        return (
          <Choice key={level} on={on} onClick={() => onChange(level)}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-serif text-xl">{t(text.label)}</span>
              <span className="text-sm text-muted">{t(text.minutes)}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{t(text.hint)}</p>
          </Choice>
        );
      })}
    </div>
  );
}
