alter table profiles
  add column if not exists diet text not null default 'none';

update profiles
set diet = 'vegan'
where is_vegan = true and diet = 'none';

alter table profiles drop constraint if exists profiles_diet_chk;
alter table profiles
  add constraint profiles_diet_chk check (diet in ('none', 'vegetarian', 'vegan', 'pescatarian'));
