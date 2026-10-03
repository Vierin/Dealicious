import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const root = process.cwd();
const mealsPath = path.join(root, "src/lib/henzo-meals.ts");
let source = fs.readFileSync(mealsPath, "utf8");
source = source.replace(/^import type[\s\S]*?;\r?\n/, "");
source = source.replace(/export const HENZO_MEALS:\s*\{[\s\S]*?\}\[\] =/, "export const HENZO_MEALS =");
const temp = path.join(root, "scripts/.henzo-meals.mjs");
fs.writeFileSync(temp, source);
const { HENZO_MEALS } = await import(pathToFileURL(temp).href);
fs.unlinkSync(temp);

const GLUTEN = new Set(["penne", "spaghetti", "tortilla", "tortilla-kukurydza", "chleb", "bulka", "bulka-tarta", "bulka-burger", "pita", "gnocchi", "kuskus", "makaron", "udon", "ramen", "panko"]);
const LACTOSE = new Set(["mleko", "jogurt", "jogurt-grecki", "gouda", "smietana", "smietanka", "maslo", "feta", "cheddar", "parmezan", "mozzarella", "ricotta", "twarog"]);
const EGGS = new Set(["jaja", "makaron", "ramen"]);
const FISH = new Set(["losos", "dorsz", "tunczyk"]);
const LEGUMES = new Set(["soczewica", "ciecierzyca", "fasola", "fasola-czarna", "fasola-biala"]);
const SEASONAL = new Set(["pomidory", "cukinia", "brokuly", "szpinak", "awokado"]);

function q(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}
function textArray(values) {
  return values.length === 0 ? "'{}'::text[]" : `array[${values.map(q).join(", ")}]::text[]`;
}
function num(value) {
  return Number(value.toFixed(6)).toString();
}

function allergens(meal) {
  const ids = meal.paid.map(([id]) => id);
  const list = [];
  if (ids.some((id) => GLUTEN.has(id))) list.push("gluten");
  if (ids.some((id) => LACTOSE.has(id))) list.push("lactose");
  if (ids.some((id) => EGGS.has(id))) list.push("eggs");
  if (ids.some((id) => FISH.has(id))) list.push("fish");
  if (ids.some((id) => id === "tofu") || meal.pantry.some((item) => item.name === "Sos sojowy")) list.push("soy");
  return list;
}

function dietsFor(proteins, isVegan) {
  if (isVegan) return ["vegan", "vegetarian", "pescatarian"];
  if (proteins.every((protein) => protein === "veg")) return ["vegetarian", "pescatarian"];
  if (proteins.every((protein) => protein === "veg" || protein === "fish") && proteins.includes("fish")) return ["pescatarian"];
  return [];
}

function vibesOf(meal) {
  const vibes = new Set(meal.vibes);
  if (meal.minutes <= 20) vibes.add("speedy-meals");
  if (meal.kcal <= 560) vibes.add("low-calories");
  if (meal.paid.some(([id]) => LEGUMES.has(id))) vibes.add("gut-friendly");
  if (meal.paid.some(([id]) => id === "tortilla")) vibes.add("fakeway");
  return [...vibes];
}

const catalog = fs.readFileSync(path.join(root, "src/lib/catalog.ts"), "utf8");
const products = [...catalog.matchAll(/product\("([^"]+)", "([^"]+)", "([^"]+)", "([^"]+)", ([0-9.]+)\)/g)].map((match) => ({
  id: match[1],
  name: match[2],
  category: match[3],
  unit: match[4],
  price: match[5],
}));
const used = new Set(HENZO_MEALS.flatMap((meal) => meal.paid.map(([id]) => id)));
const needed = products.filter((product) => used.has(product.id));
if (needed.length !== used.size) {
  const have = new Set(needed.map((product) => product.id));
  throw new Error([...used].filter((id) => !have.has(id)).join(","));
}

const defaultUnit = { kg: "kg", l: "l", szt: "pc", opak: "pc" };
const lines = [];
lines.push("-- Polish Henzo menu. Replaces the old recipe rows. Products are upserted so ingredient foreign keys resolve.");
lines.push("-- Safe to run again.");
lines.push("");
lines.push("alter table recipes add column if not exists prep_time integer;");
lines.push("alter table recipes add column if not exists calories integer;");
lines.push("alter table recipes add column if not exists protein_g numeric(6, 1);");
lines.push("alter table recipes add column if not exists fat_g numeric(6, 1);");
lines.push("alter table recipes add column if not exists carbs_g numeric(6, 1);");
lines.push("alter table recipes add column if not exists steps text[] not null default '{}';");
lines.push("alter table recipes add column if not exists cuisines text[] not null default '{}';");
lines.push("alter table recipes add column if not exists diets text[] not null default '{}';");
lines.push("");
lines.push("alter table recipe_ingredients alter column qty_per_person type numeric(12, 6);");
lines.push("alter table recipe_ingredients alter column quantity type numeric(12, 6);");
lines.push("");
lines.push("create table if not exists recipe_pantry (");
lines.push("  recipe_id text not null references recipes (id) on delete cascade,");
lines.push("  name text not null,");
lines.push("  grams numeric(8, 1),");
lines.push("  primary key (recipe_id, name)");
lines.push(");");
lines.push("alter table recipe_pantry enable row level security;");
lines.push("drop policy if exists recipe_pantry_read on recipe_pantry;");
lines.push("create policy recipe_pantry_read on recipe_pantry for select to anon, authenticated using (true);");
lines.push("");
lines.push("insert into products (id, name_pl, name, category, unit, default_unit, regular_price_pln, availability_type, is_pantry_staple) values");
lines.push(
  needed
    .map((product) => {
      const availability = SEASONAL.has(product.id) ? "seasonal" : "standard";
      const staple = product.id === "oliwa" || product.id === "maslo";
      return `  (${q(product.id)}, ${q(product.name)}, ${q(product.name)}, ${q(product.category)}, ${q(product.unit)}, ${q(defaultUnit[product.unit])}, ${product.price}, ${q(availability)}, ${staple})`;
    })
    .join(",\n"),
);
lines.push("on conflict (id) do update set");
lines.push("  name_pl = excluded.name_pl,");
lines.push("  name = excluded.name,");
lines.push("  category = excluded.category,");
lines.push("  unit = excluded.unit,");
lines.push("  default_unit = excluded.default_unit,");
lines.push("  regular_price_pln = excluded.regular_price_pln,");
lines.push("  availability_type = excluded.availability_type,");
lines.push("  is_pantry_staple = excluded.is_pantry_staple;");
lines.push("");
lines.push("delete from recipes;");
lines.push("");
lines.push("insert into recipes (id, title, diet_styles, allergens, proteins, appliances, cuisines, diets, description, servings, prep_time, calories, protein_g, fat_g, carbs_g, steps) values");
lines.push(
  HENZO_MEALS.map((meal) => {
    return `  (${[
      q(meal.id),
      q(meal.title),
      textArray(vibesOf(meal)),
      textArray(allergens(meal)),
      textArray(meal.proteins),
      textArray(meal.appliances),
      textArray(meal.cuisines),
      textArray(dietsFor(meal.proteins, meal.isVegan)),
      "''",
      "1",
      String(meal.minutes),
      String(meal.kcal),
      num(meal.protein),
      num(meal.fat),
      num(meal.carbs),
      textArray(meal.steps),
    ].join(", ")})`;
  }).join(",\n"),
);
lines.push(";");
lines.push("");

const ingredients = HENZO_MEALS.flatMap((meal) =>
  meal.paid.map(([productId, qty]) => ({ recipeId: meal.id, productId, qty, unit: needed.find((product) => product.id === productId).unit })),
);
lines.push("insert into recipe_ingredients (recipe_id, product_id, qty_per_person, quantity, unit, is_pantry_ingredient) values");
lines.push(
  ingredients
    .map((row) => {
      const pantry = row.productId === "oliwa" || row.productId === "maslo";
      return `  (${q(row.recipeId)}, ${q(row.productId)}, ${num(row.qty)}, ${num(row.qty)}, ${q(row.unit)}, ${pantry})`;
    })
    .join(",\n"),
);
lines.push(";");
lines.push("");

const pantry = HENZO_MEALS.flatMap((meal) => meal.pantry.map((item) => ({ recipeId: meal.id, name: item.name, grams: item.grams ?? null })));
if (pantry.length) {
  lines.push("insert into recipe_pantry (recipe_id, name, grams) values");
  lines.push(
    pantry
      .map((row) => `  (${q(row.recipeId)}, ${q(row.name)}, ${row.grams == null ? "null" : num(row.grams)})`)
      .join(",\n"),
  );
  lines.push(";");
}

const out = path.join(root, "supabase/migrations/014_henzo_recipes.sql");
fs.writeFileSync(out, `${lines.join("\n")}\n`);
console.log("meals", HENZO_MEALS.length, "ingredients", ingredients.length, "pantry", pantry.length, "bytes", fs.statSync(out).size);
