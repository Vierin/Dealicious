import { writeFile } from "fs/promises";
import { INGREDIENTS, MON_PROMO, PRODUCTS, RECIPES, THU_PROMO } from "../src/lib/catalog";

function q(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

function arr(values: string[]): string {
  return `array[${values.map(q).join(", ")}]::text[]`;
}

const products = PRODUCTS.map(
  (product) =>
    `(${q(product.id)}, ${q(product.namePl)}, ${q(product.category)}, ${q(product.unit)}, ${product.regularPricePln.toFixed(2)})`,
).join(",\n");

const recipes = RECIPES.map(
  (recipe) =>
    `(${q(recipe.id)}, ${q(recipe.title)}, ${arr(recipe.vibes)}, ${arr(recipe.allergens)}, ${arr(recipe.proteins)}, ${arr(recipe.diets)}, ${arr(recipe.appliances)}, ${arr(recipe.cuisines)})`,
).join(",\n");

const ingredients = INGREDIENTS.map(
  (item) =>
    `(${q(item.recipeId)}, ${q(item.productId)}, ${item.qtyPerPerson})`,
).join(",\n");

function promoRows(label: "gazetka-pon" | "gazetka-czw", items: { productId: string; price: number }[], from: string, to: string) {
  return items
    .map(
      (item) =>
        `(${q(`${label}-0-${item.productId}`)}, ${q(item.productId)}, ${item.price.toFixed(2)}, ${from}, ${to}, ${q(label)}), (${q(`${label}-1-${item.productId}`)}, ${q(item.productId)}, ${item.price.toFixed(2)}, ${from} + 7, ${to} + 7, ${q(label)})`,
    )
    .join(",\n");
}

const sql = `-- Generated from src/lib/catalog.ts. Re-run: npx tsx scripts/emit-seed.ts
begin;

truncate table
  recipe_ingredients,
  meal_plan_items,
  promotions,
  meal_plans,
  recipes,
  products
restart identity cascade;

insert into products (id, name_pl, category, unit, regular_price_pln) values
${products};

insert into recipes (id, title, diet_styles, allergens, proteins, diets, appliances, cuisines) values
${recipes};

insert into recipe_ingredients (recipe_id, product_id, qty_per_person) values
${ingredients};

insert into promotions (id, product_id, promo_price_pln, valid_from, valid_to, label)
select id, product_id, promo_price_pln, valid_from, valid_to, label
from (
  select
    date_trunc('week', current_date)::date as mon,
    (date_trunc('week', current_date)::date + 5) as mon_to,
    (date_trunc('week', current_date)::date + 3) as thu,
    (date_trunc('week', current_date)::date + 6) as thu_to
) bounds
cross join lateral (
  values
${promoRows("gazetka-pon", MON_PROMO, "bounds.mon", "bounds.mon_to")},
${promoRows("gazetka-czw", THU_PROMO, "bounds.thu", "bounds.thu_to")}
) as promo(id, product_id, promo_price_pln, valid_from, valid_to, label);

commit;
`;

writeFile(new URL("../supabase/seed.sql", import.meta.url), sql, "utf8").then(() => {
  console.log("wrote supabase/seed.sql");
});
