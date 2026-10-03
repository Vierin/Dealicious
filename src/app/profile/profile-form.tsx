"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { Choice, choiceClass } from "@/components/choice";
import { Field } from "@/components/field";
import { Page } from "@/components/page";
import { createClient } from "@/lib/supabase/client";
import { DayPills } from "@/components/day-pills";
import { MenuLevelCards } from "@/components/menu-level";
import { RangeSlider } from "@/components/range-slider";
import { saveProfileAndPlan } from "@/lib/http";
import { BUDGET_MAX, BUDGET_MIN, BUDGET_STEP, isWarsaw, menuLevelOf, sliderBudget } from "@/lib/profile";
import { ALLERGEN_OPTIONS, APPLIANCE_OPTIONS, DIET_OPTIONS, MEAT_OPTIONS, SHOP_DAYS, STYLE_OPTIONS } from "@/lib/options";
import type { Allergen, Appliance, DietNeed, DietStyle, MeatPref, Profile } from "@/lib/types";

export function ProfileForm({ profile, email }: { profile: Profile; email: string }) {
  const router = useRouter();
  const t = useTranslations("profile");
  const dietT = useTranslations("diet");
  const meatT = useTranslations("meat");
  const allergenT = useTranslations("allergen");
  const styleT = useTranslations("vibe");
  const applianceT = useTranslations("appliance");
  const errors = useTranslations("errors");
  const auth = useTranslations("auth");
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [diet, setDiet] = useState<DietNeed>(profile.diet);
  const [meatPref, setMeatPref] = useState<MeatPref>(profile.meatPref);
  const [allergies, setAllergies] = useState<Allergen[]>(profile.allergies);
  const [dietStyle, setDietStyle] = useState<DietStyle>(profile.dietStyle);
  const [appliances, setAppliances] = useState<Appliance[]>(profile.appliances);
  const [householdSize, setHouseholdSize] = useState(profile.householdSize);
  const [weeklyBudget, setWeeklyBudget] = useState(sliderBudget(profile.weeklyBudgetPln));
  const [menuLevel, setMenuLevel] = useState(menuLevelOf(profile.menuLevel));
  const [dailyKcal, setDailyKcal] = useState(profile.dailyKcal ?? 2000);
  const [shopWeekday, setShopWeekday] = useState(profile.shopWeekday);
  const [cookDays, setCookDays] = useState<number[]>(
    profile.cookDays?.length ? profile.cookDays : SHOP_DAYS.map((day) => day.value),
  );
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
    if (name.trim().length < 1) {
      setError(errors("name"));
      return;
    }
    if (!isWarsaw(city)) {
      setError(errors("warsaw"));
      return;
    }
    if (cookDays.length < 1) {
      setError(errors("pickCookDay"));
      return;
    }
    if (appliances.length < 1) {
      setError(errors("appliance"));
      return;
    }

    setPending(true);
    try {
      await saveProfileAndPlan(
        {
          name,
          city,
          diet,
          meatPref: diet === "none" ? meatPref : "any",
          allergies,
          appliances,
          dietStyle,
          householdSize,
          dailyKcal,
          weeklyBudgetPln: weeklyBudget,
          menuLevel,
          shopWeekday,
          cookDays,
        },
        { profile: t("profileError"), plan: t("planError") },
      );
      router.push("/week");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : auth("failed"));
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    const { error } = await createClient().auth.signOut();
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/login");
    router.refresh();
  }

  return (
    <Page>
      <div className="flex items-center justify-between gap-4">
        <BackLink href="/week" />
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-ink px-3 py-2 text-sm"
        >
          <LogOut size={16} strokeWidth={1.75} />
          {t("logout")}
        </button>
      </div>
      <h1 className="mt-3 font-serif text-4xl">{t("title")}</h1>
      <p className="mt-2 text-muted">{email}</p>

      <Section title={t("name")}>
        <Field size="lg" value={name} onChange={(event) => setName(event.target.value)} />
      </Section>

      <Section title={t("city")}>
        <Field size="lg" value={city} onChange={(event) => setCity(event.target.value)} />
        <button type="button" onClick={() => setCity("Warszawa")} className="mt-3 rounded-full border border-olive px-4 py-2 text-sm text-olive">
          {t("warsaw")}
        </button>
      </Section>

      <Section title={t("store")}>
        <div className={choiceClass(true)}>
          <div>Biedronka</div>
          <div className="mt-1 text-sm text-muted">{t("warsaw")}</div>
        </div>
      </Section>

      <Section title={t("diet")}>
        <div className="flex flex-col gap-2">
          {DIET_OPTIONS.map((option) => (
            <Choice key={option.id} on={diet === option.id} onClick={() => setDiet(option.id)}>
              <div>{dietT(option.id)}</div>
              <div className="mt-1 text-sm text-muted">{dietT(`${option.id}Hint`)}</div>
            </Choice>
          ))}
        </div>
      </Section>

      {diet === "none" ? (
        <Section title={t("meat")}>
          <div className="flex flex-col gap-2">
            {MEAT_OPTIONS.map((option) => (
              <Choice key={option.id} on={meatPref === option.id} onClick={() => setMeatPref(option.id)}>
                {meatT(option.id)}
              </Choice>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title={t("allergies")}>
        <div className="flex flex-col gap-2">
          <Choice on={allergies.length === 0} onClick={() => setAllergies([])}>
            {t("noAllergy")}
          </Choice>
          {ALLERGEN_OPTIONS.map((option) => (
            <Choice key={option.id} on={allergies.includes(option.id)} onClick={() => toggleAllergy(option.id)}>
              {allergenT(option.id)}
            </Choice>
          ))}
        </div>
      </Section>

      <Section title={t("style")}>
        <div className="flex flex-col gap-2">
          {STYLE_OPTIONS.map((option) => (
            <Choice key={option.id} on={dietStyle === option.id} onClick={() => setDietStyle(option.id)}>
              <div>{styleT(option.id)}</div>
              <div className="mt-1 text-sm text-muted">{styleT(`${option.id}Hint`)}</div>
            </Choice>
          ))}
        </div>
      </Section>

      <Section title={t("appliances")} hint={t("appliancesHint")}>
        <div className="flex flex-col gap-2">
          {APPLIANCE_OPTIONS.map((option) => (
            <Choice key={option.id} on={appliances.includes(option.id)} onClick={() => toggleAppliance(option.id)}>
              <div>{applianceT(option.id)}</div>
              <div className="mt-1 text-sm text-muted">{applianceT(`${option.id}Hint`)}</div>
            </Choice>
          ))}
        </div>
      </Section>

      <Section title={t("people")}>
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

      <Section title={t("kcal")} hint={t("kcalHint")}>
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

      <Section title={t("budget")} hint={t("budgetHint")}>
        <RangeSlider
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={weeklyBudget}
          onChange={setWeeklyBudget}
          readout={`${weeklyBudget} zł`}
          minLabel={`${BUDGET_MIN} zł`}
          maxLabel={`${BUDGET_MAX} zł`}
        />
      </Section>

      <Section title={t("menu")}>
        <MenuLevelCards value={menuLevel} onChange={setMenuLevel} />
      </Section>

      <Section title={t("cookDays")} hint={t("cookDaysHint")}>
        <DayPills
          selected={cookDays}
          onPick={(day) =>
            setCookDays((current) => (current.includes(day) ? current.filter((value) => value !== day) : [...current, day]))
          }
        />
      </Section>

      <Section title={t("shopDay")}>
        <DayPills selected={[shopWeekday]} onPick={setShopWeekday} />
      </Section>

      {error ? <p className="mt-6 text-sm text-[#8a3d32]">{error}</p> : null}

      <div className="h-28" aria-hidden />

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-line bg-cream/95 px-5 py-4 md:bottom-0">
        <div className="mx-auto flex max-w-2xl justify-end">
          <button type="button" disabled={pending} onClick={save} className="h-12 rounded-full bg-olive px-6 text-paper disabled:opacity-60">
            {pending ? t("saving") : t("save")}
          </button>
        </div>
      </div>
    </Page>
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
