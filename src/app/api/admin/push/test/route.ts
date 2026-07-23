import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { sendPushToAdmins, getAdminAlertCount, isPushConfigured } from "@/lib/push/webpush";
import { FEATURE_NOTIFICATIONS } from "@/lib/features";

export const dynamic = "force-dynamic";

/**
 * Envía una notificación de prueba a los dispositivos suscritos del admin.
 * Sirve para que confirme, dispositivo por dispositivo, que las alertas llegan
 * aunque la app esté cerrada.
 */
export async function POST() {
  const { user, supabase } = await requireAdmin();
  if (!user || !supabase) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!FEATURE_NOTIFICATIONS) {
    return NextResponse.json(
      { error: "Las notificaciones están suspendidas hasta autorizar la función." },
      { status: 503 },
    );
  }

  if (!isPushConfigured()) {
    return NextResponse.json(
      { error: "Las notificaciones push no están configuradas en el servidor (faltan claves VAPID)." },
      { status: 503 },
    );
  }

  const service = await createServiceClient();
  const badgeCount = await getAdminAlertCount(service);

  const result = await sendPushToAdmins(
    {
      title: "Notificación de prueba",
      body: "Las alertas del panel funcionan en este dispositivo.",
      url: "/admin/cotizaciones",
      tag: "fenice-test",
      badgeCount,
    },
    { supabase: service },
  );

  if (result.sent === 0) {
    return NextResponse.json(
      {
        ok: false,
        ...result,
        error:
          "No se envió a ningún dispositivo. Activa las notificaciones en este dispositivo primero.",
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ ok: true, ...result });
}
