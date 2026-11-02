import assert from 'node:assert/strict';

const base = process.argv[2] || 'http://127.0.0.1:3100';
async function get(path) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000), redirect: 'manual' });
  return { response, html: await response.text() };
}
const sitemap = await get('/sitemap.xml');
assert.equal(sitemap.response.status, 200, 'sitemap');
const urls = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.ok(urls.length > 70);
assert.equal(new Set(urls).size, urls.length, 'URLs duplicadas');
const scheduled = ['despachos-programados-combustible-empresas', 'control-consumo-combustible-flotas', 'kerosene-parafina-calderas-edificios', 'preparar-recepcion-despacho-combustible-empresa', 'elegir-proveedor-diesel-empresas-santiago'];
const now = Date.now();
const planDates = ['2026-11-05T12:00Z', '2026-11-12T12:00Z', '2026-11-19T12:00Z', '2026-11-26T12:00Z', '2026-12-03T12:00Z'];
const future = scheduled.filter((_, i) => now < Date.parse(planDates[i]));
for (const slug of future) assert.equal(sitemap.html.includes(`/blog/${slug}`), false, 'Artículo futuro en sitemap');
let checked = 0;
const queue = [...urls];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const url = queue.shift();
    const { pathname } = new URL(url);
    const { response, html } = await get(pathname);
    assert.equal(response.status, 200, pathname);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${pathname}: h1`);
    assert.ok(html.includes('rel="canonical"'), `${pathname}: canonical`);
    const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/);
    assert.ok(canonical && new URL(canonical[1]).pathname.replace(/\/$/, '') === pathname.replace(/\/$/, ''), `${pathname}: canonical de otra página`);
    assert.ok(/<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html), `${pathname}: description`);
    assert.equal(/name="robots"[^>]+content="[^"]*noindex/.test(html), false, `${pathname}: noindex`);
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1]);
    if (pathname === '/') {
      assert.equal(html.includes('id="documentacion-flota"'), false);
      assert.equal(html.includes('id="fenice-loader"'), false);
      assert.ok(html.includes('quick-name'));
    }
    checked++;
  }
}));
for (const slug of [...future, 'articulo-inexistente-fenice']) {
  assert.equal((await get(`/blog/${slug}`)).response.status, 404, `No debe ser público: ${slug}`);
}
for (const [source, destination] of [['/servicios/parafina-a-domicilio-santiago', '/venta-kerosene'], ['/servicios/petroleo-a-domicilio-santiago', '/petroleo-a-domicilio']]) {
  const { response } = await get(source);
  assert.equal(response.status, 308, source);
  assert.equal(new URL(response.headers.get('location'), base).pathname, destination);
}
const invalidLead = await fetch(new URL('/api/public/contacto', base), { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
assert.equal(invalidLead.status, 400);
const protectedImport = await fetch(new URL('/api/admin/blog/plan-editorial', base), { method: 'POST' });
assert.equal(protectedImport.status, 401);
console.log(JSON.stringify({ pagesChecked: checked, futureArticlesHidden: future.length, structuredData: 'valid JSON', redirects: 'valid', leadValidation: 'valid', editorialImport: 'protected' }));
