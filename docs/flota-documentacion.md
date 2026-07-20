# Flota certificada y documentación verificable

## Qué es

Sección pública en la Home (`#documentacion-flota`, entre la galería "En terreno" y
"Compromiso con la seguridad") que muestra los camiones de la flota y sus
certificados vigentes. Módulo administrativo en `/admin/flota` para gestionar
vehículos, documentos, archivos y publicación.

## Modelo de datos (`supabase/migration_flota_documentacion.sql`)

- `fleet_vehicles`: un camión por fila. `plate_key` (columna generada) normaliza
  la patente (mayúsculas, sin guiones/espacios) solo para evitar duplicados;
  `plate` conserva el formato ingresado.
- `fleet_documents`: certificados por vehículo. Nunca guarda el estado de
  vigencia: se calcula en `src/lib/fleet.ts` a partir de `expires_at`,
  `is_historical` y `review_status`.
- `fleet_document_private_files`: PDF original completo, 1 a 1 con el
  documento. Sin policy de lectura pública.
- `fleet_document_audit_logs`: historial de acciones (create/update/
  replace_public_file/replace_private_file/publish/unpublish/archive/delete).

Un documento solo es visible para un visitante anónimo cuando **todas** estas
condiciones se cumplen (regla replicada en la policy RLS de `fleet_documents`
y en `canPublishDocument()` del lado admin, para no depender de una sola capa):
`is_public`, `is_active`, `sanitized_confirmed`, `review_status = 'approved'`,
`public_file_path` no nulo, y el vehículo asociado también público y activo.

## Storage

- `flota` (público): fotos de camiones.
- `fleet-public-documents` (público, solo PDF, 15 MB): copias sanitizadas.
- `fleet-private-documents` (privado): PDF originales completos. Se acceden
  desde `/admin/flota` con URL firmada de 60 segundos
  (`supabase.storage.from(...).createSignedUrl`), nunca con URL pública.

Rutas: `vehicle-id/document-id/archivo-<random>.pdf` (público) y
`.../original-<random>.pdf` (privado) — no adivinables, generadas en
`buildFleetFilePath()`.

## Roles

No se creó un sistema de roles nuevo. Se reutilizó exactamente la convención
existente del proyecto: `auth.role() = 'authenticated'` para CRUD completo en
RLS, con el filtro de "¿admin activo?" ya aplicado en
`src/app/admin/layout.tsx` contra `admin_profiles.activo`.

## Flujo de publicación

1. Admin crea el vehículo en `/admin/flota/vehiculos`.
2. Admin crea el documento en `/admin/flota/documentos/nuevo` (metadatos +
   fechas). El PDF original se sube al bucket privado; el PDF sanitizado
   (sin RUT, firmas, teléfonos ni domicilios) se sube al bucket público.
3. Antes de aprobar o publicar, la casilla de confirmación de sanitización es
   obligatoria (bloqueada en el formulario si falta).
4. "Documento público" + "Estado de revisión = Aprobado" habilitan la
   visibilidad; sin PDF público sanitizado, el formulario bloquea la
   publicación.
5. Renovación: botón "Duplicar" copia los metadatos a un documento nuevo
   (`review_status=pending`, sin archivos ni publicación) para cargar el PDF
   actualizado sin perder folio/entidad/tipo.

## Alertas (`/admin/flota`)

60/30/15 días antes del vencimiento, documento vencido, documento público sin
PDF, documento sin confirmación de sanitización, documento pendiente de
aprobación. Todas calculadas en cada carga de página, sin cron ni email
(el proyecto ya tiene infraestructura de email vía Resend para cotizaciones,
pero no se conectó aquí para no ampliar el alcance sin pedirlo).

## Limitación conocida

Igual que el resto del panel (logos de clientes, fotos de equipo, etc.),
borrar un vehículo o documento no borra automáticamente los archivos del
Storage asociados — quedan huérfanos. Es el mismo comportamiento que ya
tenía el proyecto antes de este módulo.
