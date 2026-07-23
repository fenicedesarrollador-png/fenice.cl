import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendPushToAdmins, getAdminAlertCount } from "@/lib/push/webpush";
import { sendWhatsAppAlert, sendCotizacionWhatsApp } from "@/lib/whatsapp/send";

/**
 * Notificación multicanal para el equipo cuando entra una nueva solicitud:
 *   1) Web Push a todos los dispositivos admin (con el contador para el badge).
 *   2) WhatsApp Business a los números configurados.
 *
 * Nunca lanza ni bloquea: el registro en base de datos ya ocurrió antes.
 * Usa el service client (bypassa RLS) para contar y leer suscripciones.
 */

type CotizacionAlert = {
  id: string;
  nombre: string;
  empresa: string;
  servicio_solicitado: string;
  comuna?: string | null;
  telefono?: string | null;
  email?: string | null;
  rut_empresa?: string | null;
  direccion_entrega?: string | null;
  tipo_combustible?: string | null;
  volumen_estimado?: string | null;
  frecuencia?: string | null;
  fecha_estimada?: string | null;
  tipo_instalacion?: string | null;
  mensaje?: string | null;
};

type LeadAlert = {
  id: string;
  nombre: string;
  comuna?: string | null;
  tipo_operacion?: string | null;
  telefono?: string | null;
};

export async function notifyNuevaCotizacion(
  service: SupabaseClient,
  cot: CotizacionAlert,
  pdfBytes?: Uint8Array,
): Promise<void> {
  try {
    const badgeCount = await getAdminAlertCount(service);
    const folio = cot.id.slice(0, 8).toUpperCase();
    const body = `${cot.empresa} · ${cot.servicio_solicitado}`;

    await Promise.allSettled([
      sendPushToAdmins(
        {
          title: "🔥 Nueva cotización — Fenice",
          body,
          url: `/admin/cotizaciones`,
          tag: `cotizacion-${cot.id}`,
          badgeCount,
        },
        { supabase: service },
      ),
      // WhatsApp con la plantilla de cotización + el PDF adjunto, a todos los
      // destinatarios de WHATSAPP_TO. Se omite solo si no está configurado.
      sendCotizacionWhatsApp(
        {
          folio,
          nombre: cot.nombre,
          empresa: cot.empresa,
          rut: cot.rut_empresa,
          telefono: cot.telefono ?? "No informado",
          correo: cot.email ?? "No informado",
          comuna: cot.comuna,
          direccion: cot.direccion_entrega,
          servicio: cot.servicio_solicitado,
          combustible: cot.tipo_combustible,
          volumen: cot.volumen_estimado,
          frecuencia: cot.frecuencia,
          fechaEntrega: cot.fecha_estimada,
          equipo: cot.tipo_instalacion,
          detalles: cot.mensaje,
        },
        pdfBytes,
      ),
    ]);
  } catch (err) {
    console.error("[notify] notifyNuevaCotizacion falló:", err);
  }
}

export async function notifyNuevoLead(
  service: SupabaseClient,
  lead: LeadAlert,
): Promise<void> {
  try {
    const badgeCount = await getAdminAlertCount(service);
    const detalle = [
      `Nombre: ${lead.nombre}`,
      lead.tipo_operacion && `Operación: ${lead.tipo_operacion}`,
      lead.comuna && `Comuna: ${lead.comuna}`,
      lead.telefono && `Teléfono: ${lead.telefono}`,
    ]
      .filter(Boolean)
      .join("\n");

    const body = [lead.nombre, lead.comuna].filter(Boolean).join(" · ");

    await Promise.allSettled([
      sendPushToAdmins(
        {
          title: "📩 Nueva solicitud de contacto — Fenice",
          body,
          url: `/admin/leads`,
          tag: `lead-${lead.id}`,
          badgeCount,
        },
        { supabase: service },
      ),
      sendWhatsAppAlert(
        `📩 *Nueva solicitud de contacto*\n${detalle}\n\nRevísala en el panel: fenice.cl/admin/leads`,
      ),
    ]);
  } catch (err) {
    console.error("[notify] notifyNuevoLead falló:", err);
  }
}
