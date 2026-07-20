// Tipos y constantes compartidas del módulo de videos tipo reel
// (Home pública + /admin/videos).

export const WEBSITE_VIDEOS_BUCKET = "website-videos";
export const MAX_ACTIVE_VIDEOS = 5;
export const VIDEO_MAX_BYTES = 20 * 1024 * 1024; // 20 MB, igual al límite del bucket
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // portada

export type WebsiteVideoRow = {
  id: string;
  title: string | null;
  description: string | null;
  video_path: string;
  poster_path: string | null;
  display_order: number;
  is_active: boolean;
  autoplay: boolean;
  loop: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

export const PUBLIC_VIDEO_COLUMNS =
  "id, title, description, video_path, poster_path, display_order, autoplay, loop";

/** Limpia un nombre de archivo para referencia (no como ruta real: la ruta siempre lleva un sufijo aleatorio). */
export function sanitizeVideoFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 140);
}

export function buildWebsiteVideoPath(kind: "video" | "poster", ext: string): string {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${kind}s/${unique}.${ext}`;
}
