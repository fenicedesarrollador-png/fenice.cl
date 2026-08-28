-- =============================================================
-- FENICE SPA — Migración: Colaboradores / Empresas asociadas
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Módulo: /admin/colaboradores (gestión) + carrusel público en la Home
-- ("Colaboradores que trabajan con nosotros").
--
-- Idempotente: se puede volver a ejecutar sin duplicar datos ni romper
-- políticas existentes.
--
-- Roles: sin sistema de roles nuevo. Igual que el resto del proyecto,
-- `auth.role() = 'authenticated'` = admin (el gate real de "¿admin activo?"
-- se aplica en src/app/admin/layout.tsx contra admin_profiles.activo, y la
-- sesión sólo existe tras pasar por /login).
-- =============================================================

-- ============================================================
-- 1) TABLA: collaborators
-- ============================================================
create table if not exists public.collaborators (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  logo_url       text not null,
  logo_path      text,
  website_url    text,
  alt_text       text,
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users(id)
);

comment on table public.collaborators is
  'Empresas, proveedores y marcas colaboradoras de Fenice. Se muestran como carrusel de logos en la Home (sólo is_active = true). Gestionadas en /admin/colaboradores.';
comment on column public.collaborators.logo_url is
  'URL pública del logo en Storage (bucket collaborators-logos).';
comment on column public.collaborators.logo_path is
  'Ruta del objeto dentro del bucket. Necesaria para borrar el archivo al eliminar/reemplazar el logo y evitar huérfanos.';

-- Columnas añadidas de forma segura si la tabla ya existía de antes.
alter table public.collaborators add column if not exists logo_path text;
alter table public.collaborators add column if not exists alt_text text;
alter table public.collaborators add column if not exists created_by uuid references auth.users(id);

-- ============================================================
-- 2) VALIDACIONES A NIVEL DE BASE DE DATOS
--    Defensa real (no sólo en el formulario): aunque alguien use la API
--    con una sesión admin, no puede insertar basura.
-- ============================================================
alter table public.collaborators drop constraint if exists collaborators_name_not_empty;
alter table public.collaborators
  add constraint collaborators_name_not_empty
  check (char_length(trim(name)) between 1 and 120);

alter table public.collaborators drop constraint if exists collaborators_logo_url_not_empty;
alter table public.collaborators
  add constraint collaborators_logo_url_not_empty
  check (char_length(trim(logo_url)) > 0 and logo_url ~* '^https?://');

-- Sólo http/https. Bloquea javascript:, data:, vbscript:, file: etc.
alter table public.collaborators drop constraint if exists collaborators_website_url_scheme;
alter table public.collaborators
  add constraint collaborators_website_url_scheme
  check (website_url is null or website_url ~* '^https?://[^\s]+$');

alter table public.collaborators drop constraint if exists collaborators_display_order_range;
alter table public.collaborators
  add constraint collaborators_display_order_range
  check (display_order >= 0 and display_order <= 9999);

alter table public.collaborators drop constraint if exists collaborators_alt_text_len;
alter table public.collaborators
  add constraint collaborators_alt_text_len
  check (alt_text is null or char_length(alt_text) <= 180);

-- ============================================================
-- 3) ÍNDICES
-- ============================================================
create index if not exists idx_collaborators_active
  on public.collaborators(is_active);

create index if not exists idx_collaborators_order
  on public.collaborators(display_order);

-- Índice que sirve exactamente a la consulta pública
-- (where is_active = true order by display_order, created_at).
create index if not exists idx_collaborators_public_listing
  on public.collaborators(is_active, display_order, created_at);

-- ============================================================
-- 4) updated_at AUTOMÁTICO
--    Reutiliza la función genérica que ya existe en el proyecto
--    (creada en migration_website_videos.sql). No se duplica.
-- ============================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists collaborators_updated_at on public.collaborators;
create trigger collaborators_updated_at
  before update on public.collaborators
  for each row execute function public.update_updated_at_column();

-- ============================================================
-- 5) ROW LEVEL SECURITY
--    Público (anon): SOLO lectura de registros activos.
--    Admin (authenticated): gestión completa.
-- ============================================================
alter table public.collaborators enable row level security;

drop policy if exists "lectura_publica_collaborators" on public.collaborators;
create policy "lectura_publica_collaborators" on public.collaborators
  for select
  to anon, authenticated
  using (is_active = true);

-- Los admins necesitan ver también los inactivos en el panel.
drop policy if exists "admin_lee_collaborators" on public.collaborators;
create policy "admin_lee_collaborators" on public.collaborators
  for select
  to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "admin_inserta_collaborators" on public.collaborators;
create policy "admin_inserta_collaborators" on public.collaborators
  for insert
  to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "admin_actualiza_collaborators" on public.collaborators;
create policy "admin_actualiza_collaborators" on public.collaborators
  for update
  to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin_elimina_collaborators" on public.collaborators;
create policy "admin_elimina_collaborators" on public.collaborators
  for delete
  to authenticated
  using (auth.role() = 'authenticated');

-- NO existe ninguna política de INSERT/UPDATE/DELETE para el rol `anon`:
-- el sitio público sólo puede leer colaboradores activos.

-- ============================================================
-- 6) STORAGE BUCKET "collaborators-logos"
--    Público para lectura · 5 MB máx · sólo imágenes rasterizadas.
--
--    SVG queda FUERA de allowed_mime_types a propósito: un SVG es un
--    documento ejecutable (puede llevar <script>) y se serviría desde el
--    dominio de Supabase. El panel convierte los logos a WebP antes de
--    subirlos, así que no hace falta.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'collaborators-logos',
  'collaborators-logos',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lectura pública de los logos.
drop policy if exists "public_read_collaborators_logos" on storage.objects;
create policy "public_read_collaborators_logos" on storage.objects
  for select
  using (bucket_id = 'collaborators-logos');

-- Subida / reemplazo / borrado: sólo administración autenticada.
drop policy if exists "auth_insert_collaborators_logos" on storage.objects;
create policy "auth_insert_collaborators_logos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'collaborators-logos');

drop policy if exists "auth_update_collaborators_logos" on storage.objects;
create policy "auth_update_collaborators_logos" on storage.objects
  for update to authenticated
  using (bucket_id = 'collaborators-logos')
  with check (bucket_id = 'collaborators-logos');

drop policy if exists "auth_delete_collaborators_logos" on storage.objects;
create policy "auth_delete_collaborators_logos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'collaborators-logos');

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- select id, name, is_active, display_order, logo_path from public.collaborators order by display_order, created_at;
-- select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'collaborators-logos';
