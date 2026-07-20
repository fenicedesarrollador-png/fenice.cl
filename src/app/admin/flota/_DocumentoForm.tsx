"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PdfDropzone from "../_components/PdfDropzone";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";
import { uploadFleetPdf, removeFleetFile, logFleetAudit, FleetUploadError } from "@/lib/admin/fleetUpload";
import { Eye, Download, Loader2 } from "lucide-react";
import {
  DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, REVIEW_STATUSES, REVIEW_STATUS_LABELS,
  FLEET_PUBLIC_DOCUMENTS_BUCKET, FLEET_PRIVATE_DOCUMENTS_BUCKET,
  type FleetDocumentRow, type FleetDocumentPrivateFileRow, type ReviewStatus,
} from "@/lib/fleet";

type VehicleOption = { id: string; plate: string; brand: string | null; model: string | null };

/** Ver/descargar el PDF público sanitizado ya guardado (bucket público: URL directa). */
function ExistingPublicFileActions({ path }: { path: string }) {
  const supabase = createClient();
  const viewUrl = supabase.storage.from(FLEET_PUBLIC_DOCUMENTS_BUCKET).getPublicUrl(path).data.publicUrl;
  const downloadUrl = supabase.storage.from(FLEET_PUBLIC_DOCUMENTS_BUCKET).getPublicUrl(path, { download: true }).data.publicUrl;
  return (
    <div className="flex items-center gap-3 mb-2 text-[11.5px]">
      <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-[#1a6b3c] hover:text-[#0d4a28]">
        <Eye className="w-3 h-3" /> Ver actual
      </a>
      <a href={downloadUrl} className="inline-flex items-center gap-1 font-bold text-slate-500 hover:text-[#0a1628]">
        <Download className="w-3 h-3" /> Descargar
      </a>
    </div>
  );
}

/** Ver/descargar el PDF original privado: requiere URL firmada de corta duración (bucket no público). */
function ExistingPrivateFileActions({ path }: { path: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function open(download: boolean) {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { data, error: signError } = await supabase.storage
      .from(FLEET_PRIVATE_DOCUMENTS_BUCKET)
      .createSignedUrl(path, 60, download ? { download: true } : undefined);
    setLoading(false);
    if (signError || !data) { setError("No se pudo generar el enlace privado."); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex items-center gap-3 mb-2 text-[11.5px]">
      <button type="button" onClick={() => open(false)} disabled={loading} className="inline-flex items-center gap-1 font-bold text-[#1a6b3c] hover:text-[#0d4a28] disabled:opacity-50">
        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Eye className="w-3 h-3" />} Ver original (enlace privado, 60s)
      </button>
      <button type="button" onClick={() => open(true)} disabled={loading} className="inline-flex items-center gap-1 font-bold text-slate-500 hover:text-[#0a1628] disabled:opacity-50">
        <Download className="w-3 h-3" /> Descargar
      </button>
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}

export default function DocumentoForm({
  documento,
  initialValues,
  privateFile,
  vehicles,
  defaultVehicleId,
}: {
  /** Documento EXISTENTE a editar. Si es undefined, el formulario siempre crea uno nuevo. */
  documento?: FleetDocumentRow;
  /** Valores de partida para precargar un documento nuevo (ej: renovación/duplicado). Nunca activa el modo edición. */
  initialValues?: Partial<FleetDocumentRow>;
  privateFile?: FleetDocumentPrivateFileRow | null;
  vehicles: VehicleOption[];
  defaultVehicleId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const d = documento ?? initialValues;
  const [publicFile, setPublicFile] = useState<File | null>(null);
  const [privateFileSelected, setPrivateFileSelected] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const vehicleId = fd.get("vehicle_id") as string;
    const wantsPublic = fd.get("is_public") === "on";
    const wantsApproved = (fd.get("review_status") as string) === "approved";
    const sanitizedConfirmed = fd.get("sanitized_confirmed") === "on";
    const hasOrWillHavePublicFile = !!publicFile || !!documento?.public_file_path;

    if (!vehicleId) { setError("Selecciona un vehículo."); setLoading(false); return; }
    if ((wantsPublic || wantsApproved) && !sanitizedConfirmed) {
      setError("Debes confirmar la revisión de sanitización antes de aprobar o publicar este documento.");
      setLoading(false);
      return;
    }
    if (wantsPublic && !hasOrWillHavePublicFile) {
      setError("No puedes publicar un documento sin un PDF público sanitizado.");
      setLoading(false);
      return;
    }

    const metadata = {
      vehicle_id: vehicleId,
      document_type: fd.get("document_type") as string,
      title: (fd.get("title") as string).trim(),
      description: (fd.get("description") as string).trim() || null,
      issuing_entity: (fd.get("issuing_entity") as string).trim() || null,
      certificate_number: (fd.get("certificate_number") as string).trim() || null,
      folio: (fd.get("folio") as string).trim() || null,
      verification_code: (fd.get("verification_code") as string).trim() || null,
      verification_url: (fd.get("verification_url") as string).trim() || null,
      issued_at: (fd.get("issued_at") as string) || null,
      expires_at: (fd.get("expires_at") as string) || null,
      next_inspection_at: (fd.get("next_inspection_at") as string) || null,
      is_active: fd.get("is_active") === "on",
      is_historical: fd.get("is_historical") === "on",
      sanitized_confirmed: sanitizedConfirmed,
      review_status: fd.get("review_status") as ReviewStatus,
      display_order: Number(fd.get("display_order")) || 0,
      notes: (fd.get("notes") as string).trim() || null,
    };

    if (!metadata.title) { setError("El título es obligatorio."); setLoading(false); return; }

    try {
      let documentId = documento?.id ?? "";

      if (!documento) {
        // 1) crear la fila primero (sin publicar todavía) para obtener un id
        //    y así poder construir la ruta vehicle-id/document-id/ del storage.
        const { data: created, error: insertError } = await supabase
          .from("fleet_documents")
          .insert({ ...metadata, is_public: false, created_by: user?.id ?? null, updated_by: user?.id ?? null })
          .select("id")
          .single();
        if (insertError || !created) throw new Error(insertError?.message || "No se pudo crear el documento.");
        documentId = created.id;
        await logFleetAudit(supabase, { documentId, vehicleId, action: "create", newData: metadata, performedBy: user?.id });
      } else {
        await logFleetAudit(supabase, {
          documentId, vehicleId, action: "update",
          previousData: documento, newData: metadata, performedBy: user?.id,
        });
      }

      // 2) reemplazar PDF público si se seleccionó uno nuevo
      let publicPathUpdate: Record<string, unknown> = {};
      if (publicFile) {
        const uploaded = await uploadFleetPdf(supabase, FLEET_PUBLIC_DOCUMENTS_BUCKET, vehicleId, documentId, "archivo", publicFile);
        if (documento?.public_file_path) await removeFleetFile(supabase, FLEET_PUBLIC_DOCUMENTS_BUCKET, documento.public_file_path);
        publicPathUpdate = {
          public_file_path: uploaded.path,
          original_filename: uploaded.filename,
          mime_type: uploaded.mimeType,
          file_size_bytes: uploaded.sizeBytes,
        };
        await logFleetAudit(supabase, { documentId, vehicleId, action: "replace_public_file", newData: publicPathUpdate, performedBy: user?.id });
      }

      // 3) guardar metadatos + estado de publicación (ya seguro: hay archivo si wantsPublic=true)
      const { error: updateError } = await supabase
        .from("fleet_documents")
        .update({ ...metadata, ...publicPathUpdate, is_public: wantsPublic, updated_by: user?.id ?? null })
        .eq("id", documentId);
      if (updateError) throw new Error(updateError.message);

      if (documento && documento.is_public !== wantsPublic) {
        await logFleetAudit(supabase, { documentId, vehicleId, action: wantsPublic ? "publish" : "unpublish", performedBy: user?.id });
      }

      // 4) reemplazar PDF privado original si se seleccionó uno nuevo
      if (privateFileSelected) {
        const uploadedPrivate = await uploadFleetPdf(supabase, FLEET_PRIVATE_DOCUMENTS_BUCKET, vehicleId, documentId, "original", privateFileSelected);
        if (privateFile?.private_file_path) await removeFleetFile(supabase, FLEET_PRIVATE_DOCUMENTS_BUCKET, privateFile.private_file_path);
        const { error: privateError } = await supabase.from("fleet_document_private_files").upsert(
          {
            document_id: documentId,
            private_file_path: uploadedPrivate.path,
            original_filename: uploadedPrivate.filename,
            mime_type: uploadedPrivate.mimeType,
            file_size_bytes: uploadedPrivate.sizeBytes,
            uploaded_by: user?.id ?? null,
          },
          { onConflict: "document_id" },
        );
        if (privateError) throw new Error(privateError.message);
        await logFleetAudit(supabase, { documentId, vehicleId, action: "replace_private_file", performedBy: user?.id });
      }

      await Promise.allSettled(["/"].map((p) => fetch(`/api/revalidate?path=${encodeURIComponent(p)}`, { method: "POST" })));
      router.push("/admin/flota");
      router.refresh();
    } catch (e) {
      setError(e instanceof FleetUploadError ? e.message : e instanceof Error ? e.message : "No se pudo guardar el documento.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
      <FormSection title="Documento">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Vehículo" required>
            <select name="vehicle_id" required defaultValue={d?.vehicle_id ?? defaultVehicleId ?? ""} className="admin-input">
              <option value="" disabled>Selecciona un vehículo</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.plate} {[v.brand, v.model].filter(Boolean).join(" ")}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de documento" required>
            <select name="document_type" required defaultValue={d?.document_type ?? DOCUMENT_TYPES[0]} className="admin-input">
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Título" required>
          <input name="title" type="text" required defaultValue={d?.title} className="admin-input" placeholder="Ej: Prueba de hermeticidad 2026" />
        </Field>
        <Field label="Descripción">
          <textarea name="description" rows={2} defaultValue={d?.description ?? ""} className="admin-input" />
        </Field>
      </FormSection>

      <FormSection title="Identificación oficial">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Entidad emisora">
            <input name="issuing_entity" type="text" defaultValue={d?.issuing_entity ?? ""} className="admin-input" />
          </Field>
          <Field label="Número de certificado">
            <input name="certificate_number" type="text" defaultValue={d?.certificate_number ?? ""} className="admin-input" />
          </Field>
          <Field label="Folio">
            <input name="folio" type="text" defaultValue={d?.folio ?? ""} className="admin-input" />
          </Field>
          <Field label="Código de verificación">
            <input name="verification_code" type="text" defaultValue={d?.verification_code ?? ""} className="admin-input" />
          </Field>
        </div>
        <Field label="URL de verificación" hint="Canal oficial donde se puede validar el documento. Se muestra como botón “Verificar”.">
          <input name="verification_url" type="url" defaultValue={d?.verification_url ?? ""} className="admin-input" placeholder="https://…" />
        </Field>
      </FormSection>

      <FormSection title="Vigencia">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Fecha de emisión">
            <input name="issued_at" type="date" defaultValue={d?.issued_at ?? ""} className="admin-input" />
          </Field>
          <Field label="Fecha de vencimiento">
            <input name="expires_at" type="date" defaultValue={d?.expires_at ?? ""} className="admin-input" />
          </Field>
          <Field label="Próxima inspección">
            <input name="next_inspection_at" type="date" defaultValue={d?.next_inspection_at ?? ""} className="admin-input" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Archivos">
        <div>
          {documento?.public_file_path && <ExistingPublicFileActions path={documento.public_file_path} />}
          <PdfDropzone
            label="PDF público sanitizado"
            hint="Copia sin RUT, firmas, teléfonos ni domicilios personales. Se muestra en la Home."
            existingFilename={documento?.original_filename}
            onFileChange={setPublicFile}
          />
        </div>
        <div>
          {privateFile?.private_file_path && <ExistingPrivateFileActions path={privateFile.private_file_path} />}
          <PdfDropzone
            label="PDF original privado"
            hint="Documento completo. Nunca se expone públicamente; solo accesible desde este panel."
            existingFilename={privateFile?.original_filename}
            onFileChange={setPrivateFileSelected}
          />
        </div>
      </FormSection>

      <FormSection title="Revisión y publicación">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Estado de revisión">
            <select name="review_status" defaultValue={d?.review_status ?? "pending"} className="admin-input">
              {REVIEW_STATUSES.map((s) => (
                <option key={s} value={s}>{REVIEW_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </Field>
          <Field label="Orden de aparición">
            <input name="display_order" type="number" defaultValue={d?.display_order ?? 0} className="admin-input" />
          </Field>
        </div>

        <label className="flex items-start gap-2.5 rounded-xl border border-[#f5a623]/30 bg-[#f5a623]/[0.06] p-3.5 cursor-pointer">
          <input type="checkbox" name="sanitized_confirmed" defaultChecked={d?.sanitized_confirmed ?? false} className="mt-0.5 w-4 h-4 accent-[#1a6b3c]" />
          <span className="text-[12.5px] text-[#0a1628] leading-relaxed font-medium">
            Confirmo que el documento público fue revisado y no contiene RUT personales, firmas manuscritas,
            teléfonos personales, correos personales, domicilios particulares ni otra información sensible innecesaria.
          </span>
        </label>

        <div className="grid sm:grid-cols-3 gap-4 pt-1">
          <Toggle name="is_public" defaultChecked={d?.is_public ?? false} label="Documento público" description="Visible en la Home" />
          <Toggle name="is_historical" defaultChecked={d?.is_historical ?? false} label="Documento histórico" description="No cuenta para el vencimiento del vehículo" />
          <Toggle name="is_active" defaultChecked={d?.is_active ?? true} label="Documento activo" description="Desactívalo para ocultarlo del panel" />
        </div>

        <Field label="Observaciones internas">
          <textarea name="notes" rows={2} defaultValue={d?.notes ?? ""} className="admin-input" />
        </Field>
      </FormSection>

      <FormActions submitLabel={documento ? "Guardar cambios" : "Crear documento"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
