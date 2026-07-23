import "server-only";
import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";

/**
 * Envío de notificaciones Web Push a los administradores.
 *
 * Requiere en el entorno:
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY  — clave pública VAPID (también la usa el navegador)
 *   VAPID_PRIVATE_KEY             — clave privada VAPID (solo servidor)
 *   VAPID_SUBJECT                 — "mailto:notifica@fenice.cl" (contacto del emisor)
 *
 * Genera el par de claves con:  node scripts/generate-vapid.mjs
 *
 * Nunca lanza: si las claves no están o el envío falla, se loguea y sigue.
 * Las suscripciones caducadas (404/410) se eliminan solas de la base de datos.
 */

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  /** Número que se pinta en el ícono de la app (App Badge). */
  badgeCount?: number;
};

let vapidConfigured = false;

function ensureVapid(): boolean {
  const publicKey =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:notifica@fenice.cl";

  if (!publicKey || !privateKey) {
    return false;
  }

  if (!vapidConfigured) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    vapidConfigured = true;
  }
  return true;
}

export function isPushConfigured(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY) &&
      process.env.VAPID_PRIVATE_KEY,
  );
}

type SubscriptionRow = {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
};

/**
 * Cuenta de alertas pendientes para el contador (App Badge): cotizaciones +
 * solicitudes en estado "nuevo". Es el mismo número que muestra el dashboard.
 */
export async function getAdminAlertCount(
  supabase: SupabaseClient,
): Promise<number> {
  const [cot, leads] = await Promise.all([
    supabase
      .from("cotizaciones")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nuevo"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("estado", "nuevo"),
  ]);
  return (cot.count ?? 0) + (leads.count ?? 0);
}

/**
 * Envía un push a TODAS las suscripciones de administradores.
 * Devuelve cuántas llegaron y cuántas suscripciones muertas se limpiaron.
 */
export async function sendPushToAdmins(
  payload: PushPayload,
  options?: { supabase?: SupabaseClient },
): Promise<{ sent: number; failed: number; pruned: number; skipped?: string }> {
  if (!ensureVapid()) {
    console.warn("[push] Claves VAPID no configuradas — push omitido:", payload.title);
    return { sent: 0, failed: 0, pruned: 0, skipped: "vapid_no_configurado" };
  }

  const supabase = options?.supabase ?? (await createServiceClient());

  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("id, endpoint, p256dh, auth");

  if (error) {
    console.error("[push] No se pudieron leer las suscripciones:", error.message);
    return { sent: 0, failed: 0, pruned: 0, skipped: "sin_suscripciones" };
  }

  const subscriptions = (subs ?? []) as SubscriptionRow[];
  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, pruned: 0, skipped: "sin_suscripciones" };
  }

  const body = JSON.stringify(payload);
  const deadIds: string[] = [];
  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          body,
          { TTL: 60 * 60 * 24, urgency: "high" },
        );
        sent += 1;
      } catch (err: unknown) {
        failed += 1;
        const statusCode =
          typeof err === "object" && err !== null && "statusCode" in err
            ? (err as { statusCode?: number }).statusCode
            : undefined;
        // 404/410 = suscripción caducada o revocada: hay que eliminarla.
        if (statusCode === 404 || statusCode === 410) {
          deadIds.push(sub.id);
        } else {
          console.error("[push] Error enviando a una suscripción:", statusCode ?? err);
        }
      }
    }),
  );

  if (deadIds.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", deadIds);
  }

  return { sent, failed, pruned: deadIds.length };
}
