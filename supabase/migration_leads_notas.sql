-- Notas internas para la bandeja de Solicitudes (contactos)
-- Ejecutar una vez en Supabase > SQL Editor > Run.
alter table leads add column if not exists notas text;
