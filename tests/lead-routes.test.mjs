import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function loadContactRoute({ failInsert = false } = {}) {
  const after = [];
  const rows = [];
  let emails = 0;
  const service = { from: () => ({ insert: (payload) => {
    rows.push(payload);
    return { select: () => ({ single: async () => failInsert
      ? { data: null, error: { message: 'internal database detail' } }
      : { data: { id: 'lead-test-id' }, error: null } }) };
  } }) };
  const mocks = {
    'next/server': { NextResponse: { json: Response.json.bind(Response) }, after: fn => after.push(fn) },
    '@/lib/supabase/server': { createServiceClient: async () => service },
    '@/lib/analytics/server': { linkAnalyticsIdentity: async () => {} },
    '@/lib/email/resend': { sendEmail: async () => { emails++; throw new Error('email unavailable'); } },
    '@/lib/email/templates': { contactoInternoEmail: () => 'test' },
    '@/lib/config': { NOTIFY_EMAILS: [] },
    '@/lib/notify/adminAlert': { notifyNuevoLead: async () => {} },
  };
  const source = readFileSync(new URL('../src/app/api/public/contacto/route.ts', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const compiledModule = { exports: {} };
  new Function('require', 'module', 'exports', outputText)(id => {
    if (!(id in mocks)) throw new Error(`Unexpected dependency: ${id}`);
    return mocks[id];
  }, compiledModule, compiledModule.exports);
  return { post: compiledModule.exports.POST, after, rows, emails: () => emails };
}
const valid = { nombre: 'Empresa de prueba', comuna: 'Santiago', tipo_operacion: 'Petróleo diésel', telefono: '+56912345678' };
const request = body => new Request('https://fenice.cl/api/public/contacto', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

test('el lead queda registrado y responde antes de las notificaciones; un fallo de correo no pierde la solicitud', async () => {
  const route = loadContactRoute();
  const response = await route.post(request(valid));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(route.rows.length, 1);
  assert.equal(route.emails(), 0);
  assert.equal(route.after.length, 1);
  await route.after[0]();
  assert.equal(route.emails(), 1);
  assert.equal(route.rows.length, 1);
});

test('sin contacto, teléfono incompleto o honeypot no se crean leads', async () => {
  for (const body of [{ ...valid, telefono: '' }, { ...valid, telefono: '123' }, { ...valid, website: 'spam.example' }]) {
    const route = loadContactRoute();
    const response = await route.post(request(body));
    assert.equal(response.status, 400);
    assert.equal(route.rows.length, 0);
    assert.equal(route.after.length, 0);
  }
});

test('el fallo de persistencia devuelve error sin notificar ni exponer detalles internos', async () => {
  const route = loadContactRoute({ failInsert: true });
  const response = await route.post(request(valid));
  assert.equal(response.status, 500);
  assert.equal(JSON.stringify(await response.json()).includes('internal database detail'), false);
  assert.equal(route.after.length, 0);
});
