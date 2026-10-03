import { buildCatalog, hasLivePromos } from "../src/lib/catalog";
import { pickWeek, presentPlan } from "../src/lib/planner";
import type { Profile } from "../src/lib/types";

const from = new Date(2026, 9, 2, 12);

function profile(patch: Partial<Profile>): Profile {
  return {
    userId: "test",
    name: "Аня",
    city: "Warszawa",
    store: "biedronka",
    allergies: [],
    meatPref: "any",
    diet: "none",
    dietStyle: "family-favs",
    householdSize: 2,
    shopWeekday: 1,
    weeklyBudgetPln: 400,
    dailyKcal: 2000,
    menuLevel: 3,
    cookDays: [0, 1, 2, 3, 4, 5, 6],
    appliances: ["stove", "oven", "microwave", "blender", "airfryer"],
    ...patch,
  };
}

function planFor(patch: Partial<Profile>) {
  const catalog = buildCatalog(from);
  const picked = pickWeek(profile(patch), catalog, from);
  return presentPlan({
    id: "p",
    shopDate: picked.shopDate,
    householdSize: profile(patch).householdSize,
    recipeIds: picked.recipeIds,
    catalog,
  });
}

const monday = planFor({ shopWeekday: 1, dietStyle: "protein-packed" });
const sunday = planFor({ shopWeekday: 0, dietStyle: "protein-packed" });
const vegan = planFor({ diet: "vegan", dietStyle: "healthy-comfort", allergies: ["soy"] });

function assert(cond: unknown, message: string) {
  if (!cond) throw new Error(message);
}

assert(monday.meals.length === 7, "monday meals");
assert(monday.shopDate === "2026-10-05", `monday shop ${monday.shopDate}`);
assert(sunday.shopDate === "2026-10-04", `sunday shop ${sunday.shopDate}`);
assert(monday.total <= monday.regularTotal, "monday total");
assert(monday.saved >= 0 && sunday.saved >= 0, "saved");
for (const line of [...monday.lines, ...sunday.lines]) {
  if (line.onPromo) assert(line.regularLineTotal > line.lineTotal, `badge ${line.productId}`);
}
if (!hasLivePromos()) {
  assert(
    monday.meals.map((meal) => meal.recipeId).join() !== sunday.meals.map((meal) => meal.recipeId).join(),
    `same meals\nmon ${monday.meals.map((m) => m.recipeId)}\nsun ${sunday.meals.map((m) => m.recipeId)}`,
  );
  assert(monday.saved !== sunday.saved, `same savings ${monday.saved}`);
}
assert(vegan.meals.length === 7, "vegan meals");
assert(
  vegan.meals.every((meal) => !["tofu-bowl", "chicken-rice", "bolognese", "omelette"].includes(meal.recipeId)),
  "vegan filter",
);
const vegetarian = planFor({ diet: "vegetarian", meatPref: "chicken" });
assert(
  vegetarian.meals.every((meal) => !["chicken-rice", "salmon-buckwheat", "bolognese", "pork-potato"].includes(meal.recipeId)),
  "vegetarian filter",
);
const pescatarian = planFor({ diet: "pescatarian", meatPref: "chicken" });
assert(
  pescatarian.meals.every((meal) => !["chicken-rice", "bolognese", "pork-potato"].includes(meal.recipeId)),
  "pescatarian filter",
);

const chicken = monday.lines.find((line) => line.productId === "kurczak");
if (chicken) assert(chicken.qty >= 0.1, "chicken qty");
if (chicken && !hasLivePromos()) assert(chicken.onPromo, "chicken should be on monday promo");

const big = planFor({ householdSize: 4, shopWeekday: 1 });
const small = planFor({ householdSize: 1, shopWeekday: 1 });
assert(big.total > small.total, "household scales cost");

const tight = planFor({ weeklyBudgetPln: 40, shopWeekday: 1, householdSize: 2 });
const loose = planFor({ weeklyBudgetPln: 2000, shopWeekday: 1, householdSize: 2 });
assert(tight.total <= loose.total, `tight ${tight.total} vs loose ${loose.total}`);

const stoveOnly = planFor({ appliances: ["stove"] });
assert(
  stoveOnly.meals.every((meal) => !["beef-bake", "salmon-buckwheat", "airfryer-chicken", "broccoli-soup"].includes(meal.recipeId)),
  "stove filter",
);
const noGear = planFor({ appliances: [], diet: "vegan", allergies: [] });
assert(
  noGear.meals.every((meal) => !["chicken-rice", "lentil-soup", "beef-bake"].includes(meal.recipeId)),
  "no appliance filter",
);

console.log("monday", monday.shopDate, monday.total, monday.saved, monday.meals.map((m) => m.title).join(" | "));
console.log("sunday", sunday.shopDate, sunday.total, sunday.saved, sunday.meals.map((m) => m.title).join(" | "));
console.log("ok");
