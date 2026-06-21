"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getTrackingIdentity,
  hasTrackedScroll,
  hasTrackedSection,
  markTrackedScroll,
  markTrackedSection,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  sendAnalyticsEvent,
} from "@/lib/analytics/client";
import type { AnalyticsConsentState, AnalyticsEventType, AnalyticsTrackInput } from "@/lib/analytics/types";

interface AnalyticsContextValue {
  consent: AnalyticsConsentState | null;
  measurementEnabled: boolean;
  visitorId: string | null;
  sessionId: string | null;
  trackEvent: (input: AnalyticsTrackInput, options?: { preferBeacon?: boolean }) => Promise<void>;
  trackFormStart: (formName: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics debe usarse dentro de AnalyticsProvider.");
  }

  return context;
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const lastPageViewKeyRef = useRef<string | null>(null);
  const trackedFormsRef = useRef<Set<string>>(new Set());

  const [consent, setConsent] = useState<AnalyticsConsentState | null>(null);

  const measurementEnabled = consent?.measurement === true;
  const identity = measurementEnabled ? getTrackingIdentity(pathname) : null;
  const visitorId = identity?.visitorId ?? null;
  const sessionId = identity?.sessionId ?? null;

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const storedConsent = readAnalyticsConsent();
      if (storedConsent) {
        setConsent(storedConsent);
      } else {
        // Medición auto-aceptada silenciosamente — sin banner.
        saveAnalyticsConsent(true);
        setConsent(readAnalyticsConsent());
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (!measurementEnabled) {
      lastPageViewKeyRef.current = null;
      trackedFormsRef.current.clear();
      return;
    }

    const activeIdentity = getTrackingIdentity(pathname);
    if (!activeIdentity) {
      return;
    }

    const pageViewKey = `${activeIdentity.sessionId}:${pathname}`;
    if (lastPageViewKeyRef.current === pageViewKey) {
      return;
    }

    lastPageViewKeyRef.current = pageViewKey;
    void sendAnalyticsEvent({
      eventType: "page_view",
      path: pathname,
      pageTitle: document.title,
    }, pathname);
  }, [measurementEnabled, pathname]);

  useEffect(() => {
    if (!measurementEnabled) {
      return;
    }

    const activeIdentity = getTrackingIdentity(pathname);
    if (!activeIdentity) {
      return;
    }

    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-analytics-section]"));
    if (!nodes.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
            return;
          }

          const sectionId = entry.target.getAttribute("data-analytics-section");
          if (!sectionId) {
            return;
          }

          const storageKey = `${activeIdentity.sessionId}:${pathname}:${sectionId}`;
          if (hasTrackedSection(storageKey)) {
            return;
          }

          markTrackedSection(storageKey);
          void sendAnalyticsEvent({
            eventType: "section_view",
            path: pathname,
            pageTitle: document.title,
            sectionId,
          }, pathname);
        });
      },
      { threshold: [0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [measurementEnabled, pathname]);

  useEffect(() => {
    if (!measurementEnabled) {
      return;
    }

    const activeIdentity = getTrackingIdentity(pathname);
    if (!activeIdentity) {
      return;
    }

    let ticking = false;
    const thresholds = [25, 50, 75, 100] as const;

    const handleScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight <= 0 ? 100 : Math.round((scrollTop / scrollHeight) * 100);

        thresholds.forEach((threshold) => {
          if (progress < threshold) {
            return;
          }

          const storageKey = `${activeIdentity.sessionId}:${pathname}:${threshold}`;
          if (hasTrackedScroll(storageKey)) {
            return;
          }

          markTrackedScroll(storageKey);
          void sendAnalyticsEvent({
            eventType: "scroll_depth",
            path: pathname,
            pageTitle: document.title,
            scrollDepth: threshold,
          }, pathname);
        });

        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [measurementEnabled, pathname]);

  useEffect(() => {
    if (!measurementEnabled) {
      return;
    }

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const clickable = target.closest<HTMLElement>("[data-analytics-id]");
      if (!clickable) {
        return;
      }

      const anchor = clickable.closest<HTMLAnchorElement>("a[href]");
      const href = anchor?.getAttribute("href") ?? "";
      const sectionId =
        clickable.getAttribute("data-analytics-section") ??
        clickable.closest<HTMLElement>("[data-analytics-section]")?.getAttribute("data-analytics-section") ??
        undefined;

      let eventType: AnalyticsEventType =
        (clickable.getAttribute("data-analytics-event") as AnalyticsEventType | null) ?? "click";

      if (href.startsWith("https://wa.me/") || href.includes("api.whatsapp.com")) {
        eventType = "whatsapp_click";
      } else if (href.startsWith("tel:")) {
        eventType = "phone_click";
      } else if (href.startsWith("mailto:")) {
        eventType = "email_click";
      }

      let destinationHost = "";
      let destinationPath = "";
      if (href.startsWith("http")) {
        try {
          const url = new URL(href);
          destinationHost = url.hostname;
          destinationPath = url.pathname;
        } catch {}
      } else if (href.startsWith("/") || href.startsWith("tel:") || href.startsWith("mailto:")) {
        destinationPath = href.slice(0, 160);
      }

      const label =
        clickable.getAttribute("data-analytics-label")?.trim() ||
        clickable.textContent?.replace(/\s+/g, " ").trim() ||
        clickable.getAttribute("aria-label") ||
        "Sin etiqueta";

      void sendAnalyticsEvent({
        eventType,
        path: pathname,
        pageTitle: document.title,
        sectionId,
        elementId: clickable.getAttribute("data-analytics-id") ?? undefined,
        elementLabel: label.slice(0, 120),
        metadata: {
          cta_type: clickable.getAttribute("data-analytics-cta") || null,
          destination_host: destinationHost || null,
          destination_path: destinationPath || null,
        },
      }, pathname);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [measurementEnabled, pathname]);

  async function trackEvent(
    input: AnalyticsTrackInput,
    options?: { preferBeacon?: boolean },
  ) {
    if (!measurementEnabled) {
      return;
    }

    await sendAnalyticsEvent(input, pathRef.current, options);
  }

  async function trackFormStart(formName: string) {
    if (!measurementEnabled || trackedFormsRef.current.has(formName)) {
      return;
    }

    trackedFormsRef.current.add(formName);
    await sendAnalyticsEvent({
      eventType: "form_start",
      path: pathRef.current,
      pageTitle: document.title,
      formName,
    }, pathRef.current);
  }

  return (
    <AnalyticsContext.Provider
      value={{
        consent,
        measurementEnabled,
        visitorId,
        sessionId,
        trackEvent,
        trackFormStart,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

