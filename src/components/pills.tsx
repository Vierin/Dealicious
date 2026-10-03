"use client";

import { useTranslations } from "next-intl";
import type { Cuisine, DietStyle } from "@/lib/types";

export const VIBE_COLOR: Record<DietStyle, string> = {
  "healthy-comfort": "bg-[#d7e7c8] text-[#2c5134]",
  "protein-packed": "bg-[#f3d2c4] text-[#6b3a2c]",
  "speedy-meals": "bg-[#f6d7a8] text-[#6a4514]",
  "low-calories": "bg-[#d5eadf] text-[#1f4d3a]",
  "family-favs": "bg-[#e4ddd2] text-[#3f3a34]",
  fakeway: "bg-[#f3c9c2] text-[#6b3028]",
  "gut-friendly": "bg-[#d9e4c4] text-[#3d4a22]",
  "home-style": "bg-[#f3e3b0] text-[#5c4a1e]",
};

export function CuisineName({ cuisine }: { cuisine: Cuisine }) {
  const t = useTranslations("cuisine");
  return t(cuisine);
}

export function VibePills({ styles }: { styles: DietStyle[] }) {
  const t = useTranslations("vibe");
  return (
    <ul className="flex flex-wrap gap-1.5">
      {styles.map((style) => (
        <li key={style} className={`rounded-full px-2.5 py-0.5 text-xs ${VIBE_COLOR[style]}`}>
          {t(style)}
        </li>
      ))}
    </ul>
  );
}
