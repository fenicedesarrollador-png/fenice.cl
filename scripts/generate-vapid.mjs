/**
 * Genera un par de claves VAPID para Web Push.
 *
 *   node scripts/generate-vapid.mjs
 *
 * Copia las 3 variables que imprime a tu entorno (Vercel → Project → Settings
 * → Environment Variables, y a tu .env.local para desarrollo). La clave pública
 * se expone al navegador (NEXT_PUBLIC_…); la privada NUNCA debe filtrarse.
 *
 * Genera las claves UNA sola vez y consérvalas: si las cambias, todas las
 * suscripciones push existentes dejan de funcionar y hay que volver a activar
 * las notificaciones en cada dispositivo.
 */
import webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();

console.log("\n Claves VAPID generadas — pégalas en tus variables de entorno:\n");
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${privateKey}`);
console.log(`VAPID_SUBJECT=mailto:notifica@fenice.cl`);
console.log("\n  Guarda la clave privada de forma segura. No la subas al repo.\n");
