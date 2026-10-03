alter table profiles
  add column if not exists menu_level smallint not null default 3;

alter table profiles drop constraint if exists profiles_menu_level_chk;
alter table profiles
  add constraint profiles_menu_level_chk check (menu_level between 1 and 5);
