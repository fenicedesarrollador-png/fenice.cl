-- =============================================================
-- FENICE SPA — Migración: Equipo + Clientes (autoridad) + correo corporativo
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================

-- ============================================================
-- 1) CORREO CORPORATIVO PRINCIPAL → ventas@fenice.cl
-- ============================================================
update configuracion_sitio
set valor = 'ventas@fenice.cl', updated_at = now()
where clave = 'email';

insert into configuracion_sitio (clave, valor, descripcion)
values ('email', 'ventas@fenice.cl', 'Correo de contacto corporativo')
on conflict (clave) do nothing;

-- ============================================================
-- 2) EQUIPO (sección Quiénes Somos — editable desde /admin/equipo)
--    Las fotos se cargan por URL (campo foto_url).
-- ============================================================
create table if not exists equipo (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  cargo text not null,
  email text,
  foto_url text,
  bio text,
  linkedin_url text,
  orden integer default 0,
  activo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table equipo enable row level security;

drop policy if exists "lectura_publica_equipo" on equipo;
create policy "lectura_publica_equipo" on equipo
  for select using (activo = true);

drop policy if exists "admin_gestiona_equipo" on equipo;
create policy "admin_gestiona_equipo" on equipo
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop trigger if exists set_equipo_updated_at on equipo;
create trigger set_equipo_updated_at
  before update on equipo
  for each row execute function update_updated_at_column();

-- ============================================================
-- 3) CLIENTES — campos para la sección de autoridad
--    (sector + descripción de trabajos realizados)
-- ============================================================
alter table clientes add column if not exists sector text;
alter table clientes add column if not exists descripcion text;
alter table clientes add column if not exists destacado boolean default false;
