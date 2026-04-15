-- ETF cache table
create table if not exists public.etf_cache (
  ticker text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.etf_cache enable row level security;
alter table public.profiles enable row level security;

create policy "etf_cache read authenticated" on public.etf_cache
  for select using (auth.role() = 'authenticated');
create policy "etf_cache write authenticated" on public.etf_cache
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles self upsert" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
