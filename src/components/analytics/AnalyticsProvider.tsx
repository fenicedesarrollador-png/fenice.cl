"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  clearAnalyticsStorage,
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

function ConsentBanner({
  hasConsent,
  isOpen,
  measurementChecked,
  onClose,
  onReject,
  onAccept,
  onSaveCustom,
  setMeasurementChecked,
}: {
  hasConsent: boolean;
  isOpen: boolean;
  measurementChecked: boolean;
  onClose: () => void;
  onReject: () => void;
  onAccept: () => void;
  onSaveCustom: () => void;
  setMeasurementChecked: (value: boolean) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1a6b3c]">
                Privacidad
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0a1628]">
                Preferencias de medición
              </h2>
            </div>
            {hasConsent ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800"
              >
                Cerrar
              </button>
            ) : null}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Siempre activamos las cookies necesarias para que el sitio funcione. La medición del
            sitio es opcional y sirve para entender rutas, secciones, clics y formularios sin
            guardar datos personales en los eventos analíticos.
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#0a1628]">Necesarias</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Requeridas para navegación, seguridad y funcionamiento básico del sitio.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                Siempre activas
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#0a1628]">Medición del sitio</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Crea un identificador anónimo, mide páginas, scroll, secciones, CTAs y
                  conversiones reales para el panel interno de Fenice.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#1a6b3c]"
                  checked={measurementChecked}
                  onChange={(event) => setMeasurementChecked(event.target.checked)}
                />
                <span className="text-sm font-semibold text-slate-700">Activar</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-5 sm:flex-row sm:justify-end">
          {!hasConsent ? (
            <button
              type="button"
              onClick={onReject}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              Solo necesarias
            </button>
          ) : null}
          <button
            type="button"
            onClick={onSaveCustom}
            className="rounded-xl border border-[#1a6b3c]/20 bg-[#f0faf4] px-5 py-3 text-sm font-semibold text-[#1a6b3c] transition-colors hover:bg-[#e6f5ed]"
          >
            Guardar preferencias
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="rounded-xl bg-[#f5a623] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d4891a]"
          >
            Aceptar medición
          </button>
        </div>
      </div>
    </div>
  );
}

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
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [measurementChecked, setMeasurementChecked] = useState(true);

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
        setMeasurementChecked(storedConsent.measurement ?? true);
      } else {
        // Auto-accept measurement silently — no banner shown
        saveAnalyticsConsent(true);
        const autoConsent = readAnalyticsConsent()!;
        setConsent(autoConsent);
        setMeasurementChecked(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handler = () => {
      const storedConsent = readAnalyticsConsent();
      setMeasurementChecked(storedConsent?.measurement ?? measurementEnabled);
      setPreferencesOpen(true);
    };

    window.addEventListener("fenice:open-consent-preferences", handler);
    return () => window.removeEventListener("fenice:open-consent-preferences", handler);
  }, [measurementEnabled]);

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

  function handleReject() {
    const nextConsent = saveAnalyticsConsent(false);
    clearAnalyticsStorage();
    setConsent(nextConsent);
    setMeasurementChecked(false);
    setPreferencesOpen(false);
    trackedFormsRef.current.clear();
  }

  function handleAccept() {
    const nextConsent = saveAnalyticsConsent(true);
    setConsent(nextConsent);
    setMeasurementChecked(true);
    setPreferencesOpen(false);
  }

  function handleSaveCustom() {
    const nextConsent = saveAnalyticsConsent(measurementChecked);
    setConsent(nextConsent);
    setPreferencesOpen(false);

    if (!measurementChecked) {
      trackedFormsRef.current.clear();
    }
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

