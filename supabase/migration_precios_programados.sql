-- =============================================================
-- FENICE SPA — Migración: caducidad, programación y alertas de precios
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================

-- ============================================================
-- 1) COLUMNAS NUEVAS EN fuel_prices
-- ============================================================
alter table fuel_prices add column if not exists vence_at timestamptz;            -- caducidad del precio publicado
alter table fuel_prices add column if not exists precio_programado numeric;       -- precio pendiente de publicar
alter table fuel_prices add column if not exists programado_at timestamptz;       -- cuándo se publica el precio programado
alter table fuel_prices add column if not exists vence_programado_at timestamptz; -- caducidad que tendrá el precio programado
alter table fuel_prices add column if not exists alerta_enviada_at timestamptz;   -- dedup de alertas por correo

-- ============================================================
-- 2) TOGGLE GLOBAL: mostrar/ocultar la sección de precios en la web
-- ============================================================
insert into configuracion_sitio (clave, valor, descripcion)
values ('precios_visibles', 'true', 'Mostrar la sección de precios de combustible en la web pública (true/false)')
on conflict (clave) do nothing;

-- ============================================================
-- 3) SEGURIDAD DE COLUMNAS
--    El público NO debe poder leer el precio programado ni datos internos
--    (un competidor podría ver el precio futuro antes de su publicación).
--    Con RLS activo + grants por columna, el rol anon solo lee lo público.
-- ============================================================
revoke select on table fuel_prices from anon;
grant select (id, code, name, price, unit, accent_color, is_available, is_visible, display_order, note, updated_at, vence_at)
  on table fuel_prices to anon;

-- ============================================================
-- 4) PUBLICACIÓN AUTOMÁTICA DE PRECIOS PROGRAMADOS
--    Función idempotente: aplica los precios cuya hora de publicación llegó.
--    La llama la web pública en cada render ISR (≤60 s de precisión),
--    el endpoint de cron, y opcionalmente pg_cron.
-- ============================================================
create or replace function aplicar_precios_programados()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  aplicados integer;
begin
  update fuel_prices
  set price = precio_programado,
      vence_at = vence_programado_at,
      precio_programado = null,
      programado_at = null,
      vence_programado_at = null,
      alerta_enviada_at = null,
      updated_at = now()
  where precio_programado is not null
    and programado_at is not null
    and programado_at <= now();
  get diagnostics aplicados = row_count;
  return aplicados;
end;
$$;

revoke all on function aplicar_precios_programados() from public;
grant execute on function aplicar_precios_programados() to anon, authenticated, service_role;

-- ============================================================
-- 5) OPCIONAL — pg_cron como respaldo del cron de Vercel
--    (descomentar si el proyecto Supabase tiene pg_cron habilitado)
-- ============================================================
-- select cron.schedule(
--   'aplicar-precios-programados',
--   '*/5 * * * *',
--   $$select aplicar_precios_programados()$$
-- );
