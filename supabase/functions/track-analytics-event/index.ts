// @ts-nocheck
import { createClient } from "npm:@supabase/supabase-js@2";

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
const MAX_PAYLOAD_BYTES = 8_192;
const MAX_EVENTS_PER_MINUTE = 120;
const BLOCKED_PATHS = [/^\/admin(\/|$)/, /^\/login(\/|$)/, /^\/api(\/|$)/, /^\/_next(\/|$)/];
const ALLOWED_METADATA_KEYS = new Set([
  "cta_type",
  "destination_host",
  "destination_path",
  "error_code",
]);

interface ValidPayload {
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
  scrollDepth: 25 | 50 | 75 | 100 | null;
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
}

function getAllowedOrigins() {
  const envOrigins = (Deno.env.get("ANALYTICS_ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return new Set([
    "https://fenice.cl",
    "https://www.fenice.cl",
    "https://fenice-cl.onrender.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...envOrigins,
  ]);
}

function getCorsHeaders(origin: string) {
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "authorization, apikey, content-type",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function jsonResponse(origin: string, status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(origin),
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function sanitizeText(value: unknown, maxLength: number, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }

  return value.trim().slice(0, maxLength);
}

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

function isBlockedPath(path: string) {
  return BLOCKED_PATHS.some((pattern) => pattern.test(path));
}

function sanitizeMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .filter(([key]) => ALLOWED_METADATA_KEYS.has(key))
    .slice(0, 12)
    .map(([key, entryValue]) => {
      if (
        entryValue === null ||
        typeof entryValue === "boolean" ||
        typeof entryValue === "number"
      ) {
        return [key, entryValue];
      }

      if (typeof entryValue === "string") {
        return [key, entryValue.slice(0, 160)];
      }

      return [key, null];
    });

  return Object.fromEntries(entries);
}

function resolveCountryCode(request: Request) {
  const value =
    request.headers.get("x-country-code") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-vercel-ip-country");

  if (!value) {
    return null;
  }

  return sanitizeText(value, 8, "").toUpperCase() || null;
}

function validatePayload(payload: unknown, request: Request): ValidPayload | { error: string } {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { error: "payload_invalid" };
  }

  const raw = payload as Record<string, unknown>;
  const visitorId = sanitizeText(raw.visitorId, 64);
  const sessionId = sanitizeText(raw.sessionId, 64);
  const eventType = sanitizeText(raw.eventType, 64);
  const path = sanitizeText(raw.path, 320);
  const landingPath = sanitizeText(raw.landingPath, 320, path || "/");

  if (!isUuid(visitorId) || !isUuid(sessionId)) {
    return { error: "uuid_invalid" };
  }

  if (!EVENT_TYPES.has(eventType)) {
    return { error: "event_type_invalid" };
  }

  if (!path.startsWith("/") || isBlockedPath(path)) {
    return { error: "path_invalid" };
  }

  const occurredAt = sanitizeText(raw.occurredAt, 64);
  if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) {
    return { error: "occurred_at_invalid" };
  }

  const scrollDepth =
    typeof raw.scrollDepth === "number" && SCROLL_DEPTHS.has(raw.scrollDepth)
      ? (raw.scrollDepth as 25 | 50 | 75 | 100)
      : null;

  if (eventType === "scroll_depth" && !scrollDepth) {
    return { error: "scroll_depth_invalid" };
  }

  return {
    visitorId,
    sessionId,
    eventType,
    occurredAt,
    path,
    pageTitle: sanitizeText(raw.pageTitle, 180) || null,
    sectionId: sanitizeText(raw.sectionId, 100) || null,
    elementId: sanitizeText(raw.elementId, 100) || null,
    elementLabel: sanitizeText(raw.elementLabel, 120) || null,
    formName: sanitizeText(raw.formName, 100) || null,
    scrollDepth,
    metadata: sanitizeMetadata(raw.metadata),
    landingPath: landingPath.startsWith("/") ? landingPath : path,
    source: sanitizeText(raw.source, 80, "direct") || "direct",
    medium: sanitizeText(raw.medium, 80, "none") || "none",
    campaign: sanitizeText(raw.campaign, 120),
    content: sanitizeText(raw.content, 120),
    term: sanitizeText(raw.term, 120),
    referrerHost: sanitizeText(raw.referrerHost, 160) || null,
    deviceType: sanitizeText(raw.deviceType, 40, "unknown") || "unknown",
    browserName: sanitizeText(raw.browserName, 80) || null,
    osName: sanitizeText(raw.osName, 80) || null,
    language: sanitizeText(raw.language, 32) || null,
    screenGroup: sanitizeText(raw.screenGroup, 32) || null,
    countryCode: resolveCountryCode(request),
  };
}

async function hashActor(ipValue: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(ipValue));
  return Array.from(new Uint8Array(signature))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

async function enforceRateLimit(
  supabase: ReturnType<typeof createClient>,
  request: Request,
  sessionId: string,
) {
  const secret = Deno.env.get("ANALYTICS_IP_HMAC_SECRET");
  if (!secret) {
    throw new Error("Missing ANALYTICS_IP_HMAC_SECRET");
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const realIp = request.headers.get("x-real-ip")?.trim() ?? "";
  const actorSource = forwardedFor || realIp || sessionId;
  const actorHash = await hashActor(actorSource, secret);
  const bucketMinute = new Date();
  bucketMinute.setSeconds(0, 0);

  const { data: existing, error: readError } = await supabase
    .from("analytics_ingest_guards")
    .select("hits")
    .eq("actor_hash", actorHash)
    .eq("bucket_minute", bucketMinute.toISOString())
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (!existing) {
    const { error: insertError } = await supabase.from("analytics_ingest_guards").insert({
      actor_hash: actorHash,
      bucket_minute: bucketMinute.toISOString(),
      hits: 1,
      last_seen_at: new Date().toISOString(),
    });

    if (insertError) {
      throw insertError;
    }

    return;
  }

  if ((existing.hits ?? 0) >= MAX_EVENTS_PER_MINUTE) {
    throw new Error("rate_limited");
  }

  const { error: updateError } = await supabase
    .from("analytics_ingest_guards")
    .update({
      hits: (existing.hits ?? 0) + 1,
      last_seen_at: new Date().toISOString(),
    })
    .eq("actor_hash", actorHash)
    .eq("bucket_minute", bucketMinute.toISOString());

  if (updateError) {
    throw updateError;
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get("origin") ?? "";
  const allowedOrigins = getAllowedOrigins();
  const safeOrigin = allowedOrigins.has(origin) ? origin : "";

  if (request.method === "OPTIONS") {
    if (!safeOrigin) {
      return new Response("forbidden", { status: 403 });
    }
    return new Response("ok", { headers: getCorsHeaders(safeOrigin) });
  }

  if (!safeOrigin) {
    return jsonResponse(origin || "https://fenice.cl", 403, { error: "origin_forbidden" });
  }

  if (request.method !== "POST") {
    return jsonResponse(safeOrigin, 405, { error: "method_not_allowed" });
  }

  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
    return jsonResponse(safeOrigin, 413, { error: "payload_too_large" });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(safeOrigin, 400, { error: "invalid_json" });
  }

  const validated = validatePayload(payload, request);
  if ("error" in validated) {
    return jsonResponse(safeOrigin, 400, { error: validated.error });
  }

  const supabaseUrl =
    Deno.env.get("SUPABASE_URL") ||
    Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ||
    "";
  const serviceRoleKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    Deno.env.get("SUPABASE_SECRET_KEY") ||
    "";

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(safeOrigin, 500, { error: "supabase_config_missing" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    await enforceRateLimit(supabase, request, validated.sessionId);

    const { data: existingSession, error: sessionReadError } = await supabase
      .from("analytics_sessions")
      .select("id, started_at, landing_path")
      .eq("id", validated.sessionId)
      .maybeSingle();

    if (sessionReadError) {
      throw sessionReadError;
    }

    if (!existingSession) {
      const { error: sessionInsertError } = await supabase.from("analytics_sessions").insert({
        id: validated.sessionId,
        visitor_id: validated.visitorId,
        started_at: validated.occurredAt,
        last_seen_at: validated.occurredAt,
        landing_path: validated.landingPath,
        last_path: validated.path,
        source: validated.source,
        medium: validated.medium,
        campaign: validated.campaign || null,
        content: validated.content || null,
        term: validated.term || null,
        referrer_host: validated.referrerHost,
        device_type: validated.deviceType,
        browser_name: validated.browserName,
        os_name: validated.osName,
        language: validated.language,
        screen_group: validated.screenGroup,
        country_code: validated.countryCode,
      });

      if (sessionInsertError) {
        throw sessionInsertError;
      }
    } else {
      const { error: sessionUpdateError } = await supabase
        .from("analytics_sessions")
        .update({
          visitor_id: validated.visitorId,
          last_seen_at: validated.occurredAt,
          last_path: validated.path,
          source: validated.source,
          medium: validated.medium,
          campaign: validated.campaign || null,
          content: validated.content || null,
          term: validated.term || null,
          referrer_host: validated.referrerHost,
          device_type: validated.deviceType,
          browser_name: validated.browserName,
          os_name: validated.osName,
          language: validated.language,
          screen_group: validated.screenGroup,
          country_code: validated.countryCode,
        })
        .eq("id", validated.sessionId);

      if (sessionUpdateError) {
        throw sessionUpdateError;
      }
    }

    const { error: eventInsertError } = await supabase.from("analytics_events").insert({
      session_id: validated.sessionId,
      visitor_id: validated.visitorId,
      event_type: validated.eventType,
      occurred_at: validated.occurredAt,
      path: validated.path,
      page_title: validated.pageTitle,
      section_id: validated.sectionId,
      element_id: validated.elementId,
      element_label: validated.elementLabel,
      form_name: validated.formName,
      scroll_depth: validated.scrollDepth,
      metadata: validated.metadata,
    });

    if (eventInsertError) {
      throw eventInsertError;
    }

    return jsonResponse(safeOrigin, 200, { ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unexpected_error";
    const status = message === "rate_limited" ? 429 : 500;
    return jsonResponse(safeOrigin, status, { error: message });
  }
});
