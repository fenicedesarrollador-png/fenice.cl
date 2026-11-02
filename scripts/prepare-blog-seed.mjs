import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const plan = JSON.parse(await readFile(new URL('content/blog-plan-comercial.json', root), 'utf8'));
const migration = await readFile(new URL('supabase/migration_blog_programado.sql', root), 'utf8');
const literal = JSON.stringify(plan);
if (literal.includes('$fenice_blog_seed$')) throw new Error('Delimitador SQL no válido.');
const sql = `${migration.replace(/commit;\s*$/i, '')}
with plan as (
  select * from jsonb_to_recordset($fenice_blog_seed$${literal}$fenice_blog_seed$::jsonb)
  as p(slug text, titulo text, extracto text, contenido text, imagen_destacada text,
    autor text, categoria text, meta_title text, meta_description text,
    palabras_clave text, days_after_start integer)
)
insert into public.blog_posts
  (slug, titulo, extracto, contenido, imagen_destacada, autor, categoria,
    meta_title, meta_description, palabras_clave, publicado, fecha_publicacion)
select slug, titulo, extracto, contenido, imagen_destacada, autor, categoria,
  meta_title, meta_description, palabras_clave, true,
  case when days_after_start = 0 then now()
    else ((timezone('America/Santiago', now())::date + days_after_start) + time '09:00')
      at time zone 'America/Santiago' end
from plan
on conflict (slug) do nothing;

commit;

select titulo,
  case when not publicado then 'Borrador'
    when fecha_publicacion > now() then 'Programado' else 'Publicado' end as estado,
  to_char(fecha_publicacion at time zone 'America/Santiago', 'DD-MM-YYYY HH24:MI') as publicacion_santiago
from public.blog_posts
order by fecha_publicacion, titulo;
`;
process.stdout.write(sql);
