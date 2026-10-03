import type { Allergen, Appliance, DietNeed, DietStyle, MeatPref, Profile } from "./types";

const ALLERGENS: Allergen[] = ["gluten", "lactose", "eggs", "fish", "soy"];
const APPLIANCES: Appliance[] = ["stove", "oven", "microwave", "blender", "airfryer"];
const MEAT: MeatPref[] = ["any", "chicken", "beef", "pork", "fish"];
const DIETS: DietNeed[] = ["none", "vegetarian", "vegan", "pescatarian"];
const STYLES: DietStyle[] = [
  "healthy-comfort",
  "protein-packed",
  "speedy-meals",
  "low-calories",
  "family-favs",
  "fakeway",
  "gut-friendly",
  "home-style",
];

const LEGACY_STYLE: Record<string, DietStyle> = {
  healthy: "healthy-comfort",
  sport: "protein-packed",
  balanced: "family-favs",
  comfort: "home-style",
};

export function vibeOf(value: string | null | undefined): DietStyle {
  if (value && STYLES.includes(value as DietStyle)) return value as DietStyle;
  if (value && LEGACY_STYLE[value]) return LEGACY_STYLE[value];
  return "family-favs";
}

export const ALL_COOK_DAYS = [0, 1, 2, 3, 4, 5, 6];

export const BUDGET_MIN = 50;
export const BUDGET_MAX = 800;
export const BUDGET_STEP = 10;

export const MENU_LEVELS = [
  {
    value: 1,
    label: "Simple",
    minutes: "15–25 мин",
    hint: "Простые техники, минимум посуды, 5–8 основных ингредиентов. Например, тёплая миска с курицей, рисом и овощами в лимонно-йогуртовом соусе.",
  },
  {
    value: 3,
    label: "Balanced",
    minutes: "25–40 мин",
    hint: "Интересные сочетания вкусов, маринады, домашние соусы, запекание и обжаривание. Например, средиземноморская курица с нутом, запечёнными овощами и травяным соусом.",
  },
  {
    value: 5,
    label: "Gourmet",
    minutes: "35–50 мин",
    hint: "Более сложные вкусовые сочетания, несколько компонентов, интересная подача и техники. Например, лосось с мисо-глазурью, гречкой и шпинатом. Только если стоимость вписывается в бюджет.",
  },
] as const;

export function sliderBudget(value: number): number {
  const stepped = Math.round(value / BUDGET_STEP) * BUDGET_STEP;
  return Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, stepped));
}

export function menuLevelOf(value: unknown): number {
  const level = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(level)) return 3;
  if (level <= 2) return 1;
  if (level === 3) return 3;
  if (level <= 5) return 5;
  return 3;
}

export function cookDaysOrAll(value: number[] | undefined): number[] {
  if (!value?.length) return [...ALL_COOK_DAYS];
  const days = [...new Set(value.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6))];
  return days.length > 0 ? days : [...ALL_COOK_DAYS];
}

export function parseCookDays(value: unknown): number[] {
  if (value == null) return [...ALL_COOK_DAYS];
  if (!Array.isArray(value) || value.length < 1) throw new Error("Выбери хотя бы один день готовки");
  const days = [...new Set(value)];
  if (
    days.length !== value.length ||
    days.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
  ) {
    throw new Error("Выбери дни готовки");
  }
  return days as number[];
}

export function isWarsaw(value: string): boolean {
  return /warszaw|варшав|warsaw/i.test(value);
}

export function isProfileComplete(profile: Profile | null): profile is Profile {
  if (!profile) return false;
  return (
    profile.name.trim().length > 0 &&
    isWarsaw(profile.city) &&
    profile.store === "biedronka" &&
    profile.householdSize >= 1 &&
    profile.shopWeekday >= 0 &&
    profile.shopWeekday <= 6 &&
    profile.cookDays.length >= 1 &&
    profile.cookDays.length <= 7 &&
    profile.cookDays.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
    new Set(profile.cookDays).size === profile.cookDays.length &&
    STYLES.includes(profile.dietStyle) &&
    DIETS.includes(profile.diet) &&
    Array.isArray(profile.appliances) &&
    profile.appliances.length >= 1 &&
    (profile.diet !== "none" || MEAT.includes(profile.meatPref)) &&
    profile.weeklyBudgetPln >= 20 &&
    profile.weeklyBudgetPln <= 10000 &&
    profile.dailyKcal >= 1200 &&
    profile.dailyKcal <= 4000 &&
    (profile.menuLevel === 1 || profile.menuLevel === 3 || profile.menuLevel === 5)
  );
}

export function parseProfile(userId: string, body: unknown): Profile {
  if (!body || typeof body !== "object") throw new Error("Пустая анкета");
  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const city = typeof input.city === "string" ? input.city.trim() : "";
  if (name.length < 1 || name.length > 80) throw new Error("Введи имя");
  if (!isWarsaw(city)) throw new Error("Пока считаем только Варшаву");

  const diet = input.diet;
  if (typeof diet !== "string" || !DIETS.includes(diet as DietNeed)) {
    throw new Error("Выбери dietary needs");
  }
  const meatPref = input.meatPref;
  if (diet === "none" && (typeof meatPref !== "string" || !MEAT.includes(meatPref as MeatPref))) {
    throw new Error("Выбери мясо");
  }

  const dietStyle = input.dietStyle;
  if (typeof dietStyle !== "string" || !STYLES.includes(dietStyle as DietStyle)) {
    throw new Error("Выбери стиль питания");
  }

  const householdSize = Number(input.householdSize);
  if (!Number.isInteger(householdSize) || householdSize < 1 || householdSize > 12) {
    throw new Error("Укажи, на сколько человек закупка");
  }

  const shopWeekday = Number(input.shopWeekday);
  if (!Number.isInteger(shopWeekday) || shopWeekday < 0 || shopWeekday > 6) {
    throw new Error("Выбери день закупки");
  }

  const cookDays = parseCookDays(input.cookDays);

  const weeklyBudgetPln = Number(input.weeklyBudgetPln);
  if (!Number.isFinite(weeklyBudgetPln) || weeklyBudgetPln < 20 || weeklyBudgetPln > 10000) {
    throw new Error("Укажи бюджет от 20 до 10 000 zł");
  }

  const rawKcal = input.dailyKcal == null || input.dailyKcal === "" ? 2000 : Number(input.dailyKcal);
  if (!Number.isInteger(rawKcal) || rawKcal < 1200 || rawKcal > 4000 || rawKcal % 100 !== 0) {
    throw new Error("Калории в день: от 1200 до 4000, шаг 100");
  }

  const rawLevel = menuLevelOf(input.menuLevel == null || input.menuLevel === "" ? 3 : input.menuLevel);

  const allergies = Array.isArray(input.allergies) ? input.allergies : [];
  if (!allergies.every((item) => typeof item === "string" && ALLERGENS.includes(item as Allergen))) {
    throw new Error("Неизвестная аллергия");
  }

  const appliances = Array.isArray(input.appliances) ? input.appliances : [];
  if (appliances.length < 1 || !appliances.every((item) => typeof item === "string" && APPLIANCES.includes(item as Appliance))) {
    throw new Error(appliances.length < 1 ? "Выбери технику" : "Неизвестная техника");
  }

  return {
    userId,
    name,
    city,
    store: "biedronka",
    allergies: [...new Set(allergies)] as Allergen[],
    appliances: [...new Set(appliances)] as Appliance[],
    meatPref: diet === "none" ? (meatPref as MeatPref) : "any",
    diet: diet as DietNeed,
    dietStyle: dietStyle as DietStyle,
    householdSize,
    shopWeekday,
    cookDays,
    weeklyBudgetPln: Math.round(weeklyBudgetPln * 100) / 100,
    dailyKcal: rawKcal,
    menuLevel: rawLevel,
  };
}
