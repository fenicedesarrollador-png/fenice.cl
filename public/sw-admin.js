/* Fenice — Service Worker de notificaciones del panel administrativo.
 *
 * Alcance: /admin (registrado con scope "/admin"). No intercepta ninguna
 * petición de la web pública: solo maneja push, clic en notificación y el
 * contador de la app (App Badge), incluso con la app o la pestaña cerradas.
 *
 * Compatible con Chrome/Edge/Firefox (Windows, macOS, Android) e iOS/iPadOS
 * 16.4+ cuando el sitio se instala en la pantalla de inicio.
 */

const NOTIF_ICON = "/icons/icon-192.png";
const NOTIF_BADGE = "/icons/badge-72.png";
const DEFAULT_URL = "/admin/cotizaciones";

self.addEventListener("install", () => {
  // Activa el nuevo SW de inmediato, sin esperar a que se cierren las pestañas.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function updateAppBadge(count) {
  try {
    if (typeof count !== "number") return;
    if (count > 0 && "setAppBadge" in self.navigator) {
      await self.navigator.setAppBadge(count);
    } else if ("clearAppBadge" in self.navigator) {
      await self.navigator.clearAppBadge();
    }
  } catch {
    /* Badging API no disponible: se ignora sin romper el push. */
  }
}

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Fenice", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Fenice — Nueva alerta";
  const url = data.url || DEFAULT_URL;
  const badgeCount = typeof data.badgeCount === "number" ? data.badgeCount : undefined;

  const options = {
    body: data.body || "",
    icon: data.icon || NOTIF_ICON,
    badge: NOTIF_BADGE,
    tag: data.tag || "fenice-alerta",
    renotify: true,
    requireInteraction: true,
    vibrate: [180, 90, 180],
    timestamp: Date.now(),
    data: { url, badgeCount },
  };

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(title, options);
      if (badgeCount !== undefined) {
        await updateAppBadge(badgeCount);
      }
      // Avisa a las pestañas abiertas del panel para que refresquen su contador.
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const client of clients) {
        client.postMessage({ type: "fenice-push", data });
      }
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || DEFAULT_URL;

  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      // Si ya hay una pestaña del panel abierta, la enfoca y navega ahí.
      for (const client of clients) {
        if (client.url.includes("/admin")) {
          client.postMessage({ type: "fenice-open", url });
          if ("focus" in client) return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })(),
  );
});

// La página puede pedir al SW que ajuste el contador de la app (App Badge).
self.addEventListener("message", (event) => {
  const msg = event.data || {};
  if (msg.type === "fenice-set-badge") {
    event.waitUntil(updateAppBadge(msg.count || 0));
  }
});
