import type { Allergen, DietStyle, MeatPref, Profile } from "./types";

const ALLERGENS: Allergen[] = ["gluten", "lactose", "eggs", "fish", "soy"];
const MEAT: MeatPref[] = ["any", "chicken", "beef", "pork", "fish"];
const STYLES: DietStyle[] = ["healthy", "sport", "balanced", "comfort"];

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
    STYLES.includes(profile.dietStyle) &&
    (profile.isVegan || MEAT.includes(profile.meatPref))
  );
}

export function parseProfile(userId: string, body: unknown): Profile {
  if (!body || typeof body !== "object") throw new Error("Пустая анкета");
  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const city = typeof input.city === "string" ? input.city.trim() : "";
  if (name.length < 1 || name.length > 80) throw new Error("Введи имя");
  if (!isWarsaw(city)) throw new Error("Пока считаем только Варшаву");

  const isVegan = input.isVegan === true;
  const meatPref = input.meatPref;
  if (!isVegan && (typeof meatPref !== "string" || !MEAT.includes(meatPref as MeatPref))) {
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

  const allergies = Array.isArray(input.allergies) ? input.allergies : [];
  if (!allergies.every((item) => typeof item === "string" && ALLERGENS.includes(item as Allergen))) {
    throw new Error("Неизвестная аллергия");
  }

  return {
    userId,
    name,
    city,
    store: "biedronka",
    allergies: [...new Set(allergies)] as Allergen[],
    meatPref: isVegan ? "any" : (meatPref as MeatPref),
    isVegan,
    dietStyle: dietStyle as DietStyle,
    householdSize,
    shopWeekday,
  };
}
