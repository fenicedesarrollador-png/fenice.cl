import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { linkAnalyticsIdentity } from "@/lib/analytics/server";
import { sendEmail, type EmailAttachment } from "@/lib/email/resend";
import { cotizacionInternaEmail, cotizacionClienteEmail } from "@/lib/email/templates";
import { buildCotizacionPdf } from "@/lib/admin/cotizacionPdf";
import { NOTIFY_EMAILS } from "@/lib/config";

function normalizeOptionalText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeRequiredText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const payload = {
      nombre: normalizeRequiredText(body.nombre),
      empresa: normalizeRequiredText(body.empresa),
      rut_empresa: normalizeOptionalText(body.rut_empresa),
      email: normalizeRequiredText(body.email),
      telefono: normalizeRequiredText(body.telefono),
      comuna: normalizeOptionalText(body.comuna),
      servicio_solicitado: normalizeRequiredText(body.servicio_solicitado),
      volumen_estimado: normalizeOptionalText(body.volumen_estimado),
      frecuencia: normalizeOptionalText(body.frecuencia),
      mensaje: normalizeOptionalText(body.mensaje),
      estado: "nuevo",
    };

    if (
      !payload.nombre ||
      !payload.empresa ||
      !payload.email ||
      !payload.telefono ||
      !payload.servicio_solicitado
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios del formulario." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { error: "El correo electrónico no es válido." },
        { status: 400 },
      );
    }

    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient
      .from("cotizaciones")
      .insert(payload)
      .select("id, created_at")
      .single();

    if (error || !data?.id) {
      return NextResponse.json(
        { error: error?.message ?? "No se pudo crear la cotización." },
        { status: 500 },
      );
    }

    await linkAnalyticsIdentity(serviceClient, request, { cotizacionId: data.id });

    // PDF corporativo de la solicitud, adjunto en la notificación interna.
    // Si el PDF falla por cualquier motivo, el correo se envía igual (sin adjunto).
    const folio = data.id.slice(0, 8).toUpperCase();
    let adjuntos: EmailAttachment[] | undefined;
    try {
      const pdfBytes = await buildCotizacionPdf({
        ...payload,
        id: data.id,
        created_at: data.created_at ?? new Date().toISOString(),
      });
      adjuntos = [
        {
          filename: `Cotizacion-${folio}-${payload.empresa.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40)}.pdf`,
          content: Buffer.from(pdfBytes).toString("base64"),
          contentType: "application/pdf",
        },
      ];
    } catch (pdfError) {
      console.error("[cotizacion] No se pudo generar el PDF adjunto:", pdfError);
    }

    // Notificaciones por correo (Resend). Nunca bloquean la respuesta:
    // la cotización ya quedó registrada en el panel administrativo.
    const emailData = { ...payload, id: data.id };
    await Promise.allSettled([
      sendEmail({
        to: [...NOTIFY_EMAILS],
        subject: `Nueva cotización — ${payload.empresa} (${payload.servicio_solicitado})`,
        html: cotizacionInternaEmail(emailData),
        replyTo: payload.email,
        attachments: adjuntos,
      }),
      sendEmail({
        to: [payload.email],
        subject: "Recibimos tu solicitud de cotización — Fenice SPA",
        html: cotizacionClienteEmail(emailData),
      }),
    ]);

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("[POST /api/public/cotizacion]", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}

