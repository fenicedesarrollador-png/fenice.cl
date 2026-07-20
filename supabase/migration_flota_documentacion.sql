-- =============================================================
-- FENICE SPA — Migración: Flota certificada y documentación verificable
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Idempotente: se puede volver a ejecutar sin duplicar datos ni romper
-- políticas existentes (usa "if not exists" / "drop policy if exists" /
-- "on conflict do nothing" en todo el script).
--
-- No se encontró ninguna tabla de vehículos/flota preexistente en el
-- proyecto (se revisó supabase/schema.sql y el resto de migraciones), por
-- lo que este script crea el módulo completo desde cero.
--
-- Convención de roles reutilizada del proyecto: NO existe un sistema de
-- roles/función is_admin() propio. Todas las tablas de contenido
-- (productos, clientes, blog_posts, eventos, promociones, cotizaciones)
-- usan `auth.role() = 'authenticated'` para dar acceso administrativo
-- completo a cualquier usuario logueado; el filtro de "¿es admin activo?"
-- se aplica en la capa de aplicación (src/app/admin/layout.tsx, contra
-- admin_profiles.activo). Este script sigue exactamente la misma
-- convención para no crear un sistema de roles paralelo.
-- =============================================================

-- ============================================================
-- 0) FUNCIÓN COMPARTIDA: updated_at automático
--    Ya existe en el proyecto (schema.sql / migration_admin_profiles.sql);
--    se redefine de forma idéntica para que este script sea autocontenido.
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1) TABLA: fleet_vehicles
-- ============================================================
create table if not exists fleet_vehicles (
  id                     uuid primary key default gen_random_uuid(),
  plate                  text unique not null,
  brand                  text,
  model                  text,
  manufacture_year       integer,
  tank_capacity_liters   integer,
  compartments           integer,
  authorized_fuel_type   text,
  image_path             text,
  short_description      text,
  is_public              boolean not null default true,
  is_active              boolean not null default true,
  display_order          integer not null default 0,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  created_by             uuid references auth.users(id),
  updated_by             uuid references auth.users(id)
);

comment on table fleet_vehicles is 'Camiones de la flota Fenice mostrados públicamente en "Flota certificada y documentación verificable" (Home) y administrados en /admin/flota.';

-- Normalización de patente para evitar duplicados por guiones, espacios o
-- mayúsculas/minúsculas (ej: "TJZV-39" == "tjzv 39" == "TJZV39").
-- `plate` conserva el formato tal como lo ingresa el administrador;
-- `plate_key` es una columna generada solo para deduplicar.
alter table fleet_vehicles add column if not exists plate_key text
  generated always as (upper(regexp_replace(plate, '[^A-Za-z0-9]', '', 'g'))) stored;

create unique index if not exists fleet_vehicles_plate_key_key on fleet_vehicles(plate_key);

-- Uniformiza mayúsculas/espacios del valor visible de `plate` al guardar.
create or replace function fleet_vehicles_normalize_plate()
returns trigger as $$
begin
  new.plate = upper(trim(regexp_replace(new.plate, '\s+', ' ', 'g')));
  return new;
end;
$$ language plpgsql;

drop trigger if exists fleet_vehicles_normalize_plate_trigger on fleet_vehicles;
create trigger fleet_vehicles_normalize_plate_trigger
  before insert or update of plate on fleet_vehicles
  for each row execute function fleet_vehicles_normalize_plate();

drop trigger if exists fleet_vehicles_updated_at on fleet_vehicles;
create trigger fleet_vehicles_updated_at
  before update on fleet_vehicles
  for each row execute function update_updated_at_column();

create index if not exists idx_fleet_vehicles_plate on fleet_vehicles(plate);
create index if not exists idx_fleet_vehicles_is_public on fleet_vehicles(is_public);
create index if not exists idx_fleet_vehicles_display_order on fleet_vehicles(display_order);

-- ============================================================
-- 2) TABLA: fleet_documents
-- ============================================================
create table if not exists fleet_documents (
  id                    uuid primary key default gen_random_uuid(),
  vehicle_id            uuid not null references fleet_vehicles(id) on delete cascade,
  document_type         text not null,
  title                 text not null,
  description           text,
  issuing_entity        text,
  certificate_number    text,
  folio                 text,
  verification_code     text,
  verification_url      text,
  issued_at             date,
  expires_at            date,
  next_inspection_at    date,
  public_file_path      text,
  original_filename     text,
  mime_type             text,
  file_size_bytes       bigint,
  is_public             boolean not null default false,
  is_active             boolean not null default true,
  is_historical         boolean not null default false,
  sanitized_confirmed   boolean not null default false,
  review_status         text not null default 'pending',
  display_order         integer not null default 0,
  notes                 text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  created_by            uuid references auth.users(id),
  updated_by            uuid references auth.users(id)
);

comment on table fleet_documents is 'Certificados/documentos técnicos por vehículo. La copia pública sanitizada vive en public_file_path (bucket fleet-public-documents); el original completo vive aparte en fleet_document_private_files.';

alter table fleet_documents drop constraint if exists fleet_documents_review_status_check;
alter table fleet_documents add constraint fleet_documents_review_status_check
  check (review_status in ('pending', 'approved', 'rejected'));

alter table fleet_documents drop constraint if exists fleet_documents_document_type_check;
alter table fleet_documents add constraint fleet_documents_document_type_check
  check (document_type in (
    'sec_tc10a',
    'tank_tc8',
    'hermeticity_test',
    'periodic_inspection',
    'visual_inspection',
    'manufacturing_certificate',
    'circulation_permit',
    'technical_revision',
    'insurance',
    'other'
  ));

drop trigger if exists fleet_documents_updated_at on fleet_documents;
create trigger fleet_documents_updated_at
  before update on fleet_documents
  for each row execute function update_updated_at_column();

create index if not exists idx_fleet_documents_vehicle_id on fleet_documents(vehicle_id);
create index if not exists idx_fleet_documents_expires_at on fleet_documents(expires_at);
create index if not exists idx_fleet_documents_is_public on fleet_documents(is_public);
create index if not exists idx_fleet_documents_is_active on fleet_documents(is_active);
create index if not exists idx_fleet_documents_review_status on fleet_documents(review_status);
create index if not exists idx_fleet_documents_display_order on fleet_documents(display_order);

-- ============================================================
-- 3) TABLA: fleet_document_private_files
--    Separa el PDF original (con datos sensibles) de la copia pública.
--    Jamás debe quedar expuesta a usuarios anónimos.
-- ============================================================
create table if not exists fleet_document_private_files (
  id                  uuid primary key default gen_random_uuid(),
  document_id         uuid unique not null references fleet_documents(id) on delete cascade,
  private_file_path   text not null,
  original_filename   text,
  mime_type           text,
  file_size_bytes     bigint,
  created_at          timestamptz not null default now(),
  uploaded_by         uuid references auth.users(id)
);

comment on table fleet_document_private_files is 'PDF original completo por documento (bucket fleet-private-documents, privado). Solo accesible vía URL firmada desde /admin.';

create index if not exists idx_fleet_document_private_files_document_id on fleet_document_private_files(document_id);

-- ============================================================
-- 4) TABLA: fleet_document_audit_logs
-- ============================================================
create table if not exists fleet_document_audit_logs (
  id             uuid primary key default gen_random_uuid(),
  document_id    uuid references fleet_documents(id) on delete set null,
  vehicle_id     uuid references fleet_vehicles(id) on delete set null,
  action         text not null,
  previous_data  jsonb,
  new_data       jsonb,
  performed_by   uuid references auth.users(id),
  created_at     timestamptz not null default now()
);

alter table fleet_document_audit_logs drop constraint if exists fleet_document_audit_logs_action_check;
alter table fleet_document_audit_logs add constraint fleet_document_audit_logs_action_check
  check (action in (
    'create', 'update', 'replace_public_file', 'replace_private_file',
    'archive', 'publish', 'unpublish', 'delete'
  ));

create index if not exists idx_fleet_document_audit_logs_document_id on fleet_document_audit_logs(document_id);
create index if not exists idx_fleet_document_audit_logs_vehicle_id on fleet_document_audit_logs(vehicle_id);
create index if not exists idx_fleet_document_audit_logs_created_at on fleet_document_audit_logs(created_at desc);

-- ============================================================
-- 5) ROW LEVEL SECURITY
-- ============================================================
alter table fleet_vehicles enable row level security;
alter table fleet_documents enable row level security;
alter table fleet_document_private_files enable row level security;
alter table fleet_document_audit_logs enable row level security;

-- --- Lectura pública ------------------------------------------------
drop policy if exists "lectura_publica_fleet_vehicles" on fleet_vehicles;
create policy "lectura_publica_fleet_vehicles" on fleet_vehicles
  for select
  using (is_public = true and is_active = true);

drop policy if exists "lectura_publica_fleet_documents" on fleet_documents;
create policy "lectura_publica_fleet_documents" on fleet_documents
  for select
  using (
    is_public = true
    and is_active = true
    and sanitized_confirmed = true
    and review_status = 'approved'
    and public_file_path is not null
    and exists (
      select 1 from fleet_vehicles v
      where v.id = fleet_documents.vehicle_id
        and v.is_public = true
        and v.is_active = true
    )
  );

-- fleet_document_private_files y fleet_document_audit_logs: SIN policy de
-- select para anon/authenticated-no-admin. Al no existir una policy que
-- lo permita, con RLS activo el acceso queda denegado por defecto para
-- cualquier rol que no sea el admin autenticado (política de abajo) o
-- service_role (que siempre hace bypass de RLS).

-- --- Gestión administrativa (usuarios autenticados) ------------------
-- Sigue la misma convención que el resto del proyecto: cualquier usuario
-- autenticado tiene CRUD completo; el gate de "¿es admin activo?" ya lo
-- aplica src/app/admin/layout.tsx contra admin_profiles.activo antes de
-- renderizar cualquier pantalla de /admin.
drop policy if exists "admin_gestiona_fleet_vehicles" on fleet_vehicles;
create policy "admin_gestiona_fleet_vehicles" on fleet_vehicles
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin_gestiona_fleet_documents" on fleet_documents;
create policy "admin_gestiona_fleet_documents" on fleet_documents
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin_gestiona_fleet_private_files" on fleet_document_private_files;
create policy "admin_gestiona_fleet_private_files" on fleet_document_private_files
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "admin_lee_fleet_audit_logs" on fleet_document_audit_logs;
create policy "admin_lee_fleet_audit_logs" on fleet_document_audit_logs
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin_crea_fleet_audit_logs" on fleet_document_audit_logs;
create policy "admin_crea_fleet_audit_logs" on fleet_document_audit_logs
  for insert
  with check (auth.role() = 'authenticated');

-- Los audit logs son un registro histórico: no se exponen policies de
-- update/delete a propósito (ni siquiera para admins autenticados).

-- ============================================================
-- 6) STORAGE BUCKETS
-- ============================================================

-- 6.1) "flota" — fotos públicas de camiones (mismo patrón que blog/clientes/eventos/equipo)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('flota', 'flota', true, 5242880, array['image/jpeg','image/jpg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 6.2) "fleet-public-documents" — SOLO copias PDF sanitizadas, lectura pública
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('fleet-public-documents', 'fleet-public-documents', true, 15728640, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- 6.3) "fleet-private-documents" — PDF originales completos, NUNCA público
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('fleet-private-documents', 'fleet-private-documents', false, 15728640, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================
-- 7) POLÍTICAS RLS SOBRE storage.objects
-- ============================================================

-- 7.1) Bucket público de fotos "flota": lectura pública + CRUD admin
drop policy if exists "public_read_flota" on storage.objects;
create policy "public_read_flota" on storage.objects
  for select using (bucket_id = 'flota');
drop policy if exists "auth_insert_flota" on storage.objects;
create policy "auth_insert_flota" on storage.objects
  for insert to authenticated with check (bucket_id = 'flota');
drop policy if exists "auth_update_flota" on storage.objects;
create policy "auth_update_flota" on storage.objects
  for update to authenticated using (bucket_id = 'flota') with check (bucket_id = 'flota');
drop policy if exists "auth_delete_flota" on storage.objects;
create policy "auth_delete_flota" on storage.objects
  for delete to authenticated using (bucket_id = 'flota');

-- 7.2) Bucket público de documentos sanitizados: lectura pública + CRUD admin
drop policy if exists "public_read_fleet_public_documents" on storage.objects;
create policy "public_read_fleet_public_documents" on storage.objects
  for select using (bucket_id = 'fleet-public-documents');
drop policy if exists "auth_insert_fleet_public_documents" on storage.objects;
create policy "auth_insert_fleet_public_documents" on storage.objects
  for insert to authenticated with check (bucket_id = 'fleet-public-documents');
drop policy if exists "auth_update_fleet_public_documents" on storage.objects;
create policy "auth_update_fleet_public_documents" on storage.objects
  for update to authenticated using (bucket_id = 'fleet-public-documents') with check (bucket_id = 'fleet-public-documents');
drop policy if exists "auth_delete_fleet_public_documents" on storage.objects;
create policy "auth_delete_fleet_public_documents" on storage.objects
  for delete to authenticated using (bucket_id = 'fleet-public-documents');

-- 7.3) Bucket privado de originales: SIN lectura pública. Solo admins
--      autenticados pueden leer (para generar URLs firmadas de corta
--      duración desde el panel) y gestionar.
drop policy if exists "public_read_fleet_private_documents" on storage.objects;
drop policy if exists "auth_select_fleet_private_documents" on storage.objects;
create policy "auth_select_fleet_private_documents" on storage.objects
  for select to authenticated using (bucket_id = 'fleet-private-documents');
drop policy if exists "auth_insert_fleet_private_documents" on storage.objects;
create policy "auth_insert_fleet_private_documents" on storage.objects
  for insert to authenticated with check (bucket_id = 'fleet-private-documents');
drop policy if exists "auth_update_fleet_private_documents" on storage.objects;
create policy "auth_update_fleet_private_documents" on storage.objects
  for update to authenticated using (bucket_id = 'fleet-private-documents') with check (bucket_id = 'fleet-private-documents');
drop policy if exists "auth_delete_fleet_private_documents" on storage.objects;
create policy "auth_delete_fleet_private_documents" on storage.objects
  for delete to authenticated using (bucket_id = 'fleet-private-documents');

-- ============================================================
-- 8) DATOS INICIALES (idempotente vía plate_key único)
--
-- Solo se cargan los vehículos y las fechas informadas por el cliente.
-- NO se suben PDF automáticamente: los originales completos deben
-- cargarse manualmente desde /admin/flota en el bucket privado, y las
-- copias sanitizadas (sin RUT, firmas, teléfonos ni domicilios) se suben
-- después para publicarlas. Los documentos quedan creados en estado
-- "pending" y sin public_file_path para que no aparezcan en el sitio
-- público hasta que un administrador los revise y apruebe.
-- ============================================================
insert into fleet_vehicles (
  plate, brand, model, manufacture_year, tank_capacity_liters, compartments,
  authorized_fuel_type, short_description, is_public, is_active, display_order
) values
  (
    'TJZV-39', 'Chevrolet', 'FTR 1524', 2024, 10000, 2,
    'Combustible líquido Clase II',
    'Camión estanque de distribución para despachos programados y de emergencia en la Región Metropolitana.',
    true, true, 1
  ),
  (
    'PFTT-94', 'Chevrolet', 'NQR 919 E5', 2020, 5000, 1,
    'Combustible líquido Clase II',
    'Camión estanque de menor capacidad para despachos en zonas de acceso más acotado.',
    true, true, 2
  )
on conflict (plate_key) do nothing;

-- Documentos iniciales del vehículo TJZV-39 (pendientes de revisión: sin
-- copia pública sanitizada todavía).
insert into fleet_documents (
  vehicle_id, document_type, title, issuing_entity,
  next_inspection_at, is_public, is_active, is_historical,
  sanitized_confirmed, review_status, notes
)
select v.id, 'periodic_inspection', 'Inspección periódica del estanque', 'Entidad certificadora autorizada por la SEC',
  '2030-05-14', false, true, false, false, 'pending',
  'Pendiente de carga de copia pública sanitizada por un administrador.'
from fleet_vehicles v
where v.plate_key = 'TJZV39'
  and not exists (
    select 1 from fleet_documents d
    where d.vehicle_id = v.id and d.document_type = 'periodic_inspection' and d.is_historical = false
  );

insert into fleet_documents (
  vehicle_id, document_type, title, issuing_entity,
  expires_at, is_public, is_active, is_historical,
  sanitized_confirmed, review_status, notes
)
select v.id, 'hermeticity_test', 'Prueba de hermeticidad', 'Entidad certificadora autorizada por la SEC',
  '2026-08-24', false, true, false, false, 'pending',
  'Pendiente de carga de copia pública sanitizada por un administrador.'
from fleet_vehicles v
where v.plate_key = 'TJZV39'
  and not exists (
    select 1 from fleet_documents d
    where d.vehicle_id = v.id and d.document_type = 'hermeticity_test' and d.is_historical = false
  );

-- Documentos iniciales del vehículo PFTT-94.
insert into fleet_documents (
  vehicle_id, document_type, title, issuing_entity,
  next_inspection_at, is_public, is_active, is_historical,
  sanitized_confirmed, review_status, notes
)
select v.id, 'periodic_inspection', 'Inspección periódica del estanque', 'Entidad certificadora autorizada por la SEC',
  '2030-10-23', false, true, false, false, 'pending',
  'Pendiente de carga de copia pública sanitizada por un administrador.'
from fleet_vehicles v
where v.plate_key = 'PFTT94'
  and not exists (
    select 1 from fleet_documents d
    where d.vehicle_id = v.id and d.document_type = 'periodic_inspection' and d.is_historical = false
  );

insert into fleet_documents (
  vehicle_id, document_type, title, issuing_entity,
  expires_at, is_public, is_active, is_historical,
  sanitized_confirmed, review_status, notes
)
select v.id, 'hermeticity_test', 'Prueba de hermeticidad', 'Entidad certificadora autorizada por la SEC',
  '2026-11-25', false, true, false, false, 'pending',
  'Pendiente de carga de copia pública sanitizada por un administrador.'
from fleet_vehicles v
where v.plate_key = 'PFTT94'
  and not exists (
    select 1 from fleet_documents d
    where d.vehicle_id = v.id and d.document_type = 'hermeticity_test' and d.is_historical = false
  );

-- Documento histórico de PFTT-94 (prueba de hermeticidad anterior, vencida):
-- se deja marcado como histórico y privado; un administrador puede
-- publicarlo más adelante con la etiqueta "Documento histórico" si lo
-- estima conveniente.
insert into fleet_documents (
  vehicle_id, document_type, title, issuing_entity,
  is_public, is_active, is_historical,
  sanitized_confirmed, review_status, notes
)
select v.id, 'hermeticity_test', 'Prueba de hermeticidad (registro histórico anterior)', 'Entidad certificadora autorizada por la SEC',
  false, true, true, false, 'pending',
  'Documento histórico previo al vencimiento vigente. Cargar fecha real de emisión/vencimiento y PDF desde /admin/flota antes de decidir si se publica.'
from fleet_vehicles v
where v.plate_key = 'PFTT94'
  and not exists (
    select 1 from fleet_documents d
    where d.vehicle_id = v.id and d.is_historical = true
  );

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- select plate, brand, model, is_public from fleet_vehicles order by display_order;
-- select v.plate, d.document_type, d.review_status, d.is_public, d.expires_at, d.next_inspection_at
--   from fleet_documents d join fleet_vehicles v on v.id = d.vehicle_id order by v.plate;
