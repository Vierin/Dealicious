"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { formatPln } from "@/lib/money";
import { packsToBuy, type PantryNeed } from "@/lib/pantry";
import { readPantry, writePantry, type PantryState } from "@/lib/pantry-store";

const empty: PantryState = { stock: {}, applied: {} };

export function PantryStock({ planId, needs }: { planId: string; needs: PantryNeed[] }) {
  const t = useTranslations("pantry");
  const names = useTranslations("staples");
  const [state, setState] = useState<PantryState>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readPantry());
    setReady(true);
  }, []);

  function write(next: PantryState) {
    setState(next);
    writePantry(next);
  }

  function toggle(item: PantryNeed) {
    const current = state.applied[planId]?.[item.id];
    const stock = state.stock[item.id] ?? 0;
    if (current) {
      const restored = Math.max(0, stock - current.packs * item.pack + current.used);
      const plan = { ...state.applied[planId] };
      delete plan[item.id];
      write({
        stock: { ...state.stock, [item.id]: restored },
        applied: { ...state.applied, [planId]: plan },
      });
      return;
    }
    const packs = packsToBuy(stock, item.need, item.pack);
    write({
      stock: { ...state.stock, [item.id]: Math.max(0, stock + packs * item.pack - item.need) },
      applied: {
        ...state.applied,
        [planId]: { ...state.applied[planId], [item.id]: { packs, used: item.need } },
      },
    });
  }

  function remove(id: string) {
    write({ ...state, stock: { ...state.stock, [id]: 0 } });
  }

  if (!ready) return null;

  const rows = needs.filter((item) => item.need > 0 || (state.stock[item.id] ?? 0) > 0);
  if (rows.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-sm tracking-wide text-muted uppercase">{t("title")}</h2>
      <ul className="mt-2">
        {rows.map((item) => {
          const bought = Boolean(state.applied[planId]?.[item.id]);
          const stock = state.stock[item.id] ?? 0;
          const packs = bought ? state.applied[planId][item.id].packs : packsToBuy(stock, item.need, item.pack);
          const unit = item.unit === "g" ? t("g") : t("ml");
          const name = names(item.id as "oliwa");
          return (
            <li key={item.id} className="border-b border-line py-3">
              <div className="flex items-start gap-4">
                {packs > 0 ? (
                  <button
                    type="button"
                    onClick={() => toggle(item)}
                    aria-label={bought ? t("return") : t("bought")}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${bought ? "border-olive bg-olive text-paper" : "border-line bg-paper"}`}
                  >
                    {bought ? "✓" : ""}
                  </button>
                ) : (
                  <span className="mt-0.5 h-6 w-6 shrink-0" />
                )}
                <span className="min-w-0 flex-1">
                  <span className={`block ${bought ? "text-muted line-through" : ""}`}>{name}</span>
                  <span className="block text-sm text-muted">{t("atHome", { stock: Math.round(stock), unit })}</span>
                  {packs > 0 ? (
                    <span className={`block text-sm ${bought ? "text-muted" : ""}`}>
                      {t("buy", { packs, pack: item.pack, unit })}
                      {item.packPrice != null ? ` · ${formatPln(packs * item.packPrice)}` : ""}
                    </span>
                  ) : (
                    <span className="block text-sm text-muted">{t("noNeed")}</span>
                  )}
                </span>
                {stock > 0 ? (
                  <button type="button" onClick={() => remove(item.id)} className="shrink-0 text-sm text-[#8a3d32]">
                    {t("clear")}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
