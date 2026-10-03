"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { STAPLES } from "@/lib/pantry";
import { readPantry, writePantry, type PantryState } from "@/lib/pantry-store";

const empty: PantryState = { stock: {}, applied: {} };

export function PantryEditor() {
  const t = useTranslations("pantry");
  const names = useTranslations("staples");
  const [state, setState] = useState<PantryState>(empty);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(readPantry());
    setReady(true);
  }, []);

  function commit(id: string, raw: string) {
    const parsed = raw.trim() === "" ? 0 : Math.round(Number(raw));
    if (!Number.isFinite(parsed) || parsed < 0) return;
    const next = { ...state, stock: { ...state.stock, [id]: parsed } };
    setState(next);
    writePantry(next);
    setDrafts((current) => {
      const copy = { ...current };
      delete copy[id];
      return copy;
    });
  }

  function remove(id: string) {
    commit(id, "0");
  }

  if (!ready) return null;

  return (
    <ul className="mt-6">
      {STAPLES.map((item) => {
        const stock = Math.round(state.stock[item.id] ?? 0);
        const unit = item.unit === "g" ? t("g") : t("ml");
        const name = names(item.id as "oliwa");
        const shown = drafts[item.id] ?? String(stock);
        return (
          <li key={item.id} className="flex items-center gap-3 border-b border-line py-3">
            <span className="min-w-0 flex-1">
              <span className="block">{name}</span>
              <span className="text-sm text-muted">{unit}</span>
            </span>
            <input
              inputMode="numeric"
              value={shown}
              aria-label={`${name}, ${t("home")}`}
              onChange={(event) => setDrafts((current) => ({ ...current, [item.id]: event.target.value }))}
              onBlur={() => commit(item.id, shown)}
              className="h-11 w-24 rounded-2xl border border-line bg-paper px-3 text-right outline-none focus:border-olive"
            />
            <button
              type="button"
              onClick={() => remove(item.id)}
              disabled={stock === 0 && drafts[item.id] == null}
              className="shrink-0 text-sm text-[#8a3d32] disabled:opacity-40"
            >
              {t("remove")}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
