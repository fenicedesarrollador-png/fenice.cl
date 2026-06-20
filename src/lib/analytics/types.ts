export const ANALYTICS_EVENT_TYPES = [
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
] as const;

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number];

export type AnalyticsMetadataValue = string | number | boolean | null;

export type AnalyticsMetadata = Record<string, AnalyticsMetadataValue>;

export interface AnalyticsConsentState {
  version: string;
  necessary: true;
  measurement: boolean;
  updatedAt: string;
}

export interface AnalyticsEventPayload {
  visitorId: string;
  sessionId: string;
  eventType: AnalyticsEventType;
  occurredAt: string;
  path: string;
  pageTitle?: string;
  sectionId?: string;
  elementId?: string;
  elementLabel?: string;
  formName?: string;
  scrollDepth?: 25 | 50 | 75 | 100;
  metadata?: AnalyticsMetadata;
  landingPath?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  referrerHost?: string | null;
  deviceType?: "desktop" | "mobile" | "tablet" | "unknown";
  browserName?: string;
  osName?: string;
  language?: string;
  screenGroup?: string;
}

export interface AnalyticsTrackInput {
  eventType: AnalyticsEventType;
  path?: string;
  pageTitle?: string;
  sectionId?: string;
  elementId?: string;
  elementLabel?: string;
  formName?: string;
  scrollDepth?: 25 | 50 | 75 | 100;
  metadata?: AnalyticsMetadata;
}

