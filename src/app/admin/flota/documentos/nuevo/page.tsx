import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DocumentoForm from "../../_DocumentoForm";
import { FormPageHeader } from "../../../_components/ui";
import type { FleetDocumentRow } from "@/lib/fleet";

export const metadata: Metadata = { title: "Nuevo documento de flota" };

export default async function NuevoDocumentoPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string; duplicateFrom?: string }>;
}) {
  const { vehicleId, duplicateFrom } = await searchParams;
  let vehicles: { id: string; plate: string; brand: string | null; model: string | null }[] = [];
  let initialValues: Partial<FleetDocumentRow> | undefined;

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("fleet_vehicles").select("id, plate, brand, model").order("display_order");
    if (data) vehicles = data;

    if (duplicateFrom) {
      const { data: original } = await supabase.from("fleet_documents").select("*").eq("id", duplicateFrom).single();
      if (original) {
        // Renovación: mantiene los datos anteriores, pero sin publicar ni
        // adjuntar archivos (el admin sube el PDF nuevo y ajusta fechas).
        const row = original as FleetDocumentRow;
        initialValues = {
          vehicle_id: row.vehicle_id,
          document_type: row.document_type,
          title: row.title,
          description: row.description,
          issuing_entity: row.issuing_entity,
          certificate_number: row.certificate_number,
          folio: row.folio,
          verification_code: row.verification_code,
          verification_url: row.verification_url,
          issued_at: row.issued_at,
          expires_at: row.expires_at,
          next_inspection_at: row.next_inspection_at,
          is_active: row.is_active,
          display_order: row.display_order,
          notes: row.notes,
          is_public: false,
          is_historical: false,
          sanitized_confirmed: false,
          review_status: "pending",
        };
      }
    }
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1000px] mx-auto admin-rise">
      <FormPageHeader
        title={duplicateFrom ? "Renovar documento" : "Nuevo documento"}
        subtitle={duplicateFrom ? "Se copiaron los datos del documento anterior. Ajusta fechas y sube el PDF nuevo." : "Certificados, permisos e inspecciones de un vehículo."}
        backHref="/admin/flota"
      />
      <DocumentoForm vehicles={vehicles} initialValues={initialValues} defaultVehicleId={vehicleId} />
    </div>
  );
}
