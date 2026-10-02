"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isWarsaw } from "@/lib/profile";
import { ALLERGEN_OPTIONS, MEAT_OPTIONS, SHOP_DAYS, STYLE_OPTIONS } from "@/lib/options";
import type { Allergen, DietStyle, MeatPref, Profile } from "@/lib/types";

type Draft = {
  name: string;
  city: string;
  isVegan: boolean | null;
  meatPref: MeatPref | null;
  allergies: Allergen[];
  dietStyle: DietStyle | null;
  householdSize: number;
  shopWeekday: number | null;
};

const emptyDraft: Draft = {
  name: "",
  city: "",
  isVegan: null,
  meatPref: null,
  allergies: [],
  dietStyle: null,
  householdSize: 2,
  shopWeekday: null,
};

function stepsFor(draft: Draft) {
  const steps = ["name", "city", "store", "vegan"] as const;
  const rest = ["allergies", "style", "people", "day"] as const;
  if (draft.isVegan === true) return [...steps, ...rest];
  return [...steps, "meat" as const, ...rest];
}

function stepReady(draft: Draft, step: string) {
  if (step === "name") return draft.name.trim().length > 0;
  if (step === "city") return isWarsaw(draft.city);
  if (step === "vegan") return draft.isVegan !== null;
  if (step === "meat") return draft.meatPref !== null;
  if (step === "style") return draft.dietStyle !== null;
  if (step === "day") return draft.shopWeekday !== null;
  return true;
}

export function OnboardingForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/session");
      if (response.status === 401) {
        router.replace("/login");
        return;
      }
      const data = (await response.json()) as { profile: Profile | null };
      if (cancelled || !data.profile) {
        setReady(true);
        return;
      }
      setDraft({
        name: data.profile.name,
        city: data.profile.city,
        isVegan: data.profile.isVegan,
        meatPref: data.profile.meatPref,
        allergies: data.profile.allergies,
        dietStyle: data.profile.dietStyle,
        householdSize: data.profile.householdSize,
        shopWeekday: data.profile.shopWeekday,
      });
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const steps = stepsFor(draft);
  const step = steps[Math.min(index, steps.length - 1)];
  const last = index === steps.length - 1;

  async function next() {
    setError("");
    if (!stepReady(draft, step)) {
      setError(step === "city" ? "Пока считаем только Варшаву" : "Выбери вариант");
      return;
    }
    if (!last) {
      setIndex((value) => value + 1);
      return;
    }

    setPending(true);
    try {
      const profileResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          city: draft.city,
          isVegan: draft.isVegan,
          meatPref: draft.isVegan ? "any" : draft.meatPref,
          allergies: draft.allergies,
          dietStyle: draft.dietStyle,
          householdSize: draft.householdSize,
          shopWeekday: draft.shopWeekday,
        }),
      });
      const profileData = (await profileResponse.json()) as { error?: string };
      if (!profileResponse.ok) throw new Error(profileData.error ?? "Анкета не сохранилась");

      const planResponse = await fetch("/api/plan", { method: "POST" });
      const planData = (await planResponse.json()) as { error?: string };
      if (!planResponse.ok) throw new Error(planData.error ?? "Не собрал неделю");
      router.push("/week");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вышло");
    } finally {
      setPending(false);
    }
  }

  if (!ready) return <main className="mx-auto min-h-screen max-w-lg px-5 py-16 text-muted">Загрузка…</main>;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-8">
      <div className="mb-10 flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full bg-olive" style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
        </div>
        <span className="text-sm text-muted">
          {index + 1}/{steps.length}
        </span>
      </div>

      <div className="flex-1">
        {step === "name" ? (
          <Step title="Как тебя зовут?">
            <input
              autoFocus
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="h-14 w-full rounded-2xl border border-line bg-paper px-4 text-lg outline-none focus:border-olive"
              placeholder="Имя"
            />
          </Step>
        ) : null}

        {step === "city" ? (
          <Step title="Где ты закупаешься?" hint="Город или адрес. Сейчас работает Варшава.">
            <input
              autoFocus
              value={draft.city}
              onChange={(event) => setDraft({ ...draft, city: event.target.value })}
              className="h-14 w-full rounded-2xl border border-line bg-paper px-4 text-lg outline-none focus:border-olive"
              placeholder="Варшава"
            />
            <button
              type="button"
              onClick={() => setDraft({ ...draft, city: "Warszawa" })}
              className="mt-3 rounded-full border border-olive px-4 py-2 text-sm text-olive"
            >
              Варшава
            </button>
          </Step>
        ) : null}

        {step === "store" ? (
          <Step title="Какой магазин?" hint="Акции Biedronka общие по всей сети.">
            <div className="rounded-2xl border border-olive bg-paper px-4 py-4">
              <div className="text-lg">Biedronka</div>
              <div className="mt-1 text-sm text-muted">Варшава</div>
            </div>
          </Step>
        ) : null}

        {step === "vegan" ? (
          <Step title="Ты веган?">
            <Choices
              value={draft.isVegan === null ? "" : draft.isVegan ? "yes" : "no"}
              options={[
                { id: "yes", label: "Да" },
                { id: "no", label: "Нет" },
              ]}
              onChange={(id) => setDraft({ ...draft, isVegan: id === "yes" })}
            />
          </Step>
        ) : null}

        {step === "meat" ? (
          <Step title="Какое мясо предпочитаешь?" hint="Овощные обеды всё равно останутся в неделе.">
            <Choices
              value={draft.meatPref ?? ""}
              options={MEAT_OPTIONS}
              onChange={(id) => setDraft({ ...draft, meatPref: id as MeatPref })}
            />
          </Step>
        ) : null}

        {step === "allergies" ? (
          <Step title="Есть аллергии?" hint="Если нет — просто дальше.">
            <div className="flex flex-col gap-2">
              {ALLERGEN_OPTIONS.map((option) => {
                const active = draft.allergies.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        allergies: active
                          ? draft.allergies.filter((item) => item !== option.id)
                          : [...draft.allergies, option.id],
                      })
                    }
                    className={`rounded-2xl border px-4 py-4 text-left ${active ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Step>
        ) : null}

        {step === "style" ? (
          <Step title="Какой стиль питания?">
            <div className="flex flex-col gap-2">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDraft({ ...draft, dietStyle: option.id })}
                  className={`rounded-2xl border px-4 py-4 text-left ${draft.dietStyle === option.id ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
                >
                  <div>{option.label}</div>
                  <div className="mt-1 text-sm text-muted">{option.hint}</div>
                </button>
              ))}
            </div>
          </Step>
        ) : null}

        {step === "people" ? (
          <Step title="На сколько человек закупка?">
            <div className="flex items-center justify-center gap-6 py-8">
              <button
                type="button"
                className="h-14 w-14 rounded-full border border-line text-2xl"
                onClick={() => setDraft({ ...draft, householdSize: Math.max(1, draft.householdSize - 1) })}
              >
                −
              </button>
              <div className="w-16 text-center font-serif text-6xl">{draft.householdSize}</div>
              <button
                type="button"
                className="h-14 w-14 rounded-full border border-line text-2xl"
                onClick={() => setDraft({ ...draft, householdSize: Math.min(12, draft.householdSize + 1) })}
              >
                +
              </button>
            </div>
          </Step>
        ) : null}

        {step === "day" ? (
          <Step title="В какой день закупаешься?" hint="От этого зависят акции, которые ещё живы в магазине.">
            <Choices
              value={draft.shopWeekday === null ? "" : String(draft.shopWeekday)}
              options={SHOP_DAYS.map((day) => ({ id: String(day.value), label: day.label }))}
              onChange={(id) => setDraft({ ...draft, shopWeekday: Number(id) })}
            />
          </Step>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-[#8a3d32]">{error}</p> : null}

      <div className="mt-6 flex items-center gap-4">
        {index > 0 ? (
          <button type="button" onClick={() => setIndex((value) => value - 1)} className="text-sm text-muted">
            Назад
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          disabled={pending}
          onClick={next}
          className="ml-auto h-12 rounded-full bg-olive px-6 text-paper disabled:opacity-60"
        >
          {pending ? "Считаю…" : last ? "Собрать неделю" : "Дальше"}
        </button>
      </div>
    </main>
  );
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section>
      <h1 className="font-serif text-4xl leading-tight">{title}</h1>
      {hint ? <p className="mt-3 text-muted">{hint}</p> : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Choices({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-2xl border px-4 py-4 text-left ${value === option.id ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
