"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Inbox, Package, Building2, FileText, CalendarDays,
  Tag, Settings, Fuel, Users, ChartColumn, Plus, Search, CornerDownLeft, Globe,
} from "lucide-react";

type Cmd = {
  label: string;
  hint?: string;
  icon: React.ElementType;
  action: (router: ReturnType<typeof useRouter>) => void;
  keywords?: string;
};

const COMMANDS: Cmd[] = [
  { label: "Dashboard", icon: LayoutDashboard, action: (r) => r.push("/admin"), keywords: "inicio resumen" },
  { label: "Solicitudes", hint: "Leads y cotizaciones", icon: Inbox, action: (r) => r.push("/admin/leads"), keywords: "leads cotizaciones contactos" },
  { label: "Precios de combustible", icon: Fuel, action: (r) => r.push("/admin/precios-combustible"), keywords: "diesel kerosene gas" },
  { label: "Productos", icon: Package, action: (r) => r.push("/admin/productos") },
  { label: "Clientes", icon: Building2, action: (r) => r.push("/admin/clientes"), keywords: "logos empresas" },
  { label: "Blog", icon: FileText, action: (r) => r.push("/admin/blog"), keywords: "posts articulos" },
  { label: "Eventos", icon: CalendarDays, action: (r) => r.push("/admin/eventos") },
  { label: "Promociones", icon: Tag, action: (r) => r.push("/admin/promociones") },
  { label: "Métricas", icon: ChartColumn, action: (r) => r.push("/admin/metricas"), keywords: "analytics estadisticas" },
  { label: "Usuarios", icon: Users, action: (r) => r.push("/admin/usuarios") },
  { label: "Configuración", icon: Settings, action: (r) => r.push("/admin/configuracion") },
  { label: "Nuevo producto", hint: "Crear", icon: Plus, action: (r) => r.push("/admin/productos/nuevo") },
  { label: "Nuevo post de blog", hint: "Crear", icon: Plus, action: (r) => r.push("/admin/blog/nuevo") },
  { label: "Nuevo cliente", hint: "Crear", icon: Plus, action: (r) => r.push("/admin/clientes/nuevo") },
  { label: "Nuevo evento", hint: "Crear", icon: Plus, action: (r) => r.push("/admin/eventos/nuevo") },
  { label: "Nueva promoción", hint: "Crear", icon: Plus, action: (r) => r.push("/admin/promociones/nuevo") },
  { label: "Ver sitio web", hint: "fenice.cl", icon: Globe, action: () => window.open("/", "_blank") },
];

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Atajo global ⌘K / Ctrl+K para abrir
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!open) document.dispatchEvent(new CustomEvent("fenice-admin-open-palette"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Al abrir: enfocar el input (sincronización con el DOM, uso válido de effect).
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMANDS;
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q) || c.keywords?.includes(q),
    );
  }, [query]);

  function reset() {
    setQuery("");
    setActive(0);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function run(cmd: Cmd) {
    reset();
    onClose();
    cmd.action(router);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); run(results[active]); }
    else if (e.key === "Escape") { handleClose(); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-xl admin-card !rounded-2xl overflow-hidden shadow-2xl admin-rise">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <Search className="w-4.5 h-4.5 text-[#5f739a] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={onKeyDown}
            placeholder="Buscar páginas o acciones…"
            className="flex-1 bg-transparent text-[15px] text-[#e8eef7] placeholder:text-[#5f739a] outline-none"
          />
          <kbd className="text-[10px] font-bold text-[#5f739a] bg-white/5 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Resultados */}
        <div className="max-h-[55vh] overflow-y-auto admin-nav-scroll py-2">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#5f739a]">Sin resultados para “{query}”.</p>
          ) : (
            results.map((cmd, i) => (
              <button
                key={cmd.label}
                onClick={() => run(cmd)}
                onMouseEnter={() => setActive(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-[#2bbe6a]/12" : "hover:bg-white/[0.04]"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  i === active ? "bg-[#2bbe6a]/20 text-[#2bbe6a]" : "bg-white/5 text-[#94a7c2]"
                }`}>
                  <cmd.icon className="w-4 h-4" />
                </div>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13.5px] font-semibold text-[#e8eef7] truncate">{cmd.label}</span>
                  {cmd.hint && <span className="block text-[11px] text-[#5f739a]">{cmd.hint}</span>}
                </span>
                {i === active && <CornerDownLeft className="w-3.5 h-3.5 text-[#2bbe6a] shrink-0" />}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
