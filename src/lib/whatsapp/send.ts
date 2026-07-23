/**
 * Alertas por WhatsApp vía WhatsApp Business Cloud API (Meta), sin dependencias.
 *
 * Requiere en el entorno:
 *   WHATSAPP_TOKEN     — token de acceso (permanente) de la app de Meta
 *   WHATSAPP_PHONE_ID  — ID del número de teléfono emisor (Phone Number ID)
 *   WHATSAPP_TO        — destinatarios separados por coma, formato internacional
 *                        sin "+", p. ej: 56912345678,56987654321
 * Opcionales:
 *   WHATSAPP_TEMPLATE  — nombre de una plantilla APROBADA con UNA variable de
 *                        cuerpo {{1}}. Recomendado: los mensajes proactivos
 *                        (fuera de la ventana de 24 h) EXIGEN plantilla.
 *   WHATSAPP_LANG      — código de idioma de la plantilla (por defecto "es")
 *   WHATSAPP_API_VERSION — versión del Graph API (por defecto "v21.0")
 *
 * Si no está configurado, no hace nada (devuelve false) y NUNCA rompe el flujo
 * de registro de la cotización.
 */

type WhatsAppResult = { sent: number; failed: number; skipped?: string };

function recipients(): string[] {
  return (process.env.WHATSAPP_TO ?? "")
    .split(",")
    .map((s) => s.replace(/[^\d]/g, "").trim())
    .filter(Boolean);
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_TOKEN &&
      process.env.WHATSAPP_PHONE_ID &&
      recipients().length > 0,
  );
}

async function sendOne(
  endpoint: string,
  token: string,
  message: object,
): Promise<boolean> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[whatsapp] Meta respondió ${res.status}:`, detail);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[whatsapp] Error de red enviando mensaje:", err);
    return false;
  }
}

/**
 * Envía una alerta de texto a todos los destinatarios configurados.
 * `texto` es el resumen completo (título + líneas). Si hay WHATSAPP_TEMPLATE,
 * usa la plantilla aprobada pasando `texto` como su única variable {{1}}
 * (única forma fiable de iniciar conversación fuera de la ventana de 24 h).
 */
export async function sendWhatsAppAlert(texto: string): Promise<WhatsAppResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const to = recipients();

  if (!token || !phoneId || to.length === 0) {
    console.warn("[whatsapp] No configurado — alerta omitida.");
    return { sent: 0, failed: 0, skipped: "no_configurado" };
  }

  const version = process.env.WHATSAPP_API_VERSION || "v21.0";
  const endpoint = `https://graph.facebook.com/${version}/${phoneId}/messages`;
  const template = process.env.WHATSAPP_TEMPLATE;
  const lang = process.env.WHATSAPP_LANG || "es";

  let sent = 0;
  let failed = 0;

  await Promise.all(
    to.map(async (numero) => {
      const message = template
        ? {
            messaging_product: "whatsapp",
            to: numero,
            type: "template",
            template: {
              name: template,
              language: { code: lang },
              components: [
                {
                  type: "body",
                  parameters: [{ type: "text", text: texto.slice(0, 1024) }],
                },
              ],
            },
          }
        : {
            messaging_product: "whatsapp",
            to: numero,
            type: "text",
            text: { preview_url: false, body: texto.slice(0, 4096) },
          };

      const ok = await sendOne(endpoint, token, message);
      if (ok) sent += 1;
      else failed += 1;
    }),
  );

  return { sent, failed };
}
