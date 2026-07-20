// Tipos, cálculo de estados y constantes compartidas del módulo
// "Flota certificada y documentación verificable" (Home + /admin/flota).
//
// El estado de vigencia NUNCA se guarda en la base de datos: se calcula acá
// a partir de expires_at / is_historical / review_status. Mantener esta
// lógica impura (new Date()) fuera de cuerpos de componente, según la
// convención del proyecto (ver src/lib/admin/stats.ts).

export const DOCUMENT_TYPES = [
  "sec_tc10a",
  "tank_tc8",
  "hermeticity_test",
  "periodic_inspection",
  "visual_inspection",
  "manufacturing_certificate",
  "circulation_permit",
  "technical_revision",
  "insurance",
  "other",
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  sec_tc10a: "Declaración SEC / TC10A",
  tank_tc8: "Certificado de estanque TC8",
  hermeticity_test: "Prueba de hermeticidad",
  periodic_inspection: "Inspección periódica",
  visual_inspection: "Inspección visual",
  manufacturing_certificate: "Certificado de fabricación",
  circulation_permit: "Permiso de circulación",
  technical_revision: "Revisión técnica",
  insurance: "Seguro",
  other: "Otro documento",
};

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "Pendiente de revisión",
  approved: "Aprobado",
  rejected: "Rechazado",
};

/* ============================================================
   Tipos de datos (coinciden con las columnas de Supabase)
   ============================================================ */

export type FleetVehicleRow = {
  id: string;
  plate: string;
  brand: string | null;
  model: string | null;
  manufacture_year: number | null;
  tank_capacity_liters: number | null;
  compartments: number | null;
  authorized_fuel_type: string | null;
  image_path: string | null;
  short_description: string | null;
  is_public: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type FleetDocumentRow = {
  id: string;
  vehicle_id: string;
  document_type: DocumentType;
  title: string;
  description: string | null;
  issuing_entity: string | null;
  certificate_number: string | null;
  folio: string | null;
  verification_code: string | null;
  verification_url: string | null;
  issued_at: string | null;
  expires_at: string | null;
  next_inspection_at: string | null;
  public_file_path: string | null;
  original_filename: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  is_public: boolean;
  is_active: boolean;
  is_historical: boolean;
  sanitized_confirmed: boolean;
  review_status: ReviewStatus;
  display_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type FleetDocumentPrivateFileRow = {
  id: string;
  document_id: string;
  private_file_path: string;
  original_filename: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  created_at: string;
  uploaded_by: string | null;
};

/* ============================================================
   Cálculo automático de estado de vigencia
   ============================================================ */

export type DocumentStatusKey =
  | "historico"
  | "en_revision"
  | "rechazado"
  | "sin_vencimiento"
  | "vencido"
  | "proximo_a_vencer"
  | "vigente_advertencia"
  | "vigente";

export type BadgeTone = "neutral" | "green" | "amber" | "red" | "blue" | "purple";

export const DOCUMENT_STATUS_META: Record<DocumentStatusKey, { label: string; tone: BadgeTone }> = {
  historico: { label: "Documento histórico", tone: "blue" },
  en_revision: { label: "En revisión", tone: "neutral" },
  rechazado: { label: "Rechazado", tone: "red" },
  sin_vencimiento: { label: "Sin vencimiento informado", tone: "neutral" },
  vencido: { label: "Vencido", tone: "red" },
  proximo_a_vencer: { label: "Próximo a vencer", tone: "amber" },
  vigente_advertencia: { label: "Vigente con advertencia", tone: "amber" },
  vigente: { label: "Vigente", tone: "green" },
};

/**
 * Calcula el estado de un documento siguiendo, en orden de prioridad:
 * histórico > revisión/rechazo > fecha de vencimiento.
 * `referenceDate` es inyectable para tests; por defecto usa la fecha actual.
 */
export function computeDocumentStatus(
  doc: Pick<FleetDocumentRow, "expires_at" | "is_historical" | "review_status">,
  referenceDate: Date = new Date(),
): { key: DocumentStatusKey; daysUntil: number | null } {
  if (doc.is_historical) return { key: "historico", daysUntil: null };
  if (doc.review_status === "pending") return { key: "en_revision", daysUntil: null };
  if (doc.review_status === "rejected") return { key: "rechazado", daysUntil: null };
  if (!doc.expires_at) return { key: "sin_vencimiento", daysUntil: null };

  const days = daysUntil(doc.expires_at, referenceDate);
  if (days < 0) return { key: "vencido", daysUntil: days };
  if (days <= 30) return { key: "proximo_a_vencer", daysUntil: days };
  if (days <= 60) return { key: "vigente_advertencia", daysUntil: days };
  return { key: "vigente", daysUntil: days };
}

/** Días de diferencia entre hoy y una fecha ISO (negativo si ya pasó). */
export function daysUntil(isoDate: string, referenceDate: Date = new Date()): number {
  const target = new Date(`${isoDate}T00:00:00`);
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const targetMidnight = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((targetMidnight.getTime() - today.getTime()) / 86_400_000);
}

/**
 * Estado general del vehículo = estado del documento activo (no histórico)
 * cuyo expires_at sea el más próximo. Si ningún documento activo tiene
 * expires_at, el vehículo queda "sin vencimiento informado".
 * Los documentos históricos NUNCA se consideran para este cálculo.
 */
export function computeVehicleStatus(
  documents: Pick<FleetDocumentRow, "expires_at" | "is_historical" | "review_status">[],
  referenceDate: Date = new Date(),
): { key: DocumentStatusKey; nearestExpiresAt: string | null } {
  const activeWithExpiry = documents
    .filter((d) => !d.is_historical && d.expires_at)
    .sort((a, b) => (a.expires_at! < b.expires_at! ? -1 : 1));

  if (activeWithExpiry.length === 0) {
    // Si hay documentos activos pero ninguno con vencimiento, y todos están
    // en revisión, refleja eso; si no hay documentos en absoluto, "sin vencimiento".
    const anyPending = documents.some((d) => !d.is_historical && d.review_status === "pending");
    return { key: anyPending ? "en_revision" : "sin_vencimiento", nearestExpiresAt: null };
  }

  const nearest = activeWithExpiry[0];
  const status = computeDocumentStatus(nearest, referenceDate);
  return { key: status.key, nearestExpiresAt: nearest.expires_at };
}

/**
 * Reglas de publicación pública (RLS aplica lo mismo en el servidor; esto
 * se usa en el panel admin para advertir ANTES de intentar publicar).
 */
export function canPublishDocument(
  doc: Pick<FleetDocumentRow, "is_public" | "is_active" | "review_status" | "sanitized_confirmed" | "public_file_path">,
): boolean {
  return (
    doc.is_public === true &&
    doc.is_active === true &&
    doc.review_status === "approved" &&
    doc.sanitized_confirmed === true &&
    !!doc.public_file_path
  );
}

/* ============================================================
   Formato
   ============================================================ */

export function formatDateCL(iso: string | null): string {
  if (!iso) return "—";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatLiters(liters: number | null): string {
  if (liters == null) return "—";
  return `${liters.toLocaleString("es-CL")} L`;
}

/* ============================================================
   Storage: rutas y nombres de archivo
   ============================================================ */

/** Limpia un nombre de archivo para usarlo como referencia (no como ruta real: la ruta siempre usa un id generado). */
export function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 140);
}

/** Ruta única no adivinable dentro de vehicle-id/document-id/. */
export function buildFleetFilePath(vehicleId: string, documentId: string, kind: "archivo" | "original", ext = "pdf"): string {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${vehicleId}/${documentId}/${kind}-${unique}.${ext}`;
}

export const FLEET_PUBLIC_DOCUMENTS_BUCKET = "fleet-public-documents";
export const FLEET_PRIVATE_DOCUMENTS_BUCKET = "fleet-private-documents";
export const FLEET_VEHICLE_PHOTOS_BUCKET = "flota";

/* ============================================================
   Columnas públicas explícitas (igual que PreciosCombustible.tsx):
   el rol anon no debe depender de "*" para no exponer columnas nuevas
   por accidente si el esquema cambia.
   ============================================================ */
export const PUBLIC_VEHICLE_COLUMNS =
  "id, plate, brand, model, manufacture_year, tank_capacity_liters, compartments, authorized_fuel_type, image_path, short_description, display_order";

export const PUBLIC_DOCUMENT_COLUMNS =
  "id, vehicle_id, document_type, title, description, issuing_entity, certificate_number, folio, verification_code, verification_url, issued_at, expires_at, next_inspection_at, public_file_path, is_historical, display_order";
