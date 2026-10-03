import { writeFile } from "fs/promises";
import {
  SUPPLY_INGREDIENTS,
  SUPPLY_PRICES,
  SUPPLY_PRODUCTS,
  SUPPLY_PROMOTIONS,
  SUPPLY_RECIPES,
  SUPPLY_STORE_PRODUCTS,
} from "../src/lib/supply-seed";

function q(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function arr(values: string[]): string {
  if (values.length === 0) return `array[]::text[]`;
  return `array[${values.map(q).join(", ")}]::text[]`;
}

function num(value: number): string {
  return Number.isInteger(value) ? value.toFixed(0) : String(value);
}

const recipeMeta: Record<string, { allergens: string[]; proteins: string[]; appliances: string[] }> = {
  "chicken-teriyaki-bowl": { allergens: ["soy"], proteins: ["chicken"], appliances: ["stove"] },
  "chicken-tacos": { allergens: ["gluten"], proteins: ["chicken"], appliances: ["stove"] },
  "spaghetti-bolognese": { allergens: ["gluten"], proteins: ["beef"], appliances: ["stove"] },
  "butter-chicken": { allergens: ["lactose"], proteins: ["chicken"], appliances: ["stove"] },
  "mediterranean-chicken-bowl": { allergens: ["lactose"], proteins: ["chicken"], appliances: ["stove"] },
  "polish-chicken-soup": { allergens: [], proteins: ["chicken"], appliances: ["stove"] },
};

const products = SUPPLY_PRODUCTS.map((product) => {
  const legacyQty =
    product.defaultUnit === "g" ? "kg" : product.defaultUnit === "ml" ? "l" : product.legacyUnit;
  return `(${q(product.id)}, ${q(product.name)}, ${q(product.name)}, ${q(product.category)}, ${q(legacyQty)}, null, ${q(product.defaultUnit)}, ${q(product.availabilityType)}, ${product.isPantryStaple})`;
}).join(",\n");

const recipes = SUPPLY_RECIPES.map((recipe) => {
  const meta = recipeMeta[recipe.id];
  return `(${q(recipe.id)}, ${q(recipe.name)}, ${q(recipe.description)}, ${recipe.servings}, ${recipe.prepTime}, ${recipe.calories}, ${recipe.protein}, ${arr(recipe.vibes)}, ${arr(meta.allergens)}, ${arr(meta.proteins)}, ${arr(meta.appliances)}, ${arr(recipe.cuisines)}, array[]::text[])`;
}).join(",\n");

const ingredients = SUPPLY_INGREDIENTS.map((item) => {
  const legacy =
    item.unit === "g" || item.unit === "ml" ? item.quantity / 1000 : item.quantity;
  return `(${q(item.recipeId)}, ${q(item.productId)}, ${num(legacy)}, ${num(item.quantity)}, ${q(item.unit)}, ${item.isPantryIngredient})`;
}).join(",\n");

const storeProducts = SUPPLY_STORE_PRODUCTS.map(
  (item) =>
    `(${q(item.id)}, ${q(item.productId)}, ${q(item.storeId)}, ${q(item.name)}, ${item.packageQuantity}, ${q(item.packageUnit)}, ${q(item.saleMode)})`,
).join(",\n");

const prices = SUPPLY_PRICES.map(
  (item) =>
    `(${q(item.id)}, ${q(item.storeProductId)}, ${item.price.toFixed(2)}, ${q(item.validFrom)}, ${item.validTo ? q(item.validTo) : "null"})`,
).join(",\n");

const promotions = SUPPLY_PROMOTIONS.map(
  (item) =>
    `(${q(item.id)}, ${q(item.storeProductId)}, ${item.regularPrice.toFixed(2)}, ${item.promotionPrice.toFixed(2)}, ${q(item.validFrom)}, ${q(item.validTo)})`,
).join(",\n");

const sql = `-- Generated from src/lib/supply-seed.ts. Re-run: npx tsx scripts/emit-supply-seed.ts
-- Run after 012_supply.sql. Does not truncate the live catalogue.

insert into products (id, name, name_pl, category, unit, regular_price_pln, default_unit, availability_type, is_pantry_staple)
values
${products}
on conflict (id) do update set
  name = excluded.name,
  name_pl = excluded.name_pl,
  category = excluded.category,
  default_unit = excluded.default_unit,
  availability_type = excluded.availability_type,
  is_pantry_staple = excluded.is_pantry_staple,
  updated_at = now();

insert into recipes (id, title, description, servings, prep_time, calories, protein_g, diet_styles, allergens, proteins, appliances, cuisines, diets)
values
${recipes}
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  servings = excluded.servings,
  prep_time = excluded.prep_time,
  calories = excluded.calories,
  protein_g = excluded.protein_g,
  diet_styles = excluded.diet_styles,
  allergens = excluded.allergens,
  proteins = excluded.proteins,
  appliances = excluded.appliances,
  cuisines = excluded.cuisines,
  diets = excluded.diets,
  updated_at = now();

insert into recipe_ingredients (recipe_id, product_id, qty_per_person, quantity, unit, is_pantry_ingredient)
values
${ingredients}
on conflict (recipe_id, product_id) do update set
  qty_per_person = excluded.qty_per_person,
  quantity = excluded.quantity,
  unit = excluded.unit,
  is_pantry_ingredient = excluded.is_pantry_ingredient;

insert into store_products (id, product_id, store_id, name, package_quantity, package_unit, sale_mode)
values
${storeProducts}
on conflict (id) do update set
  product_id = excluded.product_id,
  store_id = excluded.store_id,
  name = excluded.name,
  package_quantity = excluded.package_quantity,
  package_unit = excluded.package_unit,
  sale_mode = excluded.sale_mode,
  updated_at = now();

insert into prices (id, store_product_id, price, valid_from, valid_to)
values
${prices}
on conflict (id) do update set
  price = excluded.price,
  valid_from = excluded.valid_from,
  valid_to = excluded.valid_to;

insert into store_promotions (id, store_product_id, regular_price, promotion_price, valid_from, valid_to)
values
${promotions}
on conflict (id) do update set
  regular_price = excluded.regular_price,
  promotion_price = excluded.promotion_price,
  valid_from = excluded.valid_from,
  valid_to = excluded.valid_to;
`;

writeFile(new URL("../supabase/seed-supply.sql", import.meta.url), sql, "utf8").then(() => {
  console.log("wrote supabase/seed-supply.sql");
});
