-- Cuisines, vibes, and who can eat the dish (vegan / vegetarian / pescatarian).
-- is_vegan stays. Empty diets means only people without a diet restriction.
-- Safe to run again.

alter table profiles alter column diet_style set default 'family-favs';

update profiles
set diet_style = case diet_style
  when 'healthy' then 'healthy-comfort'
  when 'sport' then 'protein-packed'
  when 'balanced' then 'family-favs'
  when 'comfort' then 'home-style'
  else diet_style
end
where diet_style in ('healthy', 'sport', 'balanced', 'comfort');

alter table recipes
  add column if not exists cuisines text[] not null default '{}',
  add column if not exists diets text[] not null default '{}';

update recipes
set diet_styles = (
  select coalesce(array_agg(distinct mapped), '{}')
  from (
    select case token
      when 'healthy' then 'healthy-comfort'
      when 'sport' then 'protein-packed'
      when 'balanced' then 'family-favs'
      when 'comfort' then 'home-style'
      else token
    end as mapped
    from unnest(diet_styles) as token
  ) mapped_styles
);

update recipes as recipe
set diet_styles = (
  select coalesce(array_agg(distinct vibe), '{}')
  from (
    select unnest(recipe.diet_styles) as vibe
    union all
    select 'fakeway'
    where exists (
      select 1 from recipe_ingredients as ingredient
      where ingredient.recipe_id = recipe.id and ingredient.product_id = 'tortilla'
    )
    union all
    select 'gut-friendly'
    where exists (
      select 1 from recipe_ingredients as ingredient
      where ingredient.recipe_id = recipe.id
        and ingredient.product_id in ('soczewica', 'ciecierzyca', 'fasola')
    )
    union all
    select 'speedy-meals'
    where cardinality(recipe.appliances) = 0
  ) vibes
);

update recipes
set diets = case
  when is_vegan then array['vegan', 'vegetarian', 'pescatarian']::text[]
  when proteins <@ array['veg']::text[] then array['vegetarian', 'pescatarian']::text[]
  when proteins <@ array['veg', 'fish']::text[] and 'fish' = any (proteins) then array['pescatarian']::text[]
  else '{}'::text[]
end;

update recipes as recipe
set cuisines = mapped.cuisines
from (
  values
    ('bolognese', array['italian']::text[]),
    ('veg-risotto', array['italian']),
    ('chicken-caesar-wrap', array['italian']),
    ('chicken-tortilla', array['mexican']),
    ('tortilla-veg', array['mexican']),
    ('chickpea-curry', array['indian']),
    ('chicken-rice', array['asian']),
    ('tofu-bowl', array['asian']),
    ('avocado-salad', array['mediterranean']),
    ('feta-salad', array['mediterranean']),
    ('oven-cod', array['mediterranean']),
    ('spinach-salad', array['mediterranean']),
    ('green-salad', array['mediterranean']),
    ('chickpea-salad', array['mediterranean']),
    ('pork-potato', array['polish']),
    ('beef-bake', array['polish']),
    ('buckwheat-veg', array['polish']),
    ('airfryer-potato', array['polish']),
    ('salmon-buckwheat', array['polish']),
    ('lentil-soup', array['polish']),
    ('omelette', array['polish']),
    ('broccoli-soup', array['polish']),
    ('mug-eggs', array['polish']),
    ('airfryer-chicken', array['polish']),
    ('oven-veg', array['polish']),
    ('tomato-bread', array['polish']),
    ('pepper-salad', array['polish']),
    ('lentil-pepper', array['polish']),
    ('chicken-salad', array['polish'])
) as mapped(id, cuisines)
where recipe.id = mapped.id;

insert into recipes (id, title, diet_styles, allergens, proteins, is_vegan, appliances, cuisines, diets)
values (
  'chicken-caesar-wrap',
  'Chicken Caesar Wrap',
  array['fakeway', 'speedy-meals']::text[],
  array['gluten', 'lactose']::text[],
  array['chicken']::text[],
  false,
  array['stove']::text[],
  array['italian']::text[],
  '{}'::text[]
)
on conflict (id) do update set
  title = excluded.title,
  diet_styles = excluded.diet_styles,
  allergens = excluded.allergens,
  proteins = excluded.proteins,
  is_vegan = excluded.is_vegan,
  appliances = excluded.appliances,
  cuisines = excluded.cuisines,
  diets = excluded.diets;

insert into recipe_ingredients (recipe_id, product_id, qty_per_person)
values
  ('chicken-caesar-wrap', 'kurczak', 0.16),
  ('chicken-caesar-wrap', 'tortilla', 0.5),
  ('chicken-caesar-wrap', 'salata', 0.5),
  ('chicken-caesar-wrap', 'jogurt', 0.12),
  ('chicken-caesar-wrap', 'cytryna', 0.25)
on conflict (recipe_id, product_id) do update set
  qty_per_person = excluded.qty_per_person;
