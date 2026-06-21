"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail, Phone, MapPin, Package, MessageSquare,
  Search, Download, Filter, X, ChevronDown, StickyNote,
  BarChart3, Clock,
} from "lucide-react";

type Lead = {
  id: string; nombre: string; email?: string; telefono?: string;
  comuna?: string; tipo_operacion?: string; volumen?: string;
  mensaje?: string; estado: string; created_at: string;
  notas?: string;
};

const ESTADOS = ["nuevo", "contactado", "cerrado"];

const ESTADO_CONFIG: Record<string, { color: string; dot: string; badge: string; label: string }> = {
  nuevo: {
    color: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    badge: "bg-red-500",
    label: "Nuevo",
  },
  contactado: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    badge: "bg-amber-500",
    label: "Contactado",
  },
  cerrado: {
    color: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    badge: "bg-green-500",
    label: "Cerrado",
  },
};

function exportCSV(leads: Lead[]) {
  const headers = ["Nombre", "Email", "Teléfono", "Comuna", "Tipo operación", "Volumen", "Estado", "Fecha"];
  const rows = leads.map((l) => [
    l.nombre,
    l.email ?? "",
    l.telefono ?? "",
    l.comuna ?? "",
    l.tipo_operacion ?? "",
    l.volumen ?? "",
    l.estado,
    new Date(l.created_at).toLocaleDateString("es-CL"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads_fenice_${new Date().toISOString().slice(0, 10)}.csv`;
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

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expandedNote, setExpandedNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = filter === "todos" ? leads : leads.filter((l) => l.estado === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.telefono?.includes(q) ||
          l.comuna?.toLowerCase().includes(q) ||
          l.tipo_operacion?.toLowerCase().includes(q) ||
          l.mensaje?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [leads, filter, search]);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    const supabase = createClient();
    await supabase.from("leads").update({ estado }).eq("id", id);
    setUpdating(null);
    router.refresh();
  }

  async function saveNote(id: string) {
    setSavingNote(id);
    const supabase = createClient();
    await supabase.from("leads").update({ notas: noteText[id] ?? "" }).eq("id", id);
    setSavingNote(null);
    setExpandedNote(null);
    router.refresh();
  }

  function initNote(lead: Lead) {
    if (!noteText[lead.id]) {
      setNoteText((prev) => ({ ...prev, [lead.id]: lead.notas ?? "" }));
    }
    setExpandedNote(expandedNote === lead.id ? null : lead.id);
  }

  const countByEstado = (e: string) => leads.filter((l) => l.estado === e).length;

  return (
    <div>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total", value: leads.length, color: "text-slate-900" },
          { label: "Nuevos", value: countByEstado("nuevo"), color: "text-red-600" },
          { label: "Contactados", value: countByEstado("contactado"), color: "text-amber-600" },
          { label: "Cerrados", value: countByEstado("cerrado"), color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, teléfono, comuna…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 items-center flex-wrap">
          {["todos", ...ESTADOS].map((e) => {
            const cfg = ESTADO_CONFIG[e];
            const count = e === "todos" ? leads.length : countByEstado(e);
            return (
              <button
                key={e}
                onClick={() => setFilter(e)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  filter === e
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {e !== "todos" && cfg && (
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                )}
                <span className="capitalize">{e === "todos" ? "Todos" : cfg?.label ?? e}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  filter === e ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Export */}
        <button
          onClick={() => exportCSV(filtered)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all bg-white shrink-0"
          title="Exportar a CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      {/* Results count */}
      <p className="text-xs text-slate-400 mb-3 font-medium">
        {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        {search && ` para "${search}"`}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <BarChart3 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">Sin resultados</p>
          <p className="text-slate-400 text-xs mt-1">Prueba cambiando los filtros o la búsqueda</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const cfg = ESTADO_CONFIG[lead.estado] ?? ESTADO_CONFIG.nuevo;
            const isNoteOpen = expandedNote === lead.id;
            return (
              <div
                key={lead.id}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 hover:shadow-md hover:shadow-slate-100 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-100 flex items-center justify-center text-xs font-black text-orange-600 shrink-0">
                      {lead.nombre.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{lead.nombre}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                        <p className="text-[11px] text-slate-400">
                          {new Date(lead.created_at).toLocaleDateString("es-CL", { dateStyle: "medium" })}
                          {" · "}
                          {new Date(lead.created_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                    {/* Mobile status dot */}
                    <span className={`sm:hidden w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-4">
                    {lead.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-600 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`mailto:${lead.email}`} className="hover:text-orange-600 truncate transition-colors">{lead.email}</a>
                      </div>
                    )}
                    {lead.telefono && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a href={`tel:${lead.telefono}`} className="hover:text-orange-600 transition-colors">{lead.telefono}</a>
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
                      <div className="flex items-center gap-2 text-xs text-slate-600 col-span-full sm:col-span-1">
                        <span className="text-slate-400 shrink-0">Vol.</span>
                        <span>{lead.volumen}</span>
                      </div>
                    )}
                  </div>

                  {lead.mensaje && (
                    <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 mb-4">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 leading-relaxed">{lead.mensaje}</p>
                    </div>
                  )}

                  {/* Note section */}
                  {isNoteOpen && (
                    <div className="mb-4 bg-amber-50/50 border border-amber-200/50 rounded-xl p-3.5">
                      <label className="block text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">Nota interna</label>
                      <textarea
                        value={noteText[lead.id] ?? ""}
                        onChange={(e) => setNoteText((prev) => ({ ...prev, [lead.id]: e.target.value }))}
                        placeholder="Escribe una nota interna sobre este lead…"
                        rows={3}
                        className="w-full text-xs text-slate-700 bg-white border border-amber-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/30 resize-none placeholder:text-slate-400"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => saveNote(lead.id)}
                          disabled={savingNote === lead.id}
                          className="text-xs bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {savingNote === lead.id ? "Guardando…" : "Guardar nota"}
                        </button>
                        <button
                          onClick={() => setExpandedNote(null)}
                          className="text-xs text-slate-500 hover:text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium px-3 py-1.5 rounded-lg transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {lead.telefono && (
                      <a
                        href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${lead.nombre}, recibimos tu cotización de petróleo en Fenice SPA. ¿Podemos coordinar?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm shadow-green-500/20"
                      >
                        <WaIcon /> WhatsApp
                      </a>
                    )}
                    {lead.email && (
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold px-3.5 py-2 rounded-xl transition-all"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </a>
                    )}
                    <button
                      onClick={() => initNote(lead)}
                      className={`inline-flex items-center gap-1.5 border text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                        lead.notas
                          ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-500"
                      }`}
                      title={lead.notas ? "Ver/editar nota" : "Agregar nota"}
                    >
                      <StickyNote className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{lead.notas ? "Nota" : "Agregar nota"}</span>
                    </button>

                    <div className="ml-auto flex items-center gap-2">
                      <select
                        value={lead.estado}
                        disabled={updating === lead.id}
                        onChange={(e) => updateEstado(lead.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 capitalize disabled:opacity-50 font-semibold transition-all cursor-pointer"
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e} className="capitalize">
                            {ESTADO_CONFIG[e]?.label ?? e}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nota preview */}
                  {lead.notas && !isNoteOpen && (
                    <div className="mt-3 flex items-start gap-2 bg-amber-50/70 border border-amber-100 rounded-lg px-3 py-2">
                      <StickyNote className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-800 leading-relaxed line-clamp-2">{lead.notas}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
