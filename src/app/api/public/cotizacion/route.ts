import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { linkAnalyticsIdentity } from "@/lib/analytics/server";
import { sendEmail, type EmailAttachment } from "@/lib/email/resend";
import { cotizacionInternaEmail, cotizacionClienteEmail } from "@/lib/email/templates";
import { buildCotizacionPdf } from "@/lib/admin/cotizacionPdf";
import { hasCompletePhone, normalizePhoneForStorage, normalizeRutForStorage } from "@/lib/contactFormat";
import { NOTIFY_EMAILS } from "@/lib/config";
import { notifyNuevaCotizacion } from "@/lib/notify/adminAlert";

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
    const rawTelefono = normalizeRequiredText(body.telefono);

    const payload = {
      nombre: normalizeRequiredText(body.nombre),
      empresa: normalizeRequiredText(body.empresa),
      rut_empresa: typeof body.rut_empresa === "string" ? normalizeRutForStorage(body.rut_empresa.trim()) : null,
      email: normalizeRequiredText(body.email),
      telefono: normalizePhoneForStorage(rawTelefono),
      comuna: normalizeOptionalText(body.comuna),
      servicio_solicitado: normalizeRequiredText(body.servicio_solicitado),
      tipo_combustible: normalizeOptionalText(body.tipo_combustible),
      direccion_entrega: normalizeOptionalText(body.direccion_entrega),
      fecha_estimada: normalizeOptionalText(body.fecha_estimada),
      tipo_instalacion: normalizeOptionalText(body.tipo_instalacion),
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

    if (!hasCompletePhone(rawTelefono)) {
      return NextResponse.json(
        { error: "El teléfono debe incluir 8 dígitos después del +56 9." },
        { status: 400 },
      );
    }

    const serviceClient = await createServiceClient();
    let { data, error } = await serviceClient
      .from("cotizaciones")
      .insert(payload)
      .select("id, created_at")
      .single();

    // Compatibilidad: si aún no se ejecutó migration_potenciacion_comercial.sql
    // (columnas nuevas inexistentes), reintenta sin esos campos y conserva el
    // detalle dentro del mensaje para no perder información del cliente.
    if (error && /column|schema cache/i.test(error.message ?? "")) {
      const { tipo_combustible, direccion_entrega, fecha_estimada, tipo_instalacion, ...base } = payload;
      const extras = [
        tipo_combustible && `Combustible: ${tipo_combustible}`,
        direccion_entrega && `Dirección de entrega: ${direccion_entrega}`,
        fecha_estimada && `Fecha estimada: ${fecha_estimada}`,
        tipo_instalacion && `Instalación/equipo: ${tipo_instalacion}`,
      ].filter(Boolean).join(" · ");
      const retry = await serviceClient
        .from("cotizaciones")
        .insert({ ...base, mensaje: [base.mensaje, extras].filter(Boolean).join("\n") || null })
        .select("id, created_at")
        .single();
      data = retry.data;
      error = retry.error;
    }

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
    let pdfBytes: Uint8Array | undefined;
    try {
      pdfBytes = await buildCotizacionPdf({
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
      // Notificación en tiempo real al panel: Web Push (badge incluido) +
      // WhatsApp con la plantilla de cotización y el MISMO PDF adjunto.
      notifyNuevaCotizacion(
        serviceClient,
        {
          id: data.id,
          nombre: payload.nombre,
          empresa: payload.empresa,
          servicio_solicitado: payload.servicio_solicitado,
          comuna: payload.comuna,
          telefono: payload.telefono,
          email: payload.email,
          rut_empresa: payload.rut_empresa,
          direccion_entrega: payload.direccion_entrega,
          tipo_combustible: payload.tipo_combustible,
          volumen_estimado: payload.volumen_estimado,
          frecuencia: payload.frecuencia,
          fecha_estimada: payload.fecha_estimada,
          tipo_instalacion: payload.tipo_instalacion,
          mensaje: payload.mensaje,
        },
        pdfBytes,
      ),
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
