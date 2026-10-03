"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeartIcon, readFavorites } from "@/components/favorite-button";
import { readRecent } from "@/components/recent-view";
import { Field } from "@/components/field";
import { MealPhoto } from "@/components/meal-photo";
import { MealCard as MealTile } from "@/components/meal-card";
import { VIBE_COLOR } from "@/components/pills";
import { CUISINE_OPTIONS, STYLE_OPTIONS } from "@/lib/options";
import type { Cuisine, DietStyle } from "@/lib/types";

const CUISINE_TAGS: Record<Cuisine, string[]> = {
  polish: ["картошка", "котлеты", "гречка"],
  italian: ["паста", "ризотто", "пенне"],
  asian: ["рис", "лапша", "брокколи"],
  mexican: ["тортилья", "фасоль", "рис"],
  indian: ["карри", "нут", "рис"],
  mediterranean: ["фета", "лимон", "салат"],
};

export type MealCard = {
  id: string;
  title: string;
  cuisine: Cuisine;
  vibes: DietStyle[];
  minutes: number;
  photo: string | null;
};

export function MealBrowser({ meals, favoritesOnly = false }: { meals: MealCard[]; favoritesOnly?: boolean }) {
  const [query, setQuery] = useState("");
  const [vibe, setVibe] = useState<DietStyle | null>(null);
  const [showAll, setShowAll] = useState(favoritesOnly);
  const [saved, setSaved] = useState<string[] | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setSaved(readFavorites());
    setRecent(readRecent());
  }, []);

  const needle = query.trim().toLowerCase();
  const searching = needle.length > 0;
  const pool = favoritesOnly ? meals.filter((meal) => saved?.includes(meal.id)) : meals;
  const shown = pool.filter((meal) => {
    if (vibe && !meal.vibes.includes(vibe)) return false;
    if (searching && !meal.title.toLowerCase().includes(needle)) return false;
    return true;
  });
  const listOpen = favoritesOnly || showAll || vibe !== null || searching;
  const recentMeals = recent
    .map((id) => meals.find((meal) => meal.id === id))
    .filter((meal): meal is MealCard => meal != null);

  return (
    <>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl">{favoritesOnly ? "Избранное" : "Блюда"}</h1>
        <div className="flex items-center gap-4">
          {favoritesOnly ? null : (
            <button
              type="button"
              onClick={() => {
                setShowAll(true);
                setVibe(null);
              }}
              className="text-sm text-olive"
            >
              See all
            </button>
          )}
          <Link
            href={favoritesOnly ? "/meals" : "/meals?favorites=1"}
            aria-label="Избранное"
            className={`flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper ${favoritesOnly ? "text-[#8a3d32]" : "text-ink"}`}
          >
            <HeartIcon filled={favoritesOnly} />
          </Link>
        </div>
      </div>
      <Field className="mt-5" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск блюда" />

      {favoritesOnly ? null : (
        <>
          <section className="mt-8">
            <h2 className="font-serif text-2xl">Your vibes</h2>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {STYLE_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setVibe(item.id); setShowAll(false); }}
                  className={`flex h-28 w-40 shrink-0 items-end rounded-3xl px-4 py-4 text-left font-serif text-xl leading-tight ${VIBE_COLOR[item.id]} ${vibe === item.id ? "ring-2 ring-ink" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="font-serif text-2xl">Explore by cuisine</h2>
            <ul className="mt-3 flex flex-col gap-3">
              {CUISINE_OPTIONS.map((item) => {
                const photo = meals.find((meal) => meal.cuisine === item.id && meal.photo)?.photo ?? null;
                return (
                  <li key={item.id}>
                    <Link href={`/meals/${item.id}`} className="block w-full overflow-hidden rounded-3xl border border-line bg-paper text-left">
                      <MealPhoto src={photo} className="aspect-[16/7] w-full" />
                      <div className="px-4 py-4">
                        <p className="font-serif text-2xl">{item.label}</p>
                        <p className="mt-1 text-sm text-muted">{CUISINE_TAGS[item.id].join(" · ")}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {recentMeals.length > 0 ? (
            <section className="mt-8">
              <h2 className="font-serif text-2xl">Recently viewed</h2>
              <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {recentMeals.map((meal) => (
                  <li key={meal.id} className="w-40 shrink-0">
                    <Link href={`/recipe/${meal.id}`} className="block overflow-hidden rounded-3xl border border-line bg-paper">
                      <MealPhoto src={meal.photo} className="aspect-[4/3] w-full" />
                      <div className="px-3 py-3">
                        <h3 className="font-serif text-lg leading-tight">{meal.title}</h3>
                        <p className="mt-1 text-xs text-muted">{meal.minutes} мин</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      {listOpen ? (
        <>
          <p className="mt-8 text-sm text-muted">
            {favoritesOnly && saved !== null && pool.length === 0 ? "В избранном пока пусто." : `${shown.length} блюд`}
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shown.map((meal) => (
              <li key={meal.id}>
                <MealTile meal={meal} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  );
}
