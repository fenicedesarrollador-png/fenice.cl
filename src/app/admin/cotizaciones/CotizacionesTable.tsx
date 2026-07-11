"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail, Phone, MapPin, Package, MessageSquare, Building2,
  Search, Download, X, Clock, DollarSign, ChevronDown, Filter,
} from "lucide-react";

type Cotizacion = {
  id: string; nombre: string; empresa: string; rut_empresa?: string;
  email: string; telefono: string; comuna?: string; servicio_solicitado: string;
  volumen_estimado?: string; frecuencia?: string; mensaje?: string;
  estado: string; created_at: string;
};

const ESTADOS = ["nuevo", "en_proceso", "cotizado", "cerrado"] as const;

const CFG: Record<string, { label: string; chip: string; dot: string; bar: string }> = {
  nuevo: { label: "Nuevo", chip: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", bar: "bg-red-500" },
  en_proceso: { label: "En proceso", chip: "bg-[#fff7ec] text-[#b87608] border-[#f5a623]/30", dot: "bg-[#f5a623]", bar: "bg-[#f5a623]" },
  cotizado: { label: "Cotizado", chip: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", bar: "bg-blue-500" },
  cerrado: { label: "Cerrado", chip: "bg-[#ecfdf3] text-[#1a6b3c] border-[#1a6b3c]/20", dot: "bg-[#1a6b3c]", bar: "bg-[#1a6b3c]" },
};

function exportCSV(items: Cotizacion[]) {
  const headers = ["Empresa", "Nombre", "RUT", "Email", "Teléfono", "Comuna", "Servicio", "Volumen", "Frecuencia", "Estado", "Fecha"];
  const rows = items.map((c) => [c.empresa, c.nombre, c.rut_empresa ?? "", c.email, c.telefono, c.comuna ?? "", c.servicio_solicitado, c.volumen_estimado ?? "", c.frecuencia ?? "", c.estado, new Date(c.created_at).toLocaleDateString("es-CL")]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `cotizaciones_fenice_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

export default function CotizacionesTable({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = filter === "todos" ? cotizaciones : cotizaciones.filter((c) => c.estado === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((c) =>
        c.nombre.toLowerCase().includes(q) || c.empresa.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) || c.telefono.includes(q) ||
        c.comuna?.toLowerCase().includes(q) || c.servicio_solicitado.toLowerCase().includes(q) ||
        c.rut_empresa?.includes(q));
    }
    return r;
  }, [cotizaciones, filter, search]);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    await createClient().from("cotizaciones").update({ estado }).eq("id", id);
    setUpdating(null);
    router.refresh();
  }

  const count = (e: string) => cotizaciones.filter((c) => c.estado === e).length;
  const total = cotizaciones.length;

  return (
    <div className="space-y-4">
      {/* Pipeline */}
      <div className="admin-card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-wide">Pipeline</p>
          <span className="text-[11px] text-slate-400 font-bold">{total} en total</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ESTADOS.map((e) => {
            const cfg = CFG[e];
            const c = count(e);
            const pct = total > 0 ? Math.round((c / total) * 100) : 0;
            return (
              <button
                key={e}
                onClick={() => setFilter(filter === e ? "todos" : e)}
                className={`text-left rounded-xl p-3 border transition-all ${filter === e ? "border-[#1a6b3c]/30 ring-2 ring-[#1a6b3c]/15 bg-white" : "border-transparent bg-slate-50 hover:bg-slate-100"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  <span className="text-[10px] font-black text-slate-400">{pct}%</span>
                </div>
                <p className="text-2xl font-black text-[#0a1628] tabular-nums">{c}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{cfg.label}</p>
                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cfg.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa, RUT, servicio…" className="admin-input !pl-10 !pr-9" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <button onClick={() => exportCSV(filtered)} className="admin-btn-ghost shrink-0"><Download className="w-4 h-4" /><span className="hidden sm:inline">Exportar</span></button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-400 font-medium">{filtered.length} cotizacion{filtered.length !== 1 ? "es" : ""}{filter !== "todos" && ` · ${CFG[filter]?.label}`}</p>
        {filter !== "todos" && <button onClick={() => setFilter("todos")} className="text-[12px] text-[#1a6b3c] font-bold hover:underline flex items-center gap-1"><Filter className="w-3 h-3" /> Quitar filtro</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 admin-card border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3"><DollarSign className="w-6 h-6 text-slate-300" /></div>
          <p className="text-[#0a1628] font-bold text-sm">{total === 0 ? "Aún no hay cotizaciones" : "Sin resultados"}</p>
          <p className="text-slate-400 text-xs mt-1">{total === 0 ? "Las solicitudes desde /cotizacion aparecerán aquí." : "Ajusta la búsqueda o los filtros."}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((cot) => {
            const cfg = CFG[cot.estado] ?? CFG.nuevo;
            const isOpen = expanded === cot.id;
            return (
              <div key={cot.id} className="admin-card overflow-hidden transition-all hover:shadow-md">
                <button onClick={() => setExpanded(isOpen ? null : cot.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50/60 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fff7ec] to-[#fde9c8] flex items-center justify-center text-[12px] font-black text-[#d98a0e] shrink-0">
                    {cot.empresa.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#0a1628] text-sm truncate">{cot.empresa}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 truncate">{cot.nombre}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(cot.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${cfg.chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /><span className="hidden sm:inline">{cfg.label}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-50">
                    <div className="inline-flex items-center gap-1.5 bg-[#ecfdf3] border border-[#1a6b3c]/15 text-[#1a6b3c] text-[11px] font-bold px-2.5 py-1 rounded-lg my-3">
                      <Package className="w-3 h-3" />{cot.servicio_solicitado}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <a href={`mailto:${cot.email}`} className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-[#1a6b3c] min-w-0"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{cot.email}</span></a>
                      <a href={`tel:${cot.telefono}`} className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-[#1a6b3c]"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />{cot.telefono}</a>
                      {cot.rut_empresa && <div className="flex items-center gap-2 text-[12px] text-slate-600"><Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />{cot.rut_empresa}</div>}
                      {cot.comuna && <div className="flex items-center gap-2 text-[12px] text-slate-600"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{cot.comuna}</div>}
                      {cot.volumen_estimado && <div className="flex items-center gap-2 text-[12px] text-slate-600"><DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />Volumen: {cot.volumen_estimado}</div>}
                      {cot.frecuencia && <div className="flex items-center gap-2 text-[12px] text-slate-600"><Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />Frecuencia: {cot.frecuencia}</div>}
                    </div>
                    {cot.mensaje && (
                      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /><p className="text-[12px] text-slate-600 leading-relaxed">{cot.mensaje}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <a href={`https://wa.me/${cot.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${cot.nombre}, recibimos tu solicitud de cotización en Fenice SPA para ${cot.empresa}. ¿Coordinamos los detalles?`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fb959] text-white text-[12px] font-bold px-3 py-2 rounded-xl transition-colors shadow-sm shadow-[#25D366]/25"><WaIcon /> WhatsApp</a>
                      <a href={`mailto:${cot.email}?subject=Cotización Fenice SPA`} className="admin-btn-ghost !text-[12px] !py-2"><Mail className="w-3.5 h-3.5" /> Email</a>
                      <div className="ml-auto">
                        <select value={cot.estado} disabled={updating === cot.id} onChange={(e) => updateEstado(cot.id, e.target.value)} className="admin-input !w-auto !py-2 !text-[12px] font-bold">
                          {ESTADOS.map((e) => <option key={e} value={e}>{CFG[e].label}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
