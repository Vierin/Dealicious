import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { acceptWeek } from "./cook-smarter";
import type { Catalog, Product, Profile, Recipe } from "./types";

const shopDate = "2026-10-06";

function product(id: string, price: number): Product {
  return {
    id,
    namePl: id,
    category: "meat",
    unit: "kg",
    pack: "1 kg",
    kind: "core",
    estimatePricePln: price,
    regularPricePln: price,
    priceConfirmed: true,
  };
}

function recipe(id: string, protein: "chicken" | "beef"): Recipe {
  return {
    id,
    title: id,
    vibes: ["healthy-comfort"],
    allergens: [],
    proteins: [protein],
    diets: [],
    appliances: ["stove"],
    cuisines: ["polish"],
  };
}

function catalog(): Catalog {
  return {
    products: [product("chicken", 20), product("beef", 30), product("rice", 5), product("pasta", 5)],
    promotions: [
      {
        id: "chicken-promo",
        productId: "chicken",
        promoPricePln: 10,
        validFrom: "2026-10-01",
        validTo: "2026-10-10",
        label: "gazetka",
      },
    ],
    recipes: [recipe("lunch", "chicken"), recipe("stew", "beef"), recipe("grill", "chicken")],
    ingredients: [
      { recipeId: "lunch", productId: "chicken", qtyPerPerson: 0.2 },
      { recipeId: "lunch", productId: "rice", qtyPerPerson: 0.2 },
      { recipeId: "stew", productId: "beef", qtyPerPerson: 0.2 },
      { recipeId: "stew", productId: "rice", qtyPerPerson: 0.2 },
      { recipeId: "grill", productId: "chicken", qtyPerPerson: 0.2 },
      { recipeId: "grill", productId: "pasta", qtyPerPerson: 0.2 },
    ],
    cooking: {
      lunch: { minutes: 30, protein: 35, fat: 12, carbs: 60, kcal: 650, steps: [] },
      stew: { minutes: 30, protein: 35, fat: 12, carbs: 60, kcal: 650, steps: [] },
      grill: { minutes: 30, protein: 35, fat: 12, carbs: 60, kcal: 650, steps: [] },
    },
    pantry: [],
  };
}

const profile: Profile = {
  userId: "u",
  name: "A",
  city: "Warszawa",
  store: "biedronka",
  allergies: [],
  meatPref: "any",
  diet: "none",
  dietStyle: "healthy-comfort",
  appliances: ["stove"],
  householdSize: 2,
  shopWeekday: 1,
  cookDays: [1, 2],
  weeklyBudgetPln: 200,
  dailyKcal: 2000,
  menuLevel: 3,
};

const current = ["lunch", "stew", "", "", "", "", ""];

describe("acceptWeek", () => {
  it("keeps a cheaper menu that still uses the promo and the same plate", () => {
    const next = acceptWeek({
      profile,
      catalog: catalog(),
      shopDate,
      currentIds: current,
      proposedIds: ["lunch", "grill", "", "", "", "", ""],
      lockedDays: [],
    });
    assert.deepEqual(next, ["lunch", "grill", "", "", "", "", ""]);
  });

  it("rejects the same week", () => {
    assert.throws(
      () =>
        acceptWeek({
          profile,
          catalog: catalog(),
          shopDate,
          currentIds: current,
          proposedIds: current,
          lockedDays: [],
        }),
      /errors\.cookNoGain/,
    );
  });

  it("rejects a swap that cuts protein", () => {
    const thin = catalog();
    thin.cooking.grill = { minutes: 30, protein: 10, fat: 12, carbs: 60, kcal: 650, steps: [] };
    assert.throws(
      () =>
        acceptWeek({
          profile,
          catalog: thin,
          shopDate,
          currentIds: current,
          proposedIds: ["lunch", "grill", "", "", "", "", ""],
          lockedDays: [],
        }),
      /errors\.cookQuality/,
    );
  });

  it("leaves a cooked day in place", () => {
    const next = acceptWeek({
      profile,
      catalog: catalog(),
      shopDate,
      currentIds: current,
      proposedIds: ["grill", "grill", "", "", "", "", ""],
      lockedDays: [0],
    });
    assert.equal(next[0], "lunch");
    assert.equal(next[1], "grill");
  });
});
