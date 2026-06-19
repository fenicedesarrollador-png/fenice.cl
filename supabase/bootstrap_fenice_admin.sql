-- Bootstrap de usuario admin para FENICE
-- Email: fenice@fenice.cl
-- Password temporal: Fenice2026!
--
-- OJO: en Supabase hosted, desde el 21 de abril de 2025 se restringieron
-- ciertas escrituras SQL sobre el esquema auth. Si este script falla por
-- permisos/restricciones, usa scripts/bootstrap-fenice-admin.mjs.
--
-- Este proyecto requiere:
-- 1) usuario en auth.users/auth.identities para signInWithPassword
-- 2) perfil activo en public.admin_profiles para entrar a /admin
--
-- Si tu entorno local de Supabase no tiene gen_random_uuid en el search_path,
-- cambia gen_random_uuid() por extensions.gen_random_uuid().

begin;

with existing_user as (
  select u.id, u.email
  from auth.users u
  where u.email = 'fenice@fenice.cl'
  limit 1
),
new_user as (
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  select
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'fenice@fenice.cl',
    crypt('Fenice2026!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"nombre":"Fenice"}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  where not exists (select 1 from existing_user)
  returning id, email
),
existing_or_new_user as (
  select id, email from new_user
  union all
  select id, email
  from existing_user
),
new_identity as (
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  select
    gen_random_uuid(),
    u.id,
    jsonb_build_object(
      'sub', u.id::text,
      'email', u.email
    ),
    'email',
    u.id::text,
    now(),
    now(),
    now()
  from existing_or_new_user u
  where not exists (
    select 1
    from auth.identities i
    where i.user_id = u.id
      and i.provider = 'email'
  )
)
insert into admin_profiles (user_id, nombre, rol, activo)
select
  u.id,
  'Fenice',
  'superadmin',
  true
from existing_or_new_user u
where not exists (
  select 1
  from admin_profiles ap
  where ap.user_id = u.id
);

commit;

-- Verificación rápida:
-- select u.id, u.email, ap.nombre, ap.rol, ap.activo
-- from auth.users u
-- left join admin_profiles ap on ap.user_id = u.id
-- where u.email = 'fenice@fenice.cl';
