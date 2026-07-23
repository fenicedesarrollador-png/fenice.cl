-- =============================================================
-- LIMPIEZA DE COTIZACIONES Y SOLICITUDES (datos de prueba)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ⚠️  BORRA TODAS las cotizaciones y solicitudes de contacto.
--     Úsalo SOLO para eliminar tus pruebas antes de salir en vivo.
-- =============================================================

-- Primero desvincula estos registros de la analítica (por si ya hubo tráfico
-- vinculado); la FK es "on delete set null", así que esto es opcional pero
-- deja los vínculos limpios.
update public.analytics_identity_links set cotizacion_id = null where cotizacion_id is not null;
update public.analytics_identity_links set lead_id = null       where lead_id is not null;

-- Borra las cotizaciones (formulario de cotización empresarial).
delete from public.cotizaciones;

-- Borra las solicitudes de contacto (formulario de contacto / leads).
-- Comenta esta línea si quieres CONSERVAR los leads.
delete from public.leads;

-- Verificación (deben quedar en 0):
select
  (select count(*) from public.cotizaciones) as cotizaciones,
  (select count(*) from public.leads)        as solicitudes;
