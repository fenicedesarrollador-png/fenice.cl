"use client";

import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type {
  AnalyticsConsentState,
  AnalyticsEventPayload,
  AnalyticsMetadata,
  AnalyticsTrackInput,
} from "@/lib/analytics/types";

const CONSENT_VERSION = "2026-06-20";
const CONSENT_STORAGE_KEY = "fenice_cookie_consent";
const VISITOR_STORAGE_KEY = "fenice_visitor_id";
const SESSION_STORAGE_KEY = "fenice_session_id";
const SESSION_STARTED_AT_KEY = "fenice_session_started_at";
const SESSION_LAST_SEEN_AT_KEY = "fenice_session_last_seen_at";
const SESSION_ACQUISITION_KEY = "fenice_session_acquisition";
const SESSION_TRACKED_SECTIONS_KEY = "fenice_tracked_sections";
const SESSION_TRACKED_SCROLL_KEY = "fenice_tracked_scroll_depth";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface SessionAcquisition {
  landingPath: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrerHost: string | null;
}

interface TrackingIdentity {
  visitorId: string;
  sessionId: string;
  landingPath: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  referrerHost: string | null;
  deviceType: "desktop" | "mobile" | "tablet" | "unknown";
  browserName: string;
  osName: string;
  language: string;
  screenGroup: string;
}

interface SessionState {
  sessionId: string;
  acquisition: SessionAcquisition;
}

function isBrowser() {
  return typeof window !== "undefined";
}

function isUuid(value: string | null | undefined) {
  return !!value && UUID_PATTERN.test(value);
}

function safeRead(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeRemove(storage: Storage, key: string) {
  try {
    storage.removeItem(key);
  } catch {}
}

function getLocalStorage() {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function getSessionStorage() {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function generateUuid() {
  if (!isBrowser() || !window.crypto?.randomUUID) {
    return null;
  }

  return window.crypto.randomUUID();
}

function normalizePath(pathname: string) {
  if (!pathname) {
    return "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

function readJson<T>(raw: string | null) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(storage: Storage, key: string, value: unknown) {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function normalizeSourceFromHost(host: string) {
  if (host.includes("google.")) {
    return "google";
  }
  if (host.includes("instagram.")) {
    return "instagram";
  }
  if (host.includes("facebook.") || host.includes("fb.")) {
    return "facebook";
  }
  if (host.includes("linkedin.")) {
    return "linkedin";
  }
  if (host.includes("whatsapp.")) {
    return "whatsapp";
  }
  return host;
}

function deriveAcquisition(pathname: string): SessionAcquisition {
  const currentPath = normalizePath(pathname);

  if (!isBrowser()) {
    return {
      landingPath: currentPath,
      source: "direct",
      medium: "none",
      campaign: "",
      content: "",
      term: "",
      referrerHost: null,
    };
  }

  const search = new URLSearchParams(window.location.search);
  const utmSource = search.get("utm_source")?.trim() ?? "";
  const utmMedium = search.get("utm_medium")?.trim() ?? "";
  const utmCampaign = search.get("utm_campaign")?.trim() ?? "";
  const utmContent = search.get("utm_content")?.trim() ?? "";
  const utmTerm = search.get("utm_term")?.trim() ?? "";

  let referrerHost: string | null = null;
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : null;
  } catch {
    referrerHost = null;
  }

  if (utmSource) {
    return {
      landingPath: currentPath,
      source: utmSource.toLowerCase(),
      medium: utmMedium.toLowerCase() || "campaign",
      campaign: utmCampaign,
      content: utmContent,
      term: utmTerm,
      referrerHost,
    };
  }

  if (!referrerHost) {
    return {
      landingPath: currentPath,
      source: "direct",
      medium: "none",
      campaign: "",
      content: "",
      term: "",
      referrerHost: null,
    };
  }

  return {
    landingPath: currentPath,
    source: normalizeSourceFromHost(referrerHost),
    medium: "referral",
    campaign: "",
    content: "",
    term: "",
    referrerHost,
  };
}

function getDeviceType(ua: string): "desktop" | "mobile" | "tablet" | "unknown" {
  const value = ua.toLowerCase();

  if (!value) {
    return "unknown";
  }
  if (/ipad|tablet/.test(value)) {
    return "tablet";
  }
  if (/mobi|iphone|android/.test(value)) {
    return /ipad|tablet/.test(value) ? "tablet" : "mobile";
  }
  return "desktop";
}

function getBrowserName(ua: string) {
  const value = ua.toLowerCase();

  if (value.includes("edg/")) {
    return "Edge";
  }
  if (value.includes("firefox/")) {
    return "Firefox";
  }
  if (value.includes("safari/") && !value.includes("chrome/")) {
    return "Safari";
  }
  if (value.includes("chrome/")) {
    return "Chrome";
  }
  if (value.includes("opr/")) {
    return "Opera";
  }
  return "Desconocido";
}

function getOsName(ua: string) {
  const value = ua.toLowerCase();

  if (value.includes("windows")) {
    return "Windows";
  }
  if (value.includes("iphone") || value.includes("ipad")) {
    return "iOS";
  }
  if (value.includes("android")) {
    return "Android";
  }
  if (value.includes("mac os") || value.includes("macintosh")) {
    return "macOS";
  }
  if (value.includes("linux")) {
    return "Linux";
  }
  return "Desconocido";
}

function getScreenGroup() {
  if (!isBrowser()) {
    return "unknown";
  }

  const width = window.innerWidth || window.screen?.width || 0;
  if (width >= 1280) {
    return "xl";
  }
  if (width >= 1024) {
    return "lg";
  }
  if (width >= 768) {
    return "md";
  }
  if (width >= 640) {
    return "sm";
  }
  return "xs";
}

function getTrackedSet(storageKey: string) {
  const storage = getSessionStorage();
  if (!storage) {
    return new Set<string>();
  }

  const raw = readJson<string[]>(safeRead(storage, storageKey));
  return new Set(raw ?? []);
}

function saveTrackedSet(storageKey: string, values: Set<string>) {
  const storage = getSessionStorage();
  if (!storage) {
    return;
  }

  writeJson(storage, storageKey, Array.from(values));
}

function getOrCreateVisitorId() {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const existing = safeRead(storage, VISITOR_STORAGE_KEY);
  if (isUuid(existing)) {
    return existing;
  }

  const nextId = generateUuid();
  if (!nextId) {
    return null;
  }

  safeWrite(storage, VISITOR_STORAGE_KEY, nextId);
  return nextId;
}

function getOrCreateSession(pathname: string): SessionState | null {
  const storage = getSessionStorage();
  if (!storage) {
    return null;
  }

  const now = Date.now();
  const currentPath = normalizePath(pathname);

  const currentSessionId = safeRead(storage, SESSION_STORAGE_KEY);
  const lastSeenAtRaw = safeRead(storage, SESSION_LAST_SEEN_AT_KEY);
  const lastSeenAt = lastSeenAtRaw ? Number.parseInt(lastSeenAtRaw, 10) : Number.NaN;

  if (isUuid(currentSessionId) && Number.isFinite(lastSeenAt) && now - lastSeenAt <= SESSION_TIMEOUT_MS) {
    safeWrite(storage, SESSION_LAST_SEEN_AT_KEY, String(now));

    const acquisition = readJson<SessionAcquisition>(safeRead(storage, SESSION_ACQUISITION_KEY));
    return {
      sessionId: currentSessionId as string,
      acquisition: acquisition ?? deriveAcquisition(currentPath),
    };
  }

  const nextSessionId = generateUuid();
  if (!nextSessionId) {
    return null;
  }

  const acquisition = deriveAcquisition(currentPath);
  safeWrite(storage, SESSION_STORAGE_KEY, nextSessionId);
  safeWrite(storage, SESSION_STARTED_AT_KEY, String(now));
  safeWrite(storage, SESSION_LAST_SEEN_AT_KEY, String(now));
  writeJson(storage, SESSION_ACQUISITION_KEY, acquisition);
  writeJson(storage, SESSION_TRACKED_SECTIONS_KEY, []);
  writeJson(storage, SESSION_TRACKED_SCROLL_KEY, []);

  return {
    sessionId: nextSessionId,
    acquisition,
  };
}

export function readAnalyticsConsent() {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const parsed = readJson<AnalyticsConsentState>(safeRead(storage, CONSENT_STORAGE_KEY));
  if (!parsed || parsed.version !== CONSENT_VERSION) {
    return null;
  }

  return parsed;
}

export function saveAnalyticsConsent(measurement: boolean) {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  const nextState: AnalyticsConsentState = {
    version: CONSENT_VERSION,
    necessary: true,
    measurement,
    updatedAt: new Date().toISOString(),
  };

  writeJson(storage, CONSENT_STORAGE_KEY, nextState);

  if (!measurement) {
    clearAnalyticsStorage();
  }

  return nextState;
}

export function clearAnalyticsStorage() {
  const localStorageRef = getLocalStorage();
  const sessionStorageRef = getSessionStorage();

  if (localStorageRef) {
    safeRemove(localStorageRef, VISITOR_STORAGE_KEY);
  }

  if (sessionStorageRef) {
    safeRemove(sessionStorageRef, SESSION_STORAGE_KEY);
    safeRemove(sessionStorageRef, SESSION_STARTED_AT_KEY);
    safeRemove(sessionStorageRef, SESSION_LAST_SEEN_AT_KEY);
    safeRemove(sessionStorageRef, SESSION_ACQUISITION_KEY);
    safeRemove(sessionStorageRef, SESSION_TRACKED_SECTIONS_KEY);
    safeRemove(sessionStorageRef, SESSION_TRACKED_SCROLL_KEY);
  }
}

export function getTrackingIdentity(pathname: string): TrackingIdentity | null {
  const consent = readAnalyticsConsent();
  if (!consent?.measurement) {
    return null;
  }

  const visitorId = getOrCreateVisitorId();
  const session = getOrCreateSession(pathname);
  if (!visitorId || !session) {
    return null;
  }

  const ua = isBrowser() ? window.navigator.userAgent : "";

  return {
    visitorId,
    sessionId: session.sessionId,
    landingPath: session.acquisition.landingPath,
    source: session.acquisition.source,
    medium: session.acquisition.medium,
    campaign: session.acquisition.campaign,
    content: session.acquisition.content,
    term: session.acquisition.term,
    referrerHost: session.acquisition.referrerHost,
    deviceType: getDeviceType(ua),
    browserName: getBrowserName(ua),
    osName: getOsName(ua),
    language: isBrowser() ? window.navigator.language || "es-CL" : "es-CL",
    screenGroup: getScreenGroup(),
  };
}

function sanitizeMetadata(metadata?: AnalyticsMetadata) {
  if (!metadata) {
    return undefined;
  }

  const entries = Object.entries(metadata)
    .filter(([, value]) => value !== undefined)
    .slice(0, 12)
    .map(([key, value]) => [key.slice(0, 40), typeof value === "string" ? value.slice(0, 160) : value]);

  return Object.fromEntries(entries);
}

function toEventPayload(identity: TrackingIdentity, input: AnalyticsTrackInput, pathname: string): AnalyticsEventPayload {
  return {
    visitorId: identity.visitorId,
    sessionId: identity.sessionId,
    eventType: input.eventType,
    occurredAt: new Date().toISOString(),
    path: normalizePath(input.path ?? pathname),
    pageTitle: input.pageTitle?.slice(0, 180),
    sectionId: input.sectionId?.slice(0, 100),
    elementId: input.elementId?.slice(0, 100),
    elementLabel: input.elementLabel?.slice(0, 120),
    formName: input.formName?.slice(0, 100),
    scrollDepth: input.scrollDepth,
    metadata: sanitizeMetadata(input.metadata),
    landingPath: identity.landingPath,
    source: identity.source,
    medium: identity.medium,
    campaign: identity.campaign,
    content: identity.content,
    term: identity.term,
    referrerHost: identity.referrerHost,
    deviceType: identity.deviceType,
    browserName: identity.browserName,
    osName: identity.osName,
    language: identity.language,
    screenGroup: identity.screenGroup,
  };
}

function logDevError(message: string, error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  console.error(`[analytics] ${message}`, error);
}

function getFunctionEndpoint() {
  const { url } = getSupabasePublicConfig();
  return `${url}/functions/v1/track-analytics-event`;
}

export async function sendAnalyticsEvent(
  input: AnalyticsTrackInput,
  pathname: string,
  options?: { preferBeacon?: boolean },
) {
  const identity = getTrackingIdentity(pathname);
  if (!identity) {
    return null;
  }

  const payload = toEventPayload(identity, input, pathname);
  const body = JSON.stringify(payload);
  const endpoint = getFunctionEndpoint();

  try {
    if (options?.preferBeacon && isBrowser() && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(endpoint, blob);
      if (ok) {
        return identity;
      }
    }

    const { anonKey } = getSupabasePublicConfig();

    await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
      },
      body,
      keepalive: true,
      mode: "cors",
      credentials: "omit",
    });
  } catch (error) {
    logDevError(`No se pudo enviar ${input.eventType}`, error);
  }

  return identity;
}

export function markTrackedSection(sectionKey: string) {
  const values = getTrackedSet(SESSION_TRACKED_SECTIONS_KEY);
  values.add(sectionKey);
  saveTrackedSet(SESSION_TRACKED_SECTIONS_KEY, values);
}

export function hasTrackedSection(sectionKey: string) {
  return getTrackedSet(SESSION_TRACKED_SECTIONS_KEY).has(sectionKey);
}

export function markTrackedScroll(scrollKey: string) {
  const values = getTrackedSet(SESSION_TRACKED_SCROLL_KEY);
  values.add(scrollKey);
  saveTrackedSet(SESSION_TRACKED_SCROLL_KEY, values);
}

export function hasTrackedScroll(scrollKey: string) {
  return getTrackedSet(SESSION_TRACKED_SCROLL_KEY).has(scrollKey);
}
