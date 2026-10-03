"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export function RateMeal({ recipeId, score }: { recipeId: string; score: number | null }) {
  const [value, setValue] = useState(score);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function rate(next: number) {
    setError("");
    setPending(true);
    const previous = value;
    setValue(next);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recipeId, score: next }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Не сохранил оценку");
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Не сохранил оценку");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted">Оценка</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const on = value != null && star <= value;
          return (
            <button
              key={star}
              type="button"
              disabled={pending}
              aria-label={`${star} из 5`}
              onClick={() => rate(star)}
              className="text-olive disabled:opacity-60"
            >
              <Star size={18} strokeWidth={1.75} fill={on ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>
      {error ? <span className="text-sm text-[#8a3d32]">{error}</span> : null}
    </div>
  );
}
