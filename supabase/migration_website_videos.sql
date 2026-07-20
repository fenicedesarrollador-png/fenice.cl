-- =============================================================
-- FENICE SPA — Migración: Videos cortos tipo reel (Home)
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Idempotente: se puede volver a ejecutar sin duplicar datos ni romper
-- políticas existentes.
--
-- Roles: sin sistema de roles nuevo. Igual que el resto del proyecto,
-- `auth.role() = 'authenticated'` = admin (gate de "¿admin activo?" ya
-- aplicado en src/app/admin/layout.tsx contra admin_profiles.activo).
-- =============================================================

-- ============================================================
-- 1) TABLA: website_videos
-- ============================================================
create table if not exists website_videos (
  id             uuid primary key default gen_random_uuid(),
  title          text,
  description    text,
  video_path     text not null,
  poster_path    text,
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  autoplay       boolean not null default true,
  loop           boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  created_by     uuid references auth.users(id)
);

comment on table website_videos is 'Videos cortos tipo reel mostrados en la Home. Máximo recomendado: 5 activos (gestionado desde /admin/videos).';

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists website_videos_updated_at on website_videos;
create trigger website_videos_updated_at
  before update on website_videos
  for each row execute function update_updated_at_column();

create index if not exists idx_website_videos_is_active on website_videos(is_active);
create index if not exists idx_website_videos_display_order on website_videos(display_order);

-- ============================================================
-- 2) ROW LEVEL SECURITY
-- ============================================================
alter table website_videos enable row level security;

drop policy if exists "lectura_publica_website_videos" on website_videos;
create policy "lectura_publica_website_videos" on website_videos
  for select
  using (is_active = true);

drop policy if exists "admin_gestiona_website_videos" on website_videos;
create policy "admin_gestiona_website_videos" on website_videos
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- 3) STORAGE BUCKET "website-videos" (público)
--    Un solo bucket para video (mp4) + imagen de portada, tal como se
--    especificó. Tamaño máximo 20 MB (video); las portadas (imagen) son
--    muchísimo más livianas y quedan cubiertas por el mismo límite.
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'website-videos', 'website-videos', true, 20971520,
  array['video/mp4', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public_read_website_videos" on storage.objects;
create policy "public_read_website_videos" on storage.objects
  for select using (bucket_id = 'website-videos');

drop policy if exists "auth_insert_website_videos" on storage.objects;
create policy "auth_insert_website_videos" on storage.objects
  for insert to authenticated with check (bucket_id = 'website-videos');

drop policy if exists "auth_update_website_videos" on storage.objects;
create policy "auth_update_website_videos" on storage.objects
  for update to authenticated using (bucket_id = 'website-videos') with check (bucket_id = 'website-videos');

drop policy if exists "auth_delete_website_videos" on storage.objects;
create policy "auth_delete_website_videos" on storage.objects
  for delete to authenticated using (bucket_id = 'website-videos');

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- select id, title, is_active, display_order from website_videos order by display_order;
