import type { Cooking } from "./types";

export type { Cooking };

export function kcal(cooking: Cooking): number {
  if (cooking.kcal != null) return cooking.kcal;
  return Math.round(cooking.protein * 4 + cooking.carbs * 4 + cooking.fat * 9);
}
