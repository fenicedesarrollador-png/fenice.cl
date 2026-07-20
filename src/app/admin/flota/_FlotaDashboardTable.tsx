"use client";

import { useMemo, useState } from "react";
import { Search, Filter } from "lucide-react";
import { Badge } from "../_components/ui";
import { FleetDocumentRowActions } from "./_FleetDocumentActions";
import {
  DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_META,
  formatDateCL, type DocumentStatusKey, type ReviewStatus,
} from "@/lib/fleet";

export type DocRow = {
  id: string;
  vehicle_id: string;
  plate: string;
  vehicleLabel: string;
  document_type: string;
  title: string;
  folio: string | null;
  certificate_number: string | null;
  issued_at: string | null;
  expires_at: string | null;
  is_public: boolean;
  is_active: boolean;
  review_status: ReviewStatus;
  sanitized_confirmed: boolean;
  public_file_path: string | null;
  statusKey: DocumentStatusKey;
};

export default function FlotaDashboardTable({
  documents,
  vehicles,
}: {
  documents: DocRow[];
  vehicles: { id: string; plate: string }[];
}) {
  const [vehicleFilter, setVehicleFilter] = useState("todos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let r = documents;
    if (vehicleFilter !== "todos") r = r.filter((d) => d.vehicle_id === vehicleFilter);
    if (statusFilter !== "todos") r = r.filter((d) => d.statusKey === statusFilter);
    if (typeFilter !== "todos") r = r.filter((d) => d.document_type === typeFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(
        (d) =>
          d.plate.toLowerCase().includes(q) ||
          d.folio?.toLowerCase().includes(q) ||
          d.certificate_number?.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q),
      );
    }
    return r;
  }, [documents, vehicleFilter, statusFilter, typeFilter, search]);

  return (
    <div className="admin-card overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-2.5">
        <div className="flex items-center gap-2 text-slate-400 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Filtros</span>
        </div>
        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} className="admin-input !py-1.5 !text-[12.5px] w-auto">
          <option value="todos">Todos los vehículos</option>
          {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-input !py-1.5 !text-[12.5px] w-auto">
          <option value="todos">Todos los estados</option>
          {(Object.keys(DOCUMENT_STATUS_META) as DocumentStatusKey[]).map((k) => (
            <option key={k} value={k}>{DOCUMENT_STATUS_META[k].label}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="admin-input !py-1.5 !text-[12.5px] w-auto">
          <option value="todos">Todos los tipos</option>
          {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{DOCUMENT_TYPE_LABELS[t]}</option>)}
        </select>
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por patente, folio o certificado…"
            className="admin-input !py-1.5 !text-[12.5px] !pl-8 w-full"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-slate-500 text-sm font-medium">Sin documentos que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-[10.5px] font-black text-slate-400 uppercase tracking-wider">
                <th className="px-4 sm:px-5 py-2.5">Patente</th>
                <th className="px-3 py-2.5">Documento</th>
                <th className="px-3 py-2.5 hidden md:table-cell">Emisión</th>
                <th className="px-3 py-2.5">Vencimiento</th>
                <th className="px-3 py-2.5">Estado</th>
                <th className="px-3 py-2.5 hidden sm:table-cell">Visibilidad</th>
                <th className="px-3 py-2.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((d) => {
                const meta = DOCUMENT_STATUS_META[d.statusKey];
                return (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 sm:px-5 py-3">
                      <p className="font-black text-[#0a1628]">{d.plate}</p>
                      <p className="text-[10.5px] text-slate-400">{d.vehicleLabel}</p>
                    </td>
                    <td className="px-3 py-3 max-w-[220px]">
                      <p className="font-semibold text-[#0a1628] truncate">{d.title}</p>
                      <p className="text-[10.5px] text-slate-400">{DOCUMENT_TYPE_LABELS[d.document_type as keyof typeof DOCUMENT_TYPE_LABELS] ?? d.document_type}</p>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-slate-500">{formatDateCL(d.issued_at)}</td>
                    <td className="px-3 py-3 text-slate-500">{formatDateCL(d.expires_at)}</td>
                    <td className="px-3 py-3"><Badge tone={meta.tone} dot>{meta.label}</Badge></td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      {d.is_public ? <Badge tone="green">Pública</Badge> : <Badge tone="neutral">Privada</Badge>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end">
                        <FleetDocumentRowActions doc={d} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
