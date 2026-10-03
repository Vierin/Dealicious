"use client";

import Link from "next/link";
import { useState } from "react";
import { VibePills, cuisineLabel } from "@/components/pills";
import type { MealCard } from "../meal-browser";

export function CuisineMeals({ title, meals }: { title: string; meals: MealCard[] }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const shown = needle ? meals.filter((meal) => meal.title.toLowerCase().includes(needle)) : meals;

  return (
    <>
      <h1 className="mt-3 font-serif text-4xl">{title}</h1>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Поиск блюда"
        className="mt-5 h-12 w-full rounded-2xl border border-line bg-paper px-4 text-base outline-none focus:border-olive"
      />
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  <VibePills styles={meal.vibes} />
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
