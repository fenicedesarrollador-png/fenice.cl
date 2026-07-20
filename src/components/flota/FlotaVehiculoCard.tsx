"use client";

import { useState } from "react";
import Image from "next/image";
import { Truck, Fuel, Layers, Calendar, FileText, BadgeCheck } from "lucide-react";
import type { BadgeTone, DocumentStatusKey } from "@/lib/fleet";
import { formatDateCL, formatLiters } from "@/lib/fleet";
import FlotaDocumentViewerModal from "./FlotaDocumentViewerModal";

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
  /** URL directa del PDF sanitizado (solo para cargarlo en el visor en canvas; nunca se enlaza como descarga). */
  fileUrl: string;
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

export default function FlotaVehiculoCard({ vehicle, waUrl }: { vehicle: PublicFleetVehicle; waUrl: string }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article
        className="group w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)] max-w-sm bg-white border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl overflow-hidden transition-all hover:shadow-lg flex flex-col"
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
            onClick={() => setModalOpen(true)}
            className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-[#1a6b3c]/10 border border-slate-200 hover:border-[#1a6b3c]/30 text-[#0a1628] font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all"
          >
            <FileText className="w-4 h-4 text-[#1a6b3c]" aria-hidden="true" />
            Ver documentación
          </button>
        </div>
      </article>

      {modalOpen && (
        <FlotaDocumentViewerModal vehicle={vehicle} waUrl={waUrl} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
