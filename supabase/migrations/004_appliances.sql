alter table profiles
  add column if not exists appliances text[] not null default '{}';

alter table recipes
  add column if not exists appliances text[] not null default '{}';
