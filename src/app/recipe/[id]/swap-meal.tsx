"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { postJson } from "@/lib/http";

type WeekSlot = { dayIndex: number; title: string; weekday: string };

export function SwapMeal({
  recipeId,
  inWeek,
  week,
}: {
  recipeId: string;
  inWeek: boolean;
  week: WeekSlot[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState("");

  async function send(dayIndex?: number) {
    setError("");
    setPending(true);
    try {
      await postJson("/api/plan/swap", { body: { recipeId, dayIndex }, fallback: "Не заменил" });
      router.push("/week");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не заменил");
      setPending(false);
    }
  }

  if (week.length === 0) return null;

  return (
    <div className="mt-8">
      {inWeek ? (
        <button
          type="button"
          onClick={() => send()}
          disabled={pending}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink text-cream disabled:opacity-60"
        >
          <RefreshCw size={18} strokeWidth={1.75} />
          {pending ? "Меняю…" : "Swap this meal"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setPicking((value) => !value)}
          disabled={pending}
          className="h-12 w-full rounded-2xl bg-ink text-cream disabled:opacity-60"
        >
          Add to this week&apos;s menu
        </button>
      )}
      {!inWeek && picking ? (
        <>
          <p className="mt-4 text-sm text-muted">Что убрать из недели</p>
          <ul className="mt-2 flex flex-col gap-2">
          {week.map((slot) => (
            <li key={slot.dayIndex}>
              <button
                type="button"
                onClick={() => send(slot.dayIndex)}
                disabled={pending}
                className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-left disabled:opacity-60"
              >
                <span className="block text-sm text-muted capitalize">{slot.weekday}</span>
                <span className="mt-1 block font-serif text-xl">{slot.title}</span>
              </button>
            </li>
          ))}
          </ul>
        </>
      ) : null}
      {error ? <p className="mt-3 text-sm text-[#8a3d32]">{error}</p> : null}
    </div>
  );
}
