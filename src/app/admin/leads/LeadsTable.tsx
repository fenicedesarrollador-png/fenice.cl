"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail, Phone, MapPin, Package, MessageSquare, Search, Download,
  X, StickyNote, Inbox, Clock, ChevronDown, Filter,
} from "lucide-react";

type Lead = {
  id: string; nombre: string; email?: string; telefono?: string;
  comuna?: string; tipo_operacion?: string; volumen?: string;
  mensaje?: string; estado: string; created_at: string; notas?: string;
};

const ESTADOS = ["nuevo", "contactado", "cerrado"] as const;

const ESTADO_CFG: Record<string, { label: string; chip: string; dot: string; ring: string }> = {
  nuevo: { label: "Nuevo", chip: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500", ring: "ring-red-100" },
  contactado: { label: "Contactado", chip: "bg-[#fff7ec] text-[#b87608] border-[#f5a623]/30", dot: "bg-[#f5a623]", ring: "ring-[#f5a623]/15" },
  cerrado: { label: "Cerrado", chip: "bg-[#ecfdf3] text-[#1a6b3c] border-[#1a6b3c]/20", dot: "bg-[#1a6b3c]", ring: "ring-[#1a6b3c]/15" },
};

function exportCSV(leads: Lead[]) {
  const headers = ["Nombre", "Email", "Teléfono", "Comuna", "Tipo", "Volumen", "Estado", "Fecha"];
  const rows = leads.map((l) => [l.nombre, l.email ?? "", l.telefono ?? "", l.comuna ?? "", l.tipo_operacion ?? "", l.volumen ?? "", l.estado, new Date(l.created_at).toLocaleDateString("es-CL")]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `leads_fenice_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
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
  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = filter === "todos" ? leads : leads.filter((l) => l.estado === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((l) =>
        l.nombre.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) ||
        l.telefono?.includes(q) || l.comuna?.toLowerCase().includes(q) ||
        l.tipo_operacion?.toLowerCase().includes(q) || l.mensaje?.toLowerCase().includes(q));
    }
    return r;
  }, [leads, filter, search]);

  async function updateEstado(id: string, estado: string) {
    setUpdating(id);
    await createClient().from("leads").update({ estado }).eq("id", id);
    setUpdating(null);
    router.refresh();
  }
  async function saveNote(id: string) {
    setSavingNote(id);
    await createClient().from("leads").update({ notas: noteText[id] ?? "" }).eq("id", id);
    setSavingNote(null); setOpenNote(null);
    router.refresh();
  }
  function toggleNote(lead: Lead) {
    if (noteText[lead.id] === undefined) setNoteText((p) => ({ ...p, [lead.id]: lead.notas ?? "" }));
    setOpenNote(openNote === lead.id ? null : lead.id);
  }

  const count = (e: string) => leads.filter((l) => l.estado === e).length;
  const stats = [
    { e: "todos", label: "Total", value: leads.length, color: "text-[#0a1628]" },
    { e: "nuevo", label: "Nuevos", value: count("nuevo"), color: "text-red-600" },
    { e: "contactado", label: "Contactados", value: count("contactado"), color: "text-[#b87608]" },
    { e: "cerrado", label: "Cerrados", value: count("cerrado"), color: "text-[#1a6b3c]" },
  ];

  return (
    <div className="space-y-4">
      {/* Stat pills clickeables */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <button
            key={s.e}
            onClick={() => setFilter(s.e)}
            className={`admin-card px-4 py-3 text-left transition-all ${filter === s.e ? "ring-2 ring-[#1a6b3c]/30 border-[#1a6b3c]/20" : "hover:border-slate-200"}`}
          >
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre, email, teléfono, comuna…"
            className="admin-input !pl-10 !pr-9"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button onClick={() => exportCSV(filtered)} className="admin-btn-ghost shrink-0" title="Exportar a CSV">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-400 font-medium">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          {filter !== "todos" && ` · ${ESTADO_CFG[filter]?.label}`}
          {search && ` · "${search}"`}
        </p>
        {filter !== "todos" && (
          <button onClick={() => setFilter("todos")} className="text-[12px] text-[#1a6b3c] font-bold hover:underline flex items-center gap-1">
            <Filter className="w-3 h-3" /> Quitar filtro
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 admin-card border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-[#0a1628] font-bold text-sm">{leads.length === 0 ? "Aún no hay leads" : "Sin resultados"}</p>
          <p className="text-slate-400 text-xs mt-1">
            {leads.length === 0 ? "Las solicitudes del formulario de contacto aparecerán aquí." : "Prueba ajustando la búsqueda o los filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((lead) => {
            const cfg = ESTADO_CFG[lead.estado] ?? ESTADO_CFG.nuevo;
            const isOpen = expanded === lead.id;
            const noteOpen = openNote === lead.id;
            return (
              <div key={lead.id} className={`admin-card overflow-hidden transition-all hover:shadow-md ring-1 ${cfg.ring}`}>
                {/* Row header */}
                <button onClick={() => setExpanded(isOpen ? null : lead.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50/60 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ecfdf3] to-[#d1fae0] flex items-center justify-center text-[12px] font-black text-[#1a6b3c] shrink-0">
                    {lead.nombre.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-[#0a1628] text-sm truncate">{lead.nombre}</p>
                      {lead.notas && <StickyNote className="w-3 h-3 text-[#b87608] shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {lead.comuna && <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{lead.comuna}</span>}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(lead.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${cfg.chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /><span className="hidden sm:inline">{cfg.label}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 pt-3">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-[#1a6b3c] transition-colors min-w-0">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{lead.email}</span>
                        </a>
                      )}
                      {lead.telefono && (
                        <a href={`tel:${lead.telefono}`} className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-[#1a6b3c] transition-colors">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />{lead.telefono}
                        </a>
                      )}
                      {lead.tipo_operacion && (
                        <div className="flex items-center gap-2 text-[12px] text-slate-600">
                          <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />{lead.tipo_operacion}
                        </div>
                      )}
                      {lead.volumen && (
                        <div className="flex items-center gap-2 text-[12px] text-slate-600">
                          <span className="text-slate-400 text-[11px] font-bold shrink-0">VOL</span>{lead.volumen}
                        </div>
                      )}
                    </div>

                    {lead.mensaje && (
                      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-[12px] text-slate-600 leading-relaxed">{lead.mensaje}</p>
                      </div>
                    )}

                    {noteOpen ? (
                      <div className="bg-[#fff7ec] border border-[#f5a623]/30 rounded-xl p-3 mb-3">
                        <label className="text-[10px] font-black text-[#b87608] uppercase tracking-wide">Nota interna</label>
                        <textarea
                          value={noteText[lead.id] ?? ""}
                          onChange={(e) => setNoteText((p) => ({ ...p, [lead.id]: e.target.value }))}
                          rows={2}
                          placeholder="Anota seguimiento, observaciones…"
                          className="admin-input mt-1.5 !text-[12px] !py-2"
                        />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveNote(lead.id)} disabled={savingNote === lead.id} className="admin-btn-amber !text-[12px] !py-1.5 !px-3">
                            {savingNote === lead.id ? "Guardando…" : "Guardar"}
                          </button>
                          <button onClick={() => setOpenNote(null)} className="admin-btn-ghost !text-[12px] !py-1.5 !px-3">Cancelar</button>
                        </div>
                      </div>
                    ) : lead.notas ? (
                      <div className="flex items-start gap-2 bg-[#fff7ec]/70 border border-[#f5a623]/20 rounded-lg px-3 py-2 mb-3">
                        <StickyNote className="w-3 h-3 text-[#b87608] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#92600a] leading-relaxed flex-1">{lead.notas}</p>
                      </div>
                    ) : null}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {lead.telefono && (
                        <a
                          href={`https://wa.me/${lead.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${lead.nombre}, recibimos tu solicitud en Fenice SPA. ¿Podemos coordinar?`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fb959] text-white text-[12px] font-bold px-3 py-2 rounded-xl transition-colors shadow-sm shadow-[#25D366]/25"
                        >
                          <WaIcon /> WhatsApp
                        </a>
                      )}
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="admin-btn-ghost !text-[12px] !py-2">
                          <Mail className="w-3.5 h-3.5" /> Email
                        </a>
                      )}
                      <button onClick={() => toggleNote(lead)} className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl border transition-all ${lead.notas ? "border-[#f5a623]/30 bg-[#fff7ec] text-[#b87608]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>
                        <StickyNote className="w-3.5 h-3.5" /><span className="hidden sm:inline">{lead.notas ? "Editar nota" : "Nota"}</span>
                      </button>
                      <div className="ml-auto">
                        <select
                          value={lead.estado}
                          disabled={updating === lead.id}
                          onChange={(e) => updateEstado(lead.id, e.target.value)}
                          className="admin-input !w-auto !py-2 !text-[12px] font-bold capitalize"
                        >
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
