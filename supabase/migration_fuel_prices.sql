-- Migration: fuel_prices table
-- Run in Supabase SQL Editor

create table if not exists fuel_prices (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,           -- diesel | kerosene | gas_residencial
  name          text not null,
  price         numeric,                        -- null = sin disponibilidad
  unit          text not null default '$/L',
  accent_color  text not null default '#f5a623',
  is_available  boolean not null default true,
  is_visible    boolean not null default true,
  display_order integer not null default 0,
  note          text,
  updated_by    text,
  updated_at    timestamptz not null default now()
);

-- Registros iniciales
insert into fuel_prices (code, name, price, unit, accent_color, is_available, is_visible, display_order, note)
values
  ('diesel',          'Diésel',                    null, '$/L',  '#f5a623', true, true, 1, 'Precio sujeto a zona de despacho'),
  ('kerosene',        'Kerosene',                  null, '$/L',  '#ea8c00', true, true, 2, 'Precio sujeto a zona de despacho'),
  ('gas_residencial', 'Gas Envasado Residencial',  null, '$/kg', '#1a6b3c', true, true, 3, null)
on conflict (code) do nothing;

-- RLS
alter table fuel_prices enable row level security;

-- Lectura pública solo registros visibles
create policy "lectura_publica_fuel_prices" on fuel_prices
  for select using (is_visible = true);

-- Admin gestiona todo
create policy "admin_gestiona_fuel_prices" on fuel_prices
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Trigger updated_at automático
create or replace trigger fuel_prices_updated_at
  before update on fuel_prices
  for each row execute function update_updated_at_column();
