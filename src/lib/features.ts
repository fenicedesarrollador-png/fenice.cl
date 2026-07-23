/**
 * Interruptores de funciones (feature flags).
 *
 * Notificaciones push y WhatsApp quedan SUSPENDIDAS por defecto: son parte de
 * una implementación que aún no está autorizada/pagada. El código sigue intacto;
 * solo no se activa hasta habilitar el flag.
 *
 * Para REACTIVAR cuando el cliente autorice y pague, basta con setear la variable
 * de entorno correspondiente a "true" en Render (Settings → Environment) — NO hay
 * que tocar código:
 *   NEXT_PUBLIC_FEATURE_NOTIFICATIONS=true   (alertas push + campana del panel)
 *   FEATURE_WHATSAPP=true                    (envío por WhatsApp de cotizaciones)
 *
 * Si la variable no existe o no es exactamente "true", la función queda apagada.
 */

// Debe ser NEXT_PUBLIC_ porque también se lee en el cliente (la campana del panel).
export const FEATURE_NOTIFICATIONS =
  process.env.NEXT_PUBLIC_FEATURE_NOTIFICATIONS === "true";

// Solo servidor.
export const FEATURE_WHATSAPP = process.env.FEATURE_WHATSAPP === "true";
