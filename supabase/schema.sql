-- AMR Parts — run once in Supabase → SQL Editor.
-- The project was created with "Automatically expose new tables" OFF and automatic RLS ON,
-- so access is granted explicitly below.

create table if not exists public.products (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  sku         text not null unique,
  name        text not null,
  category    text not null,             -- engine, brakes, electrical, lighting, body, suspension, modification, accessories, filters, cables
  brand       text,                      -- honda, yamaha, bajaj, tvs, suzuki, hero; null = universal fit
  models      text[] not null default '{}',
  price       numeric(10,2) not null check (price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  badge       text check (badge in ('popular', 'new', 'limited')),
  featured    boolean not null default false,
  visible     boolean not null default true,
  description text,
  specs       jsonb not null default '{}',
  images      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.products enable row level security;

-- Website visitors may read visible products only. No public writes.
grant select on public.products to anon, authenticated;

drop policy if exists "Public can read visible products" on public.products;
create policy "Public can read visible products"
  on public.products for select
  to anon, authenticated
  using (visible = true);
