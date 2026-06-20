"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Package, CalendarDays, MessageSquare, Building2 } from "lucide-react";

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

const ESTADO_CONFIG: Record<string, { color: string; dot: string; label: string }> = {
  nuevo: { color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", label: "Nuevo" },
  en_proceso: { color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400", label: "En proceso" },
  cotizado: { color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500", label: "Cotizado" },
  cerrado: { color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500", label: "Cerrado" },
};

const FILTER_LABELS: Record<string, string> = {
  todos: "Todos",
  nuevo: "Nuevos",
  en_proceso: "En proceso",
  cotizado: "Cotizados",
  cerrado: "Cerrados",
};

export default function CotizacionesTable({ cotizaciones }: { cotizaciones: Cotizacion[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("todos");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = filter === "todos" ? cotizaciones : cotizaciones.filter((c) => c.estado === filter);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("cotizaciones").update({ estado }).eq("id", id);
    setUpdating(null);
    router.refresh();
  }

  const countByEstado = (e: string) => cotizaciones.filter((c) => c.estado === e).length;

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["todos", ...ESTADOS].map((e) => (
          <button
            key={e}
            onClick={() => setFilter(e)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === e
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {FILTER_LABELS[e] ?? e}
            {e !== "todos" && (
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                filter === e ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {countByEstado(e)}
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} cotizacion{filtered.length !== 1 ? "es" : ""}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-400 text-sm">No hay cotizaciones en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cot) => {
            const cfg = ESTADO_CONFIG[cot.estado] ?? ESTADO_CONFIG.nuevo;
            return (
              <div key={cot.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                      {cot.empresa.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{cot.nombre}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {cot.empresa}
                        {cot.rut_empresa && <span className="text-slate-400"> · {cot.rut_empresa}</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 hidden sm:block">
                      {new Date(cot.created_at).toLocaleDateString("es-CL", { dateStyle: "short" })}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  {/* Service badge */}
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    <Package className="w-3.5 h-3.5" />
                    {cot.servicio_solicitado}
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`mailto:${cot.email}`} className="hover:text-orange-600 truncate">{cot.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${cot.telefono}`} className="hover:text-orange-600">{cot.telefono}</a>
                    </div>
                    {cot.comuna && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cot.comuna}</span>
                      </div>
                    )}
                    {cot.volumen_estimado && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Volumen: {cot.volumen_estimado}</span>
                      </div>
                    )}
                    {cot.frecuencia && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Frecuencia: {cot.frecuencia}</span>
                      </div>
                    )}
                  </div>

                  {cot.mensaje && (
                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg px-3.5 py-3 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">{cot.mensaje}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <a
                      href={`https://wa.me/${cot.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${cot.nombre}, recibimos tu solicitud de cotización de combustible en Fenice SPA para ${cot.empresa}. ¿Podemos coordinar los detalles?`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                      WhatsApp
                    </a>
                    <a
                      href={`mailto:${cot.email}?subject=Cotización%20de%20combustible%20%E2%80%94%20Fenice%20SPA&body=Estimado%2Fa%20${encodeURIComponent(cot.nombre)}%2C%0A%0AEn%20respuesta%20a%20su%20solicitud%20de%20cotización...`}
                      className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </a>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-slate-400">Estado:</span>
                      <select
                        value={cot.estado}
                        disabled={updating === cot.id}
                        onChange={(e) => updateEstado(cot.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
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
