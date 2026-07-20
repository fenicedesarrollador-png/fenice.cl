import type { SupabaseClient } from "@supabase/supabase-js";
import { buildFleetFilePath } from "@/lib/fleet";

export const PDF_MAX_BYTES = 15 * 1024 * 1024; // 15 MB, igual al límite del bucket

export class FleetUploadError extends Error {}

/** Valida un PDF antes de intentar subirlo (repite en cliente lo que ya exige el bucket). */
export function validatePdfFile(file: File): void {
  if (file.type !== "application/pdf") {
    throw new FleetUploadError(`Formato no permitido (${file.type || "desconocido"}). Solo se aceptan archivos PDF.`);
  }
  if (file.size > PDF_MAX_BYTES) {
    throw new FleetUploadError(`El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 15 MB.`);
  }
}

/**
 * Sube un PDF a una ruta única no adivinable (vehicle-id/document-id/archivo.pdf).
 * No borra nada: el llamador decide cuándo eliminar el archivo anterior,
 * solo después de confirmar que la subida nueva fue exitosa.
 */
export async function uploadFleetPdf(
  supabase: SupabaseClient,
  bucket: string,
  vehicleId: string,
  documentId: string,
  kind: "archivo" | "original",
  file: File,
): Promise<{ path: string; filename: string; mimeType: string; sizeBytes: number }> {
  validatePdfFile(file);
  const path = buildFleetFilePath(vehicleId, documentId, kind);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: "application/pdf",
  });
  if (error) {
    const msg = error.message || "";
    if (/bucket not found/i.test(msg)) {
      throw new FleetUploadError(`El bucket "${bucket}" no existe. Ejecuta supabase/migration_flota_documentacion.sql.`);
    }
    if (/row-level security|policy|not authorized|permission/i.test(msg)) {
      throw new FleetUploadError(`Sin permiso para subir al bucket "${bucket}". Ejecuta supabase/migration_flota_documentacion.sql.`);
    }
    throw new FleetUploadError(`Error al subir el archivo: ${msg}`);
  }
  return { path, filename: file.name, mimeType: "application/pdf", sizeBytes: file.size };
}

/** Elimina un archivo previo (best-effort: nunca bloquea el flujo si falla). */
export async function removeFleetFile(supabase: SupabaseClient, bucket: string, path: string | null | undefined) {
  if (!path) return;
  try {
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // No crítico: el archivo anterior queda huérfano en storage, pero la
    // operación principal (reemplazo) ya se completó con éxito.
  }
}

export type FleetAuditAction =
  | "create" | "update" | "replace_public_file" | "replace_private_file"
  | "archive" | "publish" | "unpublish" | "delete";

/** Registra una acción en fleet_document_audit_logs. Nunca lanza: el registro de auditoría no debe bloquear la operación principal. */
export async function logFleetAudit(
  supabase: SupabaseClient,
  entry: {
    documentId?: string | null;
    vehicleId?: string | null;
    action: FleetAuditAction;
    previousData?: unknown;
    newData?: unknown;
    performedBy?: string | null;
  },
) {
  try {
    await supabase.from("fleet_document_audit_logs").insert({
      document_id: entry.documentId ?? null,
      vehicle_id: entry.vehicleId ?? null,
      action: entry.action,
      previous_data: entry.previousData ?? null,
      new_data: entry.newData ?? null,
      performed_by: entry.performedBy ?? null,
    });
  } catch {
    // El registro de auditoría es de mejor esfuerzo.
  }
}
