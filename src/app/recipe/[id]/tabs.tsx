"use client";

import { useState } from "react";

export function RecipeTabs({
  ingredients,
  steps,
}: {
  ingredients: { name: string; qty: string }[];
  steps: string[];
}) {
  const [tab, setTab] = useState<"ingredients" | "method">("ingredients");

  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 rounded-2xl border border-line p-1">
        <button
          type="button"
          onClick={() => setTab("ingredients")}
          className={`rounded-xl px-3 py-2 text-sm ${tab === "ingredients" ? "bg-ink text-cream" : "text-muted"}`}
        >
          Ингредиенты
        </button>
        <button
          type="button"
          onClick={() => setTab("method")}
          className={`rounded-xl px-3 py-2 text-sm ${tab === "method" ? "bg-ink text-cream" : "text-muted"}`}
        >
          Приготовление
        </button>
      </div>

      {tab === "ingredients" ? (
        <ul className="mt-4">
          {ingredients.map((item) => (
            <li key={item.name} className="flex items-baseline justify-between gap-4 border-b border-line py-3">
              <span>{item.name}</span>
              <span className="text-muted">{item.qty}</span>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="mt-4">
          {steps.map((step, index) => (
            <li key={step} className="flex gap-4 border-b border-line py-4">
              <span className="w-6 shrink-0 text-muted">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
