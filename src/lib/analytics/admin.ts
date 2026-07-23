import dayjs from "dayjs";

type SearchParamValue = string | string[] | undefined;

export interface AnalyticsFilters {
  period: string;
  dateFrom: string;
  dateTo: string;
  source: string;
  medium: string;
  campaign: string;
  path: string;
  deviceType: string;
  identityState: "all" | "identified" | "anonymous";
  page: number;
}

export interface AnalyticsDashboardData {
  filters: AnalyticsFilters;
  filterOptions: {
    sources: string[];
    mediums: string[];
    campaigns: string[];
    paths: string[];
    devices: string[];
  };
  overview: Record<string, number | boolean | null>;
  traffic: Array<{ bucket_date: string; visitors: number; sessions: number; page_views: number }>;
  sources: Array<{ source: string; sessions: number; visitors: number; conversions: number; conversion_rate: number }>;
  pages: Array<{ path: string; page_title: string; views: number; visitors: number; avg_time_seconds: number; exits: number; conversion_rate: number }>;
  sections: Array<{ path: string; section_id: string; views: number; page_visit_sessions: number; page_percentage: number }>;
  ctas: Array<{ element_id: string; element_label: string; path: string; clicks: number; click_percentage: number; conversion_rate: number }>;
  scrollDepth: Array<{ path: string; depth_25: number; depth_50: number; depth_75: number; depth_100: number }>;
  funnel: { purchase_integrated: boolean; stages: Array<{ key: string; label: string; count: number }> };
  devices: {
    devices: Array<{ device_type: string; sessions: number; visitors: number }>;
    browsers: Array<{ browser_name: string; sessions: number }>;
    operating_systems: Array<{ os_name: string; sessions: number }>;
  };
  campaigns: Array<{ campaign: string; source: string; medium: string; sessions: number; leads: number; conversions: number }>;
  recentSessions: Array<{
    session_id: string;
    started_at: string;
    visitor_label: string;
    identity_state: string;
    source: string;
    landing_path: string;
    last_path: string;
    page_count: number;
    event_count: number;
    duration_seconds: number;
    conversion: string | null;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    contact_type: string | null;
    total_count: number;
  }>;
  totalSessions: number;
}

function firstValue(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

/**
 * Traduce el código de fuente (utm_source o referrer) a un nombre legible para
 * personas no técnicas: "ig" → "Instagram", "google" → "Google", etc.
 */
const SOURCE_LABELS: Record<string, string> = {
  ig: "Instagram",
  instagram: "Instagram",
  "instagram.com": "Instagram",
  fb: "Facebook",
  facebook: "Facebook",
  "facebook.com": "Facebook",
  "m.facebook.com": "Facebook",
  "l.facebook.com": "Facebook",
  google: "Google",
  "google.com": "Google",
  "google.cl": "Google",
  bing: "Bing",
  wa: "WhatsApp",
  whatsapp: "WhatsApp",
  "whatsapp.com": "WhatsApp",
  "l.instagram.com": "Instagram",
  linkedin: "LinkedIn",
  "linkedin.com": "LinkedIn",
  tiktok: "TikTok",
  "tiktok.com": "TikTok",
  youtube: "YouTube",
  "youtube.com": "YouTube",
  email: "Email",
  mail: "Email",
  newsletter: "Newsletter",
  direct: "Directo",
  "": "Directo",
};

export function sourceLabel(source: string | null | undefined): string {
  const raw = (source ?? "").trim().toLowerCase();
  if (!raw) return "Directo";
  if (SOURCE_LABELS[raw]) return SOURCE_LABELS[raw];
  // Coincidencia parcial por si viene un host completo desconocido.
  for (const [key, label] of Object.entries(SOURCE_LABELS)) {
    if (key && raw.includes(key)) return label;
  }
  // Si no hay match, capitaliza y limpia el dominio.
  const clean = raw.replace(/^www\./, "").replace(/\.(com|cl|net|org|co)$/i, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function startOfToday() {
  return dayjs().startOf("day");
}

function resolveDateRange(period: string, rawFrom: string, rawTo: string) {
  const today = startOfToday();

  switch (period) {
    case "today":
      return {
        from: today.format("YYYY-MM-DD"),
        to: today.add(1, "day").format("YYYY-MM-DD"),
      };
    case "this_week": {
      // Semana en curso de LUNES a DOMINGO. dayjs usa domingo como día 0,
      // así que calculamos el lunes restando (día+6)%7 días.
      const dow = today.day(); // 0=domingo … 6=sábado
      const monday = today.subtract((dow + 6) % 7, "day");
      return {
        from: monday.format("YYYY-MM-DD"),
        to: monday.add(7, "day").format("YYYY-MM-DD"), // exclusivo (lunes siguiente)
      };
    }
    case "last_7_days":
      return {
        from: today.subtract(6, "day").format("YYYY-MM-DD"),
        to: today.add(1, "day").format("YYYY-MM-DD"),
      };
    case "last_30_days":
      return {
        from: today.subtract(29, "day").format("YYYY-MM-DD"),
        to: today.add(1, "day").format("YYYY-MM-DD"),
      };
    case "this_month":
      return {
        from: today.startOf("month").format("YYYY-MM-DD"),
        to: today.add(1, "day").format("YYYY-MM-DD"),
      };
    case "last_month":
      return {
        from: today.subtract(1, "month").startOf("month").format("YYYY-MM-DD"),
        to: today.startOf("month").format("YYYY-MM-DD"),
      };
    case "custom":
      return {
        from: rawFrom || today.subtract(29, "day").format("YYYY-MM-DD"),
        to: rawTo || today.add(1, "day").format("YYYY-MM-DD"),
      };
    default:
      return {
        from: today.subtract(29, "day").format("YYYY-MM-DD"),
        to: today.add(1, "day").format("YYYY-MM-DD"),
      };
  }
}

export function resolveAnalyticsFilters(searchParams: Record<string, SearchParamValue>): AnalyticsFilters {
  const period = firstValue(searchParams.period) || "this_week";
  const rawFrom = firstValue(searchParams.date_from);
  const rawTo = firstValue(searchParams.date_to);
  const dates = resolveDateRange(period, rawFrom, rawTo);
  const page = Number.parseInt(firstValue(searchParams.page) || "1", 10);

  const identity = firstValue(searchParams.identity_state);
  const identityState =
    identity === "identified" || identity === "anonymous" ? identity : "all";

  return {
    period,
    dateFrom: dates.from,
    dateTo: dates.to,
    source: firstValue(searchParams.source),
    medium: firstValue(searchParams.medium),
    campaign: firstValue(searchParams.campaign),
    path: firstValue(searchParams.path),
    deviceType: firstValue(searchParams.device_type),
    identityState,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function buildAnalyticsRpcArgs(filters: AnalyticsFilters) {
  return {
    p_date_from: `${filters.dateFrom}T00:00:00.000Z`,
    p_date_to: `${filters.dateTo}T00:00:00.000Z`,
    p_source: filters.source || null,
    p_medium: filters.medium || null,
    p_campaign: filters.campaign || null,
    p_path: filters.path || null,
    p_device_type: filters.deviceType || null,
    p_identity_state: filters.identityState,
  };
}

export function buildAnalyticsQueryString(filters: AnalyticsFilters, overrides?: Partial<AnalyticsFilters>) {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.period) params.set("period", next.period);
  if (next.dateFrom) params.set("date_from", next.dateFrom);
  if (next.dateTo) params.set("date_to", next.dateTo);
  if (next.source) params.set("source", next.source);
  if (next.medium) params.set("medium", next.medium);
  if (next.campaign) params.set("campaign", next.campaign);
  if (next.path) params.set("path", next.path);
  if (next.deviceType) params.set("device_type", next.deviceType);
  if (next.identityState && next.identityState !== "all") {
    params.set("identity_state", next.identityState);
  }
  if (next.page > 1) params.set("page", String(next.page));

  return params.toString();
}

function normalizeArray<T>(value: T[] | null | undefined) {
  return value ?? [];
}

export async function loadAnalyticsDashboard(
  supabase: {
    rpc: (
      fn: string,
      args?: Record<string, unknown>,
    ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
  },
  filters: AnalyticsFilters,
): Promise<AnalyticsDashboardData> {
  const args = buildAnalyticsRpcArgs(filters);

  const [
    filterOptionsRes,
    overviewRes,
    trafficRes,
    sourcesRes,
    pagesRes,
    sectionsRes,
    ctasRes,
    scrollRes,
    funnelRes,
    devicesRes,
    campaignsRes,
    recentSessionsRes,
  ] = await Promise.all([
    supabase.rpc("analytics_get_filter_options"),
    supabase.rpc("analytics_get_overview", args),
    supabase.rpc("analytics_get_traffic_timeseries", args),
    supabase.rpc("analytics_get_sources", args),
    supabase.rpc("analytics_get_pages", args),
    supabase.rpc("analytics_get_sections", args),
    supabase.rpc("analytics_get_ctas", args),
    supabase.rpc("analytics_get_scroll_depth", args),
    supabase.rpc("analytics_get_funnel", args),
    supabase.rpc("analytics_get_devices", args),
    supabase.rpc("analytics_get_campaigns", args),
    supabase.rpc("analytics_get_recent_sessions", {
      ...args,
      p_page: filters.page,
      p_page_size: 20,
    }),
  ]);

  const errors = [
    filterOptionsRes.error,
    overviewRes.error,
    trafficRes.error,
    sourcesRes.error,
    pagesRes.error,
    sectionsRes.error,
    ctasRes.error,
    scrollRes.error,
    funnelRes.error,
    devicesRes.error,
    campaignsRes.error,
    recentSessionsRes.error,
  ].filter(Boolean);

  if (errors.length) {
    throw new Error(errors[0]?.message ?? "No se pudieron cargar las métricas.");
  }

  const recentSessions = normalizeArray(
    recentSessionsRes.data as AnalyticsDashboardData["recentSessions"],
  );

  return {
    filters,
    filterOptions: (filterOptionsRes.data as AnalyticsDashboardData["filterOptions"]) ?? {
      sources: [],
      mediums: [],
      campaigns: [],
      paths: [],
      devices: [],
    },
    overview: (overviewRes.data as AnalyticsDashboardData["overview"]) ?? {},
    traffic: normalizeArray(trafficRes.data as AnalyticsDashboardData["traffic"]),
    sources: normalizeArray(sourcesRes.data as AnalyticsDashboardData["sources"]),
    pages: normalizeArray(pagesRes.data as AnalyticsDashboardData["pages"]),
    sections: normalizeArray(sectionsRes.data as AnalyticsDashboardData["sections"]),
    ctas: normalizeArray(ctasRes.data as AnalyticsDashboardData["ctas"]),
    scrollDepth: normalizeArray(scrollRes.data as AnalyticsDashboardData["scrollDepth"]),
    funnel: (funnelRes.data as AnalyticsDashboardData["funnel"]) ?? {
      purchase_integrated: false,
      stages: [],
    },
    devices: (devicesRes.data as AnalyticsDashboardData["devices"]) ?? {
      devices: [],
      browsers: [],
      operating_systems: [],
    },
    campaigns: normalizeArray(campaignsRes.data as AnalyticsDashboardData["campaigns"]),
    recentSessions,
    totalSessions: recentSessions[0]?.total_count ?? 0,
  };
}

export function formatDuration(seconds: number | null | undefined) {
  const total = Math.max(0, Math.round(seconds ?? 0));
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;

  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}
