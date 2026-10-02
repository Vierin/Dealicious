"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

type Slot = { dayIndex: number; title: string; weekday: string };

export function RebuildPlan({ meals }: { meals: Slot[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [keep, setKeep] = useState<number[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function toggle(dayIndex: number) {
    setKeep((current) =>
      current.includes(dayIndex) ? current.filter((day) => day !== dayIndex) : [...current, dayIndex],
    );
  }

  async function rebuild() {
    setError("");
    if (keep.length >= meals.length) {
      setError("Нечего менять");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ keep }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Не пересчитал");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не пересчитал");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={rebuild}
          disabled={pending}
          className="h-12 flex-1 rounded-2xl bg-ink text-cream disabled:opacity-60"
        >
          {pending ? "Считаю…" : "Rebuild plan"}
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Какие оставить"
          aria-expanded={open}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${open ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink"}`}
        >
          <Settings size={20} strokeWidth={1.75} />
        </button>
      </div>
      {open ? (
        <ul className="mt-3 flex flex-col gap-2">
          <li className="text-sm text-muted">Отмеченные останутся, остальные сменятся.</li>
          {meals.map((meal) => {
            const on = keep.includes(meal.dayIndex);
            return (
              <li key={meal.dayIndex}>
                <button
                  type="button"
                  onClick={() => toggle(meal.dayIndex)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${on ? "border-olive bg-olive text-paper" : "border-line"}`}
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted capitalize">{meal.weekday}</span>
                    <span className="mt-0.5 block truncate font-serif text-xl">{meal.title}</span>
                  </span>
                  <span className="ml-auto shrink-0 text-sm text-muted">{on ? "Оставить" : "Сменить"}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
      {error ? <p className="mt-3 text-sm text-[#8a3d32]">{error}</p> : null}
    </div>
  );
}

