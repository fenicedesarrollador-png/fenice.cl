-- =============================================================
-- LIMPIEZA DE MÉTRICAS / ANALÍTICA (borra TODO el tracking)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ⚠️  BORRA TODOS los datos de analítica de forma irreversible.
--     Úsalo para dejar el panel limpio después de tus pruebas.
-- =============================================================

-- TRUNCATE con CASCADE respeta las llaves foráneas (events → sessions,
-- identity_links → sessions/events) y reinicia todo a cero.
truncate table
  public.analytics_events,
  public.analytics_identity_links,
  public.analytics_ingest_guards,
  public.analytics_sessions
restart identity cascade;

-- Verificación (todas deben quedar en 0):
select
  (select count(*) from public.analytics_sessions)        as sesiones,
  (select count(*) from public.analytics_events)          as eventos,
  (select count(*) from public.analytics_identity_links)  as vinculos,
  (select count(*) from public.analytics_ingest_guards)   as guards;
