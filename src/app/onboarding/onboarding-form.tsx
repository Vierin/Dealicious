"use client";

import { useEffect, useState } from "react";
import { BackButton } from "@/components/back-link";
import { useRouter } from "next/navigation";
import { DayPills } from "@/components/day-pills";
import { MenuLevelCards } from "@/components/menu-level";
import { RangeSlider } from "@/components/range-slider";
import { BUDGET_MAX, BUDGET_MIN, BUDGET_STEP, isWarsaw, menuLevelOf, sliderBudget } from "@/lib/profile";
import { ALLERGEN_OPTIONS, APPLIANCE_OPTIONS, DIET_OPTIONS, MEAT_OPTIONS, SHOP_DAYS, STYLE_OPTIONS } from "@/lib/options";
import type { Allergen, Appliance, DietNeed, DietStyle, MeatPref, Profile } from "@/lib/types";

type Draft = {
  name: string;
  city: string;
  diet: DietNeed | null;
  meatPref: MeatPref | null;
  allergies: Allergen[];
  appliances: Appliance[];
  dietStyle: DietStyle | null;
  householdSize: number;
  dailyKcal: number;
  weeklyBudget: number;
  menuLevel: number;
  shopWeekday: number | null;
  cookDays: number[];
};

const emptyDraft: Draft = {
  name: "",
  city: "",
  diet: null,
  meatPref: null,
  allergies: [],
  appliances: [],
  dietStyle: null,
  householdSize: 2,
  dailyKcal: 2000,
  weeklyBudget: 250,
  menuLevel: 3,
  shopWeekday: null,
  cookDays: SHOP_DAYS.map((day) => day.value),
};

function stepsFor(draft: Draft) {
  const steps = ["name", "city", "store", "diet"] as const;
  const rest = ["allergies", "style", "kcal", "kitchen", "people", "budget", "day", "cook"] as const;
  if (draft.diet !== null && draft.diet !== "none") return [...steps, ...rest];
  return [...steps, "meat" as const, ...rest];
}

function stepReady(draft: Draft, step: string) {
  if (step === "name") return draft.name.trim().length > 0;
  if (step === "city") return isWarsaw(draft.city);
  if (step === "diet") return draft.diet !== null;
  if (step === "meat") return draft.meatPref !== null;
  if (step === "style") return draft.dietStyle !== null;
  if (step === "kitchen") return draft.appliances.length > 0;
  if (step === "budget") {
    return draft.weeklyBudget >= BUDGET_MIN && draft.weeklyBudget <= BUDGET_MAX;
  }
  if (step === "day") return draft.shopWeekday !== null;
  if (step === "cook") return draft.cookDays.length > 0;
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
        diet: data.profile.diet,
        meatPref: data.profile.meatPref,
        allergies: data.profile.allergies,
        appliances: data.profile.appliances ?? [],
        dietStyle: data.profile.dietStyle,
        householdSize: data.profile.householdSize,
        dailyKcal: data.profile.dailyKcal ?? 2000,
        weeklyBudget: sliderBudget(data.profile.weeklyBudgetPln),
        menuLevel: menuLevelOf(data.profile.menuLevel),
        shopWeekday: data.profile.shopWeekday,
        cookDays: data.profile.cookDays?.length ? data.profile.cookDays : SHOP_DAYS.map((day) => day.value),
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
      setError(
        step === "city"
          ? "Пока считаем только Варшаву"
          : step === "budget"
            ? "Укажи бюджет от 20 до 10 000 zł"
            : "Выбери вариант",
      );
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
          diet: draft.diet,
          meatPref: draft.diet === "none" ? draft.meatPref : "any",
          allergies: draft.allergies,
          appliances: draft.appliances,
          dietStyle: draft.dietStyle,
          householdSize: draft.householdSize,
          dailyKcal: draft.dailyKcal,
          weeklyBudgetPln: draft.weeklyBudget,
          menuLevel: draft.menuLevel,
          shopWeekday: draft.shopWeekday,
          cookDays: draft.cookDays,
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

        {step === "diet" ? (
          <Step title="Dietary needs">
            <div className="flex flex-col gap-2">
              {DIET_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setDraft({ ...draft, diet: option.id })}
                  className={`rounded-2xl border px-4 py-4 text-left ${draft.diet === option.id ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
                >
                  <div>{option.label}</div>
                  <div className="mt-1 text-sm text-muted">{option.hint}</div>
                </button>
              ))}
            </div>
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
          <Step title="Есть аллергии?">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, allergies: [] })}
                className={`rounded-2xl border px-4 py-4 text-left ${draft.allergies.length === 0 ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
              >
                Нет аллергии
              </button>
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

        {step === "kitchen" ? (
          <Step title="Kitchen appliances" hint="Рецепт попадёт в неделю, только если вся нужная техника есть.">
            <div className="flex flex-col gap-2">
              {APPLIANCE_OPTIONS.map((option) => {
                const active = draft.appliances.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        appliances: active
                          ? draft.appliances.filter((item) => item !== option.id)
                          : [...draft.appliances, option.id],
                      })
                    }
                    className={`rounded-2xl border px-4 py-4 text-left ${active ? "border-olive bg-paper" : "border-line bg-paper/60"}`}
                  >
                    <div>{option.label}</div>
                    <div className="mt-1 text-sm text-muted">{option.hint}</div>
                  </button>
                );
              })}
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

        {step === "kcal" ? (
          <Step title="Сколько калорий в день?" hint="Обед подберём примерно на треть этой нормы.">
            <div className="flex items-center justify-center gap-6 py-8">
              <button
                type="button"
                className="h-14 w-14 rounded-full border border-line text-2xl"
                onClick={() => setDraft({ ...draft, dailyKcal: Math.max(1200, draft.dailyKcal - 100) })}
              >
                −
              </button>
              <div className="w-32 text-center font-serif text-5xl">{draft.dailyKcal}</div>
              <button
                type="button"
                className="h-14 w-14 rounded-full border border-line text-2xl"
                onClick={() => setDraft({ ...draft, dailyKcal: Math.min(4000, draft.dailyKcal + 100) })}
              >
                +
              </button>
            </div>
          </Step>
        ) : null}

        {step === "budget" ? (
          <Step title="Какой бюджет на неделю?" hint="Только обеды, в злотых. План будет держаться этой суммы.">
            <RangeSlider
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={draft.weeklyBudget}
              onChange={(weeklyBudget) => setDraft({ ...draft, weeklyBudget })}
              readout={`${draft.weeklyBudget} zł`}
              minLabel={`${BUDGET_MIN} zł`}
              maxLabel={`${BUDGET_MAX} zł`}
            />
            <div className="mt-10">
              <h2 className="font-serif text-2xl leading-tight">Уровень меню</h2>
              <div className="mt-4">
                <MenuLevelCards value={draft.menuLevel} onChange={(menuLevel) => setDraft({ ...draft, menuLevel })} />
              </div>
            </div>
          </Step>
        ) : null}

        {step === "day" ? (
          <Step title="В какой день закупаешься?" hint="От этого зависят акции, которые ещё живы в магазине.">
            <DayPills
              selected={draft.shopWeekday === null ? [] : [draft.shopWeekday]}
              onPick={(shopWeekday) => setDraft({ ...draft, shopWeekday })}
            />
          </Step>
        ) : null}

        {step === "cook" ? (
          <Step title="В какие дни готовишь?" hint="Меню соберётся только на эти дни, не обязательно на всю неделю.">
            <DayPills
              selected={draft.cookDays}
              onPick={(day) =>
                setDraft({
                  ...draft,
                  cookDays: draft.cookDays.includes(day)
                    ? draft.cookDays.filter((value) => value !== day)
                    : [...draft.cookDays, day],
                })
              }
            />
          </Step>
        ) : null}
      </div>

      {error ? <p className="mt-4 text-sm text-[#8a3d32]">{error}</p> : null}

      <div className="mt-6 flex items-center gap-4">
        {index > 0 ? (
          <BackButton label="Назад" onClick={() => setIndex((value) => value - 1)} />
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
