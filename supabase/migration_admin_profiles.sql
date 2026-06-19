-- =============================================================
-- MIGRACIÓN: admin_profiles refactorizada
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================

-- 1. Drop y recrear la tabla con el esquema correcto
drop table if exists admin_profiles cascade;

create table admin_profiles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid unique not null references auth.users(id) on delete cascade,
  nombre      text not null,
  rol         text not null default 'admin' check (rol in ('admin', 'editor', 'superadmin')),
  activo      boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Index para búsqueda rápida por user_id
create index if not exists idx_admin_profiles_user_id on admin_profiles(user_id);

-- Trigger updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at_admin_profiles on admin_profiles;
create trigger set_updated_at_admin_profiles
  before update on admin_profiles
  for each row execute function update_updated_at_column();

-- =============================================================
-- RLS: admin_profiles
-- Solo lectores autenticados pueden leer SU propio perfil.
-- Solo service_role puede insertar/actualizar/eliminar.
-- =============================================================
alter table admin_profiles enable row level security;

-- Política: usuario autenticado lee solo su propio perfil
create policy "admin_profiles_select_own"
  on admin_profiles for select
  to authenticated
  using (user_id = auth.uid());

-- NOTA: Insert/Update/Delete se hace via service_role desde los API routes
-- El service_role bypassa RLS, así que no se necesitan políticas para esas operaciones.

-- =============================================================
-- PASO FINAL: Crear el primer superadmin
-- Reemplaza 'TU_EMAIL@fenice.cl' y 'TU_UUID_DE_AUTH' con los reales.
-- Para obtener el UUID, ve a Supabase > Auth > Users
-- =============================================================

-- Ejemplo (descomenta y edita):
-- insert into admin_profiles (user_id, nombre, rol, activo) values
--   ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Administrador Principal', 'superadmin', true);

-- =============================================================
-- VERIFICACIÓN
-- =============================================================
-- select * from admin_profiles;
