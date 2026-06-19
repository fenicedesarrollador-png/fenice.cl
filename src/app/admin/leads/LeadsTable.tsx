"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { SITE_CONFIG } from "@/lib/config";
import { Mail, Phone, MapPin, Package, CalendarDays, MessageSquare } from "lucide-react";

type Lead = {
  id: string; nombre: string; email?: string; telefono?: string;
  comuna?: string; tipo_operacion?: string; volumen?: string;
  mensaje?: string; estado: string; created_at: string;
};

const ESTADOS = ["nuevo", "contactado", "cerrado"];

const ESTADO_CONFIG: Record<string, { color: string; dot: string }> = {
  nuevo: { color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  contactado: { color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  cerrado: { color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-500" },
};

const FILTER_LABELS: Record<string, string> = {
  todos: "Todos",
  nuevo: "Nuevos",
  contactado: "Contactados",
  cerrado: "Cerrados",
};

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("todos");
  const [updating, setUpdating] = useState<string | null>(null);

  const filtered = filter === "todos" ? leads : leads.filter((l) => l.estado === filter);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("leads").update({ estado }).eq("id", id);
    setUpdating(null);
    router.refresh();
  }

  const countByEstado = (e: string) => leads.filter((l) => l.estado === e).length;

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
            {FILTER_LABELS[e]}
            {e !== "todos" && (
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                filter === e ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {countByEstado(e)}
              </span>
            )}
          </button>
        ))}
        <span className="ml-auto text-xs text-slate-400 self-center">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-400 text-sm">No hay leads en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const cfg = ESTADO_CONFIG[lead.estado] ?? ESTADO_CONFIG.nuevo;
            return (
              <div key={lead.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                      {lead.nombre.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{lead.nombre}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString("es-CL", { dateStyle: "medium" })}
                        {" · "}
                        {new Date(lead.created_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {lead.estado.charAt(0).toUpperCase() + lead.estado.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <div className="grid sm:grid-cols-3 gap-3 mb-4">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${lead.email}`} className="hover:text-orange-600 truncate">{lead.email}</a>
                      </div>
                    )}
                    {lead.telefono && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`tel:${lead.telefono}`} className="hover:text-orange-600">{lead.telefono}</a>
                      </div>
                    )}
                    {lead.comuna && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.comuna}</span>
                      </div>
                    )}
                    {lead.tipo_operacion && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.tipo_operacion}</span>
                      </div>
                    )}
                    {lead.volumen && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{lead.volumen}</span>
                      </div>
                    )}
                  </div>

                  {lead.mensaje && (
                    <div className="flex items-start gap-2 bg-slate-50 rounded-lg px-3.5 py-3 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">{lead.mensaje}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {lead.telefono && (
                      <a
                        href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${lead.nombre}, recibimos tu cotización de petróleo en Fenice SPA. ¿Podemos coordinar?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                        WhatsApp
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-slate-400">Estado:</span>
                      <select
                        value={lead.estado}
                        disabled={updating === lead.id}
                        onChange={(e) => updateEstado(lead.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 capitalize disabled:opacity-50"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e} className="capitalize">{e}</option>
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
