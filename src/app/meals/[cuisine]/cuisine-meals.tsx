"use client";

import { useState } from "react";
import { Field } from "@/components/field";
import { MealCard as MealTile } from "@/components/meal-card";
import type { MealCard } from "../meal-browser";

export function CuisineMeals({ title, meals }: { title: string; meals: MealCard[] }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const shown = needle ? meals.filter((meal) => meal.title.toLowerCase().includes(needle)) : meals;

  return (
    <>
      <h1 className="mt-3 font-serif text-4xl">{title}</h1>
      <Field className="mt-5" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск блюда" />
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shown.map((meal) => (
          <li key={meal.id}>
            <MealTile meal={meal} />
          </li>
        ))}
      </ul>
    </>
  );
}
