import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  aggregateIngredients,
  buildShoppingList,
  currentPrice,
  seasonalPreferred,
  selectPackages,
  type PricePoint,
  type StoreProduct,
} from "./supply";
import {
  SUPPLY_INGREDIENTS,
  SUPPLY_PRICES,
  SUPPLY_PRODUCTS,
  SUPPLY_PROMOTIONS,
  SUPPLY_RECIPES,
  SUPPLY_STORE,
  SUPPLY_STORE_PRODUCTS,
} from "./supply-seed";

const on = "2026-10-03";

describe("aggregateIngredients", () => {
  it("matches the week example: 300 + 300 + 250 chicken, tomatoes 150 + 200", () => {
    const plate = (id: string) => ({
      id,
      name: id,
      description: "",
      servings: 1,
      prepTime: 20,
      calories: 500,
      protein: 30,
      cuisines: ["polish" as const],
      vibes: ["home-style" as const],
    });
    const rows = aggregateIngredients(
      [{ recipeId: "mon" }, { recipeId: "tue" }, { recipeId: "wed" }],
      [plate("mon"), plate("tue"), plate("wed")],
      [
        { id: "1", recipeId: "mon", productId: "chicken-breast", quantity: 300, unit: "g", isPantryIngredient: false },
        { id: "2", recipeId: "mon", productId: "rice", quantity: 150, unit: "g", isPantryIngredient: false },
        { id: "3", recipeId: "mon", productId: "broccoli", quantity: 200, unit: "g", isPantryIngredient: false },
        { id: "4", recipeId: "tue", productId: "chicken-breast", quantity: 300, unit: "g", isPantryIngredient: false },
        { id: "5", recipeId: "tue", productId: "tortilla-wraps", quantity: 4, unit: "pc", isPantryIngredient: false },
        { id: "6", recipeId: "tue", productId: "tomatoes", quantity: 150, unit: "g", isPantryIngredient: false },
        { id: "7", recipeId: "tue", productId: "avocado", quantity: 1, unit: "pc", isPantryIngredient: false },
        { id: "8", recipeId: "wed", productId: "chicken-breast", quantity: 250, unit: "g", isPantryIngredient: false },
        { id: "9", recipeId: "wed", productId: "pasta", quantity: 150, unit: "g", isPantryIngredient: false },
        { id: "10", recipeId: "wed", productId: "tomatoes", quantity: 200, unit: "g", isPantryIngredient: false },
        { id: "11", recipeId: "mon", productId: "soy-sauce", quantity: 30, unit: "ml", isPantryIngredient: true },
      ],
    );
    const qty = (id: string) => rows.find((row) => row.productId === id);
    assert.deepEqual(qty("chicken-breast"), { productId: "chicken-breast", quantity: 850, unit: "g" });
    assert.deepEqual(qty("rice"), { productId: "rice", quantity: 150, unit: "g" });
    assert.deepEqual(qty("broccoli"), { productId: "broccoli", quantity: 200, unit: "g" });
    assert.deepEqual(qty("tortilla-wraps"), { productId: "tortilla-wraps", quantity: 4, unit: "pc" });
    assert.deepEqual(qty("tomatoes"), { productId: "tomatoes", quantity: 350, unit: "g" });
    assert.deepEqual(qty("avocado"), { productId: "avocado", quantity: 1, unit: "pc" });
    assert.deepEqual(qty("pasta"), { productId: "pasta", quantity: 150, unit: "g" });
    assert.equal(qty("soy-sauce"), undefined);
    assert.equal(qty("olive-oil"), undefined);
  });

  it("does not merge different product ids that share a name", () => {
    const rows = aggregateIngredients(
      [{ recipeId: "a" }, { recipeId: "b" }],
      [
        { id: "a", name: "A", description: "", servings: 1, prepTime: 1, calories: 1, protein: 1, cuisines: ["polish"], vibes: ["home-style"] },
        { id: "b", name: "B", description: "", servings: 1, prepTime: 1, calories: 1, protein: 1, cuisines: ["polish"], vibes: ["home-style"] },
      ],
      [
        { id: "a:1", recipeId: "a", productId: "chicken-breast", quantity: 100, unit: "g", isPantryIngredient: false },
        { id: "b:1", recipeId: "b", productId: "chicken-thighs", quantity: 100, unit: "g", isPantryIngredient: false },
      ],
    );
    assert.equal(rows.length, 2);
  });

  it("subtracts what is already in the user pantry", () => {
    const rows = aggregateIngredients([{ recipeId: "chicken-teriyaki-bowl" }], SUPPLY_RECIPES, SUPPLY_INGREDIENTS, {
      pantry: [{ productId: "rice", quantity: 500, unit: "g" }],
    });
    assert.equal(rows.find((row) => row.productId === "rice"), undefined);
    assert.equal(rows.find((row) => row.productId === "chicken-breast")?.quantity, 300);
  });
});

describe("selectPackages", () => {
  it("buys two 500 g packs for 850 g of chicken", () => {
    const [line] = selectPackages({
      requirements: [{ productId: "chicken-breast", quantity: 850, unit: "g" }],
      storeProducts: SUPPLY_STORE_PRODUCTS.filter((item) => item.id === "biedronka-chicken-breast-500"),
      prices: SUPPLY_PRICES,
      promotions: [],
      storeId: SUPPLY_STORE.id,
      on,
    });
    assert.equal(line.packages, 2);
    assert.equal(line.purchasedQuantity, 1000);
    assert.equal(line.lineTotal, 25.98);
    assert.equal(line.waste, 150);
  });

  it("picks one rice pack instead of mixing sizes", () => {
    const [line] = selectPackages({
      requirements: [{ productId: "rice", quantity: 1.2, unit: "kg" }],
      storeProducts: SUPPLY_STORE_PRODUCTS,
      prices: SUPPLY_PRICES,
      promotions: [],
      storeId: SUPPLY_STORE.id,
      on,
    });
    assert.equal(line.storeProductId, "biedronka-rice-2000");
    assert.equal(line.packages, 1);
    assert.equal(line.lineTotal, 13.99);
  });

  it("keeps an older price row and reads the one that covers the date", () => {
    const prices: PricePoint[] = [
      { id: "old", storeProductId: "biedronka-chicken-breast-500", price: 10, validFrom: "2026-09-01", validTo: "2026-09-30" },
      { id: "now", storeProductId: "biedronka-chicken-breast-500", price: 12.99, validFrom: "2026-10-01", validTo: null },
    ];
    assert.equal(currentPrice("biedronka-chicken-breast-500", prices, on)?.id, "now");
    assert.equal(prices.length, 2);
  });

  it("charges the promotion price while it is active", () => {
    const [line] = selectPackages({
      requirements: [{ productId: "strawberries", quantity: 400, unit: "g" }],
      storeProducts: SUPPLY_STORE_PRODUCTS,
      prices: SUPPLY_PRICES,
      promotions: SUPPLY_PROMOTIONS,
      storeId: SUPPLY_STORE.id,
      on,
    });
    assert.equal(line.onPromo, true);
    assert.equal(line.payPrice, 7.99);
    assert.equal(line.regularPrice, 12.99);
    assert.equal(line.packages, 1);
  });
});

describe("seasonalPreferred", () => {
  const strawberries = SUPPLY_PRODUCTS.find((item) => item.id === "strawberries");
  const chicken = SUPPLY_PRODUCTS.find((item) => item.id === "chicken-breast");
  const packs: StoreProduct[] = SUPPLY_STORE_PRODUCTS.filter((item) => item.productId === "strawberries");
  if (!strawberries || !chicken) throw new Error("seed");

  it("always allows a standard product", () => {
    assert.equal(seasonalPreferred(chicken, [], [], [], on), true);
  });

  it("skips seasonal produce with no price and no promo", () => {
    assert.equal(seasonalPreferred(strawberries, packs, [], [], on), false);
  });

  it("allows seasonal produce on an active promo", () => {
    assert.equal(seasonalPreferred(strawberries, packs, [], SUPPLY_PROMOTIONS, on), true);
  });
});

describe("buildShoppingList", () => {
  it("drops pantry oil and prices the rest", () => {
    const list = buildShoppingList({
      picks: [{ recipeId: "spaghetti-bolognese" }],
      recipes: SUPPLY_RECIPES,
      ingredients: SUPPLY_INGREDIENTS,
      storeProducts: SUPPLY_STORE_PRODUCTS,
      prices: SUPPLY_PRICES,
      promotions: SUPPLY_PROMOTIONS,
      storeId: SUPPLY_STORE.id,
      on,
    });
    assert.equal(list.requirements.some((row) => row.productId === "olive-oil"), false);
    assert.ok(list.lines.some((row) => row.productId === "pasta" && row.lineTotal > 0));
  });
});
