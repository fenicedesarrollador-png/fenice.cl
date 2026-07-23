-- =============================================================
-- MIGRACIÓN: analytics v2 — contacto identificado en sesiones
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- Requiere haber corrido antes migration_analytics.sql.
-- =============================================================
--
-- Qué hace:
--   1) Recrea analytics_get_recent_sessions agregando el CONTACTO real
--      (nombre, email, teléfono) cuando el visitante llegó a enviar una
--      cotización o un formulario de contacto (se vincula vía
--      analytics_identity_links). Los visitantes 100% anónimos no tienen
--      email —es imposible obtenerlo si nunca dejaron sus datos—.
--   2) Recrea analytics_get_session_detail (esto arregla el 404 de
--      "Ver sesión" si la función no se había creado) añadiendo el mismo
--      bloque de contacto.
-- =============================================================

-- ── 1) SESIONES RECIENTES CON CONTACTO ───────────────────────
-- El tipo de retorno cambia (columnas nuevas), así que hay que DROP + CREATE.
drop function if exists public.analytics_get_recent_sessions(
  timestamptz, timestamptz, text, text, text, text, text, text, integer, integer
);

create or replace function public.analytics_get_recent_sessions(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all',
  p_page integer default 1,
  p_page_size integer default 20
)
returns table (
  session_id uuid,
  started_at timestamptz,
  visitor_label text,
  identity_state text,
  source text,
  landing_path text,
  last_path text,
  page_count bigint,
  event_count bigint,
  duration_seconds numeric,
  conversion text,
  contact_name text,
  contact_email text,
  contact_phone text,
  contact_type text,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_active_admin() then
    raise exception 'forbidden';
  end if;

  return query
  with filtered_sessions as (
    select *
    from public.analytics_filtered_sessions(
      p_date_from, p_date_to, p_source, p_medium, p_campaign, p_path, p_device_type, p_identity_state
    )
  ),
  session_counts as (
    select
      s.id as session_id,
      count(*) filter (where e.event_type = 'page_view')::bigint as page_count,
      count(e.id)::bigint as event_count,
      case
        when bool_or(e.event_type = 'purchase_completed') then 'Compra confirmada'
        when bool_or(e.event_type = 'quote_submitted') then 'Cotización creada'
        when bool_or(e.event_type = 'form_submit_success') then 'Formulario enviado'
        when bool_or(e.event_type = 'whatsapp_click') then 'WhatsApp'
        else null
      end as conversion
    from filtered_sessions s
    left join public.analytics_events e on e.session_id = s.id
    group by s.id
  ),
  rows as (
    select
      s.id as session_id,
      s.started_at,
      'Visitante ' || upper(substr(replace(s.visitor_id::text, '-', ''), 1, 6)) as visitor_label,
      case when s.identified then 'Identificado' else 'Anónimo' end as identity_state,
      coalesce(s.source, 'direct') as source,
      s.landing_path,
      s.last_path,
      coalesce(sc.page_count, 0) as page_count,
      coalesce(sc.event_count, 0) as event_count,
      round(extract(epoch from (s.last_seen_at - s.started_at))::numeric, 2) as duration_seconds,
      sc.conversion,
      ct.contact_name,
      ct.contact_email,
      ct.contact_phone,
      ct.contact_type,
      count(*) over()::bigint as total_count
    from filtered_sessions s
    left join session_counts sc on sc.session_id = s.id
    left join lateral (
      select
        coalesce(c.nombre, l.nombre, cl.nombre) as contact_name,
        coalesce(c.email, l.email) as contact_email,
        coalesce(c.telefono, l.telefono) as contact_phone,
        case
          when ail.cotizacion_id is not null then 'cotizacion'
          when ail.lead_id is not null then 'lead'
          when ail.client_id is not null then 'cliente'
          else null
        end as contact_type
      from public.analytics_identity_links ail
      left join public.cotizaciones c on c.id = ail.cotizacion_id
      left join public.leads l on l.id = ail.lead_id
      left join public.clientes cl on cl.id = ail.client_id
      where (ail.session_id = s.id or ail.visitor_id = s.visitor_id)
        and (ail.cotizacion_id is not null or ail.lead_id is not null or ail.client_id is not null)
      order by ail.identified_at desc
      limit 1
    ) ct on true
    order by s.started_at desc
    limit greatest(p_page_size, 1)
    offset greatest((p_page - 1) * p_page_size, 0)
  )
  select *
  from rows;
end;
$$;

-- ── 2) DETALLE DE SESIÓN CON CONTACTO (arregla el 404) ────────
create or replace function public.analytics_get_session_detail(
  p_session_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  if not public.is_active_admin() then
    raise exception 'forbidden';
  end if;

  with session_row as (
    select
      s.*,
      ('Visitante ' || upper(substr(replace(s.visitor_id::text, '-', ''), 1, 6))) as visitor_label,
      exists (
        select 1
        from public.analytics_identity_links ail
        where ail.session_id = s.id
           or ail.visitor_id = s.visitor_id
      ) as identified
    from public.analytics_sessions s
    where s.id = p_session_id
  ),
  contact as (
    select
      coalesce(c.nombre, l.nombre, cl.nombre) as name,
      coalesce(c.email, l.email) as email,
      coalesce(c.telefono, l.telefono) as phone,
      coalesce(c.empresa, cl.nombre) as company,
      case
        when ail.cotizacion_id is not null then 'cotizacion'
        when ail.lead_id is not null then 'lead'
        when ail.client_id is not null then 'cliente'
        else null
      end as type
    from public.analytics_identity_links ail
    left join public.cotizaciones c on c.id = ail.cotizacion_id
    left join public.leads l on l.id = ail.lead_id
    left join public.clientes cl on cl.id = ail.client_id
    where (ail.session_id = p_session_id
           or ail.visitor_id = (select visitor_id from session_row limit 1))
      and (ail.cotizacion_id is not null or ail.lead_id is not null or ail.client_id is not null)
    order by ail.identified_at desc
    limit 1
  ),
  pages as (
    select jsonb_agg(
      jsonb_build_object('path', e.path, 'page_title', e.page_title, 'occurred_at', e.occurred_at)
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id and e.event_type = 'page_view'
  ),
  sections as (
    select jsonb_agg(
      jsonb_build_object('path', e.path, 'section_id', e.section_id, 'occurred_at', e.occurred_at)
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id and e.event_type = 'section_view'
  ),
  clicks as (
    select jsonb_agg(
      jsonb_build_object(
        'path', e.path, 'element_id', e.element_id, 'element_label', e.element_label,
        'event_type', e.event_type, 'occurred_at', e.occurred_at
      )
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id
      and e.event_type in ('click', 'whatsapp_click', 'phone_click', 'email_click')
  ),
  forms as (
    select jsonb_agg(
      jsonb_build_object(
        'event_type', e.event_type, 'form_name', e.form_name,
        'occurred_at', e.occurred_at, 'metadata', e.metadata
      )
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id
      and e.event_type in ('form_start', 'form_submit_success', 'form_submit_error', 'quote_started', 'quote_submitted')
  ),
  scrolls as (
    select jsonb_agg(
      jsonb_build_object('path', path, 'max_scroll_depth', max_scroll_depth)
      order by path
    ) as value
    from (
      select e.path, max(e.scroll_depth) as max_scroll_depth
      from public.analytics_events e
      where e.session_id = p_session_id and e.event_type = 'scroll_depth'
      group by e.path
    ) q
  ),
  identities as (
    select jsonb_agg(
      jsonb_build_object(
        'lead_id', ail.lead_id, 'client_id', ail.client_id,
        'cotizacion_id', ail.cotizacion_id, 'identified_at', ail.identified_at
      )
      order by ail.identified_at
    ) as value
    from public.analytics_identity_links ail
    where ail.session_id = p_session_id
       or ail.visitor_id = (select visitor_id from session_row limit 1)
  )
  select jsonb_build_object(
    'session',
    (
      select jsonb_build_object(
        'id', s.id,
        'visitor_id', s.visitor_id,
        'visitor_label', s.visitor_label,
        'identified', s.identified,
        'started_at', s.started_at,
        'last_seen_at', s.last_seen_at,
        'source', s.source,
        'medium', s.medium,
        'campaign', s.campaign,
        'referrer_host', s.referrer_host,
        'landing_path', s.landing_path,
        'last_path', s.last_path,
        'device_type', s.device_type,
        'browser_name', s.browser_name,
        'os_name', s.os_name,
        'language', s.language,
        'screen_group', s.screen_group,
        'country_code', s.country_code,
        'duration_seconds', round(extract(epoch from (s.last_seen_at - s.started_at))::numeric, 2),
        'contact', (
          select jsonb_build_object(
            'name', ct.name, 'email', ct.email, 'phone', ct.phone,
            'company', ct.company, 'type', ct.type
          )
          from contact ct
        )
      )
      from session_row s
    ),
    'pages', coalesce((select value from pages), '[]'::jsonb),
    'sections', coalesce((select value from sections), '[]'::jsonb),
    'clicks', coalesce((select value from clicks), '[]'::jsonb),
    'forms', coalesce((select value from forms), '[]'::jsonb),
    'scrolls', coalesce((select value from scrolls), '[]'::jsonb),
    'identity_links', coalesce((select value from identities), '[]'::jsonb)
  )
  into v_result;

  return v_result;
end;
$$;
