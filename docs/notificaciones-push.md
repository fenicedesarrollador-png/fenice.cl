# Notificaciones en tiempo real del panel administrativo

Alertas de nuevas **cotizaciones** y **solicitudes de contacto** para el equipo
Fenice. Funcionan **solo en `/admin`** (la web pública no se ve afectada) y llegan
a **Windows, macOS, Android e iPhone**, incluso con la app o la pestaña cerradas,
con **contador rojo** en el ícono de la app.

Canales:
1. **Web Push** (notificación del sistema + badge en el ícono).
2. **Contador en vivo** dentro del panel (Supabase Realtime).
3. **WhatsApp** a los números del equipo (opcional).
4. Correo (Resend) — ya existía.

---

## 1. Base de datos

Ejecutar en el **SQL editor de Supabase** (idempotente):

```
supabase/migration_push_notifications.sql
```

Crea la tabla `push_subscriptions` (con RLS por usuario) y añade `cotizaciones`
y `leads` a la publicación de Supabase Realtime.

## 2. Claves VAPID (obligatorio para el push)

Genera el par **una sola vez** y consérvalo:

```bash
node scripts/generate-vapid.mjs
```

Copia las 3 variables a **Vercel → Settings → Environment Variables** y a tu
`.env.local`:

| Variable | Ámbito | Descripción |
|---|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | público | clave pública VAPID |
| `VAPID_PRIVATE_KEY` | **secreto** | clave privada (nunca al repo) |
| `VAPID_SUBJECT` | secreto | `mailto:notifica@fenice.cl` |

> Si cambias las claves, todas las suscripciones dejan de funcionar y hay que
> volver a activar las notificaciones en cada dispositivo.

## 3. WhatsApp (cotización con PDF a varios números)

Vía **WhatsApp Business Cloud API** de Meta. Variables:

| Variable | Descripción |
|---|---|
| `WHATSAPP_TOKEN` | token de acceso permanente de la app de Meta (solo servidor) |
| `WHATSAPP_PHONE_ID` | *Phone Number ID* del número emisor |
| `WHATSAPP_TO` | **uno o varios** destinatarios separados por coma (se limpian `+`, espacios, guiones): `56939579658,56984752936,56998296350` |
| `WHATSAPP_TEMPLATE` | plantilla **aprobada** de cotización: header tipo **DOCUMENT** (el PDF) + **15 variables** de body |
| `WHATSAPP_LANG` | *(opcional)* idioma de la plantilla, por defecto `es_CL` |
| `WHATSAPP_API_VERSION` | *(opcional)* por defecto `v21.0` |
| `WHATSAPP_TEMPLATE_LEAD` | *(opcional)* plantilla de 1 variable para avisos de contacto/lead; sin ella, los leads no envían WhatsApp |

**Plantilla de cotización.** El cuerpo debe tener 15 variables en ESTE orden
(`{{1}}`…`{{15}}`): folio, nombre, empresa, rut, teléfono, correo, comuna,
dirección, servicio, combustible, volumen, frecuencia, fecha de entrega, equipo,
detalles. El header debe ser de tipo **Documento**.

**El PDF.** Al llegar una cotización, el servidor genera el PDF corporativo y lo
**sube a Meta una sola vez** (`/media`), luego envía la plantilla con ese PDF y
las 15 variables a **cada número de `WHATSAPP_TO` por separado**. No se expone
ninguna URL pública del PDF (se envía por `media id`, privado). Si un número
falla, los demás igual reciben (se registran en el log los que fallan). Si
`WHATSAPP_TO` está vacío o falta configuración, WhatsApp se omite **sin afectar**
el guardado de la cotización, el correo ni el push.

---

## Cómo se usa (equipo Fenice)

1. Entrar a `fenice.cl/admin` y hacer clic en la **campana** (arriba a la derecha).
2. Pulsar **«Activar notificaciones»** y aceptar el permiso del navegador.
3. Usar **«Enviar notificación de prueba»** para confirmar que llega.
4. Repetir en **cada dispositivo** donde se quieran recibir alertas.

### iPhone / iPad
Safari solo permite push si la web está **instalada**: abrir fenice.cl en Safari →
botón **Compartir** → **Agregar a inicio**. Abrir Fenice desde ese ícono y activar
las notificaciones desde la campana. (Requiere iOS/iPadOS 16.4 o superior.)

### Windows / macOS / Android
Recomendado **instalar la app** (Chrome/Edge: ícono de instalar en la barra de
direcciones) para que el **contador rojo** aparezca sobre el ícono de la app.

---

## Arquitectura (para desarrollo)

| Pieza | Archivo |
|---|---|
| Service Worker (push, click, badge) | `public/sw-admin.js` |
| Envío Web Push (VAPID, poda de caducadas) | `src/lib/push/webpush.ts` |
| Envío WhatsApp Cloud API | `src/lib/whatsapp/send.ts` |
| Orquestador multicanal | `src/lib/notify/adminAlert.ts` |
| API suscribir / desuscribir / estado / prueba | `src/app/api/admin/push/*` |
| UI campana + contador + realtime | `src/app/admin/AdminNotifications.tsx` |
| Disparo al recibir cotización / lead | `src/app/api/public/{cotizacion,contacto}/route.ts` |

El **badge** = cotizaciones + solicitudes en estado `nuevo`. Baja solo cuando el
equipo cambia el estado en el panel. El número se recalcula en el servidor y se
envía en cada push (`badgeCount`), por lo que el ícono se actualiza aunque la app
esté cerrada.
