import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { businessDateTimeToIso, toBusinessDateTimeInput, formatBusinessDateTime } from '../src/lib/dates.ts';
import { publicationStatus, publicationFilter } from '../src/lib/blogPublication.ts';

const plan = JSON.parse(readFileSync(new URL('../content/blog-plan-comercial.json', import.meta.url)));

test('Santiago: programación independiente de la zona del navegador y horario estacional', () => {
  assert.equal(businessDateTimeToIso('2026-11-05T09:00'), '2026-11-05T12:00:00.000Z');
  assert.equal(businessDateTimeToIso('2026-07-05T09:00'), '2026-07-05T13:00:00.000Z');
  assert.equal(toBusinessDateTimeInput('2026-11-05T12:00:00Z'), '2026-11-05T09:00');
  assert.equal(formatBusinessDateTime('2026-11-05T12:00:00Z'), '05-11-2026 09:00');
  assert.throws(() => businessDateTimeToIso('2026-09-06T00:30'));
  assert.throws(() => businessDateTimeToIso('2026-02-30T09:00'));
});

test('borrador, futuro, fecha exacta y publicaciones antiguas sin fecha', () => {
  const now = Date.parse('2026-11-05T12:00:00Z');
  assert.equal(publicationStatus({ publicado: false }, now), 'draft');
  assert.equal(publicationStatus({ publicado: true, fecha_publicacion: '2026-11-05T12:00:01Z' }, now), 'scheduled');
  assert.equal(publicationStatus({ publicado: true, fecha_publicacion: '2026-11-05T12:00:00Z' }, now), 'published');
  assert.equal(publicationStatus({ publicado: true, fecha_publicacion: null }, now), 'published');
  assert.equal(publicationStatus({ publicado: true, fecha_publicacion: 'invalid' }, now), 'draft');
  assert.equal(publicationFilter(new Date(now)), 'fecha_publicacion.is.null,fecha_publicacion.lte.2026-11-05T12:00:00.000Z');
});

test('plan editorial: metadatos, imágenes y enlaces a servicios existentes', () => {
  assert.equal(plan.length, 8);
  assert.equal(new Set(plan.map(p => p.slug)).size, plan.length);
  assert.equal(plan.filter(p => p.days_after_start === 0).length, 3);
  assert.equal(plan.filter(p => p.days_after_start > 0).length, 5);
  const slugs = new Set(plan.map(p => p.slug));
  for (const post of plan) {
    assert.ok(post.meta_title.length > 0 && post.meta_title.length <= 60, post.slug);
    assert.ok(post.meta_description.length > 0 && post.meta_description.length <= 155, post.slug);
    assert.ok(post.contenido.split(/\s+/).length >= 400, post.slug);
    assert.ok(existsSync(`public${post.imagen_destacada}`), post.imagen_destacada);
    for (const match of post.contenido.matchAll(/\]\((\/[^)]+)\)/g)) {
      const href = match[1];
      if (href.startsWith('/blog/')) assert.ok(slugs.has(href.slice(6)), href);
      else assert.ok(existsSync(`src/app/(site)${href}/page.tsx`), href);
    }
  }
});
