import "server-only";
import { FEATURE_WHATSAPP } from "@/lib/features";

/**
 * Alertas por WhatsApp vía WhatsApp Business Cloud API (Meta), sin dependencias.
 * SOLO se ejecuta en el servidor (`server-only`): el WHATSAPP_TOKEN nunca llega
 * al cliente.
 *
 * Requiere en el entorno:
 *   WHATSAPP_TOKEN     — token de acceso (permanente) de la app de Meta
 *   WHATSAPP_PHONE_ID  — ID del número de teléfono emisor (Phone Number ID)
 *   WHATSAPP_TO        — destinatarios separados por coma, formato internacional
 *                        (se limpian +, espacios, guiones y todo lo no numérico):
 *                        ej. 56939579658,56984752936,56998296350
 *   WHATSAPP_TEMPLATE  — plantilla APROBADA de cotización: header de tipo
 *                        DOCUMENT (el PDF) + 15 variables de body en este orden:
 *                        folio, nombre, empresa, rut, telefono, correo, comuna,
 *                        direccion, servicio, combustible, volumen, frecuencia,
 *                        fechaEntrega, equipo, detalles.
 * Opcionales:
 *   WHATSAPP_LANG          — idioma de la plantilla (por defecto "es_CL")
 *   WHATSAPP_API_VERSION   — versión del Graph API (por defecto "v21.0")
 *   WHATSAPP_TEMPLATE_LEAD — plantilla (1 variable) para avisos de contacto/lead;
 *                            si no se define, los leads NO envían WhatsApp.
 *
 * Nada de esto bloquea ni rompe el guardado de la cotización, el correo ni el
 * push: si algo falla o no está configurado, se registra y se sigue.
 */

const DEFAULT_LANG = "es_CL";
const DEFAULT_VERSION = "v21.0";

type WhatsAppResult = {
  sent: number;
  failed: number;
  failedNumbers: string[];
  skipped?: string;
};

export type WhatsAppQuoteData = {
  folio: string;
  nombre: string;
  empresa: string;
  rut?: string | null;
  telefono: string;
  correo: string;
  comuna?: string | null;
  direccion?: string | null;
  servicio: string;
  combustible?: string | null;
  volumen?: string | null;
  frecuencia?: string | null;
  fechaEntrega?: string | null;
  equipo?: string | null;
  detalles?: string | null;
};

/** Limpia un número: deja solo dígitos (quita +, espacios, guiones, etc.). */
function normalizeNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Lista de destinatarios saneada desde WHATSAPP_TO. */
export function recipients(): string[] {
  return (process.env.WHATSAPP_TO ?? "")
    .split(",")
    .map(normalizeNumber)
    .filter(Boolean);
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_TOKEN &&
      process.env.WHATSAPP_PHONE_ID &&
      recipients().length > 0,
  );
}

/**
 * Sanea un valor para usarlo como variable de plantilla: Meta rechaza saltos de
 * línea, tabulaciones o 4+ espacios seguidos. Colapsa espacios y evita vacíos.
 */
function safeParam(value?: string | null): string {
  const text = (value ?? "").replace(/\s+/g, " ").trim();
  return text ? text.slice(0, 900) : "No informado";
}

function apiBase(): string {
  const version = process.env.WHATSAPP_API_VERSION || DEFAULT_VERSION;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  return `https://graph.facebook.com/${version}/${phoneId}`;
}

/**
 * Sube el PDF a Meta UNA vez y devuelve el media id (reutilizable para todos los
 * destinatarios). Evita exponer el PDF con una URL pública.
 */
async function uploadPdfMedia(
  token: string,
  pdfBytes: Uint8Array,
  filename: string,
): Promise<string> {
  const form = new FormData();
  form.append("messaging_product", "whatsapp");
  form.append("type", "application/pdf");
  form.append(
    "file",
    new Blob([pdfBytes as BlobPart], { type: "application/pdf" }),
    filename,
  );

  const res = await fetch(`${apiBase()}/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const json = (await res.json().catch(() => null)) as { id?: string; error?: { message?: string } } | null;
  if (!res.ok || !json?.id) {
    throw new Error(json?.error?.message ?? `Fallo al subir el PDF (HTTP ${res.status})`);
  }
  return json.id;
}

/** Envía la plantilla a UN destinatario. Lanza si Meta responde error. */
async function sendTemplateMessage(
  token: string,
  to: string,
  template: string,
  lang: string,
  components: unknown[],
): Promise<void> {
  const res = await fetch(`${apiBase()}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "template",
      template: {
        name: template,
        language: { code: lang },
        components,
      },
    }),
  });

  if (!res.ok) {
    const detail = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(detail?.error?.message ?? `HTTP ${res.status}`);
  }
}

/**
 * Envía la cotización (plantilla con PDF adjunto + 15 variables) a TODOS los
 * destinatarios de WHATSAPP_TO. El PDF se sube una sola vez y se reutiliza.
 * Un fallo en un número no impide el envío a los demás (Promise.allSettled).
 */
export async function sendCotizacionWhatsApp(
  data: WhatsAppQuoteData,
  pdfBytes?: Uint8Array,
): Promise<WhatsAppResult> {
  // Suspendido hasta autorización/pago del cliente.
  if (!FEATURE_WHATSAPP) {
    return { sent: 0, failed: 0, failedNumbers: [], skipped: "suspendido" };
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const template = process.env.WHATSAPP_TEMPLATE;
  const lang = process.env.WHATSAPP_LANG || DEFAULT_LANG;
  const to = recipients();

  // WHATSAPP_TO vacío (o config incompleta) → se omite sin afectar nada más.
  if (!token || !phoneId || !template || to.length === 0) {
    console.warn("[whatsapp] Sin configuración o sin destinatarios — cotización WhatsApp omitida.");
    return { sent: 0, failed: 0, failedNumbers: [], skipped: "no_configurado" };
  }

  if (!pdfBytes || pdfBytes.length === 0) {
    console.warn("[whatsapp] No hay PDF disponible — cotización WhatsApp omitida.");
    return { sent: 0, failed: 0, failedNumbers: [], skipped: "sin_pdf" };
  }

  const filename = `cotizacion-${data.folio}.pdf`;

  // 1) Subir el PDF a Meta una sola vez.
  let mediaId: string;
  try {
    mediaId = await uploadPdfMedia(token, pdfBytes, filename);
  } catch (err) {
    console.error("[whatsapp] No se pudo subir el PDF a Meta:", err);
    return { sent: 0, failed: to.length, failedNumbers: to, skipped: "error_media" };
  }

  // 2) Componentes: header con el documento + 15 variables de body en orden.
  const bodyValues = [
    data.folio,
    data.nombre,
    data.empresa,
    data.rut,
    data.telefono,
    data.correo,
    data.comuna,
    data.direccion,
    data.servicio,
    data.combustible,
    data.volumen,
    data.frecuencia,
    data.fechaEntrega,
    data.equipo,
    data.detalles,
  ];

  const components = [
    {
      type: "header",
      parameters: [
        {
          type: "document",
          document: { id: mediaId, filename },
        },
      ],
    },
    {
      type: "body",
      parameters: bodyValues.map((value) => ({ type: "text", text: safeParam(value) })),
    },
  ];

  // 3) Enviar a cada destinatario por separado; un fallo no frena a los demás.
  const results = await Promise.allSettled(
    to.map((numero) => sendTemplateMessage(token, numero, template, lang, components)),
  );

  const failedNumbers: string[] = [];
  let sent = 0;
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      sent += 1;
    } else {
      failedNumbers.push(to[i]);
      console.error(`[whatsapp] Falló el envío a ${to[i]}:`, result.reason?.message ?? result.reason);
    }
  });

  if (failedNumbers.length > 0) {
    console.error(`[whatsapp] Números con fallo (${failedNumbers.length}/${to.length}): ${failedNumbers.join(", ")}`);
  }

  return { sent, failed: failedNumbers.length, failedNumbers };
}

/**
 * Aviso simple de lead/contacto por WhatsApp. Usa una plantilla propia de 1
 * variable (WHATSAPP_TEMPLATE_LEAD). Si no está definida, se omite (los leads
 * siguen recibiendo correo + push). No usa la plantilla de cotización.
 */
export async function sendWhatsAppAlert(texto: string): Promise<WhatsAppResult> {
  // Suspendido hasta autorización/pago del cliente.
  if (!FEATURE_WHATSAPP) {
    return { sent: 0, failed: 0, failedNumbers: [], skipped: "suspendido" };
  }

  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const template = process.env.WHATSAPP_TEMPLATE_LEAD;
  const lang = process.env.WHATSAPP_LANG || DEFAULT_LANG;
  const to = recipients();

  if (!token || !phoneId || !template || to.length === 0) {
    return { sent: 0, failed: 0, failedNumbers: [], skipped: "no_configurado" };
  }

  const components = [
    { type: "body", parameters: [{ type: "text", text: safeParam(texto) }] },
  ];

  const results = await Promise.allSettled(
    to.map((numero) => sendTemplateMessage(token, numero, template, lang, components)),
  );

  const failedNumbers: string[] = [];
  let sent = 0;
  results.forEach((result, i) => {
    if (result.status === "fulfilled") sent += 1;
    else {
      failedNumbers.push(to[i]);
      console.error(`[whatsapp] Falló el aviso de lead a ${to[i]}:`, result.reason?.message ?? result.reason);
    }
  });

  return { sent, failed: failedNumbers.length, failedNumbers };
}
