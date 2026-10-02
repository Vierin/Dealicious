-- Catalog lives in src/lib/recipes.ts. Plan rows may reference ids that are not in recipes.
alter table meal_plan_items drop constraint if exists meal_plan_items_recipe_id_fkey;
