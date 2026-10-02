alter table profiles
  add column if not exists weekly_budget_pln numeric(10, 2) not null default 250;

alter table profiles drop constraint if exists profiles_budget_chk;
alter table profiles
  add constraint profiles_budget_chk check (weekly_budget_pln between 20 and 10000);
