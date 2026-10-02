"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { VibePills, cuisineLabel } from "@/components/pills";
import { CUISINE_OPTIONS, STYLE_OPTIONS } from "@/lib/options";
import type { Cuisine, DietStyle } from "@/lib/types";

export type MealCard = {
  id: string;
  title: string;
  cuisine: Cuisine;
  dietStyles: DietStyle[];
  minutes: number;
  photo: string | null;
};

export function MealBrowser({ meals }: { meals: MealCard[] }) {
  const [cuisine, setCuisine] = useState<Cuisine | "all">("all");
  const [vibe, setVibe] = useState<DietStyle | "all">("all");
  const shown = meals.filter((meal) => {
    if (cuisine !== "all" && meal.cuisine !== cuisine) return false;
    if (vibe !== "all" && !meal.dietStyles.includes(vibe)) return false;
    return true;
  });

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2">
        <Chip active={cuisine === "all"} onClick={() => setCuisine("all")}>
          Все кухни
        </Chip>
        {CUISINE_OPTIONS.map((item) => (
          <Chip key={item.id} active={cuisine === item.id} onClick={() => setCuisine(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip active={vibe === "all"} onClick={() => setVibe("all")}>
          Все вайбы
        </Chip>
        {STYLE_OPTIONS.map((item) => (
          <Chip key={item.id} active={vibe === item.id} onClick={() => setVibe(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{shown.length} блюд</p>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shown.map((meal) => (
          <li key={meal.id}>
            <Link href={`/recipe/${meal.id}`} className="block overflow-hidden rounded-3xl border border-line bg-paper">
              {meal.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={meal.photo} alt="" className="aspect-[4/3] w-full object-cover" />
              ) : (
                <div className="aspect-[4/3] w-full bg-cream" />
              )}
              <div className="px-4 py-4">
                <p className="text-xs tracking-wide text-muted uppercase">{cuisineLabel(meal.cuisine)}</p>
                <h2 className="mt-1 font-serif text-2xl">{meal.title}</h2>
                <div className="mt-3">
                  <VibePills styles={meal.dietStyles} />
                </div>
                <p className="mt-3 text-sm text-muted">{meal.minutes} мин</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-sm ${active ? "border-ink bg-ink text-cream" : "border-line text-muted"}`}
    >
      {children}
    </button>
  );
}
