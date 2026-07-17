-- ============================================================================
-- Migration: Potenciación comercial FENICE (julio 2026)
-- Ejecutar en el SQL Editor de Supabase.
--
-- 1. Actualiza los datos corporativos oficiales en configuracion_sitio
--    (razón social, RUT, dirección comercial, correos del brief).
-- 2. Agrega campos nuevos a la tabla cotizaciones para el formulario
--    potenciado (dirección exacta, tipo de combustible, litros, fecha
--    estimada y tipo de instalación/equipo a abastecer).
-- ============================================================================

-- ── 1. Datos corporativos oficiales ─────────────────────────────────────────

insert into configuracion_sitio (clave, valor, descripcion) values
  ('razon_social',   'Sociedad de Transportes y Diesel SpA',                'Razón social oficial'),
  ('rut',            '76.710.961-K',                                        'RUT de la empresa'),
  ('email',          'notifica@fenice.cl',                                  'Correo general y comercial'),
  ('email_finanzas', 'finanzas@fenice.cl',                                  'Correo de finanzas (pagos, facturación)'),
  ('direccion',      'Calle La Granja 8396, San Ramón, Región Metropolitana', 'Dirección comercial'),
  ('fundacion',      '2010',                                                'Año de inicio de actividades')
on conflict (clave) do update
  set valor = excluded.valor,
      descripcion = excluded.descripcion;

-- ── 2. Campos nuevos del formulario de cotización ───────────────────────────
-- Todos opcionales (nullable) para no romper cotizaciones existentes.

alter table cotizaciones add column if not exists tipo_combustible text;      -- 'Petróleo diésel' | 'Kerosene'
alter table cotizaciones add column if not exists direccion_entrega text;     -- Dirección exacta del despacho
alter table cotizaciones add column if not exists fecha_estimada date;        -- Fecha estimada de entrega
alter table cotizaciones add column if not exists tipo_instalacion text;      -- Equipo/instalación a abastecer

-- ============================================================================
-- Verificación (opcional): ejecutar después para confirmar.
--   select clave, valor from configuracion_sitio order by clave;
--   select column_name from information_schema.columns
--     where table_name = 'cotizaciones' order by ordinal_position;
-- ============================================================================
