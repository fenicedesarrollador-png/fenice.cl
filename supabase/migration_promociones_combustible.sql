-- =============================================================
-- FENICE SPA — Migración: promociones ligadas a combustibles
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Permite crear una promoción asociada a un combustible (diesel / kerosene /
-- gas_residencial) con un descuento en porcentaje o en monto fijo. La oferta
-- se muestra automáticamente en la tarjeta del precio en la web pública.
-- =============================================================

alter table promociones add column if not exists fuel_code text;        -- diesel | kerosene | gas_residencial | null (promo general)
alter table promociones add column if not exists descuento_tipo text;   -- 'porcentaje' | 'monto'
alter table promociones add column if not exists descuento_valor numeric;

-- Validación del tipo de descuento
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'promociones_descuento_tipo_check'
  ) then
    alter table promociones
      add constraint promociones_descuento_tipo_check
      check (descuento_tipo is null or descuento_tipo in ('porcentaje','monto'));
  end if;
end $$;

-- Índice para el join por combustible desde la web pública
create index if not exists idx_promociones_fuel_code on promociones(fuel_code) where fuel_code is not null;
