"use client";

import { useEffect, useState } from "react";
import { formatPln, formatQty } from "@/lib/money";
import type { BasketLine } from "@/lib/types";

type Group = { category: string; lines: BasketLine[] };

export function ShoppingList({ planId, groups }: { planId: string; groups: Group[] }) {
  const [checked, setChecked] = useState<string[]>([]);
  const storageKey = `dealicious-checks:${planId}`;
  const total = groups.reduce((sum, group) => sum + group.lines.length, 0);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        setChecked(parsed);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  function toggle(productId: string) {
    setChecked((current) => {
      const next = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  }

  const done = groups.reduce(
    (sum, group) => sum + group.lines.filter((line) => checked.includes(line.productId)).length,
    0,
  );

  return (
    <>
      <p className="mt-6 text-sm text-muted">
        {done} из {total}
      </p>
      {groups.map((group) => (
        <section key={group.category} className="mt-8">
          <h2 className="text-sm tracking-wide text-muted uppercase">{group.category}</h2>
          <ul className="mt-2">
            {group.lines.map((line) => {
              const on = checked.includes(line.productId);
              const discounted = line.onPromo && line.regularLineTotal > line.lineTotal && line.qty > 0;
              const pct = discounted
                ? Math.round((1 - line.unitPrice / (line.regularLineTotal / line.qty)) * 100)
                : 0;
              return (
                <li key={line.productId} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => toggle(line.productId)}
                    className="flex w-full items-start gap-4 py-3 text-left"
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${on ? "border-olive bg-olive text-paper" : "border-line bg-paper"}`}
                      aria-hidden
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span className={`min-w-0 flex-1 ${on ? "text-muted line-through" : ""}`}>
                      <span className="block">{line.namePl}</span>
                      <span className="block text-sm">{formatQty(line.qty, line.unit)}</span>
                    </span>
                    <span className={`text-right ${on ? "text-muted" : ""}`}>
                      <span className="block">{line.approx ? `≈ ${formatPln(line.lineTotal)}` : formatPln(line.lineTotal)}</span>
                      {line.approx ? <span className="block text-sm text-muted">ориентир, без точной экономии</span> : null}
                      {discounted && !line.approx ? (
                        <span className={`block text-sm ${on ? "" : "text-olive"}`}>
                          −{pct}% · было {formatPln(line.regularLineTotal)}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
