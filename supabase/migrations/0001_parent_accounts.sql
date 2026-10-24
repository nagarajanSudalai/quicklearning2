-- QuickStep parent accounts: up to 4 child profiles per parent, one progress row per child.
-- Parents sign in with Supabase Auth (email code). Row-level security means a parent can only
-- ever see or change their own children. We store a child's nickname and grade, nothing else.

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 20),
  grade smallint not null check (grade between 1 and 5),
  created_at timestamptz not null default now()
);
create index children_parent_idx on public.children (parent_id);

-- Progress is the app's own JSON (stars, solved puzzles, streak, test reports).
create table public.progress (
  child_id uuid primary key references public.children (id) on delete cascade,
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 512000),
  updated_at timestamptz not null default now()
);

alter table public.children enable row level security;
alter table public.progress enable row level security;

create policy "parents manage their own children" on public.children
  for all to authenticated
  using (parent_id = (select auth.uid()))
  with check (parent_id = (select auth.uid()));

create policy "parents manage their children's progress" on public.progress
  for all to authenticated
  using (exists (select 1 from public.children c where c.id = child_id and c.parent_id = (select auth.uid())))
  with check (exists (select 1 from public.children c where c.id = child_id and c.parent_id = (select auth.uid())));

-- At most 4 children per parent.
create function public.limit_children() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.children where parent_id = new.parent_id) >= 4 then
    raise exception 'A parent account can have at most 4 children.';
  end if;
  return new;
end $$;
create trigger children_limit before insert on public.children
  for each row execute function public.limit_children();

-- "Delete my account": removes the parent's login; children and progress go with it (on delete cascade).
create function public.delete_my_account() returns void
language plpgsql security definer set search_path = '' as $$
begin
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
