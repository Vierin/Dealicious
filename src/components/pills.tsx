import { CUISINE_OPTIONS, STYLE_OPTIONS } from "@/lib/options";
import type { Cuisine, DietStyle } from "@/lib/types";

export function cuisineLabel(cuisine: Cuisine): string {
  return CUISINE_OPTIONS.find((item) => item.id === cuisine)?.label ?? cuisine;
}

export const VIBE_COLOR: Record<DietStyle, string> = {
  healthy: "bg-[#d7e7c8] text-[#2c5134]",
  sport: "bg-[#f3d2c4] text-[#6b3a2c]",
  balanced: "bg-[#e4ddd2] text-[#3f3a34]",
  comfort: "bg-[#f3e3b0] text-[#5c4a1e]",
};

export function VibePills({ styles }: { styles: DietStyle[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {styles.map((style) => (
        <li key={style} className={`rounded-full px-2.5 py-0.5 text-xs ${VIBE_COLOR[style]}`}>
          {STYLE_OPTIONS.find((item) => item.id === style)?.label ?? style}
        </li>
      ))}
    </ul>
  );
}
