"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, X } from "lucide-react";

type Slot = { dayIndex: number; title: string; weekday: string };

export function RebuildPlan({ meals }: { meals: Slot[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [keep, setKeep] = useState<number[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function toggle(dayIndex: number) {
    setKeep((current) =>
      current.includes(dayIndex) ? current.filter((day) => day !== dayIndex) : [...current, dayIndex],
    );
    setError("");
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
      setKeep([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не пересчитал");
    } finally {
      setPending(false);
    }
  }

  const kept = meals.filter((meal) => keep.includes(meal.dayIndex));

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
          onClick={() => setOpen(true)}
          aria-label="Какие оставить"
          aria-expanded={open}
          aria-haspopup="dialog"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${open || kept.length > 0 ? "border-ink bg-ink text-cream" : "border-line bg-paper text-ink"}`}
        >
          <Settings size={20} strokeWidth={1.75} />
        </button>
      </div>
      {kept.length > 0 ? (
        <p className="mt-2 text-sm text-muted capitalize">Оставить: {kept.map((meal) => meal.weekday).join(", ")}</p>
      ) : null}
      {error ? <p className="mt-3 text-sm text-[#8a3d32]">{error}</p> : null}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center">
          <button type="button" aria-label="Закрыть" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rebuild-keep-title"
            className="relative z-10 flex max-h-[min(36rem,calc(100dvh-1.5rem))] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-line bg-paper"
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5">
              <div>
                <h2 id="rebuild-keep-title" className="font-serif text-2xl">
                  Что оставить
                </h2>
                <p className="mt-1 text-sm text-muted">Отмеченные останутся, остальные сменятся.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <ul className="mt-4 flex flex-col gap-2 overflow-y-auto px-5 pb-5">
              {meals.map((meal) => {
                const on = keep.includes(meal.dayIndex);
                return (
                  <li key={meal.dayIndex}>
                    <button
                      type="button"
                      onClick={() => toggle(meal.dayIndex)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-line bg-cream px-4 py-3 text-left"
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${on ? "border-olive bg-olive text-paper" : "border-line bg-paper"}`}
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
