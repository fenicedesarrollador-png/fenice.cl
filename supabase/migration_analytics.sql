-- =============================================================
-- MIGRACIÓN: analytics / métricas internas Fenice
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- =============================================================

create extension if not exists pgcrypto;

-- =============================================================
-- HELPERS DE AUTORIZACIÓN
-- =============================================================

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles ap
    where ap.user_id = auth.uid()
      and coalesce(ap.activo, true) = true
  );
$$;

-- =============================================================
-- TABLAS ANALYTICS
-- =============================================================

create table if not exists public.analytics_sessions (
  id uuid primary key,
  visitor_id uuid not null,
  started_at timestamptz not null,
  last_seen_at timestamptz not null,
  landing_path text not null,
  last_path text,
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  referrer_host text,
  device_type text default 'unknown',
  browser_name text,
  os_name text,
  language text,
  screen_group text,
  country_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.analytics_sessions(id) on delete cascade,
  visitor_id uuid not null,
  event_type text not null check (
    event_type in (
      'page_view',
      'section_view',
      'scroll_depth',
      'click',
      'form_start',
      'form_submit_success',
      'form_submit_error',
      'quote_started',
      'quote_submitted',
      'checkout_started',
      'purchase_completed',
      'whatsapp_click',
      'phone_click',
      'email_click'
    )
  ),
  occurred_at timestamptz not null,
  path text not null,
  page_title text,
  section_id text,
  element_id text,
  element_label text,
  form_name text,
  scroll_depth smallint check (scroll_depth in (25, 50, 75, 100)),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_identity_links (
  id uuid primary key default gen_random_uuid(),
  visitor_id uuid not null,
  session_id uuid references public.analytics_sessions(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.clientes(id) on delete set null,
  cotizacion_id uuid references public.cotizaciones(id) on delete set null,
  identified_at timestamptz not null default now(),
  source_event_id uuid references public.analytics_events(id) on delete set null
);

create table if not exists public.analytics_ingest_guards (
  actor_hash text not null,
  bucket_minute timestamptz not null,
  hits integer not null default 1,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (actor_hash, bucket_minute)
);

-- =============================================================
-- ÍNDICES
-- =============================================================

create index if not exists idx_analytics_events_occurred_at on public.analytics_events(occurred_at desc);
create index if not exists idx_analytics_events_path on public.analytics_events(path);
create index if not exists idx_analytics_events_event_type on public.analytics_events(event_type);
create index if not exists idx_analytics_events_session_id on public.analytics_events(session_id);
create index if not exists idx_analytics_events_visitor_id on public.analytics_events(visitor_id);
create index if not exists idx_analytics_sessions_started_at on public.analytics_sessions(started_at desc);
create index if not exists idx_analytics_sessions_source on public.analytics_sessions(source);
create index if not exists idx_analytics_sessions_visitor_id on public.analytics_sessions(visitor_id);
create index if not exists idx_analytics_identity_links_visitor_id on public.analytics_identity_links(visitor_id);
create index if not exists idx_analytics_identity_links_session_id on public.analytics_identity_links(session_id);
create index if not exists idx_analytics_identity_links_lead_id on public.analytics_identity_links(lead_id);
create index if not exists idx_analytics_identity_links_cotizacion_id on public.analytics_identity_links(cotizacion_id);
create index if not exists idx_analytics_ingest_guards_bucket on public.analytics_ingest_guards(bucket_minute desc);

-- =============================================================
-- RLS
-- =============================================================

alter table public.analytics_sessions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.analytics_identity_links enable row level security;
alter table public.analytics_ingest_guards enable row level security;

drop policy if exists "analytics_sessions_admin_read" on public.analytics_sessions;
create policy "analytics_sessions_admin_read"
  on public.analytics_sessions
  for select
  to authenticated
  using (public.is_active_admin());

drop policy if exists "analytics_events_admin_read" on public.analytics_events;
create policy "analytics_events_admin_read"
  on public.analytics_events
  for select
  to authenticated
  using (public.is_active_admin());

drop policy if exists "analytics_identity_links_admin_read" on public.analytics_identity_links;
create policy "analytics_identity_links_admin_read"
  on public.analytics_identity_links
  for select
  to authenticated
  using (public.is_active_admin());

-- No se crean políticas de insert/update/delete:
-- service_role bypassa RLS para la Edge Function y API routes seguras.

revoke all on public.analytics_sessions from anon, authenticated;
revoke all on public.analytics_events from anon, authenticated;
revoke all on public.analytics_identity_links from anon, authenticated;
revoke all on public.analytics_ingest_guards from anon, authenticated;

grant select on public.analytics_sessions to authenticated;
grant select on public.analytics_events to authenticated;
grant select on public.analytics_identity_links to authenticated;

-- =============================================================
-- HELPERS DE FILTRO
-- =============================================================

create or replace function public.analytics_filtered_sessions(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  id uuid,
  visitor_id uuid,
  started_at timestamptz,
  last_seen_at timestamptz,
  landing_path text,
  last_path text,
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  referrer_host text,
  device_type text,
  browser_name text,
  os_name text,
  language text,
  screen_group text,
  country_code text,
  identified boolean
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
  with session_base as (
    select
      s.id,
      s.visitor_id,
      s.started_at,
      s.last_seen_at,
      s.landing_path,
      s.last_path,
      s.source,
      s.medium,
      s.campaign,
      s.content,
      s.term,
      s.referrer_host,
      s.device_type,
      s.browser_name,
      s.os_name,
      s.language,
      s.screen_group,
      s.country_code,
      exists (
        select 1
        from public.analytics_identity_links ail
        where ail.session_id = s.id
           or ail.visitor_id = s.visitor_id
      ) as identified
    from public.analytics_sessions s
    where (p_date_from is null or s.started_at >= p_date_from)
      and (p_date_to is null or s.started_at < p_date_to)
      and (p_source is null or p_source = '' or coalesce(s.source, '') = p_source)
      and (p_medium is null or p_medium = '' or coalesce(s.medium, '') = p_medium)
      and (p_campaign is null or p_campaign = '' or coalesce(s.campaign, '') = p_campaign)
      and (p_device_type is null or p_device_type = '' or coalesce(s.device_type, 'unknown') = p_device_type)
      and (
        p_path is null
        or p_path = ''
        or s.landing_path = p_path
        or s.last_path = p_path
        or exists (
          select 1
          from public.analytics_events e
          where e.session_id = s.id
            and e.path = p_path
        )
      )
  )
  select *
  from session_base sb
  where coalesce(p_identity_state, 'all') = 'all'
     or (p_identity_state = 'identified' and sb.identified = true)
     or (p_identity_state = 'anonymous' and sb.identified = false);
end;
$$;

create or replace function public.analytics_get_filter_options()
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

  select jsonb_build_object(
    'sources',
    coalesce(
      (
        select jsonb_agg(value order by value)
        from (
          select distinct source as value
          from public.analytics_sessions
          where source is not null and source <> ''
        ) src
      ),
      '[]'::jsonb
    ),
    'mediums',
    coalesce(
      (
        select jsonb_agg(value order by value)
        from (
          select distinct medium as value
          from public.analytics_sessions
          where medium is not null and medium <> ''
        ) med
      ),
      '[]'::jsonb
    ),
    'campaigns',
    coalesce(
      (
        select jsonb_agg(value order by value)
        from (
          select distinct campaign as value
          from public.analytics_sessions
          where campaign is not null and campaign <> ''
        ) cmp
      ),
      '[]'::jsonb
    ),
    'paths',
    coalesce(
      (
        select jsonb_agg(value order by value)
        from (
          select distinct path as value
          from public.analytics_events
          where path is not null and path <> ''
        ) pth
      ),
      '[]'::jsonb
    ),
    'devices',
    coalesce(
      (
        select jsonb_agg(value order by value)
        from (
          select distinct device_type as value
          from public.analytics_sessions
          where device_type is not null and device_type <> ''
        ) dev
      ),
      '[]'::jsonb
    )
  ) into v_result;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

create or replace function public.analytics_get_overview(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
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

  with filtered_sessions as (
    select *
    from public.analytics_filtered_sessions(
      p_date_from, p_date_to, p_source, p_medium, p_campaign, p_path, p_device_type, p_identity_state
    )
  ),
  filtered_events as (
    select e.*
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
  ),
  counts as (
    select
      (select count(distinct visitor_id) from filtered_sessions) as unique_visitors,
      (select count(*) from filtered_sessions) as sessions,
      (select count(*) from filtered_events where event_type = 'page_view') as page_views,
      (select count(*) from filtered_events where event_type in ('click', 'whatsapp_click', 'phone_click', 'email_click')) as cta_clicks,
      (select count(*) from filtered_events where event_type = 'form_start') as form_starts,
      (select count(*) from filtered_events where event_type = 'form_submit_success') as form_successes,
      (select count(*) from filtered_events where event_type = 'quote_submitted') as quote_submissions,
      (select round(avg(extract(epoch from (last_seen_at - started_at)))::numeric, 2) from filtered_sessions) as avg_duration
  )
  select jsonb_build_object(
    'unique_visitors', coalesce(unique_visitors, 0),
    'sessions', coalesce(sessions, 0),
    'page_views', coalesce(page_views, 0),
    'pages_per_session', coalesce(round((page_views::numeric / nullif(sessions, 0)), 2), 0),
    'avg_session_duration_seconds', coalesce(avg_duration, 0),
    'cta_clicks', coalesce(cta_clicks, 0),
    'form_starts', coalesce(form_starts, 0),
    'form_submit_success', coalesce(form_successes, 0),
    'quote_submissions', coalesce(quote_submissions, 0),
    'purchase_integrated', false,
    'purchase_completed', null,
    'anonymous_sessions', coalesce((select count(*) from filtered_sessions where identified = false), 0),
    'identified_sessions', coalesce((select count(*) from filtered_sessions where identified = true), 0),
    'conversion_rate', coalesce(
      round((((coalesce(form_successes, 0) + coalesce(quote_submissions, 0))::numeric) / nullif(sessions, 0)) * 100, 2),
      0
    )
  ) into v_result
  from counts;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

create or replace function public.analytics_get_traffic_timeseries(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  bucket_date date,
  visitors bigint,
  sessions bigint,
  page_views bigint
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
  series as (
    select generate_series(
      coalesce(date_trunc('day', p_date_from), (select coalesce(date_trunc('day', min(started_at)), date_trunc('day', now())) from filtered_sessions)),
      coalesce(date_trunc('day', p_date_to - interval '1 day'), date_trunc('day', now())),
      interval '1 day'
    )::date as bucket_date
  ),
  session_counts as (
    select
      date_trunc('day', started_at)::date as bucket_date,
      count(*) as sessions,
      count(distinct visitor_id) as visitors
    from filtered_sessions
    group by 1
  ),
  page_counts as (
    select
      date_trunc('day', e.occurred_at)::date as bucket_date,
      count(*) as page_views
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type = 'page_view'
    group by 1
  )
  select
    series.bucket_date,
    coalesce(sc.visitors, 0)::bigint as visitors,
    coalesce(sc.sessions, 0)::bigint as sessions,
    coalesce(pc.page_views, 0)::bigint as page_views
  from series
  left join session_counts sc on sc.bucket_date = series.bucket_date
  left join page_counts pc on pc.bucket_date = series.bucket_date
  order by series.bucket_date;
end;
$$;

create or replace function public.analytics_get_sources(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  source text,
  sessions bigint,
  visitors bigint,
  conversions bigint,
  conversion_rate numeric
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
  converted_sessions as (
    select distinct e.session_id
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type in ('form_submit_success', 'quote_submitted', 'purchase_completed')
  )
  select
    coalesce(fs.source, 'direct') as source,
    count(*)::bigint as sessions,
    count(distinct fs.visitor_id)::bigint as visitors,
    count(cs.session_id)::bigint as conversions,
    coalesce(round((count(cs.session_id)::numeric / nullif(count(*), 0)) * 100, 2), 0) as conversion_rate
  from filtered_sessions fs
  left join converted_sessions cs on cs.session_id = fs.id
  group by coalesce(fs.source, 'direct')
  order by sessions desc, source asc;
end;
$$;

create or replace function public.analytics_get_pages(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  path text,
  page_title text,
  views bigint,
  visitors bigint,
  avg_time_seconds numeric,
  exits bigint,
  conversion_rate numeric
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
  pageviews as (
    select
      e.id,
      e.session_id,
      e.visitor_id,
      e.path,
      coalesce(nullif(e.page_title, ''), 'Sin título') as page_title,
      e.occurred_at,
      lead(e.occurred_at) over (partition by e.session_id order by e.occurred_at) as next_page_at,
      row_number() over (partition by e.session_id order by e.occurred_at desc) as reverse_rank,
      exists (
        select 1
        from public.analytics_events ce
        where ce.session_id = e.session_id
          and ce.event_type in ('form_submit_success', 'quote_submitted', 'purchase_completed')
      ) as session_converted
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type = 'page_view'
  ),
  page_metrics as (
    select
      pv.path,
      min(pv.page_title) as page_title,
      count(*)::bigint as views,
      count(distinct pv.visitor_id)::bigint as visitors,
      round(avg(
        least(
          extract(epoch from (coalesce(pv.next_page_at, fs.last_seen_at) - pv.occurred_at)),
          1800
        )
      )::numeric, 2) as avg_time_seconds,
      count(*) filter (where pv.reverse_rank = 1)::bigint as exits,
      round(
        (count(distinct case when pv.session_converted then pv.session_id end)::numeric / nullif(count(distinct pv.session_id), 0)) * 100,
        2
      ) as conversion_rate
    from pageviews pv
    join filtered_sessions fs on fs.id = pv.session_id
    group by pv.path
  )
  select *
  from page_metrics
  order by views desc, path asc;
end;
$$;

create or replace function public.analytics_get_sections(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  path text,
  section_id text,
  views bigint,
  page_visit_sessions bigint,
  page_percentage numeric
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
  page_counts as (
    select
      e.path,
      count(distinct e.session_id)::bigint as page_visit_sessions
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type = 'page_view'
    group by e.path
  ),
  section_counts as (
    select
      e.path,
      e.section_id,
      count(*)::bigint as views
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type = 'section_view'
      and e.section_id is not null
    group by e.path, e.section_id
  )
  select
    sc.path,
    sc.section_id,
    sc.views,
    coalesce(pc.page_visit_sessions, 0) as page_visit_sessions,
    round((sc.views::numeric / nullif(pc.page_visit_sessions, 0)) * 100, 2) as page_percentage
  from section_counts sc
  left join page_counts pc on pc.path = sc.path
  order by sc.views desc, sc.path asc, sc.section_id asc;
end;
$$;

create or replace function public.analytics_get_ctas(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  element_id text,
  element_label text,
  path text,
  clicks bigint,
  click_percentage numeric,
  conversion_rate numeric
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
  click_events as (
    select
      e.id,
      e.session_id,
      e.path,
      coalesce(e.element_id, 'sin_id') as element_id,
      coalesce(e.element_label, 'Sin etiqueta') as element_label,
      e.occurred_at
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type in ('click', 'whatsapp_click', 'phone_click', 'email_click')
  ),
  total_clicks as (
    select count(*)::numeric as total_clicks from click_events
  ),
  click_conversions as (
    select
      ce.id as click_id,
      exists (
        select 1
        from public.analytics_events conv
        where conv.session_id = ce.session_id
          and conv.occurred_at >= ce.occurred_at
          and conv.event_type in ('form_submit_success', 'quote_submitted', 'purchase_completed')
      ) as converted
    from click_events ce
  )
  select
    ce.element_id,
    ce.element_label,
    ce.path,
    count(*)::bigint as clicks,
    round((count(*)::numeric / nullif((select total_clicks from total_clicks), 0)) * 100, 2) as click_percentage,
    round((count(*) filter (where cc.converted)::numeric / nullif(count(*), 0)) * 100, 2) as conversion_rate
  from click_events ce
  join click_conversions cc on cc.click_id = ce.id
  group by ce.element_id, ce.element_label, ce.path
  order by clicks desc, ce.element_id asc;
end;
$$;

create or replace function public.analytics_get_scroll_depth(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  path text,
  depth_25 bigint,
  depth_50 bigint,
  depth_75 bigint,
  depth_100 bigint
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
  scrolls as (
    select distinct e.session_id, e.path, e.scroll_depth
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    where e.event_type = 'scroll_depth'
  )
  select
    sc.path,
    count(*) filter (where sc.scroll_depth = 25)::bigint as depth_25,
    count(*) filter (where sc.scroll_depth = 50)::bigint as depth_50,
    count(*) filter (where sc.scroll_depth = 75)::bigint as depth_75,
    count(*) filter (where sc.scroll_depth = 100)::bigint as depth_100
  from scrolls sc
  group by sc.path
  order by depth_100 desc, sc.path asc;
end;
$$;

create or replace function public.analytics_get_funnel(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
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

  with filtered_sessions as (
    select *
    from public.analytics_filtered_sessions(
      p_date_from, p_date_to, p_source, p_medium, p_campaign, p_path, p_device_type, p_identity_state
    )
  ),
  filtered_events as (
    select e.*
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
  )
  select jsonb_build_object(
    'purchase_integrated', false,
    'stages', jsonb_build_array(
      jsonb_build_object('key', 'visits', 'label', 'Visitas', 'count', coalesce((select count(*) from filtered_sessions), 0)),
      jsonb_build_object('key', 'quote_page', 'label', 'Vista de cotización', 'count', coalesce((select count(distinct session_id) from filtered_events where event_type = 'page_view' and path = '/cotizacion'), 0)),
      jsonb_build_object('key', 'form_start', 'label', 'Inicio de formulario', 'count', coalesce((select count(distinct session_id) from filtered_events where event_type = 'form_start'), 0)),
      jsonb_build_object('key', 'form_submit_success', 'label', 'Envío exitoso', 'count', coalesce((select count(distinct session_id) from filtered_events where event_type = 'form_submit_success'), 0)),
      jsonb_build_object('key', 'quote_submitted', 'label', 'Cotización creada', 'count', coalesce((select count(distinct session_id) from filtered_events where event_type = 'quote_submitted'), 0))
    )
  ) into v_result;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

create or replace function public.analytics_get_devices(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
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

  with filtered_sessions as (
    select *
    from public.analytics_filtered_sessions(
      p_date_from, p_date_to, p_source, p_medium, p_campaign, p_path, p_device_type, p_identity_state
    )
  )
  select jsonb_build_object(
    'devices',
    coalesce(
      (
        select jsonb_agg(row_to_json(dev) order by dev.sessions desc, dev.device_type asc)
        from (
          select
            coalesce(device_type, 'unknown') as device_type,
            count(*)::bigint as sessions,
            count(distinct visitor_id)::bigint as visitors
          from filtered_sessions
          group by 1
        ) dev
      ),
      '[]'::jsonb
    ),
    'browsers',
    coalesce(
      (
        select jsonb_agg(row_to_json(brw) order by brw.sessions desc, brw.browser_name asc)
        from (
          select
            coalesce(browser_name, 'Desconocido') as browser_name,
            count(*)::bigint as sessions
          from filtered_sessions
          group by 1
        ) brw
      ),
      '[]'::jsonb
    ),
    'operating_systems',
    coalesce(
      (
        select jsonb_agg(row_to_json(osq) order by osq.sessions desc, osq.os_name asc)
        from (
          select
            coalesce(os_name, 'Desconocido') as os_name,
            count(*)::bigint as sessions
          from filtered_sessions
          group by 1
        ) osq
      ),
      '[]'::jsonb
    )
  ) into v_result;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

create or replace function public.analytics_get_campaigns(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  campaign text,
  source text,
  medium text,
  sessions bigint,
  leads bigint,
  conversions bigint
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
  session_conversions as (
    select
      e.session_id,
      bool_or(e.event_type in ('form_submit_success', 'quote_submitted')) as is_lead,
      bool_or(e.event_type in ('form_submit_success', 'quote_submitted', 'purchase_completed')) as is_conversion
    from public.analytics_events e
    join filtered_sessions s on s.id = e.session_id
    group by e.session_id
  )
  select
    coalesce(fs.campaign, 'Sin campaña') as campaign,
    coalesce(fs.source, 'direct') as source,
    coalesce(fs.medium, 'none') as medium,
    count(*)::bigint as sessions,
    count(*) filter (where sc.is_lead)::bigint as leads,
    count(*) filter (where sc.is_conversion)::bigint as conversions
  from filtered_sessions fs
  left join session_conversions sc on sc.session_id = fs.id
  group by coalesce(fs.campaign, 'Sin campaña'), coalesce(fs.source, 'direct'), coalesce(fs.medium, 'none')
  order by sessions desc, campaign asc;
end;
$$;

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
      count(*) over()::bigint as total_count
    from filtered_sessions s
    left join session_counts sc on sc.session_id = s.id
    order by s.started_at desc
    limit greatest(p_page_size, 1)
    offset greatest((p_page - 1) * p_page_size, 0)
  )
  select *
  from rows;
end;
$$;

create or replace function public.analytics_export_sessions(
  p_date_from timestamptz default null,
  p_date_to timestamptz default null,
  p_source text default null,
  p_medium text default null,
  p_campaign text default null,
  p_path text default null,
  p_device_type text default null,
  p_identity_state text default 'all'
)
returns table (
  session_id uuid,
  started_at timestamptz,
  last_seen_at timestamptz,
  visitor_label text,
  identity_state text,
  source text,
  medium text,
  campaign text,
  landing_path text,
  last_path text,
  page_count bigint,
  event_count bigint,
  duration_seconds numeric,
  conversion text,
  lead_id uuid,
  cotizacion_id uuid,
  client_id uuid
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
  session_links as (
    select
      s.id as session_id,
      (array_remove(array_agg(distinct ail.lead_id), null))[1] as lead_id,
      (array_remove(array_agg(distinct ail.cotizacion_id), null))[1] as cotizacion_id,
      (array_remove(array_agg(distinct ail.client_id), null))[1] as client_id
    from filtered_sessions s
    left join public.analytics_identity_links ail
      on ail.session_id = s.id
      or ail.visitor_id = s.visitor_id
    group by s.id
  )
  select
    s.id as session_id,
    s.started_at,
    s.last_seen_at,
    'Visitante ' || upper(substr(replace(s.visitor_id::text, '-', ''), 1, 6)) as visitor_label,
    case when s.identified then 'Identificado' else 'Anónimo' end as identity_state,
    coalesce(s.source, 'direct') as source,
    coalesce(s.medium, 'none') as medium,
    coalesce(s.campaign, '') as campaign,
    s.landing_path,
    s.last_path,
    coalesce(sc.page_count, 0) as page_count,
    coalesce(sc.event_count, 0) as event_count,
    round(extract(epoch from (s.last_seen_at - s.started_at))::numeric, 2) as duration_seconds,
    sc.conversion,
    sl.lead_id,
    sl.cotizacion_id,
    sl.client_id
  from filtered_sessions s
  left join session_counts sc on sc.session_id = s.id
  left join session_links sl on sl.session_id = s.id
  order by s.started_at desc;
end;
$$;

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
  pages as (
    select jsonb_agg(
      jsonb_build_object(
        'path', e.path,
        'page_title', e.page_title,
        'occurred_at', e.occurred_at
      )
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id
      and e.event_type = 'page_view'
  ),
  sections as (
    select jsonb_agg(
      jsonb_build_object(
        'path', e.path,
        'section_id', e.section_id,
        'occurred_at', e.occurred_at
      )
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id
      and e.event_type = 'section_view'
  ),
  clicks as (
    select jsonb_agg(
      jsonb_build_object(
        'path', e.path,
        'element_id', e.element_id,
        'element_label', e.element_label,
        'event_type', e.event_type,
        'occurred_at', e.occurred_at
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
        'event_type', e.event_type,
        'form_name', e.form_name,
        'occurred_at', e.occurred_at,
        'metadata', e.metadata
      )
      order by e.occurred_at
    ) as value
    from public.analytics_events e
    where e.session_id = p_session_id
      and e.event_type in ('form_start', 'form_submit_success', 'form_submit_error', 'quote_started', 'quote_submitted')
  ),
  scrolls as (
    select jsonb_agg(
      jsonb_build_object(
        'path', path,
        'max_scroll_depth', max(scroll_depth)
      )
      order by path
    ) as value
    from (
      select e.path, max(e.scroll_depth) as scroll_depth
      from public.analytics_events e
      where e.session_id = p_session_id
        and e.event_type = 'scroll_depth'
      group by e.path
    ) q
  ),
  identities as (
    select jsonb_agg(
      jsonb_build_object(
        'lead_id', ail.lead_id,
        'client_id', ail.client_id,
        'cotizacion_id', ail.cotizacion_id,
        'identified_at', ail.identified_at
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
        'duration_seconds', round(extract(epoch from (s.last_seen_at - s.started_at))::numeric, 2)
      )
      from session_row s
    ),
    'pages', coalesce((select value from pages), '[]'::jsonb),
    'sections', coalesce((select value from sections), '[]'::jsonb),
    'clicks', coalesce((select value from clicks), '[]'::jsonb),
    'forms', coalesce((select value from forms), '[]'::jsonb),
    'scrolls', coalesce((select value from scrolls), '[]'::jsonb),
    'identity_links', coalesce((select value from identities), '[]'::jsonb)
  ) into v_result;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;
