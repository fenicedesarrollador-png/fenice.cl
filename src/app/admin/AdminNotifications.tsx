"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellRing, BellOff, Check, Smartphone, Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/** Convierte la clave pública VAPID (base64url) al formato que exige PushManager. */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) output[i] = raw.charCodeAt(i);
  return output;
}

type State = {
  count: number;
  cotizacionesNuevas: number;
  leadsNuevos: number;
  subscribed: boolean;
  pushConfigured: boolean;
  vapidPublicKey: string | null;
};

type Support =
  | "loading"
  | "unsupported"
  | "needs-install" // iOS/Safari: hay que instalar en la pantalla de inicio
  | "ready";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS 13+ se identifica como Mac con pantalla táctil.
    (navigator.platform === "MacIntel" && (navigator as { maxTouchPoints?: number }).maxTouchPoints! > 1)
  );
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function isMacDesktop() {
  if (typeof navigator === "undefined") return false;
  return (
    /Macintosh|Mac OS X/.test(navigator.userAgent) &&
    (navigator as { maxTouchPoints?: number }).maxTouchPoints! <= 1
  );
}

export default function AdminNotifications() {
  const router = useRouter();
  const [state, setState] = useState<State>({
    count: 0,
    cotizacionesNuevas: 0,
    leadsNuevos: 0,
    subscribed: false,
    pushConfigured: false,
    vapidPublicKey: null,
  });
  const [support, setSupport] = useState<Support>("loading");
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const swRegRef = useRef<ServiceWorkerRegistration | null>(null);
  const endpointRef = useRef<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // ── Sonido corto de alerta (WebAudio, sin archivos) ─────────────
  const playChime = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx = audioCtxRef.current ?? new AC();
      audioCtxRef.current = ctx;
      const now = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const t = now + i * 0.16;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.34);
      });
    } catch {
      /* audio bloqueado hasta la primera interacción: se ignora */
    }
  }, []);

  // ── Sincroniza el badge del sistema operativo (App Badge) ───────
  const syncAppBadge = useCallback((count: number) => {
    try {
      const nav = navigator as Navigator & {
        setAppBadge?: (n?: number) => Promise<void>;
        clearAppBadge?: () => Promise<void>;
      };
      if (count > 0 && nav.setAppBadge) nav.setAppBadge(count).catch(() => {});
      else if (nav.clearAppBadge) nav.clearAppBadge().catch(() => {});
    } catch {
      /* Badging API no disponible */
    }
    // Refuerzo vía SW (necesario en algunas plataformas al estar en 2º plano).
    swRegRef.current?.active?.postMessage({ type: "fenice-set-badge", count });
  }, []);

  const refreshState = useCallback(async () => {
    try {
      const ep = endpointRef.current ? `?endpoint=${encodeURIComponent(endpointRef.current)}` : "";
      const res = await fetch(`/api/admin/push/state${ep}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as State;
      setState(data);
      syncAppBadge(data.count);
    } catch {
      /* red intermitente: se reintenta en el próximo evento */
    }
  }, [syncAppBadge]);

  // ── Registro del Service Worker + estado inicial ────────────────
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      const supported =
        "serviceWorker" in navigator && "Notification" in window && "PushManager" in window;

      if (!supported) {
        // iOS/Safari solo exponen PushManager cuando la web está instalada.
        if (isIOS() && !isStandalone()) {
          if (!cancelled) setSupport("needs-install");
        } else if (!cancelled) {
          setSupport("unsupported");
        }
        // Aun sin push, mostramos el contador en vivo.
        await refreshState();
        return;
      }

      if (!cancelled) setPermission(Notification.permission);

      try {
        const reg = await navigator.serviceWorker.register("/sw-admin.js", { scope: "/admin" });
        swRegRef.current = reg;
        const existing = await reg.pushManager.getSubscription();
        if (existing) endpointRef.current = existing.endpoint;
      } catch (err) {
        console.error("[push] No se pudo registrar el service worker:", err);
      }

      if (!cancelled) setSupport("ready");
      await refreshState();
    };

    boot();
    return () => {
      cancelled = true;
    };
  }, [refreshState]);

  // ── Mensajes del Service Worker (llegó un push) ─────────────────
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const onMessage = (event: MessageEvent) => {
      const msg = event.data || {};
      if (msg.type === "fenice-push") {
        playChime();
        refreshState();
      } else if (msg.type === "fenice-open" && typeof msg.url === "string") {
        router.push(msg.url);
      }
    };
    navigator.serviceWorker.addEventListener("message", onMessage);
    return () => navigator.serviceWorker.removeEventListener("message", onMessage);
  }, [playChime, refreshState, router]);

  // ── Realtime de Supabase: contador en vivo con la app abierta ───
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-alertas")
      .on("postgres_changes", { event: "*", schema: "public", table: "cotizaciones" }, (payload) => {
        if (payload.eventType === "INSERT") {
          playChime();
          setToast("Nueva cotización recibida");
        }
        refreshState();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        if (payload.eventType === "INSERT") {
          playChime();
          setToast("Nueva solicitud de contacto");
        }
        refreshState();
      })
      .subscribe();

    // Re-sincroniza al volver a la pestaña.
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshState();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      supabase.removeChannel(channel);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [playChime, refreshState]);

  // ── Auto-oculta el toast ────────────────────────────────────────
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(id);
  }, [toast]);

  // ── Activar notificaciones en este dispositivo ──────────────────
  const enable = useCallback(async () => {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setToast("Permiso de notificaciones denegado");
        return;
      }

      const reg = swRegRef.current ?? (await navigator.serviceWorker.ready);
      swRegRef.current = reg;

      // Necesitamos la clave pública VAPID del servidor.
      const stRes = await fetch("/api/admin/push/state", { cache: "no-store" });
      const st = (await stRes.json()) as State;
      if (!st.pushConfigured || !st.vapidPublicKey) {
        setToast("El servidor aún no tiene configuradas las claves VAPID");
        return;
      }

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(st.vapidPublicKey) as BufferSource,
        });
      }
      endpointRef.current = sub.endpoint;

      const res = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      if (!res.ok) {
        setToast("No se pudo guardar la suscripción");
        return;
      }

      // Dispara una notificación del SISTEMA al instante: confirma que llega y,
      // sobre todo en Mac, revela de inmediato si el sistema operativo la está
      // bloqueando (aunque el permiso del sitio esté concedido).
      try {
        await reg.showNotification("✅ Notificaciones activadas", {
          body: "Así se verán las alertas de nuevas cotizaciones de Fenice.",
          icon: "/icons/icon-192.png",
          badge: "/icons/badge-72.png",
          tag: "fenice-enabled",
        });
      } catch {
        /* si falla el display, el permiso del SO está bloqueando */
      }

      setToast("Notificaciones activadas en este dispositivo");
      await refreshState();
    } catch (err) {
      console.error("[push] enable:", err);
      setToast("No se pudieron activar las notificaciones");
    } finally {
      setBusy(false);
    }
  }, [refreshState]);

  // ── Desactivar en este dispositivo ──────────────────────────────
  const disable = useCallback(async () => {
    setBusy(true);
    try {
      const reg = swRegRef.current ?? (await navigator.serviceWorker.ready);
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/admin/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      endpointRef.current = null;
      setToast("Notificaciones desactivadas en este dispositivo");
      await refreshState();
    } catch (err) {
      console.error("[push] disable:", err);
    } finally {
      setBusy(false);
    }
  }, [refreshState]);

  // ── Enviar notificación de prueba ───────────────────────────────
  const sendTest = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/push/test", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setToast(
          isMacDesktop()
            ? `Prueba enviada a ${data.sent} dispositivo(s). Si no ves el banner del sistema en Mac, revisa Ajustes → Notificaciones.`
            : `Notificación de prueba enviada a ${data.sent} dispositivo(s)`,
        );
      } else {
        setToast(data.error || "No se pudo enviar la prueba");
      }
    } catch {
      setToast("No se pudo enviar la prueba");
    } finally {
      setBusy(false);
    }
  }, []);

  const activo = permission === "granted" && state.subscribed;
  const count = state.count;

  return (
    <div className="relative">
      {/* Botón campana con contador rojo */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 transition-all"
        aria-label={`Notificaciones${count > 0 ? ` (${count} pendientes)` : ""}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {activo ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white admin-pulse-badge">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Toast flotante */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 max-w-xs bg-[#0a1628] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 admin-toast-in">
          <BellRing className="w-4 h-4 text-[#2bbe6a] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Panel desplegable */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-[#0a1628]">Notificaciones</h3>
              {activo ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a6b3c]">
                  <Check className="w-3.5 h-3.5" /> Activas
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400">Inactivas</span>
              )}
            </div>

            {/* Resumen del contador */}
            <div className="px-4 py-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/cotizaciones");
                }}
                className="text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 transition-colors"
              >
                <div className="text-[22px] font-extrabold text-[#0a1628] leading-none">
                  {state.cotizacionesNuevas}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cotizaciones nuevas</div>
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/admin/leads");
                }}
                className="text-left rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 transition-colors"
              >
                <div className="text-[22px] font-extrabold text-[#0a1628] leading-none">
                  {state.leadsNuevos}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Solicitudes nuevas</div>
              </button>
            </div>

            {/* Controles según soporte */}
            <div className="px-4 pb-4 pt-1 space-y-2">
              {support === "needs-install" && (
                <div className="text-[12px] text-slate-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex gap-2">
                  <Smartphone className="w-4 h-4 text-[#b87608] shrink-0 mt-0.5" />
                  <span>
                    En iPhone/iPad: toca <b>Compartir</b> → <b>Agregar a inicio</b> y abre Fenice
                    desde ese ícono para recibir alertas con la app cerrada.
                  </span>
                </div>
              )}

              {support === "unsupported" && (
                <div className="text-[12px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  Este navegador no admite notificaciones push. El contador en vivo sí funciona
                  mientras el panel esté abierto.
                </div>
              )}

              {permission === "denied" && support === "ready" && (
                <div className="text-[12px] text-slate-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  Bloqueaste las notificaciones. Actívalas desde el candado 🔒 de la barra de
                  direcciones para este sitio.
                </div>
              )}

              {support === "ready" && permission !== "denied" && (
                <>
                  {activo ? (
                    <button
                      onClick={disable}
                      disabled={busy}
                      className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <BellOff className="w-4 h-4" />}
                      Desactivar en este dispositivo
                    </button>
                  ) : (
                    <button
                      onClick={enable}
                      disabled={busy}
                      className="w-full inline-flex items-center justify-center gap-2 text-[13px] font-bold text-white bg-[#1a6b3c] hover:bg-[#155230] rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <BellRing className="w-4 h-4" />}
                      Activar notificaciones
                    </button>
                  )}

                  {activo && (
                    <button
                      onClick={sendTest}
                      disabled={busy}
                      className="w-full inline-flex items-center justify-center gap-2 text-[12px] font-semibold text-[#1a6b3c] hover:bg-[#1a6b3c]/5 rounded-lg px-3 py-2 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Enviar notificación de prueba
                    </button>
                  )}

                  {/* En Mac el permiso del sitio no basta: macOS debe permitir
                      las notificaciones del navegador. Aviso solo cuando aplica. */}
                  {activo && isMacDesktop() && (
                    <div className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
                      <span className="font-bold text-[#0a1628]">¿No ves el aviso flotante en Mac?</span>{" "}
                      Abre <b>Ajustes del Sistema → Notificaciones</b>, elige tu navegador
                      (<b>Chrome</b>, <b>Safari</b> o <b>Edge</b>), activa <b>Permitir
                      notificaciones</b> y pon el estilo en <b>Avisos</b> o <b>Franjas</b>.
                      Desactiva también <b>Concentración / No molestar</b>. El permiso del sitio
                      ya está concedido; esto es aparte, a nivel del sistema.
                    </div>
                  )}
                </>
              )}

              <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                Las alertas llegan a Windows, macOS, Android e iPhone aunque la app esté cerrada.
                Actívalas una vez en cada dispositivo.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
