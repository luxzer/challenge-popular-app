-- El insight de una categoría ("41% más que el mes pasado") depende del
-- perfil/mes, no es un dato fijo de la categoría — se mueve de `categories`
-- a `category_totals`, que ya está scoped por user_id/profile_id/mes.
alter table category_totals add column if not exists insight text;
alter table category_totals add column if not exists insight_tone text;

alter table categories drop column if exists insight;
alter table categories drop column if exists insight_tone;
