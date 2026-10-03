create table if not exists recipe_ratings (
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id text not null,
  score smallint not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, recipe_id),
  constraint recipe_ratings_score_chk check (score between 1 and 5)
);

alter table recipe_ratings enable row level security;

drop policy if exists recipe_ratings_all on recipe_ratings;
create policy recipe_ratings_all on recipe_ratings
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
