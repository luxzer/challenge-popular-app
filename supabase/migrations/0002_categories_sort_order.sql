-- categories.id sorts alphabetically, which breaks the intended display
-- order (delivery, supermercado, transporte, servicios, otros). Add an
-- explicit sort_order instead of relying on id.
alter table categories add column if not exists sort_order int not null default 0;
