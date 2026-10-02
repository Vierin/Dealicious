"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isWarsaw } from "@/lib/profile";
import { ALLERGEN_OPTIONS, APPLIANCE_OPTIONS, DIET_OPTIONS, MEAT_OPTIONS, SHOP_DAYS, STYLE_OPTIONS } from "@/lib/options";
import type { Allergen, Appliance, DietNeed, DietStyle, MeatPref, Profile } from "@/lib/types";

const on = "rounded-2xl border border-olive bg-paper px-4 py-3 text-left";
const off = "rounded-2xl border border-line bg-paper/60 px-4 py-3 text-left";

export function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [diet, setDiet] = useState<DietNeed>(profile.diet);
  const [meatPref, setMeatPref] = useState<MeatPref>(profile.meatPref);
  const [allergies, setAllergies] = useState<Allergen[]>(profile.allergies);
  const [dietStyle, setDietStyle] = useState<DietStyle>(profile.dietStyle);
  const [appliances, setAppliances] = useState<Appliance[]>(profile.appliances);
  const [householdSize, setHouseholdSize] = useState(profile.householdSize);
  const [weeklyBudget, setWeeklyBudget] = useState(String(profile.weeklyBudgetPln));
  const [dailyKcal, setDailyKcal] = useState(profile.dailyKcal ?? 2000);
  const [shopWeekday, setShopWeekday] = useState(profile.shopWeekday);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function toggleAllergy(id: Allergen) {
    setAllergies((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAppliance(id: Appliance) {
    setAppliances((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function save() {
    setError("");
    const budget = Number(weeklyBudget);
    if (name.trim().length < 1) {
      setError("Введи имя");
      return;
    }
    if (!isWarsaw(city)) {
      setError("Пока считаем только Варшаву");
      return;
    }
    if (!Number.isFinite(budget) || budget < 20 || budget > 10000) {
      setError("Укажи бюджет от 20 до 10 000 zł");
      return;
    }

    setPending(true);
    try {
      const profileResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          diet,
          meatPref: diet === "none" ? meatPref : "any",
          allergies,
          appliances,
          dietStyle,
          householdSize,
          dailyKcal,
          weeklyBudgetPln: budget,
          shopWeekday,
        }),
      });
      const profileData = (await profileResponse.json()) as { error?: string };
      if (!profileResponse.ok) throw new Error(profileData.error ?? "Не сохранилось");

      const planResponse = await fetch("/api/plan", { method: "POST" });
      const planData = (await planResponse.json()) as { error?: string };
      if (!planResponse.ok) throw new Error(planData.error ?? "Не пересчитал неделю");
      router.push("/week");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вышло");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8 pb-28">
      <a href="/week" className="text-sm text-muted">
        Неделя
      </a>
      <h1 className="mt-3 font-serif text-4xl">Профиль</h1>
      <p className="mt-2 text-muted">{email}</p>

      <Section title="Имя">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-14 w-full rounded-2xl border border-line bg-paper px-4 text-lg outline-none focus:border-olive"
        />
      </Section>

      <Section title="Город">
        <input
          value={city}
          onChange={(event) => setCity(event.target.value)}
          className="h-14 w-full rounded-2xl border border-line bg-paper px-4 text-lg outline-none focus:border-olive"
        />
        <button type="button" onClick={() => setCity("Warszawa")} className="mt-3 rounded-full border border-olive px-4 py-2 text-sm text-olive">
          Варшава
        </button>
      </Section>

      <Section title="Магазин">
        <div className={on}>
          <div>Biedronka</div>
          <div className="mt-1 text-sm text-muted">Варшава</div>
        </div>
      </Section>

      <Section title="Dietary needs">
        <div className="flex flex-col gap-2">
          {DIET_OPTIONS.map((option) => (
            <button key={option.id} type="button" onClick={() => setDiet(option.id)} className={diet === option.id ? on : off}>
              <div>{option.label}</div>
              <div className="mt-1 text-sm text-muted">{option.hint}</div>
            </button>
          ))}
        </div>
      </Section>

      {diet === "none" ? (
        <Section title="Мясо">
          <div className="flex flex-col gap-2">
            {MEAT_OPTIONS.map((option) => (
              <button key={option.id} type="button" onClick={() => setMeatPref(option.id)} className={meatPref === option.id ? on : off}>
                {option.label}
              </button>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="Аллергии">
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => setAllergies([])} className={allergies.length === 0 ? on : off}>
            Нет аллергии
          </button>
          {ALLERGEN_OPTIONS.map((option) => (
            <button key={option.id} type="button" onClick={() => toggleAllergy(option.id)} className={allergies.includes(option.id) ? on : off}>
              {option.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Стиль">
        <div className="flex flex-col gap-2">
          {STYLE_OPTIONS.map((option) => (
            <button key={option.id} type="button" onClick={() => setDietStyle(option.id)} className={dietStyle === option.id ? on : off}>
              <div>{option.label}</div>
              <div className="mt-1 text-sm text-muted">{option.hint}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Техника" hint="Рецепт попадает в неделю, только если вся нужная техника есть.">
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => setAppliances([])} className={appliances.length === 0 ? on : off}>
            <div>None</div>
            <div className="mt-1 text-sm text-muted">Только холодные обеды</div>
          </button>
          {APPLIANCE_OPTIONS.map((option) => (
            <button key={option.id} type="button" onClick={() => toggleAppliance(option.id)} className={appliances.includes(option.id) ? on : off}>
              <div>{option.label}</div>
              <div className="mt-1 text-sm text-muted">{option.hint}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Человек">
        <div className="flex items-center gap-6">
          <button type="button" className="h-12 w-12 rounded-full border border-line text-2xl" onClick={() => setHouseholdSize((value) => Math.max(1, value - 1))}>
            −
          </button>
          <div className="w-12 text-center font-serif text-4xl">{householdSize}</div>
          <button type="button" className="h-12 w-12 rounded-full border border-line text-2xl" onClick={() => setHouseholdSize((value) => Math.min(12, value + 1))}>
            +
          </button>
        </div>
      </Section>

      <Section title="Калории в день" hint="Обед около трети этой нормы.">
        <div className="flex items-center gap-6">
          <button type="button" className="h-12 w-12 rounded-full border border-line text-2xl" onClick={() => setDailyKcal((value) => Math.max(1200, value - 100))}>
            −
          </button>
          <div className="w-24 text-center font-serif text-4xl">{dailyKcal}</div>
          <button type="button" className="h-12 w-12 rounded-full border border-line text-2xl" onClick={() => setDailyKcal((value) => Math.min(4000, value + 100))}>
            +
          </button>
        </div>
      </Section>

      <Section title="Бюджет на неделю">
        <div className="flex gap-2">
          {[150, 250, 400].map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setWeeklyBudget(String(amount))}
              className={`flex-1 ${Number(weeklyBudget) === amount ? on : off}`}
            >
              {amount} zł
            </button>
          ))}
        </div>
        <input
          type="number"
          inputMode="decimal"
          min={20}
          max={10000}
          value={weeklyBudget}
          onChange={(event) => setWeeklyBudget(event.target.value)}
          className="mt-3 h-14 w-full rounded-2xl border border-line bg-paper px-4 text-lg outline-none focus:border-olive"
        />
      </Section>

      <Section title="День закупки">
        <div className="flex flex-col gap-2">
          {SHOP_DAYS.map((day) => (
            <button key={day.value} type="button" onClick={() => setShopWeekday(day.value)} className={shopWeekday === day.value ? on : off}>
              {day.label}
            </button>
          ))}
        </div>
      </Section>

      {error ? <p className="mt-6 text-sm text-[#8a3d32]">{error}</p> : null}

      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-cream/95 px-5 py-4">
        <div className="mx-auto flex max-w-2xl justify-end">
          <button type="button" disabled={pending} onClick={save} className="h-12 rounded-full bg-olive px-6 text-paper disabled:opacity-60">
            {pending ? "Считаю…" : "Сохранить"}
          </button>
        </div>
      </div>
    </main>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm tracking-wide text-muted uppercase">{title}</h2>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}
