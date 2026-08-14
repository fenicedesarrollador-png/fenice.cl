import { ShieldCheck, FileCheck2, Truck as TruckIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/public";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { fetchWithTimeout } from "@/lib/getSiteConfig";
import { SITE_CONFIG } from "@/lib/config";
import {
  computeDocumentStatus, computeVehicleStatus, publicStatusMeta,
  PUBLIC_VEHICLE_COLUMNS, PUBLIC_DOCUMENT_COLUMNS,
  FLEET_PUBLIC_DOCUMENTS_BUCKET, FLEET_VEHICLE_PHOTOS_BUCKET,
  type FleetVehicleRow, type FleetDocumentRow,
} from "@/lib/fleet";
import FlotaVehiculoCard, { type PublicFleetVehicle, type PublicFleetDocument } from "./FlotaVehiculoCard";

type PublicVehicleRow = Pick<
  FleetVehicleRow,
  "id" | "plate" | "brand" | "model" | "manufacture_year" | "tank_capacity_liters" |
  "compartments" | "authorized_fuel_type" | "image_path" | "short_description" | "display_order"
>;

type PublicDocumentRow = Pick<
  FleetDocumentRow,
  "id" | "vehicle_id" | "document_type" | "title" | "description" | "issuing_entity" |
  "certificate_number" | "folio" | "verification_code" | "verification_url" | "issued_at" |
  "expires_at" | "next_inspection_at" | "public_file_path" | "is_historical" | "display_order"
>;

async function getPublicFleetData(): Promise<{ vehicles: PublicVehicleRow[]; documents: PublicDocumentRow[] } | null> {
  if (!hasUsableSupabasePublicConfig()) return null;
  try {
    const supabase = await createClient();
    const [vehiclesRes, documentsRes] = await Promise.all([
      fetchWithTimeout(
        supabase.from("fleet_vehicles").select(PUBLIC_VEHICLE_COLUMNS).eq("is_public", true).eq("is_active", true).order("display_order"),
        2500,
      ),
      fetchWithTimeout(
        supabase.from("fleet_documents").select(PUBLIC_DOCUMENT_COLUMNS).order("display_order"),
        2500,
      ),
    ]);
    if (vehiclesRes?.error || documentsRes?.error) return null;
    return {
      vehicles: (vehiclesRes?.data as PublicVehicleRow[]) ?? [],
      documents: (documentsRes?.data as PublicDocumentRow[]) ?? [],
    };
  } catch {
    return null;
  }
}

export default async function FlotaDocumentacion() {
  const data = await getPublicFleetData();
  const showSkeleton = data === null;
  const vehiclesRaw = data?.vehicles ?? [];

  if (!showSkeleton && vehiclesRaw.length === 0) return null;

  const supabase = showSkeleton ? null : await createClient();

  const vehicles: PublicFleetVehicle[] = vehiclesRaw.map((v) => {
    const docsForVehicle = (data?.documents ?? []).filter((d) => d.vehicle_id === v.id);

    const documents: PublicFleetDocument[] = docsForVehicle.map((doc) => {
      // RLS ya garantiza que cualquier fila pública está review_status='approved'.
      const status = computeDocumentStatus({ expires_at: doc.expires_at, is_historical: doc.is_historical, review_status: "approved" });
      const meta = publicStatusMeta(status.key);
      const path = doc.public_file_path as string;
      const fileUrl = supabase!.storage.from(FLEET_PUBLIC_DOCUMENTS_BUCKET).getPublicUrl(path).data.publicUrl;

      return {
        id: doc.id,
        document_type: doc.document_type,
        title: doc.title,
        description: doc.description,
        issuing_entity: doc.issuing_entity,
        certificate_number: doc.certificate_number,
        folio: doc.folio,
        verification_code: doc.verification_code,
        verification_url: doc.verification_url,
        issued_at: doc.issued_at,
        expires_at: doc.expires_at,
        next_inspection_at: doc.next_inspection_at,
        fileUrl,
        is_historical: doc.is_historical,
        statusKey: status.key,
        statusLabel: meta.label,
        statusTone: meta.tone,
      };
    });

    const vehicleStatus = computeVehicleStatus(
      docsForVehicle.map((doc) => ({ expires_at: doc.expires_at, is_historical: doc.is_historical, review_status: "approved" as const })),
    );
    const vehicleMeta = publicStatusMeta(vehicleStatus.key);
    const imageUrl = v.image_path
      ? (v.image_path.startsWith("http")
          ? v.image_path
          : supabase!.storage.from(FLEET_VEHICLE_PHOTOS_BUCKET).getPublicUrl(v.image_path).data.publicUrl)
      : null;

    return {
      id: v.id,
      plate: v.plate,
      brand: v.brand,
      model: v.model,
      manufacture_year: v.manufacture_year,
      tank_capacity_liters: v.tank_capacity_liters,
      compartments: v.compartments,
      authorized_fuel_type: v.authorized_fuel_type,
      imageUrl,
      short_description: v.short_description,
      documents,
      vehicleStatusKey: vehicleStatus.key,
      vehicleStatusLabel: vehicleMeta.label,
      vehicleStatusTone: vehicleMeta.tone,
      nearestExpiresAt: vehicleStatus.nearestExpiresAt,
    };
  });

  const waUrl = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero solicitar antecedentes de documentación de la flota Fenice.")}`;

  return (
    <section id="documentacion-flota" className="py-20 bg-slate-50 border-y border-slate-100 scroll-mt-20" data-analytics-section="documentacion_flota" aria-labelledby="documentacion-flota-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10" data-reveal>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-[#f5a623]" />
            <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Transparencia operacional</p>
          </div>
          <h2 id="documentacion-flota-heading" className="text-3xl font-extrabold text-[#0a1628] leading-tight">
            Flota documentada y antecedentes verificables
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Consulta la documentación técnica, inspecciones y certificados vigentes de nuestros vehículos destinados
            al transporte y distribución de combustibles.
          </p>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Cada camión estanque de nuestra flota cuenta con una declaración registrada ante la SEC y un
            tanque inspeccionado por una entidad certificadora, con pruebas de hermeticidad e inspecciones
            periódicas que respaldan el transporte seguro de combustibles en la Región Metropolitana.
          </p>
        </div>

        {showSkeleton ? (
          <div className="flex flex-wrap justify-center gap-5" aria-busy="true" aria-label="Cargando documentación de flota">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)] max-w-sm bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="aspect-[16/10] bg-slate-100 admin-skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-4 w-2/3 bg-slate-100 admin-skeleton rounded" />
                  <div className="h-3 w-full bg-slate-100 admin-skeleton rounded" />
                  <div className="h-9 w-full bg-slate-100 admin-skeleton rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-5" data-reveal>
            {vehicles.map((vehicle) => (
              <FlotaVehiculoCard key={vehicle.id} vehicle={vehicle} waUrl={waUrl} />
            ))}
          </div>
        )}

        {/* Contenido semántico SEO */}
        <div className="mt-12 grid sm:grid-cols-2 gap-6 max-w-4xl">
          <div className="flex items-start gap-3" data-reveal>
            <div className="w-9 h-9 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5 text-[#1a6b3c]" aria-hidden="true" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nuestros camiones tanque para distribución de combustible operan con documentación técnica
              trazable: inspección de estanques, pruebas de hermeticidad y control de vencimientos.
            </p>
          </div>
          <div className="flex items-start gap-3" data-reveal>
            <div className="w-9 h-9 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-4.5 h-4.5 text-[#1a6b3c]" aria-hidden="true" />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              El transporte seguro de combustibles de nuestra flota se respalda con folios,
              códigos y canales oficiales de verificación disponibles en cada certificado.
            </p>
          </div>
        </div>

        {/* Nota de fines informativos */}
        <div className="mt-8 flex items-start gap-2.5 max-w-4xl" data-reveal>
          <TruckIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[11.5px] text-slate-400 leading-relaxed">
            La disponibilidad de estos antecedentes tiene fines informativos. La vigencia y autenticidad
            de los documentos puede verificarse mediante los folios, códigos y canales oficiales indicados.
          </p>
        </div>
      </div>
    </section>
  );
}
