-- Migration: add cotizaciones table
-- Run in Supabase SQL Editor if schema.sql was already applied previously

create table if not exists cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text not null,
  rut_empresa text,
  email text not null,
  telefono text not null,
  comuna text,
  servicio_solicitado text not null,
  volumen_estimado text,
  frecuencia text,
  mensaje text,
  estado text default 'nuevo',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table cotizaciones enable row level security;

create policy "cualquiera_crea_cotizacion" on cotizaciones
  for insert with check (true);

create policy "admin_gestiona_cotizaciones" on cotizaciones
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create or replace trigger cotizaciones_updated_at
  before update on cotizaciones
  for each row execute function update_updated_at_column();
