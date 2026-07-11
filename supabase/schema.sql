-- =============================================================
-- FENICE SPA — Supabase Schema completo
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================

-- ============================================================
-- CONFIGURACIÓN GENERAL DEL SITIO
-- ============================================================
create table if not exists configuracion_sitio (
  clave text primary key,
  valor text not null,
  descripcion text,
  updated_at timestamptz default now()
);

insert into configuracion_sitio (clave, valor, descripcion) values
  ('whatsapp_numero', '56939579658', 'Solo números, sin + ni espacios, para wa.me'),
  ('telefono', '+56939579658', 'Teléfono de contacto, formato con +'),
  ('email', 'ventas@fenice.cl', 'Correo de contacto corporativo'),
  ('horario', 'Lun-Vie 09:00-19:00', 'Horario de atención'),
  ('direccion', 'La Granja, Santiago', 'Dirección base operativa'),
  ('instagram_url', 'https://www.instagram.com/fenice.spa/', 'Instagram')
on conflict (clave) do nothing;

-- ============================================================
-- PRODUCTOS
-- ============================================================
create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null,
  descripcion_corta text,
  descripcion text,
  imagen_url text,
  categoria text,
  precio_referencial numeric,
  destacado boolean default false,
  activo boolean default true,
  meta_title text,
  meta_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- CLIENTES (empresas con las que trabajan)
-- ============================================================
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  logo_url text,
  sitio_web text,
  testimonio text,
  orden integer default 0,
  activo boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- BLOG
-- ============================================================
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text unique not null,
  extracto text,
  contenido text not null,
  imagen_destacada text,
  autor text default 'Fenice SPA',
  categoria text,
  meta_title text,
  meta_description text,
  palabras_clave text,
  publicado boolean default false,
  fecha_publicacion timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- EVENTOS
-- ============================================================
create table if not exists eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text unique not null,
  descripcion text,
  ubicacion text,
  fecha_inicio timestamptz not null,
  fecha_fin timestamptz,
  imagen_url text,
  activo boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PROMOCIONES
-- ============================================================
create table if not exists promociones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  descuento_texto text,
  codigo text,
  imagen_url text,
  fecha_inicio timestamptz not null,
  fecha_fin timestamptz not null,
  destacado boolean default false,
  activo boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- LEADS (mensajes del formulario de contacto público)
-- ============================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  comuna text,
  tipo_operacion text,
  volumen text,
  telefono text,
  email text,
  mensaje text,
  estado text default 'nuevo', -- nuevo | contactado | cerrado
  created_at timestamptz default now()
);

-- ============================================================
-- COTIZACIONES (formulario de cotización empresarial)
-- ============================================================
create table if not exists cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text not null,
  rut_empresa text,
  email text not null,
  telefono text not null,
  comuna text,
  servicio_solicitado text not null,
  volumen_estimado text,
  frecuencia text,
  mensaje text,
  estado text default 'nuevo', -- nuevo | en_proceso | cotizado | cerrado
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PERFILES ADMIN
-- ============================================================
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  rol text default 'editor', -- admin | editor
  created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table productos enable row level security;
alter table clientes enable row level security;
alter table blog_posts enable row level security;
alter table eventos enable row level security;
alter table promociones enable row level security;
alter table configuracion_sitio enable row level security;
alter table cotizaciones enable row level security;
alter table leads enable row level security;
alter table admin_profiles enable row level security;

-- LECTURA PÚBLICA: solo contenido activo/publicado/vigente
create policy "lectura_publica_productos" on productos
  for select using (activo = true);

create policy "lectura_publica_clientes" on clientes
  for select using (activo = true);

create policy "lectura_publica_blog" on blog_posts
  for select using (publicado = true);

create policy "lectura_publica_eventos" on eventos
  for select using (activo = true);

create policy "lectura_publica_promociones" on promociones
  for select using (activo = true and now() between fecha_inicio and fecha_fin);

create policy "lectura_publica_configuracion" on configuracion_sitio
  for select using (true);

-- Formulario público puede insertar cotizaciones (sin leer)
create policy "cualquiera_crea_cotizacion" on cotizaciones
  for insert with check (true);

-- Formulario público puede insertar leads (sin leer)
create policy "cualquiera_crea_lead" on leads
  for insert with check (true);

-- GESTIÓN ADMIN COMPLETA (usuarios autenticados)
create policy "admin_gestiona_productos" on productos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_gestiona_clientes" on clientes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_gestiona_blog" on blog_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_gestiona_eventos" on eventos
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_gestiona_promociones" on promociones
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_gestiona_configuracion" on configuracion_sitio
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_gestiona_cotizaciones" on cotizaciones
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "admin_lee_leads" on leads
  for select using (auth.role() = 'authenticated');

create policy "admin_actualiza_leads" on leads
  for update using (auth.role() = 'authenticated');

create policy "admin_gestiona_perfiles" on admin_profiles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKETS (crear en Supabase Dashboard > Storage)
-- ============================================================
-- Buckets requeridos (todos públicos):
--   - productos     (imágenes de productos)
--   - blog          (imágenes destacadas de posts)
--   - clientes      (logos de empresas)
--   - eventos       (imágenes de eventos)
--
-- Configuración de cada bucket:
--   Public bucket: true
--   Allowed MIME types: image/jpeg, image/png, image/webp
--   Max file size: 2097152 (2 MB)
--
-- Comando alternativo via SQL (si tu plan lo permite):
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values
--   ('productos', 'productos', true, 2097152, array['image/jpeg','image/png','image/webp']),
--   ('blog', 'blog', true, 2097152, array['image/jpeg','image/png','image/webp']),
--   ('clientes', 'clientes', true, 2097152, array['image/jpeg','image/png','image/webp']),
--   ('eventos', 'eventos', true, 2097152, array['image/jpeg','image/png','image/webp'])
-- on conflict (id) do nothing;

-- ============================================================
-- FUNCIÓN: updated_at automático
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger productos_updated_at before update on productos for each row execute function update_updated_at_column();
create or replace trigger blog_posts_updated_at before update on blog_posts for each row execute function update_updated_at_column();
create or replace trigger eventos_updated_at before update on eventos for each row execute function update_updated_at_column();
create or replace trigger configuracion_sitio_updated_at before update on configuracion_sitio for each row execute function update_updated_at_column();

-- ============================================================
-- PRIMER USUARIO ADMIN
-- Después de ejecutar este SQL:
-- 1. Ve a Supabase Dashboard > Authentication > Users
-- 2. Crea un nuevo usuario con email y contraseña
-- 3. Copia el UUID del usuario y ejecúta:
--    INSERT INTO admin_profiles (id, nombre, rol) VALUES ('<UUID>', 'Administrador', 'admin');
-- ============================================================
