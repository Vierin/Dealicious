"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { MealPhoto } from "@/components/meal-photo";
import { CuisineName, VibePills } from "@/components/pills";
import type { Cuisine, DietStyle } from "@/lib/types";

export function MealCard({
  meal,
}: {
  meal: {
    id: string;
    title: string;
    cuisine: Cuisine;
    vibes: DietStyle[];
    minutes: number;
    photo: string | null;
  };
}) {
  const t = useTranslations("week");
  return (
    <Link href={`/recipe/${meal.id}`} className="block overflow-hidden rounded-3xl border border-line bg-paper">
      <MealPhoto src={meal.photo} className="aspect-[4/3] w-full" />
      <div className="px-4 py-4">
        <p className="text-xs tracking-wide text-muted uppercase">
          <CuisineName cuisine={meal.cuisine} />
        </p>
        <h2 className="mt-1 font-serif text-2xl">{meal.title}</h2>
        <div className="mt-3">
          <VibePills styles={meal.vibes} />
        </div>
        <p className="mt-3 text-sm text-muted">{t("minutes", { count: meal.minutes })}</p>
      </div>
    </Link>
  );
}
