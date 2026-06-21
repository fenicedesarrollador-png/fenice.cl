"use client";

import { usePathname } from "next/navigation";
import { Menu, ChevronRight, Home, Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import CommandPalette from "./CommandPalette";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Dashboard",
  leads: "Solicitudes",
  cotizaciones: "Cotizaciones",
  productos: "Productos",
  clientes: "Clientes",
  blog: "Blog",
  eventos: "Eventos",
  promociones: "Promociones",
  metricas: "Métricas",
  "precios-combustible": "Precios combustible",
  configuracion: "Configuración",
  usuarios: "Usuarios",
  nuevo: "Nuevo",
  editar: "Editar",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let path = "";
  for (const seg of segments) {
    path += `/${seg}`;
    const label = ROUTE_LABELS[seg] ?? (seg.length >= 20 ? "Detalle" : seg);
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export default function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // El atajo ⌘K dispara un evento global desde CommandPalette; aquí lo abrimos.
  useEffect(() => {
    const handler = () => setPaletteOpen(true);
    document.addEventListener("fenice-admin-open-palette", handler);
    return () => document.removeEventListener("fenice-admin-open-palette", handler);
  }, []);

  return (
    <>
      <header className="h-14 bg-[#070d18]/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center px-4 gap-3 shrink-0 sticky top-0 z-30">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-lg text-[#94a7c2] hover:text-white hover:bg-white/5 transition-all"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav className="flex items-center gap-1.5 min-w-0 flex-1" aria-label="Breadcrumb">
          <Link href="/admin" className="text-[#5f739a] hover:text-[#2bbe6a] transition-colors shrink-0">
            <Home className="w-4 h-4" />
          </Link>
          {crumbs.slice(1).map((crumb, i) => {
            const isLast = i === crumbs.length - 2;
            return (
              <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
                <ChevronRight className="w-3.5 h-3.5 text-[#33415c] shrink-0" />
                {isLast ? (
                  <span className="text-[13px] font-bold text-[#e8eef7] truncate">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-[13px] text-[#94a7c2] hover:text-[#2bbe6a] transition-colors truncate">
                    {crumb.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        {/* Buscador / Command palette trigger */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="hidden sm:inline-flex items-center gap-2 text-[12px] font-medium text-[#94a7c2] hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all bg-white/[0.03] hover:bg-white/[0.06] shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Buscar…</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-bold text-[#5f739a] bg-white/5 border border-white/10 rounded px-1.5 py-0.5 ml-1">⌘K</kbd>
        </button>

        <button
          onClick={() => setPaletteOpen(true)}
          className="sm:hidden p-2 rounded-lg text-[#94a7c2] hover:text-white hover:bg-white/5 transition-all"
          aria-label="Buscar"
        >
          <Search className="w-4 h-4" />
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-bold text-[#94a7c2] hover:text-[#2bbe6a] border border-white/10 hover:border-[#2bbe6a]/30 px-3 py-1.5 rounded-lg transition-all bg-white/[0.03] hover:bg-[#2bbe6a]/10 shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2bbe6a] admin-glow-dot" />
          fenice.cl
        </a>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
