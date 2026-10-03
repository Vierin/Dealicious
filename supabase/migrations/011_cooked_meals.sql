create table if not exists cooked_meals (
  user_id uuid not null references auth.users (id) on delete cascade,
  meal_plan_id uuid not null references meal_plans (id) on delete cascade,
  day_index integer not null,
  primary key (user_id, meal_plan_id, day_index),
  constraint cooked_meals_day_chk check (day_index between 0 and 6)
);

alter table cooked_meals enable row level security;

drop policy if exists cooked_meals_all on cooked_meals;
create policy cooked_meals_all on cooked_meals
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
