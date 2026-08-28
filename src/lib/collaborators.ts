// Tipos, constantes y validaciones compartidas del módulo de Colaboradores
// (carrusel público en la Home + /admin/colaboradores).
//
// Este archivo NO importa nada de Supabase ni del DOM: se usa igual desde
// server components, client components y helpers de subida.

export const COLLABORATORS_BUCKET = "collaborators-logos";

/** Coincide con file_size_limit del bucket (5 MB). */
export const LOGO_MAX_BYTES = 5 * 1024 * 1024;

/**
 * SVG queda fuera a propósito: es un documento ejecutable y no se puede
 * sanitizar de forma fiable sin dependencias extra. Los logos se convierten
 * a WebP en el navegador antes de subirse.
 */
export const ALLOWED_LOGO_MIME = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export const ALLOWED_LOGO_ACCEPT = ALLOWED_LOGO_MIME.join(",");

/** Ancho máximo al que se reescala el logo antes de subirlo (nítido en retina). */
export const LOGO_TARGET_MAX_WIDTH = 480;

export type Collaborator = {
  id: string;
  name: string;
  logo_url: string;
  logo_path: string | null;
  website_url: string | null;
  alt_text: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

/** Sólo lo que necesita el carrusel público. Nada más viaja al cliente. */
export type PublicCollaborator = Pick<
  Collaborator,
  "id" | "name" | "logo_url" | "website_url" | "alt_text" | "display_order"
>;

export const PUBLIC_COLLABORATOR_COLUMNS =
  "id, name, logo_url, website_url, alt_text, display_order";

export const ADMIN_COLLABORATOR_COLUMNS =
  "id, name, logo_url, logo_path, website_url, alt_text, display_order, is_active, created_at, updated_at";

/* ============================================================
   Texto
   ============================================================ */

/** Colapsa espacios y recorta. Los textos se renderizan como texto (React
 *  escapa por defecto), así que no hace falta stripping de HTML. */
export function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

/** ALT por defecto cuando el administrador no escribe uno. */
export function defaultAltText(name: string): string {
  return `Logo de ${name.trim()}`;
}

export function resolveAltText(name: string, altText?: string | null): string {
  const alt = cleanText(altText, 180);
  return alt || defaultAltText(name);
}

/* ============================================================
   URL del colaborador
   ============================================================ */

export type UrlResult =
  | { ok: true; url: string | null }
  | { ok: false; error: string };

/**
 * Normaliza y valida la URL del colaborador.
 *
 * - Vacío  → null (el campo es opcional).
 * - "www.copec.cl" → "https://www.copec.cl" (sin esquema ⇒ https).
 * - Sólo se aceptan http:// y https://. Cualquier otro esquema
 *   (javascript:, data:, vbscript:, file:…) se rechaza.
 */
export function normalizeWebsiteUrl(input: unknown): UrlResult {
  const raw = typeof input === "string" ? input.trim() : "";
  if (!raw) return { ok: true, url: null };

  // Un esquema explícito distinto de http/https se rechaza antes de parsear.
  const schemeMatch = raw.match(/^([a-z][a-z0-9+.-]*):/i);
  if (schemeMatch && !/^https?$/i.test(schemeMatch[1])) {
    return { ok: false, error: "La URL debe comenzar con http:// o https://" };
  }

  const candidate = schemeMatch ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return { ok: false, error: "La URL no es válida. Ejemplo: https://www.copec.cl" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "La URL debe comenzar con http:// o https://" };
  }
  // Exige un dominio con punto (evita "https://copec" o espacios internos).
  if (!parsed.hostname || !parsed.hostname.includes(".") || /\s/.test(parsed.hostname)) {
    return { ok: false, error: "El dominio no es válido. Ejemplo: https://www.copec.cl" };
  }
  if (parsed.href.length > 500) {
    return { ok: false, error: "La URL es demasiado larga." };
  }

  return { ok: true, url: parsed.href };
}

/** Guarda de render: nunca convertir en <a> algo que no sea http(s). */
export function isSafeHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/** Host legible para la tabla del admin: "https://www.copec.cl/" → "copec.cl". */
export function displayHost(value: string | null | undefined): string {
  if (!value) return "";
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

/* ============================================================
   Storage: nombres de archivo seguros
   ============================================================ */

/** Slug ASCII sin acentos, espacios ni caracteres de ruta. */
export function slugifyName(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "colaborador";
}

/**
 * Construye la ruta dentro del bucket. NUNCA se usa el nombre de archivo que
 * envía el navegador: se deriva del nombre del colaborador + timestamp +
 * sufijo aleatorio, así que no hay path traversal ni colisiones.
 *
 * Ej: "copec/copec-1724848312-a1b2c3.webp"
 */
export function buildLogoPath(name: string, ext: string, now: number): string {
  const slug = slugifyName(name);
  const safeExt = /^(png|jpg|jpeg|webp)$/i.test(ext) ? ext.toLowerCase() : "webp";
  const unique = Math.random().toString(36).slice(2, 8);
  return `${slug}/${slug}-${now}-${unique}.${safeExt}`;
}

/* ============================================================
   Validación del archivo
   ============================================================ */

export function validateLogoFile(file: File | null | undefined): string | null {
  if (!file) return "Selecciona un archivo de logo.";
  if (file.size === 0) return "El archivo está vacío.";
  if (!(ALLOWED_LOGO_MIME as readonly string[]).includes(file.type)) {
    const tipo = file.type || "desconocido";
    return `Formato no permitido (${tipo}). Usa PNG, JPG o WebP.`;
  }
  if (file.size > LOGO_MAX_BYTES) {
    return `El logo pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. El máximo es 5 MB.`;
  }
  return null;
}

/* ============================================================
   Payload validado (se usa antes de tocar Supabase)
   ============================================================ */

export type CollaboratorInput = {
  name: string;
  website_url: string | null;
  alt_text: string;
  display_order: number;
  is_active: boolean;
};

export type ValidationResult =
  | { ok: true; value: CollaboratorInput }
  | { ok: false; error: string };

export function validateCollaboratorInput(raw: {
  name: unknown;
  website_url: unknown;
  alt_text: unknown;
  display_order: unknown;
  is_active: unknown;
}): ValidationResult {
  const name = cleanText(raw.name, 120);
  if (!name) return { ok: false, error: "El nombre del colaborador es obligatorio." };

  const url = normalizeWebsiteUrl(raw.website_url);
  if (!url.ok) return { ok: false, error: url.error };

  const orderRaw = typeof raw.display_order === "number"
    ? raw.display_order
    : Number(String(raw.display_order ?? "").trim() || 0);
  if (!Number.isFinite(orderRaw)) {
    return { ok: false, error: "El orden debe ser un número." };
  }
  const display_order = Math.min(9999, Math.max(0, Math.trunc(orderRaw)));

  return {
    ok: true,
    value: {
      name,
      website_url: url.url,
      alt_text: resolveAltText(name, typeof raw.alt_text === "string" ? raw.alt_text : ""),
      display_order,
      is_active: raw.is_active === true || raw.is_active === "true" || raw.is_active === "on",
    },
  };
}

/* ============================================================
   Orden público
   ============================================================ */

/** Mismo criterio que la consulta SQL: display_order asc, created_at asc. */
export function sortCollaborators<T extends { display_order: number; created_at?: string }>(
  rows: T[],
): T[] {
  return [...rows].sort((a, b) => {
    if (a.display_order !== b.display_order) return a.display_order - b.display_order;
    return (a.created_at ?? "").localeCompare(b.created_at ?? "");
  });
}
