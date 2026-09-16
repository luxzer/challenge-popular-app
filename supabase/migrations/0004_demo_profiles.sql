-- Soporta múltiples "casos de demo" (perfiles financieros) para el mismo
-- usuario sembrado, seleccionados al azar por sesión (ver middleware.ts) —
-- para que los jurados vean distintos escenarios (score alto/bajo) sin
-- tocar nada, solo refrescando la pantalla de Resumen.

alter table account_signals add column if not exists profile_id int not null default 1;
alter table category_totals add column if not exists profile_id int not null default 1;
alter table category_remainders add column if not exists profile_id int not null default 1;
alter table transactions add column if not exists profile_id int not null default 1;

alter table account_signals drop constraint account_signals_pkey;
alter table account_signals add primary key (user_id, profile_id);

alter table category_totals drop constraint category_totals_pkey;
alter table category_totals add primary key (user_id, profile_id, category_id, month);

alter table category_remainders drop constraint category_remainders_pkey;
alter table category_remainders add primary key (user_id, profile_id, category_id, month);

create index if not exists transactions_profile_idx on transactions (user_id, profile_id);
