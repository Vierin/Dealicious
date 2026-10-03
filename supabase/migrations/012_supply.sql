-- Canonical product stays in products. Store pack, price history, and promos are separate.
-- products.regular_price_pln is the old catalogue estimate. New prices go to prices.
-- Safe to run again.

create table if not exists stores (
  id text primary key,
  name text not null
);

insert into stores (id, name) values ('biedronka', 'Biedronka')
on conflict (id) do update set name = excluded.name;

alter table products add column if not exists name text;
alter table products add column if not exists default_unit text;
alter table products add column if not exists availability_type text not null default 'standard';
alter table products add column if not exists is_pantry_staple boolean not null default false;
alter table products add column if not exists created_at timestamptz not null default now();
alter table products add column if not exists updated_at timestamptz not null default now();

alter table products alter column regular_price_pln drop not null;

update products set name = name_pl where name is null;

update products
set default_unit = case unit
  when 'kg' then 'kg'
  when 'l' then 'l'
  when 'szt' then 'pc'
  when 'opak' then 'pc'
  else unit
end
where default_unit is null;

alter table products drop constraint if exists products_availability_chk;
alter table products
  add constraint products_availability_chk check (availability_type in ('standard', 'seasonal'));

update products
set availability_type = 'seasonal'
where id in ('pomidory', 'ogorki', 'papryka', 'salata', 'cukinia', 'brokuly', 'szpinak', 'awokado');

update products
set is_pantry_staple = true
where id in ('oliwa', 'maslo');

alter table recipes add column if not exists description text not null default '';
alter table recipes add column if not exists servings integer not null default 1;
alter table recipes add column if not exists prep_time integer;
alter table recipes add column if not exists calories integer;
alter table recipes add column if not exists protein_g numeric(6, 1);
alter table recipes add column if not exists created_at timestamptz not null default now();
alter table recipes add column if not exists updated_at timestamptz not null default now();

alter table recipes drop constraint if exists recipes_servings_chk;
alter table recipes add constraint recipes_servings_chk check (servings >= 1);

alter table recipe_ingredients add column if not exists quantity numeric(10, 3);
alter table recipe_ingredients add column if not exists unit text;
alter table recipe_ingredients add column if not exists is_pantry_ingredient boolean not null default false;

update recipe_ingredients as ingredient
set quantity = ingredient.qty_per_person,
    unit = product.unit
from products as product
where ingredient.product_id = product.id
  and ingredient.quantity is null;

update recipe_ingredients
set is_pantry_ingredient = true
where product_id in ('oliwa', 'maslo');

create table if not exists store_products (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  store_id text not null references stores (id),
  name text not null,
  brand text,
  package_quantity numeric(10, 3) not null,
  package_unit text not null,
  sku text,
  sale_mode text not null default 'package',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint store_products_qty_chk check (package_quantity > 0),
  constraint store_products_unit_chk check (package_unit in ('g', 'kg', 'ml', 'l', 'pc')),
  constraint store_products_sale_chk check (sale_mode in ('package', 'weight'))
);

create index if not exists store_products_product_store_idx
  on store_products (product_id, store_id);

create table if not exists prices (
  id text primary key,
  store_product_id text not null references store_products (id) on delete cascade,
  price numeric(10, 2) not null,
  valid_from date not null,
  valid_to date,
  created_at timestamptz not null default now(),
  constraint prices_dates_chk check (valid_to is null or valid_to >= valid_from),
  constraint prices_amount_chk check (price >= 0)
);

create index if not exists prices_store_product_dates_idx
  on prices (store_product_id, valid_from, valid_to);

create table if not exists store_promotions (
  id text primary key,
  store_product_id text not null references store_products (id) on delete cascade,
  regular_price numeric(10, 2) not null,
  promotion_price numeric(10, 2) not null,
  valid_from date not null,
  valid_to date not null,
  created_at timestamptz not null default now(),
  constraint store_promotions_dates_chk check (valid_to >= valid_from),
  constraint store_promotions_price_chk check (promotion_price >= 0 and regular_price >= 0)
);

create index if not exists store_promotions_product_dates_idx
  on store_promotions (store_product_id, valid_from, valid_to);

create table if not exists user_pantry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id text not null references products (id),
  quantity numeric(10, 3) not null,
  unit text not null,
  constraint user_pantry_qty_chk check (quantity >= 0),
  constraint user_pantry_unit_chk check (unit in ('g', 'kg', 'ml', 'l', 'pc')),
  unique (user_id, product_id)
);

create index if not exists user_pantry_user_idx on user_pantry (user_id);

alter table stores enable row level security;
alter table store_products enable row level security;
alter table prices enable row level security;
alter table store_promotions enable row level security;
alter table user_pantry enable row level security;

drop policy if exists stores_read on stores;
create policy stores_read on stores for select to anon, authenticated using (true);

drop policy if exists store_products_read on store_products;
create policy store_products_read on store_products for select to anon, authenticated using (true);

drop policy if exists prices_read on prices;
create policy prices_read on prices for select to anon, authenticated using (true);

drop policy if exists store_promotions_read on store_promotions;
create policy store_promotions_read on store_promotions for select to anon, authenticated using (true);

drop policy if exists user_pantry_all on user_pantry;
create policy user_pantry_all on user_pantry
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
