-- Salud Financiera — schema inicial
-- Un solo usuario demo ("Luis") por ahora; sin RLS/multi-tenant todavía
-- (ver docs/DATA.md). El service_role key es el único que toca esta base
-- desde el server de Next.js.

create extension if not exists "pgcrypto";

create table app_users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text,
  created_at timestamptz not null default now()
);

create table account_signals (
  user_id uuid primary key references app_users(id) on delete cascade,
  as_of_date date not null,
  on_time_payments int not null,
  total_payments int not null,
  credit_utilization_pct numeric not null,
  income_stability_score int not null,
  monthly_income numeric not null,
  products_held int not null,
  products_in_universe int not null,
  score_delta_month int not null,
  score_trend text not null,
  updated_at timestamptz not null default now()
);

create table categories (
  id text primary key,
  name text not null,
  color_var text not null,
  insight text,
  insight_tone text,
  sort_order int not null default 0
);

create table category_totals (
  user_id uuid not null references app_users(id) on delete cascade,
  category_id text not null references categories(id),
  month date not null,
  amount numeric not null,
  primary key (user_id, category_id, month)
);

create table transactions (
  id text primary key,
  user_id uuid not null references app_users(id) on delete cascade,
  merchant text not null,
  occurred_on date not null,
  amount numeric not null,
  category_id text not null references categories(id)
);

create table category_remainders (
  user_id uuid not null references app_users(id) on delete cascade,
  category_id text not null references categories(id),
  month date not null,
  extra_count int not null,
  primary key (user_id, category_id, month)
);

create table cards (
  id text primary key,
  name text not null,
  issuer text not null,
  network text not null,
  badge text not null check (badge in ('top', 'estandar')),
  badge_label text not null,
  estimated_annual_savings numeric not null,
  annual_cost text not null,
  min_income text not null,
  redemption text not null,
  perks jsonb not null default '[]'::jsonb,
  image_path text,
  match_category_ids text[] not null default '{}',
  sort_order int not null default 0
);

create table card_cashback_items (
  id bigint generated always as identity primary key,
  card_id text not null references cards(id) on delete cascade,
  label text not null,
  limit_label text not null,
  estimated_savings_label text not null,
  sort_order int not null default 0
);

create table suggested_actions (
  id text primary key,
  user_id uuid not null references app_users(id) on delete cascade,
  title text not null,
  detail text not null,
  score_impact_pts int not null,
  money_impact_label text not null,
  primary_cta text not null,
  secondary_cta text not null,
  direction text not null check (direction in ('up', 'down')),
  category text not null check (category in ('deuda', 'ahorro', 'tarjetas')),
  sort_order int not null default 0
);

create table user_action_feedback (
  id bigint generated always as identity primary key,
  user_id uuid not null references app_users(id) on delete cascade,
  action_id text not null references suggested_actions(id) on delete cascade,
  status text not null check (status in ('accepted', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (user_id, action_id)
);

create table chat_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references app_users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
