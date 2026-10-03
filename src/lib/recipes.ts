import { HENZO_MEALS } from "./henzo-meals";
import { existsSync } from "fs";
import path from "path";
import type {
  Allergen,
  Appliance,
  Cuisine,
  DietNeed,
  DietStyle,
  PantryItem,
  Protein,
  Recipe,
  RecipeIngredient,
} from "./types";

export type Cooking = {
  minutes: number;
  protein: number;
  fat: number;
  carbs: number;
  kcal?: number;
  steps: string[];
};

type Meal = {
  id: string;
  title: string;
  cuisines: Cuisine[];
  vibes: DietStyle[];
  proteins: Protein[];
  isVegan: boolean;
  appliances: Appliance[];
  minutes: number;
  protein: number;
  fat: number;
  carbs: number;
  kcal: number;
  paid: [string, number][];
  pantry: { name: string; grams?: number }[];
  steps: string[];
};

const GLUTEN = new Set([
  "penne",
  "spaghetti",
  "tortilla",
  "tortilla-kukurydza",
  "chleb",
  "bulka",
  "bulka-tarta",
  "bulka-burger",
  "pita",
  "gnocchi",
  "kuskus",
  "makaron",
  "udon",
  "ramen",
  "panko",
]);
const LACTOSE = new Set([
  "mleko",
  "jogurt",
  "jogurt-grecki",
  "gouda",
  "smietana",
  "smietanka",
  "maslo",
  "feta",
  "cheddar",
  "parmezan",
  "mozzarella",
  "ricotta",
  "twarog",
]);
const EGGS = new Set(["jaja", "makaron", "ramen"]);
const FISH = new Set(["losos", "dorsz", "tunczyk"]);
const SOY = new Set(["tofu"]);

function allergens(meal: Meal): Allergen[] {
  const ids = meal.paid.map(([id]) => id);
  const list: Allergen[] = [];
  if (ids.some((id) => GLUTEN.has(id))) list.push("gluten");
  if (ids.some((id) => LACTOSE.has(id))) list.push("lactose");
  if (ids.some((id) => EGGS.has(id))) list.push("eggs");
  if (ids.some((id) => FISH.has(id))) list.push("fish");
  if (ids.some((id) => SOY.has(id)) || meal.pantry.some((item) => item.name === "Sos sojowy")) list.push("soy");
  return list;
}

const MEALS: Meal[] = HENZO_MEALS;

const LEGUMES = new Set(["soczewica", "ciecierzyca", "fasola", "fasola-czarna", "fasola-biala"]);

export function dietsFor(proteins: Protein[], isVegan: boolean): DietNeed[] {
  if (isVegan) return ["vegan", "vegetarian", "pescatarian"];
  if (proteins.every((protein) => protein === "veg")) return ["vegetarian", "pescatarian"];
  if (proteins.every((protein) => protein === "veg" || protein === "fish") && proteins.includes("fish")) {
    return ["pescatarian"];
  }
  return [];
}

function vibesOf(meal: Meal): DietStyle[] {
  const vibes = new Set<DietStyle>(meal.vibes);
  if (meal.minutes <= 20) vibes.add("speedy-meals");
  const energy = meal.kcal;
  if (energy <= 560) vibes.add("low-calories");
  if (meal.paid.some(([id]) => LEGUMES.has(id))) vibes.add("gut-friendly");
  if (meal.paid.some(([id]) => id === "tortilla")) vibes.add("fakeway");
  return [...vibes];
}

function cookingOf(meal: Meal): Cooking {
  return {
    minutes: meal.minutes,
    protein: meal.protein,
    fat: meal.fat,
    carbs: meal.carbs,
    kcal: meal.kcal,
    steps: meal.steps,
  };
}

export const RECIPES: Recipe[] = MEALS.map((meal) => ({
  id: meal.id,
  title: meal.title,
  vibes: vibesOf(meal),
  allergens: allergens(meal),
  proteins: meal.proteins,
  diets: dietsFor(meal.proteins, meal.isVegan),
  appliances: meal.appliances,
  cuisines: meal.cuisines,
}));

export const INGREDIENTS: RecipeIngredient[] = MEALS.flatMap((meal) =>
  meal.paid.map(([productId, qtyPerPerson]) => ({
    recipeId: meal.id,
    productId,
    qtyPerPerson,
  })),
);

export const PANTRY: PantryItem[] = MEALS.flatMap((meal) =>
  meal.pantry.map((item) => ({ recipeId: meal.id, name: item.name, grams: item.grams })),
);

export const COOKING: Record<string, Cooking> = Object.fromEntries(
  MEALS.map((meal) => [meal.id, cookingOf(meal)]),
);

export function kcal(cooking: Cooking): number {
  if (cooking.kcal != null) return cooking.kcal;
  return Math.round(cooking.protein * 4 + cooking.carbs * 4 + cooking.fat * 9);
}

export function recipePhoto(id: string): string | null {
  const file = path.join(process.cwd(), "public", "meals", `${id}.webp`);
  return existsSync(file) ? `/meals/${id}.webp` : null;
}
