import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { linkAnalyticsIdentity } from "@/lib/analytics/server";
import { sendEmail } from "@/lib/email/resend";
import { contactoInternoEmail } from "@/lib/email/templates";
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

function isValidEmail(value: string | null) {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const payload = {
      nombre: normalizeRequiredText(body.nombre),
      telefono: normalizeOptionalText(body.telefono),
      email: normalizeOptionalText(body.email),
      comuna: normalizeRequiredText(body.comuna),
      tipo_operacion: normalizeRequiredText(body.tipo_operacion),
      volumen: normalizeOptionalText(body.volumen),
      mensaje: normalizeOptionalText(body.mensaje),
      estado: "nuevo",
    };

    if (!payload.nombre || !payload.comuna || !payload.tipo_operacion) {
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
      .from("leads")
      .insert(payload)
      .select("id")
      .single();

    if (error || !data?.id) {
      return NextResponse.json(
        { error: error?.message ?? "No se pudo crear el lead." },
        { status: 500 },
      );
    }

    await linkAnalyticsIdentity(serviceClient, request, { leadId: data.id });

    // Notificación interna por correo (Resend) — no bloquea la respuesta.
    await Promise.allSettled([
      sendEmail({
        to: [...NOTIFY_EMAILS],
        subject: `Nuevo contacto — ${payload.nombre} (${payload.tipo_operacion})`,
        html: contactoInternoEmail(payload),
        ...(payload.email ? { replyTo: payload.email } : {}),
      }),
    ]);

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("[POST /api/public/contacto]", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}

