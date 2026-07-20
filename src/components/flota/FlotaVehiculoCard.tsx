"use client";

import { useId, useState } from "react";
import Image from "next/image";
import {
  Truck, Fuel, Layers, Calendar, ChevronDown, FileText,
  ExternalLink, Download, BadgeCheck, ShieldQuestion,
} from "lucide-react";
import type { BadgeTone, DocumentStatusKey } from "@/lib/fleet";
import { DOCUMENT_TYPE_LABELS, formatDateCL, formatLiters } from "@/lib/fleet";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  green: "bg-[#1a6b3c]/12 text-[#0d4a28] border-[#1a6b3c]/25",
  amber: "bg-[#f5a623]/12 text-[#b87608] border-[#f5a623]/25",
  red: "bg-red-50 text-red-600 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export type PublicFleetDocument = {
  id: string;
  document_type: string;
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
  fileUrl: string;
  downloadUrl: string;
  is_historical: boolean;
  statusKey: DocumentStatusKey;
  statusLabel: string;
  statusTone: BadgeTone;
};

export type PublicFleetVehicle = {
  id: string;
  plate: string;
  brand: string | null;
  model: string | null;
  manufacture_year: number | null;
  tank_capacity_liters: number | null;
  compartments: number | null;
  authorized_fuel_type: string | null;
  imageUrl: string | null;
  short_description: string | null;
  documents: PublicFleetDocument[];
  vehicleStatusKey: DocumentStatusKey;
  vehicleStatusLabel: string;
  vehicleStatusTone: BadgeTone;
  nearestExpiresAt: string | null;
};

function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export default function FlotaVehiculoCard({ vehicle, waUrl }: { vehicle: PublicFleetVehicle; waUrl: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const visibleDocs = vehicle.documents;

  return (
    <article
      className="group bg-white border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden transition-all hover:shadow-lg flex flex-col"
      data-analytics-id={`documentacion_flota_${vehicle.plate.toLowerCase()}`}
    >
      {/* Foto */}
      <div className="relative aspect-[16/10] bg-slate-100 shrink-0">
        {vehicle.imageUrl ? (
          <Image
            src={vehicle.imageUrl}
            alt={`Camión estanque Fenice SPA, patente ${vehicle.plate}${vehicle.brand ? `, ${vehicle.brand}` : ""}${vehicle.model ? ` ${vehicle.model}` : ""}`}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            <Truck className="w-12 h-12 text-slate-400" strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center bg-[#0a1628]/85 backdrop-blur-sm text-white text-xs font-black tracking-wider px-2.5 py-1 rounded-lg">
          {vehicle.plate}
        </span>
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${TONE_CLASSES[vehicle.vehicleStatusTone]}`}
          role="status"
        >
          {vehicle.vehicleStatusLabel}
        </span>
      </div>

      {/* Info resumen */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-extrabold text-[#0a1628] leading-tight">
          {vehicle.brand} {vehicle.model}
        </h3>
        {vehicle.short_description && (
          <p className="text-[13px] text-slate-500 mt-1 leading-relaxed line-clamp-2">{vehicle.short_description}</p>
        )}

        <dl className="grid grid-cols-2 gap-2.5 mt-4 text-[12px]">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" aria-hidden="true" />
            <dt className="sr-only">Año</dt>
            <dd>{vehicle.manufacture_year ?? "—"}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Fuel className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" aria-hidden="true" />
            <dt className="sr-only">Capacidad</dt>
            <dd>{formatLiters(vehicle.tank_capacity_liters)}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Layers className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" aria-hidden="true" />
            <dt className="sr-only">Compartimientos</dt>
            <dd>{vehicle.compartments ?? "—"} compartimiento{vehicle.compartments === 1 ? "" : "s"}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 truncate">
            <BadgeCheck className="w-3.5 h-3.5 text-[#1a6b3c] shrink-0" aria-hidden="true" />
            <dt className="sr-only">Combustible autorizado</dt>
            <dd className="truncate">{vehicle.authorized_fuel_type ?? "—"}</dd>
          </div>
        </dl>

        {vehicle.nearestExpiresAt && (
          <p className="text-[11px] text-slate-400 mt-3">
            Próximo vencimiento: <span className="font-semibold text-slate-600">{formatDateCL(vehicle.nearestExpiresAt)}</span>
          </p>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-[#1a6b3c]/10 border border-slate-200 hover:border-[#1a6b3c]/30 text-[#0a1628] font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all"
        >
          <FileText className="w-4 h-4 text-[#1a6b3c]" aria-hidden="true" />
          {open ? "Ocultar documentación" : "Ver documentación"}
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>

        {/* Panel expandible de documentos */}
        <div id={panelId} className={open ? "mt-4 space-y-3" : "hidden"}>
          {visibleDocs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center">
              <ShieldQuestion className="w-5 h-5 text-slate-400 mx-auto mb-1.5" aria-hidden="true" />
              <p className="text-[12px] text-slate-500 leading-relaxed">
                Aún no hay documentos públicos disponibles para este vehículo.
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-[12px] font-bold text-[#1a6b3c] hover:text-[#0d4a28]"
              >
                Solicitar antecedentes por WhatsApp
              </a>
            </div>
          ) : (
            visibleDocs.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/60">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#1a6b3c] uppercase tracking-wider">{DOCUMENT_TYPE_LABELS[doc.document_type as keyof typeof DOCUMENT_TYPE_LABELS] ?? "Documento"}</p>
                    <h4 className="text-[13px] font-bold text-[#0a1628] leading-snug truncate">{doc.title}</h4>
                  </div>
                  <span className={`shrink-0 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${TONE_CLASSES[doc.statusTone]}`}>
                    {doc.statusLabel}
                  </span>
                </div>

                {doc.description && <p className="text-[11.5px] text-slate-500 leading-relaxed mb-2">{doc.description}</p>}

                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3">
                  {doc.issuing_entity && (
                    <div className="col-span-2"><dt className="inline font-semibold text-slate-600">Entidad: </dt><dd className="inline">{doc.issuing_entity}</dd></div>
                  )}
                  {doc.certificate_number && (
                    <div><dt className="inline font-semibold text-slate-600">N° certificado: </dt><dd className="inline">{doc.certificate_number}</dd></div>
                  )}
                  {doc.folio && (
                    <div><dt className="inline font-semibold text-slate-600">Folio: </dt><dd className="inline">{doc.folio}</dd></div>
                  )}
                  {doc.verification_code && (
                    <div className="col-span-2"><dt className="inline font-semibold text-slate-600">Código de verificación: </dt><dd className="inline">{doc.verification_code}</dd></div>
                  )}
                  {doc.issued_at && (
                    <div><dt className="inline font-semibold text-slate-600">Emisión: </dt><dd className="inline">{formatDateCL(doc.issued_at)}</dd></div>
                  )}
                  {doc.expires_at && (
                    <div><dt className="inline font-semibold text-slate-600">Vencimiento: </dt><dd className="inline">{formatDateCL(doc.expires_at)}</dd></div>
                  )}
                  {doc.next_inspection_at && (
                    <div className="col-span-2"><dt className="inline font-semibold text-slate-600">Próxima inspección: </dt><dd className="inline">{formatDateCL(doc.next_inspection_at)}</dd></div>
                  )}
                </dl>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-[#0a1628] hover:bg-[#0d2040] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" aria-hidden="true" /> Ver documento
                  </a>
                  <a
                    href={doc.downloadUrl}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0a1628] bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download className="w-3 h-3" aria-hidden="true" /> Descargar PDF
                  </a>
                  {doc.verification_url && isSafeExternalUrl(doc.verification_url) && (
                    <a
                      href={doc.verification_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1a6b3c] bg-[#1a6b3c]/10 hover:bg-[#1a6b3c]/15 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <BadgeCheck className="w-3 h-3" aria-hidden="true" /> Verificar
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </article>
  );
}
