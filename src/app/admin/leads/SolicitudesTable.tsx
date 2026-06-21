"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  Mail, Phone, MapPin, Package, MessageSquare, Building2, Search, Download,
  X, StickyNote, Inbox, Clock, ChevronDown, Filter, DollarSign,
} from "lucide-react";

export type Solicitud = {
  id: string;
  origen: "contacto" | "cotizacion";
  nombre: string;
  empresa: string | null;
  rut_empresa: string | null;
  email: string | null;
  telefono: string | null;
  comuna: string | null;
  servicio: string | null;
  volumen: string | null;
  frecuencia: string | null;
  mensaje: string | null;
  estado: string;
  notas: string | null;
  created_at: string;
};

// Estados posibles según origen
const ESTADOS_CONTACTO = ["nuevo", "contactado", "cerrado"] as const;
const ESTADOS_COTIZACION = ["nuevo", "en_proceso", "cotizado", "cerrado"] as const;

const ESTADO_CFG: Record<string, { label: string; chip: string; dot: string }> = {
  nuevo: { label: "Nuevo", chip: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  contactado: { label: "Contactado", chip: "bg-[#fff7ec] text-[#b87608] border-[#f5a623]/30", dot: "bg-[#f5a623]" },
  en_proceso: { label: "En proceso", chip: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  cotizado: { label: "Cotizado", chip: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  cerrado: { label: "Cerrado", chip: "bg-[#ecfdf3] text-[#1a6b3c] border-[#1a6b3c]/20", dot: "bg-[#1a6b3c]" },
};

const ORIGEN_CFG = {
  cotizacion: {
    label: "Cotización",
    badge: "bg-[#fff7ec] text-[#b87608] border-[#f5a623]/30",
    avatar: "from-[#fff7ec] to-[#fde9c8] text-[#d98a0e]",
    icon: DollarSign,
  },
  contacto: {
    label: "Contacto",
    badge: "bg-[#ecfdf3] text-[#1a6b3c] border-[#1a6b3c]/20",
    avatar: "from-[#ecfdf3] to-[#d1fae0] text-[#1a6b3c]",
    icon: Mail,
  },
} as const;

function tableFor(origen: Solicitud["origen"]) {
  return origen === "cotizacion" ? "cotizaciones" : "leads";
}

function exportCSV(items: Solicitud[]) {
  const headers = ["Origen", "Nombre", "Empresa", "RUT", "Email", "Teléfono", "Comuna", "Servicio", "Volumen", "Frecuencia", "Estado", "Fecha"];
  const rows = items.map((s) => [
    ORIGEN_CFG[s.origen].label, s.nombre, s.empresa ?? "", s.rut_empresa ?? "", s.email ?? "",
    s.telefono ?? "", s.comuna ?? "", s.servicio ?? "", s.volumen ?? "", s.frecuencia ?? "",
    s.estado, new Date(s.created_at).toLocaleDateString("es-CL"),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `solicitudes_fenice_${new Date().toISOString().slice(0, 10)}.csv`; a.click();
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

export default function SolicitudesTable({
  solicitudes,
  origenInicial = "todos",
}: {
  solicitudes: Solicitud[];
  origenInicial?: "todos" | "cotizacion" | "contacto";
}) {
  const router = useRouter();
  const [origenFilter, setOrigenFilter] = useState<"todos" | "cotizacion" | "contacto">(origenInicial);
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<Record<string, string>>({});
  const [savingNote, setSavingNote] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = solicitudes;
    if (origenFilter !== "todos") r = r.filter((s) => s.origen === origenFilter);
    if (estadoFilter !== "todos") r = r.filter((s) => s.estado === estadoFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((s) =>
        s.nombre.toLowerCase().includes(q) || s.empresa?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) || s.telefono?.includes(q) ||
        s.comuna?.toLowerCase().includes(q) || s.servicio?.toLowerCase().includes(q) ||
        s.rut_empresa?.includes(q) || s.mensaje?.toLowerCase().includes(q));
    }
    return r;
  }, [solicitudes, origenFilter, estadoFilter, search]);

  async function updateEstado(s: Solicitud, estado: string) {
    setUpdating(s.id);
    await createClient().from(tableFor(s.origen)).update({ estado }).eq("id", s.id);
    setUpdating(null);
    router.refresh();
  }

  async function saveNote(s: Solicitud) {
    // Las notas solo existen en la tabla leads (contacto)
    if (s.origen !== "contacto") { setOpenNote(null); return; }
    setSavingNote(s.id);
    await createClient().from("leads").update({ notas: noteText[s.id] ?? "" }).eq("id", s.id);
    setSavingNote(null); setOpenNote(null);
    router.refresh();
  }

  function toggleNote(s: Solicitud) {
    if (noteText[s.id] === undefined) setNoteText((p) => ({ ...p, [s.id]: s.notas ?? "" }));
    setOpenNote(openNote === s.id ? null : s.id);
  }

  const count = (predicate: (s: Solicitud) => boolean) => solicitudes.filter(predicate).length;
  const stats = [
    { label: "Total", value: solicitudes.length, color: "text-[#0a1628]", onClick: () => { setOrigenFilter("todos"); setEstadoFilter("todos"); } },
    { label: "Cotizaciones", value: count((s) => s.origen === "cotizacion"), color: "text-[#d98a0e]", onClick: () => setOrigenFilter("cotizacion") },
    { label: "Contactos", value: count((s) => s.origen === "contacto"), color: "text-[#1a6b3c]", onClick: () => setOrigenFilter("contacto") },
    { label: "Nuevos sin atender", value: count((s) => s.estado === "nuevo"), color: "text-red-600", onClick: () => setEstadoFilter("nuevo") },
  ];

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <button key={s.label} onClick={s.onClick} className="admin-card px-4 py-3 text-left hover:border-slate-200 transition-all">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nombre, empresa, email, teléfono…" className="admin-input !pl-10 !pr-9" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>
          <button onClick={() => exportCSV(filtered)} className="admin-btn-ghost shrink-0"><Download className="w-4 h-4" /><span className="hidden sm:inline">Exportar</span></button>
        </div>

        {/* Filtros de origen */}
        <div className="flex flex-wrap gap-2">
          {([
            { key: "todos", label: "Todo el origen" },
            { key: "cotizacion", label: "Cotizaciones" },
            { key: "contacto", label: "Contactos" },
          ] as const).map((o) => (
            <button
              key={o.key}
              onClick={() => setOrigenFilter(o.key)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all border ${origenFilter === o.key ? "bg-[#1a6b3c] text-white border-[#1a6b3c] shadow-sm shadow-[#1a6b3c]/20" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-400 font-medium">
          {filtered.length} solicitud{filtered.length !== 1 ? "es" : ""}
          {origenFilter !== "todos" && ` · ${ORIGEN_CFG[origenFilter].label}`}
          {estadoFilter !== "todos" && ` · ${ESTADO_CFG[estadoFilter]?.label}`}
        </p>
        {(origenFilter !== "todos" || estadoFilter !== "todos" || search) && (
          <button onClick={() => { setOrigenFilter("todos"); setEstadoFilter("todos"); setSearch(""); }} className="text-[12px] text-[#1a6b3c] font-bold hover:underline flex items-center gap-1">
            <Filter className="w-3 h-3" /> Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 admin-card border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-[#0a1628] font-bold text-sm">{solicitudes.length === 0 ? "Aún no hay solicitudes" : "Sin resultados"}</p>
          <p className="text-slate-400 text-xs mt-1">
            {solicitudes.length === 0 ? "Las cotizaciones y mensajes de contacto aparecerán aquí." : "Ajusta la búsqueda o los filtros."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((s) => {
            const cfg = ESTADO_CFG[s.estado] ?? ESTADO_CFG.nuevo;
            const origen = ORIGEN_CFG[s.origen];
            const OrigenIcon = origen.icon;
            const isOpen = expanded === s.id;
            const noteOpen = openNote === s.id;
            const estadosDisponibles = s.origen === "cotizacion" ? ESTADOS_COTIZACION : ESTADOS_CONTACTO;
            return (
              <div key={`${s.origen}-${s.id}`} className="admin-card overflow-hidden transition-all hover:shadow-md">
                {/* Header */}
                <button onClick={() => setExpanded(isOpen ? null : s.id)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50/60 transition-colors">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${origen.avatar} flex items-center justify-center text-[12px] font-black shrink-0`}>
                    {(s.empresa ?? s.nombre).slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-[#0a1628] text-sm truncate">{s.empresa ?? s.nombre}</p>
                      {/* Etiqueta de ORIGEN (lo que pediste) */}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${origen.badge}`}>
                        <OrigenIcon className="w-2.5 h-2.5" />
                        {origen.label}
                      </span>
                      {s.notas && <StickyNote className="w-3 h-3 text-[#f5a623] shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {s.empresa && <span className="text-[11px] text-slate-500 truncate">{s.nombre}</span>}
                      {s.comuna && <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{s.comuna}</span>}
                      <span className="text-[11px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(s.created_at).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${cfg.chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /><span className="hidden sm:inline">{cfg.label}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-300 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Detalle */}
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-50">
                    {s.servicio && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded-lg my-3">
                        <Package className="w-3 h-3" />{s.servicio}
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      {s.email && <a href={`mailto:${s.email}`} className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-[#1a6b3c] min-w-0"><Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="truncate">{s.email}</span></a>}
                      {s.telefono && <a href={`tel:${s.telefono}`} className="flex items-center gap-2 text-[12px] text-slate-600 hover:text-[#1a6b3c]"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />{s.telefono}</a>}
                      {s.rut_empresa && <div className="flex items-center gap-2 text-[12px] text-slate-600"><Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />{s.rut_empresa}</div>}
                      {s.volumen && <div className="flex items-center gap-2 text-[12px] text-slate-600"><DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />Volumen: {s.volumen}</div>}
                      {s.frecuencia && <div className="flex items-center gap-2 text-[12px] text-slate-600"><Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />Frecuencia: {s.frecuencia}</div>}
                    </div>
                    {s.mensaje && (
                      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-3 mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /><p className="text-[12px] text-slate-600 leading-relaxed">{s.mensaje}</p>
                      </div>
                    )}

                    {/* Nota interna (solo contactos) */}
                    {s.origen === "contacto" && (noteOpen ? (
                      <div className="bg-[#fff7ec] border border-[#f5a623]/30 rounded-xl p-3 mb-3">
                        <label className="text-[10px] font-black text-[#b87608] uppercase tracking-wide">Nota interna</label>
                        <textarea value={noteText[s.id] ?? ""} onChange={(e) => setNoteText((p) => ({ ...p, [s.id]: e.target.value }))} rows={2} placeholder="Anota seguimiento…" className="admin-input mt-1.5 !text-[12px] !py-2" />
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => saveNote(s)} disabled={savingNote === s.id} className="admin-btn-amber !text-[12px] !py-1.5 !px-3">{savingNote === s.id ? "Guardando…" : "Guardar"}</button>
                          <button onClick={() => setOpenNote(null)} className="admin-btn-ghost !text-[12px] !py-1.5 !px-3">Cancelar</button>
                        </div>
                      </div>
                    ) : s.notas ? (
                      <div className="flex items-start gap-2 bg-[#fff7ec]/70 border border-[#f5a623]/20 rounded-lg px-3 py-2 mb-3">
                        <StickyNote className="w-3 h-3 text-[#f5a623] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-[#92600a] leading-relaxed flex-1">{s.notas}</p>
                      </div>
                    ) : null)}

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-2">
                      {s.telefono && (
                        <a href={`https://wa.me/${s.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${s.nombre}, recibimos tu ${origen.label.toLowerCase()} en Fenice SPA. ¿Podemos coordinar?`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fb959] text-white text-[12px] font-bold px-3 py-2 rounded-xl transition-colors shadow-sm shadow-[#25D366]/25"><WaIcon /> WhatsApp</a>
                      )}
                      {s.email && <a href={`mailto:${s.email}`} className="admin-btn-ghost !text-[12px] !py-2"><Mail className="w-3.5 h-3.5" /> Email</a>}
                      {s.origen === "contacto" && (
                        <button onClick={() => toggleNote(s)} className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-2 rounded-xl border transition-all ${s.notas ? "border-[#f5a623]/30 bg-[#fff7ec] text-[#b87608]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>
                          <StickyNote className="w-3.5 h-3.5" /><span className="hidden sm:inline">{s.notas ? "Editar nota" : "Nota"}</span>
                        </button>
                      )}
                      <div className="ml-auto">
                        <select value={s.estado} disabled={updating === s.id} onChange={(e) => updateEstado(s, e.target.value)} className="admin-input !w-auto !py-2 !text-[12px] font-bold">
                          {estadosDisponibles.map((e) => <option key={e} value={e}>{ESTADO_CFG[e].label}</option>)}
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
