-- =============================================================
-- FENICE SPA — Migración: Storage buckets + políticas de subida
-- Ejecutar en: Supabase Dashboard > SQL Editor
--
-- Esto resuelve el error "no deja subir la foto" en Blog, Clientes y Eventos:
-- sin los buckets creados y sin políticas de INSERT, cada subida falla.
-- =============================================================

-- ============================================================
-- 1) CREAR / ACTUALIZAR BUCKETS PÚBLICOS
--    file_size_limit = 5 MB (holgado; el panel valida 2 MB en el cliente)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('blog',     'blog',     true, 5242880, array['image/jpeg','image/jpg','image/png','image/webp']),
  ('clientes', 'clientes', true, 5242880, array['image/jpeg','image/jpg','image/png','image/webp']),
  ('eventos',  'eventos',  true, 5242880, array['image/jpeg','image/jpg','image/png','image/webp']),
  ('equipo',   'equipo',   true, 5242880, array['image/jpeg','image/jpg','image/png','image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ============================================================
-- 2) POLÍTICAS RLS SOBRE storage.objects
--    Lectura pública + gestión para usuarios autenticados (admin).
-- ============================================================
do $$
declare
  b text;
  buckets text[] := array['blog','clientes','eventos','equipo'];
begin
  foreach b in array buckets loop
    -- Limpiar políticas previas de este bucket (idempotente)
    execute format('drop policy if exists "public_read_%1$s" on storage.objects', b);
    execute format('drop policy if exists "auth_insert_%1$s" on storage.objects', b);
    execute format('drop policy if exists "auth_update_%1$s" on storage.objects', b);
    execute format('drop policy if exists "auth_delete_%1$s" on storage.objects', b);

    -- Lectura pública (los buckets son públicos, pero la policy lo hace explícito)
    execute format(
      'create policy "public_read_%1$s" on storage.objects for select using (bucket_id = %1$L)', b);
    -- Subida por usuarios autenticados
    execute format(
      'create policy "auth_insert_%1$s" on storage.objects for insert to authenticated with check (bucket_id = %1$L)', b);
    -- Reemplazo / actualización
    execute format(
      'create policy "auth_update_%1$s" on storage.objects for update to authenticated using (bucket_id = %1$L) with check (bucket_id = %1$L)', b);
    -- Borrado
    execute format(
      'create policy "auth_delete_%1$s" on storage.objects for delete to authenticated using (bucket_id = %1$L)', b);
  end loop;
end $$;
