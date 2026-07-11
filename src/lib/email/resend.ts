/**
 * Cliente mínimo de Resend vía API HTTP (sin dependencias).
 * Requiere en el entorno:
 *   RESEND_API_KEY   — API key de https://resend.com
 *   EMAIL_FROM       — remitente verificado, ej: "Fenice SPA <ventas@fenice.cl>"
 *
 * El envío de correo NUNCA debe bloquear ni romper el registro de la
 * cotización en la base de datos: todos los errores se capturan y loguean.
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type EmailPayload = {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export async function sendEmail({ to, subject, html, replyTo }: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY no configurada — correo omitido:", subject);
    return false;
  }

  const from = process.env.EMAIL_FROM ?? "Fenice SPA <ventas@fenice.cl>";

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(`[email] Resend respondió ${response.status}:`, detail);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] Error enviando correo:", error);
    return false;
  }
}
