# Métricas internas Fenice

## Qué mide

- `page_view`: ruta visitada, título, fuente, UTM, dispositivo, navegador y SO.
- `section_view`: secciones reales marcadas con `data-analytics-section`.
- `scroll_depth`: 25, 50, 75 y 100 por sesión/página.
- `click`, `whatsapp_click`, `phone_click`, `email_click`: CTAs y enlaces importantes con `data-analytics-id`.
- `form_start`: primera interacción real con `contacto` y `cotizacion`.
- `form_submit_success`: solo después de respuesta exitosa del backend.
- `form_submit_error`: solo con código técnico.
- `quote_started` y `quote_submitted`: flujo real de `/cotizacion`.

## Qué no mide

- No guarda nombre, correo, RUT, teléfono, dirección ni contenido de formularios dentro de eventos.
- No graba sesiones, teclado, heatmaps ni texto escrito.
- No expone IP a administradores.
- No integra compras porque ese flujo no existe hoy en el proyecto.

## Consentimiento

- Clave local: `fenice_cookie_consent`.
- Categorías:
  - Necesarias: siempre activas.
  - Medición del sitio: opcional.
- Si la persona rechaza medición:
  - no se crea `fenice_visitor_id`
  - no se crea `fenice_session_id`
  - no se envían eventos
- El usuario puede reabrir preferencias desde:
  - footer, botón `Cookies`
  - `/politica-de-privacidad`

## Variables de entorno

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANALYTICS_IP_HMAC_SECRET`
- `ANALYTICS_ALLOWED_ORIGINS` opcional, lista separada por comas

## Despliegue Supabase

1. Ejecutar `supabase/migration_analytics.sql` en Supabase SQL Editor.
2. Desplegar la Edge Function:
   - `supabase functions deploy track-analytics-event`
3. Configurar secretos en Supabase Functions:
   - `ANALYTICS_IP_HMAC_SECRET`
   - `ANALYTICS_ALLOWED_ORIGINS` si necesitas dominios extra aparte de `fenice.cl` y `localhost`

`supabase/config.toml` deja `track-analytics-event` con `verify_jwt = false` para permitir `sendBeacon`.

## Cómo probar

1. Abrir el sitio en incógnito.
2. Rechazar medición y navegar:
   - no deben aparecer filas nuevas en `analytics_sessions` ni `analytics_events`.
3. Volver a abrir el sitio y aceptar medición:
   - debe registrarse `page_view`.
4. Navegar por home y mirar secciones:
   - cada `section_view` debe aparecer una sola vez por sesión/página.
5. Hacer scroll:
   - solo deben existir 25, 50, 75 y 100.
6. Hacer clic en WhatsApp/teléfono/correo:
   - deben aparecer `whatsapp_click`, `phone_click`, `email_click`.
7. Enviar `/contacto`:
   - debe crearse un `lead`
   - debe existir `form_submit_success`
   - debe existir vínculo en `analytics_identity_links`
8. Enviar `/cotizacion`:
   - debe crearse una `cotizacion`
   - debe existir `quote_started`, `form_submit_success` y `quote_submitted`
   - debe existir vínculo en `analytics_identity_links`
9. Entrar a `/admin/metricas` con usuario admin activo:
   - deben verse cards, gráficos, tablas y sesiones recientes reales
10. Exportar CSV:
   - debe descargar sesiones filtradas reales

## Eventos conectados hoy

- `page_view`
- `section_view`
- `scroll_depth`
- `click`
- `whatsapp_click`
- `phone_click`
- `email_click`
- `form_start`
- `form_submit_success`
- `form_submit_error`
- `quote_started`
- `quote_submitted`

## Eventos no conectados porque el flujo no existe

- `checkout_started`
- `purchase_completed`

