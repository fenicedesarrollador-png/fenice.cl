"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail, Phone, MapPin, Package, MessageSquare, Building2, Search, X,
  Clock, ChevronDown, Filter, FileDown, Loader2, Inbox, CalendarRange, Repeat, Droplets,
} from "lucide-react";

export type Cotizacion = {
  id: string;
  nombre: string;
  empresa: string;
  rut_empresa: string | null;
  email: string;
  telefono: string;
  comuna: string | null;
  servicio_solicitado: string;
  volumen_estimado: string | null;
  frecuencia: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
};

const ESTADOS = ["nuevo", "en_proceso", "cotizado", "cerrado"] as const;

const ESTADO_CFG: Record<string, { label: string; chip: string; dot: string }> = {
  nuevo: { label: "Nueva", chip: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
  en_proceso: { label: "En proceso", chip: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  cotizado: { label: "Cotizada", chip: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  cerrado: { label: "Cerrada", chip: "bg-[#1a6b3c]/12 text-[#0d4a28] border-[#1a6b3c]/25", dot: "bg-[#1a6b3c]" },
};

const RANGOS = [
  { key: "todo", label: "Todo", days: null },
  { key: "7d", label: "7 días", days: 7 },
  { key: "30d", label: "30 días", days: 30 },
  { key: "90d", label: "90 días", days: 90 },
] as const;

function filterByDays<T extends { created_at: string }>(rows: T[], days: number): T[] {
  const cutoff = Date.now() - days * 86_400_000;
  return rows.filter((r) => new Date(r.created_at).getTime() >= cutoff);
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  );
}

export default function CotizacionesManager({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
  const router = useRouter();
  const [estadoFilter, setEstadoFilter] = useState("todos");
  const [rango, setRango] = useState<(typeof RANGOS)[number]["key"]>("todo");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = cotizaciones;
    if (estadoFilter !== "todos") r = r.filter((c) => c.estado === estadoFilter);
    const days = RANGOS.find((x) => x.key === rango)?.days;
    if (days) r = filterByDays(r, days);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((c) =>
        c.nombre.toLowerCase().includes(q) || c.empresa.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) || c.telefono.includes(q) ||
        (c.comuna ?? "").toLowerCase().includes(q) ||
        c.servicio_solicitado.toLowerCase().includes(q) ||
        (c.rut_empresa ?? "").includes(q) || (c.mensaje ?? "").toLowerCase().includes(q));
    }
    return r;
  }, [cotizaciones, estadoFilter, rango, search]);

  async function updateEstado(c: Cotizacion, estado: string) {
    setUpdating(c.id);
    await createClient().from("cotizaciones").update({ estado }).eq("id", c.id);
    setUpdating(null);
    router.refresh();
  }

  async function downloadPdf(c: Cotizacion) {
    setPdfLoading(c.id);
    try {
      const res = await fetch(`/api/admin/cotizaciones/${c.id}/pdf`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cotizacion_${c.empresa.toLowerCase().replace(/[^a-z0-9]+/g, "-")}_${c.id.slice(0, 8)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo generar el PDF. Intenta de nuevo.");
    } finally {
      setPdfLoading(null);
    }
  }

  const countEstado = (e: string) => cotizaciones.filter((c) => c.estado === e).length;

  return (
    <div className="space-y-4">
      {/* Contadores por estado (clic = filtrar) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button onClick={() => setEstadoFilter("todos")} className={`admin-card px-4 py-3 text-left transition-all ${estadoFilter === "todos" ? "!border-[#1a6b3c]/50 ring-1 ring-[#1a6b3c]/25" : "hover:border-slate-300"}`}>
          <p className="text-[24px] leading-none font-black tabular-nums text-[#0a1628]">{cotizaciones.length}</p>
          <p className="text-[11px] text-slate-500 font-bold mt-1.5">Todas</p>
        </button>
        {ESTADOS.map((e) => (
          <button key={e} onClick={() => setEstadoFilter(estadoFilter === e ? "todos" : e)} className={`admin-card px-4 py-3 text-left transition-all ${estadoFilter === e ? "!border-[#1a6b3c]/50 ring-1 ring-[#1a6b3c]/25" : "hover:border-slate-300"}`}>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_CFG[e].dot}`} />
              <p className="text-[24px] leading-none font-black tabular-nums text-[#0a1628]">{countEstado(e)}</p>
            </div>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{ESTADO_CFG[e].label}s</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa, contacto, email, RUT, servicio…" className="admin-input !pl-10 !pr-9" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 shrink-0 w-fit">
          <CalendarRange className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {RANGOS.map((r) => (
            <button key={r.key} onClick={() => setRango(r.key)} className={`px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold transition-all ${rango === r.key ? "bg-[#1a6b3c] text-white" : "text-slate-500 hover:text-[#0a1628]"}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-500 font-medium">
          {filtered.length} cotización{filtered.length !== 1 ? "es" : ""}
          {estadoFilter !== "todos" && ` · ${ESTADO_CFG[estadoFilter]?.label}`}
          {rango !== "todo" && ` · Últimos ${RANGOS.find((r) => r.key === rango)?.label}`}
        </p>
        {(estadoFilter !== "todos" || rango !== "todo" || search) && (
          <button onClick={() => { setEstadoFilter("todos"); setRango("todo"); setSearch(""); }} className="text-[12px] text-[#1a6b3c] font-bold hover:underline flex items-center gap-1">
            <Filter className="w-3 h-3" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 admin-card border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6 text-slate-400" />
          </div>
          <p className="text-[#0a1628] font-bold text-sm">{cotizaciones.length === 0 ? "Aún no hay cotizaciones" : "Sin resultados"}</p>
          <p className="text-slate-500 text-xs mt-1">
            {cotizaciones.length === 0 ? "Las solicitudes del formulario público aparecerán aquí." : "Ajusta la búsqueda o los filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((c) => {
            const cfg = ESTADO_CFG[c.estado] ?? ESTADO_CFG.nuevo;
            const isOpen = expanded === c.id;
            return (
              <div key={c.id} className="admin-card overflow-hidden transition-all hover:shadow-md">
                <button onClick={() => setExpanded(isOpen ? null : c.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5a623]/20 to-[#f5a623]/5 text-[#b87608] flex items-center justify-center text-[12px] font-black shrink-0">
                    {c.empresa.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-[#0a1628] text-sm truncate">{c.empresa}</p>
                      <span className="text-[11px] text-slate-400 font-bold">#{c.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 truncate">{c.nombre}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate"><Package className="w-3 h-3 shrink-0" />{c.servicio_solicitado}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(c.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${cfg.chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /><span className="hidden sm:inline">{cfg.label}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-[12px] text-slate-700 hover:text-[#1a6b3c] min-w-0"><Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /><span className="truncate">{c.email}</span></a>
                      <a href={`tel:${c.telefono}`} className="flex items-center gap-2 text-[12px] text-slate-700 hover:text-[#1a6b3c]"><Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />{c.telefono}</a>
                      {c.rut_empresa && <div className="flex items-center gap-2 text-[12px] text-slate-700"><Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />RUT: {c.rut_empresa}</div>}
                      {c.comuna && <div className="flex items-center gap-2 text-[12px] text-slate-700"><MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />{c.comuna}</div>}
                      {c.volumen_estimado && <div className="flex items-center gap-2 text-[12px] text-slate-700"><Droplets className="w-3.5 h-3.5 text-slate-500 shrink-0" />{c.volumen_estimado}</div>}
                      {c.frecuencia && <div className="flex items-center gap-2 text-[12px] text-slate-700"><Repeat className="w-3.5 h-3.5 text-slate-500 shrink-0" />{c.frecuencia}</div>}
                    </div>
                    {c.mensaje && (
                      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /><p className="text-[12px] text-slate-700 leading-relaxed">{c.mensaje}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => downloadPdf(c)}
                        disabled={pdfLoading === c.id}
                        className="inline-flex items-center gap-1.5 bg-[#f5a623] hover:bg-[#e08a0a] disabled:opacity-60 text-[#2a1a00] text-[12px] font-black px-3 py-2 rounded-xl transition-colors shadow-sm shadow-[#f5a623]/25"
                      >
                        {pdfLoading === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                        Descargar PDF
                      </button>
                      <a href={`https://wa.me/${c.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${c.nombre}, recibimos tu solicitud de cotización en Fenice SPA (folio ${c.id.slice(0, 8).toUpperCase()}). ¿Podemos coordinar?`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fb959] text-white text-[12px] font-bold px-3 py-2 rounded-xl transition-colors"><WaIcon /> WhatsApp</a>
                      <a href={`mailto:${c.email}?subject=${encodeURIComponent(`Cotización Fenice SPA — ${c.empresa} (folio ${c.id.slice(0, 8).toUpperCase()})`)}`} className="admin-btn-ghost !text-[12px] !py-2"><Mail className="w-3.5 h-3.5" /> Responder</a>
                      <div className="ml-auto">
                        <select value={c.estado} disabled={updating === c.id} onChange={(e) => updateEstado(c, e.target.value)} className="admin-input !w-auto !py-2 !text-[12px] font-bold">
                          {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_CFG[e].label}</option>)}
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
