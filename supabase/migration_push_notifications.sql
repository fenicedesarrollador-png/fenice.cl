-- ============================================================
-- NOTIFICACIONES PUSH ADMIN (Web Push + contador en tiempo real)
-- ------------------------------------------------------------
-- Ejecutar en el SQL editor de Supabase. Idempotente: se puede
-- correr varias veces sin error.
--
-- Habilita:
--   1) Guardado de suscripciones Web Push de cada administrador
--      (para alertas que llegan aunque la app/pestaña esté cerrada).
--   2) Supabase Realtime sobre cotizaciones y leads (contador en vivo
--      dentro del panel /admin).
--
-- SOLO afecta a la sección administrativa. La web pública no cambia.
-- ============================================================

-- ── Suscripciones Web Push de administradores ───────────────
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

create index if not exists push_subscriptions_user_idx on push_subscriptions(user_id);

alter table push_subscriptions enable row level security;

-- Cada admin gestiona SOLO sus propias suscripciones.
-- El servidor envía los push con la service role key (bypassa RLS),
-- por eso aquí basta con permitir la gestión de las propias filas.
drop policy if exists "admin_inserta_su_push" on push_subscriptions;
create policy "admin_inserta_su_push" on push_subscriptions
  for insert with check (auth.role() = 'authenticated' and user_id = auth.uid());

drop policy if exists "admin_lee_su_push" on push_subscriptions;
create policy "admin_lee_su_push" on push_subscriptions
  for select using (auth.role() = 'authenticated' and user_id = auth.uid());

drop policy if exists "admin_actualiza_su_push" on push_subscriptions;
create policy "admin_actualiza_su_push" on push_subscriptions
  for update using (auth.role() = 'authenticated' and user_id = auth.uid())
  with check (auth.role() = 'authenticated' and user_id = auth.uid());

drop policy if exists "admin_borra_su_push" on push_subscriptions;
create policy "admin_borra_su_push" on push_subscriptions
  for delete using (auth.role() = 'authenticated' and user_id = auth.uid());

-- ── Realtime: contador en vivo de cotizaciones y solicitudes ─
-- Añade las tablas a la publicación de Supabase Realtime SOLO si aún
-- no son miembros (evita el error "already member of publication").
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cotizaciones'
  ) then
    execute 'alter publication supabase_realtime add table cotizaciones';
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'leads'
  ) then
    execute 'alter publication supabase_realtime add table leads';
  end if;
end $$;

-- Realtime respeta RLS: el panel admin usa la sesión autenticada, que ya
-- tiene políticas de SELECT sobre cotizaciones y leads (schema.sql), así
-- que recibirá los eventos. El público anónimo NO puede leer estas tablas.
