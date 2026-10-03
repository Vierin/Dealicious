"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Star, Users } from "lucide-react";
import { postJson } from "@/lib/http";

export function RecipeBar({
  minutes,
  portions,
  recipeId,
  score,
  cooked,
}: {
  minutes: number;
  portions: number;
  recipeId: string;
  score: number | null;
  cooked: { planId: string; dayIndex: number; cooked: boolean; weekday?: string }[];
}) {
  return (
    <div className="mt-5">
      <div className="flex items-center gap-4 text-muted">
        <p className="inline-flex items-center gap-1.5">
          <Clock size={16} strokeWidth={1.75} />
          {minutes} мин
        </p>
        <p className="inline-flex items-center gap-1.5">
          <Users size={16} strokeWidth={1.75} />
          {portions} {portionWord(portions)}
        </p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-2">
          {cooked.map((slot) => (
            <CookedButton key={slot.dayIndex} {...slot} />
          ))}
        </div>
        <Stars recipeId={recipeId} score={score} />
      </div>
    </div>
  );
}

function Stars({ recipeId, score }: { recipeId: string; score: number | null }) {
  const [value, setValue] = useState(score);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function rate(next: number) {
    setError("");
    setPending(true);
    const previous = value;
    setValue(next);
    try {
      await postJson("/api/ratings", { body: { recipeId, score: next }, fallback: "Не сохранил оценку" });
    } catch (err) {
      setValue(previous);
      setError(err instanceof Error ? err.message : "Не сохранил оценку");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
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

function CookedButton({
  planId,
  dayIndex,
  cooked,
  weekday,
}: {
  planId: string;
  dayIndex: number;
  cooked: boolean;
  weekday?: string;
}) {
  const router = useRouter();
  const [on, setOn] = useState(cooked);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    setError("");
    setPending(true);
    const next = !on;
    setOn(next);
    try {
      await postJson("/api/cooked", { body: { planId, dayIndex, cooked: next }, fallback: "Не сохранил" });
      router.refresh();
    } catch (err) {
      setOn(!next);
      setError(err instanceof Error ? err.message : "Не сохранил");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        aria-pressed={on}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm disabled:opacity-60 ${on ? "border-olive bg-olive text-cream" : "border-line bg-paper text-ink"}`}
      >
        <Check size={14} strokeWidth={2} />
        {on ? "Cooked" : "Mark as cooked"}
        {weekday ? <span className="capitalize opacity-80">{weekday}</span> : null}
      </button>
      {error ? <span className="text-sm text-[#8a3d32]">{error}</span> : null}
    </div>
  );
}

function portionWord(portions: number): string {
  const mod10 = portions % 10;
  const mod100 = portions % 100;
  if (mod10 === 1 && mod100 !== 11) return "порция";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "порции";
  return "порций";
}
