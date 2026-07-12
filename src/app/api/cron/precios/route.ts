import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/resend";
import { preciosAlertaEmail, type PrecioPorVencer } from "@/lib/email/templates";
import { NOTIFY_EMAILS } from "@/lib/config";

export const dynamic = "force-dynamic";

/**
 * Cron de precios de combustible. Hace dos cosas:
 *
 * 1) PUBLICACIÓN PROGRAMADA — aplica los precios cuya hora de publicación
 *    llegó (vía función SQL idempotente) y revalida la home.
 *    (La web pública también la ejecuta en cada render ISR, por lo que la
 *    publicación es puntual aunque el cron corra pocas veces al día.)
 *
 * 2) ALERTAS DE VENCIMIENTO — a las 10:00 de Chile envía UN correo a los
 *    correos internos listando los precios que vencen hoy o mañana, con
 *    dedup vía fuel_prices.alerta_enviada_at.
 *
 * Seguridad: requiere CRON_SECRET (Vercel lo envía como Bearer token en
 * los cron jobs; también se acepta ?secret= para pruebas manuales).
 * vercel.json lo agenda a las 13:00 y 14:00 UTC — el chequeo de hora local
 * hace que las alertas salgan exactamente a las 10:00 de Chile todo el año
 * (el huso chileno alterna entre UTC-3 y UTC-4).
 */

function santiagoHour(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "America/Santiago" }).format(date),
  );
}

function santiagoDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(date);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  const provided = request.headers.get("authorization")?.replace("Bearer ", "") ?? url.searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const force = url.searchParams.get("force") === "1";
  const now = new Date();
  const summary: Record<string, unknown> = { hora_santiago: santiagoHour(now) };

  const supabase = await createServiceClient();

  // ── 1) Publicar precios programados cuya hora llegó ─────────────────
  const { data: aplicados, error: rpcError } = await supabase.rpc("aplicar_precios_programados");
  summary.precios_publicados = rpcError ? `error: ${rpcError.message}` : (aplicados ?? 0);
  if (!rpcError && typeof aplicados === "number" && aplicados > 0) {
    revalidatePath("/");
  }

  // ── 2) Alertas de vencimiento (solo a las 10:00 de Chile) ───────────
  const esHoraDeAlerta = santiagoHour(now) === 10 || force;
  summary.ventana_alerta = esHoraDeAlerta;

  if (esHoraDeAlerta) {
    const { data: porVencer, error: qError } = await supabase
      .from("fuel_prices")
      .select("id, name, price, unit, vence_at")
      .eq("is_visible", true)
      .not("vence_at", "is", null)
      .gt("vence_at", now.toISOString())
      .is("alerta_enviada_at", null);

    if (qError) {
      summary.alertas = `error: ${qError.message}`;
    } else {
      // Vencen hoy o mañana según el calendario de Chile
      const manana = santiagoDate(new Date(now.getTime() + 86_400_000));
      const urgentes = (porVencer ?? []).filter(
        (p) => santiagoDate(new Date(p.vence_at as string)) <= manana,
      );

      if (urgentes.length === 0) {
        summary.alertas = "sin precios por vencer";
      } else {
        const enviado = await sendEmail({
          to: [...NOTIFY_EMAILS],
          subject: `⚠ ${urgentes.length === 1 ? "Precio de combustible vence pronto" : `${urgentes.length} precios de combustible vencen pronto`} — Fenice`,
          html: preciosAlertaEmail(urgentes as PrecioPorVencer[]),
        });

        if (enviado) {
          await supabase
            .from("fuel_prices")
            .update({ alerta_enviada_at: now.toISOString() })
            .in("id", urgentes.map((p) => p.id));
          summary.alertas = `correo enviado (${urgentes.length} precio${urgentes.length > 1 ? "s" : ""}) a ${NOTIFY_EMAILS.length} destinatarios`;
        } else {
          // No se marca alerta_enviada_at: se reintentará en la próxima corrida.
          summary.alertas = "falló el envío del correo — se reintentará";
        }
      }
    }
  }

  return NextResponse.json({ ok: true, ...summary });
}
