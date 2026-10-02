import type { Allergen, Appliance, DietNeed, DietStyle, MeatPref } from "./types";

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

export const STYLE_OPTIONS: { id: DietStyle; label: string; hint: string }[] = [
  { id: "healthy", label: "Здоровое", hint: "Овощи, рыба, меньше жирного" },
  { id: "sport", label: "Спорт", hint: "Больше белка" },
  { id: "balanced", label: "Обычное", hint: "Без перекоса" },
  { id: "comfort", label: "Домашнее", hint: "Простая сытная еда" },
];

export const SHOP_DAYS: { value: number; label: string }[] = [
  { value: 1, label: "Понедельник" },
  { value: 2, label: "Вторник" },
  { value: 3, label: "Среда" },
  { value: 4, label: "Четверг" },
  { value: 5, label: "Пятница" },
  { value: 6, label: "Суббота" },
  { value: 0, label: "Воскресенье" },
];
