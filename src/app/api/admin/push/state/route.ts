import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { isPushConfigured } from "@/lib/push/webpush";

export const dynamic = "force-dynamic";

/**
 * Estado para el contador de alertas del panel:
 *   - count: cotizaciones + solicitudes en estado "nuevo" (el número del badge)
 *   - desglose por tipo
 *   - si este dispositivo tiene ya una suscripción registrada (por endpoint)
 *   - la clave pública VAPID y si el push está configurado en el servidor
 */
export async function GET(request: Request) {
  const { user, supabase } = await requireAdmin();
  if (!user || !supabase) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

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

  const cotizacionesNuevas = cot.count ?? 0;
  const leadsNuevos = leads.count ?? 0;
  const count = cotizacionesNuevas + leadsNuevos;

  // ¿Este endpoint concreto ya está suscrito? (para pintar el botón correcto)
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint");
  let subscribed = false;
  if (endpoint) {
    const { count: subCount } = await supabase
      .from("push_subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("endpoint", endpoint)
      .eq("user_id", user.id);
    subscribed = (subCount ?? 0) > 0;
  }

  return NextResponse.json({
    count,
    cotizacionesNuevas,
    leadsNuevos,
    subscribed,
    pushConfigured: isPushConfigured(),
    vapidPublicKey:
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || null,
  });
}
