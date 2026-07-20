import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { SupabaseClient } from "@supabase/supabase-js";
import { VIDEO_MAX_BYTES, IMAGE_MAX_BYTES } from "@/lib/videos";

export class VideoUploadError extends Error {}

export function validateVideoFile(file: File): void {
  if (file.type !== "video/mp4") {
    throw new VideoUploadError(`Formato no permitido (${file.type || "desconocido"}). Solo se aceptan videos MP4.`);
  }
  if (file.size > VIDEO_MAX_BYTES) {
    throw new VideoUploadError(`El video pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 20 MB.`);
  }
}

export function validatePosterFile(file: File): void {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    throw new VideoUploadError(`Formato no permitido (${file.type || "desconocido"}). Usa JPG, PNG o WebP.`);
  }
  if (file.size > IMAGE_MAX_BYTES) {
    throw new VideoUploadError(`La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 5 MB.`);
  }
}

/**
 * Sube un archivo al Storage de Supabase vía XHR directo (mismo endpoint REST
 * que usa storage-js internamente) para poder reportar progreso real de
 * subida — el cliente `supabase.storage.from(...).upload()` no expone
 * eventos de progreso.
 */
export function uploadWithProgress(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
  file: File,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { reject(new VideoUploadError("Sesión expirada. Vuelve a iniciar sesión.")); return; }
        const { url, anonKey } = getSupabasePublicConfig();

        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${url}/storage/v1/object/${bucket}/${path}`);
        xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
        xhr.setRequestHeader("apikey", anonKey);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) { onProgress(100); resolve(); }
          else reject(new VideoUploadError(`Error al subir el archivo (código ${xhr.status}).`));
        };
        xhr.onerror = () => reject(new VideoUploadError("Error de red al subir el archivo."));
        xhr.send(file);
      } catch {
        reject(new VideoUploadError("No se pudo iniciar la subida."));
      }
    })();
  });
}

export async function removeWebsiteVideoFile(supabase: SupabaseClient, bucket: string, path: string | null | undefined) {
  if (!path) return;
  try {
    await supabase.storage.from(bucket).remove([path]);
  } catch {
    // Best-effort: no bloquea el flujo principal si falla.
  }
}
