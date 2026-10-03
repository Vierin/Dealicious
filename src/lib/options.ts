import type { Allergen, Appliance, Cuisine, DietNeed, DietStyle, MeatPref } from "./types";

export const APPLIANCE_OPTIONS: { id: Appliance }[] = [
  { id: "stove" },
  { id: "oven" },
  { id: "microwave" },
  { id: "blender" },
  { id: "airfryer" },
];

export const DIET_OPTIONS: { id: DietNeed }[] = [
  { id: "none" },
  { id: "vegetarian" },
  { id: "vegan" },
  { id: "pescatarian" },
];

export const ALLERGEN_OPTIONS: { id: Allergen }[] = [
  { id: "gluten" },
  { id: "lactose" },
  { id: "eggs" },
  { id: "fish" },
  { id: "soy" },
];

export const MEAT_OPTIONS: { id: MeatPref }[] = [
  { id: "chicken" },
  { id: "beef" },
  { id: "pork" },
  { id: "fish" },
  { id: "any" },
];

export const CUISINE_OPTIONS: { id: Cuisine }[] = [
  { id: "mexican" },
  { id: "italian" },
  { id: "indian" },
  { id: "asian" },
  { id: "mediterranean" },
  { id: "polish" },
];

export const STYLE_OPTIONS: { id: DietStyle }[] = [
  { id: "healthy-comfort" },
  { id: "protein-packed" },
  { id: "speedy-meals" },
  { id: "low-calories" },
  { id: "family-favs" },
  { id: "fakeway" },
  { id: "gut-friendly" },
  { id: "home-style" },
];

export const SHOP_DAYS: { value: number }[] = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 0 },
];
