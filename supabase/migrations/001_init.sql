-- Dealicious catalog, profiles, and weekly lunch plans.

create table if not exists profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  city text not null default '',
  store text not null default 'biedronka',
  allergies text[] not null default '{}',
  meat_pref text not null default 'any',
  is_vegan boolean not null default false,
  diet_style text not null default 'balanced',
  household_size integer not null default 1,
  shop_weekday integer not null default 1,
  constraint profiles_store_chk check (store = 'biedronka'),
  constraint profiles_household_chk check (household_size between 1 and 12),
  constraint profiles_weekday_chk check (shop_weekday between 0 and 6)
);

create table if not exists products (
  id text primary key,
  name_pl text not null,
  category text not null,
  unit text not null,
  regular_price_pln numeric(10, 2) not null,
  constraint products_unit_chk check (unit in ('kg', 'szt', 'l', 'opak'))
);

create table if not exists promotions (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  promo_price_pln numeric(10, 2) not null,
  valid_from date not null,
  valid_to date not null,
  label text not null,
  constraint promotions_dates_chk check (valid_to >= valid_from),
  constraint promotions_label_chk check (label in ('gazetka-pon', 'gazetka-czw'))
);

create index if not exists promotions_product_dates_idx
  on promotions (product_id, valid_from, valid_to);

create table if not exists recipes (
  id text primary key,
  title text not null,
  diet_styles text[] not null,
  allergens text[] not null default '{}',
  proteins text[] not null,
  is_vegan boolean not null
);

create table if not exists recipe_ingredients (
  recipe_id text not null references recipes (id) on delete cascade,
  product_id text not null references products (id),
  qty_per_person numeric(8, 3) not null,
  primary key (recipe_id, product_id)
);

create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  shop_date date not null,
  created_at timestamptz not null default now()
);

create index if not exists meal_plans_user_created_idx
  on meal_plans (user_id, created_at desc);

create table if not exists meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid not null references meal_plans (id) on delete cascade,
  day_index integer not null,
  recipe_id text not null references recipes (id),
  constraint meal_plan_items_day_chk check (day_index between 0 and 6),
  unique (meal_plan_id, day_index)
);

alter table profiles enable row level security;
alter table products enable row level security;
alter table promotions enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table meal_plans enable row level security;
alter table meal_plan_items enable row level security;

create policy profiles_select on profiles
  for select to authenticated using (auth.uid() = user_id);
create policy profiles_insert on profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy profiles_update on profiles
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy products_read on products
  for select to anon, authenticated using (true);
create policy promotions_read on promotions
  for select to anon, authenticated using (true);
create policy recipes_read on recipes
  for select to anon, authenticated using (true);
create policy ingredients_read on recipe_ingredients
  for select to anon, authenticated using (true);

create policy meal_plans_all on meal_plans
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy meal_plan_items_all on meal_plan_items
  for all to authenticated
  using (
    exists (
      select 1 from meal_plans
      where meal_plans.id = meal_plan_items.meal_plan_id
        and meal_plans.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from meal_plans
      where meal_plans.id = meal_plan_items.meal_plan_id
        and meal_plans.user_id = auth.uid()
    )
  );
