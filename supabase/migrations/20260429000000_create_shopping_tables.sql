create extension if not exists "pgcrypto";

create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.shopping_lists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null default 'Outros',
  quantity text,
  purchased boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_shopping_lists_user_id
on public.shopping_lists(user_id);

create index if not exists idx_shopping_items_list_id
on public.shopping_items(list_id);

create index if not exists idx_shopping_items_user_id
on public.shopping_items(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_shopping_lists_updated_at on public.shopping_lists;
create trigger set_shopping_lists_updated_at
before update on public.shopping_lists
for each row
execute function public.set_updated_at();

drop trigger if exists set_shopping_items_updated_at on public.shopping_items;
create trigger set_shopping_items_updated_at
before update on public.shopping_items
for each row
execute function public.set_updated_at();

alter table public.shopping_lists enable row level security;
alter table public.shopping_items enable row level security;

drop policy if exists "Users can select own lists" on public.shopping_lists;
create policy "Users can select own lists"
on public.shopping_lists
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own lists" on public.shopping_lists;
create policy "Users can insert own lists"
on public.shopping_lists
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own lists" on public.shopping_lists;
create policy "Users can update own lists"
on public.shopping_lists
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own lists" on public.shopping_lists;
create policy "Users can delete own lists"
on public.shopping_lists
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can select own items" on public.shopping_items;
create policy "Users can select own items"
on public.shopping_items
for select
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists
    where shopping_lists.id = shopping_items.list_id
    and shopping_lists.user_id = auth.uid()
  )
);

drop policy if exists "Users can insert own items" on public.shopping_items;
create policy "Users can insert own items"
on public.shopping_items
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists
    where shopping_lists.id = shopping_items.list_id
    and shopping_lists.user_id = auth.uid()
  )
);

drop policy if exists "Users can update own items" on public.shopping_items;
create policy "Users can update own items"
on public.shopping_items
for update
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists
    where shopping_lists.id = shopping_items.list_id
    and shopping_lists.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists
    where shopping_lists.id = shopping_items.list_id
    and shopping_lists.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete own items" on public.shopping_items;
create policy "Users can delete own items"
on public.shopping_items
for delete
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.shopping_lists
    where shopping_lists.id = shopping_items.list_id
    and shopping_lists.user_id = auth.uid()
  )
);
