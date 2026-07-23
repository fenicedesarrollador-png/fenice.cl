import { createHash } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { getSupabasePublicConfigError } from "@/lib/supabase/config";

/**
 * Ingesta de analítica propia (first-party). Antes reenviaba a una Edge Function
 * de Supabase, pero ese salto fallaba: el reenvío server-to-server no lleva
 * cabecera Origin y la función lo rechazaba con 403, así que NUNCA se guardaba
 * nada. Ahora se inserta DIRECTO con la service role key: funciona solo con la
 * migración `migration_analytics.sql` ejecutada, sin desplegar la Edge Function.
 *
 * Responde 204 siempre (compatible con navigator.sendBeacon) y nunca bloquea la
 * navegación del visitante.
 */

export const dynamic = "force-dynamic";

const EVENT_TYPES = new Set([
  "page_view",
  "section_view",
  "scroll_depth",
  "click",
  "form_start",
  "form_submit_success",
  "form_submit_error",
  "quote_started",
  "quote_submitted",
  "checkout_started",
  "purchase_completed",
  "whatsapp_click",
  "phone_click",
  "email_click",
]);
const SCROLL_DEPTHS = new Set([25, 50, 75, 100]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const BLOCKED_PATHS = [/^\/admin(\/|$)/, /^\/login(\/|$)/, /^\/api(\/|$)/, /^\/_next(\/|$)/];
const ALLOWED_METADATA_KEYS = new Set([
  "cta_type",
  "destination_host",
  "destination_path",
  "error_code",
]);
const MAX_EVENTS_PER_MINUTE = 300;

type ScrollDepth = 25 | 50 | 75 | 100;

type ValidPayload = {
  visitorId: string;
  sessionId: string;
  eventType: string;
  occurredAt: string;
  path: string;
  pageTitle: string | null;
  sectionId: string | null;
  elementId: string | null;
  elementLabel: string | null;
  formName: string | null;
  scrollDepth: ScrollDepth | null;
  metadata: Record<string, string | number | boolean | null>;
  landingPath: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrerHost: string | null;
  deviceType: string;
  browserName: string | null;
  osName: string | null;
  language: string | null;
  screenGroup: string | null;
  countryCode: string | null;
};

function noContent() {
  return new Response(null, { status: 204 });
}

function text(value: unknown, maxLength: number, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, maxLength);
}

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function isBlockedPath(path: string) {
  return BLOCKED_PATHS.some((pattern) => pattern.test(path));
}

function sanitizeMetadata(value: unknown): Record<string, string | number | boolean | null> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([key]) => ALLOWED_METADATA_KEYS.has(key))
    .slice(0, 12)
    .map(([key, entryValue]) => {
      if (entryValue === null || typeof entryValue === "boolean" || typeof entryValue === "number") {
        return [key, entryValue] as const;
      }
      if (typeof entryValue === "string") return [key, entryValue.slice(0, 160)] as const;
      return [key, null] as const;
    });
  return Object.fromEntries(entries);
}

function resolveCountryCode(request: Request): string | null {
  const value =
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    request.headers.get("x-vercel-ip-country");
  if (!value) return null;
  return text(value, 8, "").toUpperCase() || null;
}

function validate(payload: unknown, request: Request): ValidPayload | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const raw = payload as Record<string, unknown>;

  const visitorId = text(raw.visitorId, 64);
  const sessionId = text(raw.sessionId, 64);
  const eventType = text(raw.eventType, 64);
  const path = text(raw.path, 320);
  const landingPath = text(raw.landingPath, 320, path || "/");

  if (!isUuid(visitorId) || !isUuid(sessionId)) return null;
  if (!EVENT_TYPES.has(eventType)) return null;
  if (!path.startsWith("/") || isBlockedPath(path)) return null;

  const occurredAt = text(raw.occurredAt, 64);
  if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) return null;

  const scrollDepth =
    typeof raw.scrollDepth === "number" && SCROLL_DEPTHS.has(raw.scrollDepth)
      ? (raw.scrollDepth as ScrollDepth)
      : null;
  if (eventType === "scroll_depth" && !scrollDepth) return null;

  return {
    visitorId,
    sessionId,
    eventType,
    occurredAt,
    path,
    pageTitle: text(raw.pageTitle, 180) || null,
    sectionId: text(raw.sectionId, 100) || null,
    elementId: text(raw.elementId, 100) || null,
    elementLabel: text(raw.elementLabel, 120) || null,
    formName: text(raw.formName, 100) || null,
    scrollDepth,
    metadata: sanitizeMetadata(raw.metadata),
    landingPath: landingPath.startsWith("/") ? landingPath : path,
    source: text(raw.source, 80, "direct") || "direct",
    medium: text(raw.medium, 80, "none") || "none",
    campaign: text(raw.campaign, 120),
    content: text(raw.content, 120),
    term: text(raw.term, 120),
    referrerHost: text(raw.referrerHost, 160) || null,
    deviceType: text(raw.deviceType, 40, "unknown") || "unknown",
    browserName: text(raw.browserName, 80) || null,
    osName: text(raw.osName, 80) || null,
    language: text(raw.language, 32) || null,
    screenGroup: text(raw.screenGroup, 32) || null,
    countryCode: resolveCountryCode(request),
  };
}

type ServiceClient = Awaited<ReturnType<typeof createServiceClient>>;

/** Límite por IP/minuto. Best-effort: si algo falla, deja pasar el evento. */
async function withinRateLimit(
  supabase: ServiceClient,
  request: Request,
  sessionId: string,
): Promise<boolean> {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      sessionId;
    const bucket = new Date();
    bucket.setSeconds(0, 0);
    const bucketIso = bucket.toISOString();
    const actorHash = createHash("sha256").update(`${ip}|${bucketIso}`).digest("hex");

    const { data } = await supabase
      .from("analytics_ingest_guards")
      .select("hits")
      .eq("actor_hash", actorHash)
      .eq("bucket_minute", bucketIso)
      .maybeSingle();

    if (!data) {
      await supabase
        .from("analytics_ingest_guards")
        .insert({ actor_hash: actorHash, bucket_minute: bucketIso, hits: 1, last_seen_at: new Date().toISOString() });
      return true;
    }

    if ((data.hits ?? 0) >= MAX_EVENTS_PER_MINUTE) return false;

    await supabase
      .from("analytics_ingest_guards")
      .update({ hits: (data.hits ?? 0) + 1, last_seen_at: new Date().toISOString() })
      .eq("actor_hash", actorHash)
      .eq("bucket_minute", bucketIso);
    return true;
  } catch {
    return true;
  }
}

export async function POST(request: Request) {
  if (getSupabasePublicConfigError()) return noContent();

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return noContent();
  }

  const v = validate(raw, request);
  if (!v) return noContent();

  try {
    const supabase = await createServiceClient();

    const allowed = await withinRateLimit(supabase, request, v.sessionId);
    if (!allowed) return noContent();

    // Sesión: se crea la primera vez (preservando landing_path/started_at) y
    // se actualiza en cada evento posterior.
    const { data: existing } = await supabase
      .from("analytics_sessions")
      .select("id")
      .eq("id", v.sessionId)
      .maybeSingle();

    if (!existing) {
      await supabase.from("analytics_sessions").insert({
        id: v.sessionId,
        visitor_id: v.visitorId,
        started_at: v.occurredAt,
        last_seen_at: v.occurredAt,
        landing_path: v.landingPath,
        last_path: v.path,
        source: v.source,
        medium: v.medium,
        campaign: v.campaign || null,
        content: v.content || null,
        term: v.term || null,
        referrer_host: v.referrerHost,
        device_type: v.deviceType,
        browser_name: v.browserName,
        os_name: v.osName,
        language: v.language,
        screen_group: v.screenGroup,
        country_code: v.countryCode,
      });
    } else {
      await supabase
        .from("analytics_sessions")
        .update({
          visitor_id: v.visitorId,
          last_seen_at: v.occurredAt,
          last_path: v.path,
          source: v.source,
          medium: v.medium,
          campaign: v.campaign || null,
          content: v.content || null,
          term: v.term || null,
          referrer_host: v.referrerHost,
          device_type: v.deviceType,
          browser_name: v.browserName,
          os_name: v.osName,
          language: v.language,
          screen_group: v.screenGroup,
          country_code: v.countryCode,
        })
        .eq("id", v.sessionId);
    }

    await supabase.from("analytics_events").insert({
      session_id: v.sessionId,
      visitor_id: v.visitorId,
      event_type: v.eventType,
      occurred_at: v.occurredAt,
      path: v.path,
      page_title: v.pageTitle,
      section_id: v.sectionId,
      element_id: v.elementId,
      element_label: v.elementLabel,
      form_name: v.formName,
      scroll_depth: v.scrollDepth,
      metadata: v.metadata,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[analytics] No se pudo registrar el evento", error);
    }
  }

  return noContent();
}
