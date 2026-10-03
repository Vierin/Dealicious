import type { Allergen, Appliance, Cuisine, DietNeed, DietStyle, MeatPref } from "./types";

export const APPLIANCE_OPTIONS: { id: Appliance; label: string; hint: string }[] = [
  { id: "stove", label: "Stove", hint: "Плита" },
  { id: "oven", label: "Oven", hint: "Духовка" },
  { id: "microwave", label: "Microwave", hint: "Микроволновка" },
  { id: "blender", label: "Blender", hint: "Блендер" },
  { id: "airfryer", label: "Air fryer", hint: "Аэрогриль" },
];

export const DIET_OPTIONS: { id: DietNeed; label: string; hint: string }[] = [
  { id: "none", label: "None", hint: "Без ограничений" },
  { id: "vegetarian", label: "Vegetarian", hint: "Без мяса и рыбы" },
  { id: "vegan", label: "Vegan", hint: "Без мяса, рыбы, яиц и молочки" },
  { id: "pescatarian", label: "Pescatarian", hint: "Рыба и растительная еда" },
];

export const ALLERGEN_OPTIONS: { id: Allergen; label: string }[] = [
  { id: "gluten", label: "Глютен" },
  { id: "lactose", label: "Лактоза" },
  { id: "eggs", label: "Яйца" },
  { id: "fish", label: "Рыба" },
  { id: "soy", label: "Соя" },
];

export const MEAT_OPTIONS: { id: MeatPref; label: string }[] = [
  { id: "chicken", label: "Курица" },
  { id: "beef", label: "Говядина" },
  { id: "pork", label: "Свинина" },
  { id: "fish", label: "Рыба" },
  { id: "any", label: "Без разницы" },
];

export const CUISINE_OPTIONS: { id: Cuisine; label: string }[] = [
  { id: "mexican", label: "Mexican" },
  { id: "italian", label: "Italian" },
  { id: "indian", label: "Indian" },
  { id: "asian", label: "Asian" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "polish", label: "Polish" },
];

export const STYLE_OPTIONS: { id: DietStyle; label: string; hint: string }[] = [
  { id: "healthy-comfort", label: "Healthy comfort", hint: "Сытно, но легче по жиру" },
  { id: "protein-packed", label: "Protein packed", hint: "Больше белка" },
  { id: "speedy-meals", label: "Speedy meals", hint: "До 20 минут" },
  { id: "low-calories", label: "Low calories", hint: "Порция легче обычного обеда" },
  { id: "family-favs", label: "Family favs", hint: "На всех, без перекоса" },
  { id: "fakeway", label: "Fakeway", hint: "Как навынос, только дома" },
  { id: "gut-friendly", label: "Gut friendly", hint: "Бобовые и клетчатка" },
  { id: "home-style", label: "Home style", hint: "Простая домашняя еда" },
];

export const SHOP_DAYS: { value: number; label: string; short: string }[] = [
  { value: 1, label: "Понедельник", short: "Пн" },
  { value: 2, label: "Вторник", short: "Вт" },
  { value: 3, label: "Среда", short: "Ср" },
  { value: 4, label: "Четверг", short: "Чт" },
  { value: 5, label: "Пятница", short: "Пт" },
  { value: 6, label: "Суббота", short: "Сб" },
  { value: 0, label: "Воскресенье", short: "Вс" },
];
