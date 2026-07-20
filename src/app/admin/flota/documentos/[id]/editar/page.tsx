import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import DocumentoForm from "../../../_DocumentoForm";
import { FormPageHeader } from "../../../../_components/ui";
import type { FleetDocumentRow, FleetDocumentPrivateFileRow } from "@/lib/fleet";

export const metadata: Metadata = { title: "Editar documento de flota" };

export default async function EditarDocumentoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let documento: FleetDocumentRow | null = null;
  let privateFile: FleetDocumentPrivateFileRow | null = null;
  let vehicles: { id: string; plate: string; brand: string | null; model: string | null }[] = [];

  try {
    const supabase = await createClient();
    const [docRes, vehiclesRes] = await Promise.all([
      supabase.from("fleet_documents").select("*").eq("id", id).single(),
      supabase.from("fleet_vehicles").select("id, plate, brand, model").order("display_order"),
    ]);
    if (docRes.data) documento = docRes.data as FleetDocumentRow;
    if (vehiclesRes.data) vehicles = vehiclesRes.data;
    if (documento) {
      const { data: pf } = await supabase.from("fleet_document_private_files").select("*").eq("document_id", id).maybeSingle();
      if (pf) privateFile = pf as FleetDocumentPrivateFileRow;
    }
  } catch {}

  if (!documento) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1000px] mx-auto admin-rise">
      <FormPageHeader title="Editar documento" subtitle={documento.title} backHref="/admin/flota" />
      <DocumentoForm documento={documento} privateFile={privateFile} vehicles={vehicles} />
    </div>
  );
}
