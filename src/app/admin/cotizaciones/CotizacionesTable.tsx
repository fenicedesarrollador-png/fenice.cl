"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail, Phone, MapPin, Package, MessageSquare, Building2,
  Search, Download, X, Clock, BarChart3, DollarSign,
} from "lucide-react";

type Cotizacion = {
  id: string;
  nombre: string;
  empresa: string;
  rut_empresa?: string;
  email: string;
  telefono: string;
  comuna?: string;
  servicio_solicitado: string;
  volumen_estimado?: string;
  frecuencia?: string;
  mensaje?: string;
  estado: string;
  created_at: string;
};

const ESTADOS = ["nuevo", "en_proceso", "cotizado", "cerrado"];

const ESTADO_CONFIG: Record<string, { color: string; dot: string; label: string; pipeline: string }> = {
  nuevo: { color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", label: "Nuevo", pipeline: "bg-red-500" },
  en_proceso: { color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400", label: "En proceso", pipeline: "bg-amber-400" },
  cotizado: { color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", label: "Cotizado", pipeline: "bg-blue-500" },
  cerrado: { color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", label: "Cerrado", pipeline: "bg-green-500" },
};

function exportCSV(items: Cotizacion[]) {
  const headers = ["Empresa", "Nombre", "RUT", "Email", "Teléfono", "Comuna", "Servicio", "Volumen", "Frecuencia", "Estado", "Fecha"];
  const rows = items.map((c) => [
    c.empresa, c.nombre, c.rut_empresa ?? "", c.email, c.telefono,
    c.comuna ?? "", c.servicio_solicitado, c.volumen_estimado ?? "",
    c.frecuencia ?? "", c.estado,
    new Date(c.created_at).toLocaleDateString("es-CL"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cotizaciones_fenice_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
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

  const filtered = useMemo(() => {
    let result = filter === "todos" ? cotizaciones : cotizaciones.filter((c) => c.estado === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.nombre.toLowerCase().includes(q) ||
          c.empresa.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.telefono.includes(q) ||
          c.comuna?.toLowerCase().includes(q) ||
          c.servicio_solicitado.toLowerCase().includes(q) ||
          c.rut_empresa?.includes(q)
      );
    }
    return result;
  }, [cotizaciones, filter, search]);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("cotizaciones").update({ estado }).eq("id", id);
    setUpdating(null);
    router.refresh();
  }

  const countByEstado = (e: string) => cotizaciones.filter((c) => c.estado === e).length;
  const total = cotizaciones.length;

  return (
    <div>
      {/* Pipeline visual */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pipeline de cotizaciones</p>
          <span className="text-xs text-slate-400 font-medium">{total} total</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ESTADOS.map((e) => {
            const cfg = ESTADO_CONFIG[e];
            const count = countByEstado(e);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <button
                key={e}
                onClick={() => setFilter(filter === e ? "todos" : e)}
                className={`text-left rounded-xl p-3 border-2 transition-all ${
                  filter === e
                    ? "border-slate-900 shadow-md"
                    : "border-transparent bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cfg.pipeline}`} />
                  <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
                </div>
                <p className="text-2xl font-black text-slate-900 tabular-nums">{count}</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{cfg.label}</p>
                {/* Progress bar */}
                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cfg.pipeline} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar empresa, nombre, RUT, servicio…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("todos")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              filter === "todos"
                ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Todos ({total})
          </button>
        </div>
        <button
          onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all bg-white shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 mb-3 font-medium">
        {filtered.length} cotizacion{filtered.length !== 1 ? "es" : ""}
        {search && ` para "${search}"`}
        {filter !== "todos" && ` · Filtro: ${ESTADO_CONFIG[filter]?.label ?? filter}`}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">Sin cotizaciones en esta categoría</p>
          <p className="text-slate-400 text-xs mt-1">Prueba cambiando los filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cot) => {
            const cfg = ESTADO_CONFIG[cot.estado] ?? ESTADO_CONFIG.nuevo;
            return (
              <div
                key={cot.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-md hover:shadow-slate-100 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center text-xs font-black text-blue-600 shrink-0">
                      {cot.empresa.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{cot.nombre}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-[11px] text-slate-500 font-medium truncate">{cot.empresa}</span>
                        {cot.rut_empresa && (
                          <span className="text-[11px] text-slate-400 hidden sm:inline">· {cot.rut_empresa}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(cot.created_at).toLocaleDateString("es-CL", { dateStyle: "short" })}
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <div className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-xl mb-4">
                    <Package className="w-3.5 h-3.5" />
                    {cot.servicio_solicitado}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${cot.email}`} className="hover:text-orange-600 truncate transition-colors">{cot.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${cot.telefono}`} className="hover:text-orange-600 transition-colors">{cot.telefono}</a>
                    </div>
                    {cot.comuna && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cot.comuna}</span>
                      </div>
                    )}
                    {cot.volumen_estimado && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Volumen: {cot.volumen_estimado}</span>
                      </div>
                    )}
                    {cot.frecuencia && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Frecuencia: {cot.frecuencia}</span>
                      </div>
                    )}
                  </div>

                  {cot.mensaje && (
                    <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">{cot.mensaje}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://wa.me/${cot.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${cot.nombre}, recibimos tu solicitud de cotización de combustible en Fenice SPA para ${cot.empresa}. ¿Podemos coordinar los detalles?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm shadow-green-500/20"
                    >
                      <WaIcon /> WhatsApp
                    </a>
                    <a
                      href={`mailto:${cot.email}?subject=Cotización%20de%20combustible%20—%20Fenice%20SPA&body=Estimado%2Fa%20${encodeURIComponent(cot.nombre)}%2C%0A%0AEn%20respuesta%20a%20su%20solicitud%20de%20cotización...`}
                      className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                    <div className="ml-auto flex items-center gap-2">
                      <select
                        value={cot.estado}
                        disabled={updating === cot.id}
                        onChange={(e) => updateEstado(cot.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 disabled:opacity-50 font-semibold transition-all cursor-pointer"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e}>{ESTADO_CONFIG[e]?.label ?? e}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
