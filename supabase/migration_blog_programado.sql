-- Publicación por fecha: los borradores y artículos futuros no son accesibles con anon.
begin;

drop policy if exists "lectura_publica_blog" on public.blog_posts;
create policy "lectura_publica_blog" on public.blog_posts
  for select to anon
  using (publicado = true and (fecha_publicacion is null or fecha_publicacion <= now()));

create index if not exists blog_posts_publication_idx
  on public.blog_posts (fecha_publicacion desc, slug) where publicado = true;

commit;
