"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function MarkCooked({
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
      const response = await fetch("/api/cooked", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId, dayIndex, cooked: next }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Не сохранил");
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
