import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateGeneratorSupply, generatorQuoteHref, quoteDefaults } from '../src/lib/supplyPlanning.ts';

test('planificación: consumo real, reserva, autonomía y reposición sin confundirla con pedido mínimo', () => {
  const result = calculateGeneratorSupply({ consumption: 12, hours: 8, available: 100, reserve: 20 });
  assert.equal(result.consumptionLitres, 96);
  assert.equal(result.autonomyHours, 80 / 12);
  assert.equal(result.refillLitres, 16);
  assert.equal(calculateGeneratorSupply({ consumption: 10, hours: 8, available: 120, reserve: 20 }).refillLitres, 0);
  assert.equal(calculateGeneratorSupply({ consumption: 10, hours: 8, available: 5, reserve: 20 }).autonomyHours, 0);
  assert.equal(calculateGeneratorSupply({ consumption: 0.25, hours: 2.5, available: 0, reserve: 0 }).refillLitres, 0.625);
});

test('planificación: rechaza cifras no finitas, negativas, consumo cero y valores fuera de rango', () => {
  const input = { consumption: 12, hours: 8, available: 100, reserve: 20 };
  for (const patch of [{ consumption: 0 }, { hours: 0 }, { available: -1 }, { reserve: -1 }, { consumption: Infinity }, { hours: NaN }, { consumption: 10001 }, { hours: 8761 }, { available: 1000001 }, { reserve: 1000001 }]) {
    assert.throws(() => calculateGeneratorSupply({ ...input, ...patch }));
  }
});

test('cotización: conserva el cálculo completo sin enviar ni convertir el resultado en una compra', () => {
  const input = { consumption: 12, hours: 8, available: 100, reserve: 20 };
  const url = new URL(generatorQuoteHref(input), 'https://fenice.cl');
  assert.equal(url.pathname, '/cotizacion');
  const defaults = quoteDefaults(Object.fromEntries(url.searchParams));
  assert.equal(defaults.service, 'Combustible para generador eléctrico');
  assert.equal(defaults.fuel, 'Petróleo diésel');
  assert.equal(defaults.installation, 'Generador eléctrico');
  assert.match(defaults.message, /consumo 12 L\/h/);
  assert.match(defaults.message, /Reposición calculada: 16 L/);
  assert.match(defaults.message, /confirmar volumen de compra/);
});

test('cotización: parámetros ajenos, repetidos o inválidos no completan datos arbitrarios', () => {
  assert.equal(quoteDefaults({ servicio: 'parafina' }).fuel, 'Parafina (kerosene)');
  for (const servicio of ['__proto__', 'constructor', '<script>', ['generador', 'diesel']]) {
    assert.deepEqual(quoteDefaults({ servicio }), { service: '', fuel: '', installation: '', message: '' });
  }
  const input = { servicio: 'generador', consumption: '12', hours: '8', available: '100', reserve: '20' };
  for (const patch of [{ consumption: 'Infinity' }, { hours: '-1' }, { reserve: ['20', '30'] }, { available: '' }, { consumption: '0' }, { hours: '8761' }]) {
    assert.equal(quoteDefaults({ ...input, ...patch }).message, '');
  }
  assert.equal(quoteDefaults({ servicio: 'generador', mensaje: 'contenido arbitrario' }).message, '');
});
