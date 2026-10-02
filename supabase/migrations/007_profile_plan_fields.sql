alter table profiles
  add column if not exists daily_kcal integer not null default 2000;

alter table profiles
  add column if not exists cook_days smallint[] not null default '{0,1,2,3,4,5,6}';

alter table profiles drop constraint if exists profiles_kcal_chk;
alter table profiles
  add constraint profiles_kcal_chk check (daily_kcal between 1200 and 4000);

alter table meal_plans
  add column if not exists recipe_ids text[] not null default '{}';
