-- Marca si el usuario ya viene pre-aprobado para una tarjeta (según su
-- perfil interno de riesgo/ingreso) — permite mostrar el tag "Preaprobada"
-- en recomendaciones sin que todas las tarjetas top lo tengan.
alter table cards add column if not exists preaprobada boolean not null default false;
