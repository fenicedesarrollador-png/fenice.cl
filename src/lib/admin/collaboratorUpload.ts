"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  COLLABORATORS_BUCKET,
  LOGO_TARGET_MAX_WIDTH,
  buildLogoPath,
  validateLogoFile,
} from "@/lib/collaborators";

/** Error con mensaje apto para mostrar al administrador (nunca error crudo de Supabase). */
export class LogoUploadError extends Error {}

/**
 * Convierte el logo a WebP y lo reescala si es más ancho que
 * LOGO_TARGET_MAX_WIDTH. Mantiene la transparencia (canvas + image/webp la
 * conserva) y usa calidad alta para no degradar tipografías de logo.
 *
 * Si el navegador no puede procesarlo, devuelve el archivo original: la
 * subida sigue funcionando, sólo sin optimizar.
 */
export async function optimizeLogo(file: File): Promise<{ blob: Blob; ext: string; contentType: string }> {
  const fallback = () => ({
    blob: file,
    ext: (file.name.split(".").pop() || "png").toLowerCase(),
    contentType: file.type,
  });

  if (typeof document === "undefined" || typeof createImageBitmap !== "function") {
    return fallback();
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, LOGO_TARGET_MAX_WIDTH / bitmap.width);
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return fallback();
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.92),
    );

    // Sólo aceptamos el resultado si el navegador devolvió WebP real y no
    // resultó más pesado que el original.
    if (!blob || blob.size === 0 || blob.type !== "image/webp") return fallback();
    if (blob.size >= file.size && scale === 1) return fallback();

    return { blob, ext: "webp", contentType: "image/webp" };
  } catch {
    return fallback();
  }
}

export type UploadedLogo = { url: string; path: string; width: number; height: number };

/** Lee las dimensiones finales del blob para poder reservar espacio y evitar CLS. */
async function readDimensions(blob: Blob): Promise<{ width: number; height: number }> {
  try {
    const bitmap = await createImageBitmap(blob);
    const dims = { width: bitmap.width, height: bitmap.height };
    bitmap.close?.();
    return dims;
  } catch {
    return { width: 0, height: 0 };
  }
}

/**
 * Valida → optimiza → sube al bucket → devuelve URL pública y path.
 * El path se genera en el servidor de nombres propio (nunca desde file.name).
 */
export async function uploadCollaboratorLogo(
  supabase: SupabaseClient,
  file: File,
  collaboratorName: string,
): Promise<UploadedLogo> {
  const invalid = validateLogoFile(file);
  if (invalid) throw new LogoUploadError(invalid);

  const { blob, ext, contentType } = await optimizeLogo(file);
  const path = buildLogoPath(collaboratorName, ext, Date.now());

  const { error } = await supabase.storage
    .from(COLLABORATORS_BUCKET)
    .upload(path, blob, { upsert: false, contentType, cacheControl: "31536000" });

  if (error) {
    // El detalle técnico queda en consola; al usuario le llega algo accionable.
    console.error("[colaboradores] error al subir logo:", error);
    const msg = error.message || "";
    if (/bucket not found/i.test(msg)) {
      throw new LogoUploadError(
        `El bucket "${COLLABORATORS_BUCKET}" no existe. Ejecuta supabase/migration_collaborators.sql.`,
      );
    }
    if (/row-level security|policy|not authorized|permission|jwt/i.test(msg)) {
      throw new LogoUploadError(
        "Sin permiso para subir el logo. Vuelve a iniciar sesión o ejecuta supabase/migration_collaborators.sql.",
      );
    }
    if (/exceeded|maximum size|too large|payload/i.test(msg)) {
      throw new LogoUploadError("El archivo supera el límite de 5 MB del bucket.");
    }
    if (/mime|content-type|not supported/i.test(msg)) {
      throw new LogoUploadError("El bucket rechazó el formato del archivo. Usa PNG, JPG o WebP.");
    }
    throw new LogoUploadError("No fue posible subir el logo. Intente nuevamente.");
  }

  const { data } = supabase.storage.from(COLLABORATORS_BUCKET).getPublicUrl(path);
  const { width, height } = await readDimensions(blob);
  return { url: data.publicUrl, path, width, height };
}

/**
 * Borra un logo del Storage. Best-effort: si falla no bloquea el flujo
 * principal (el registro ya se actualizó/eliminó), sólo se registra.
 */
export async function removeCollaboratorLogo(
  supabase: SupabaseClient,
  path: string | null | undefined,
): Promise<void> {
  if (!path) return;
  try {
    const { error } = await supabase.storage.from(COLLABORATORS_BUCKET).remove([path]);
    if (error) console.error("[colaboradores] no se pudo borrar el logo anterior:", error);
  } catch (err) {
    console.error("[colaboradores] no se pudo borrar el logo anterior:", err);
  }
}
