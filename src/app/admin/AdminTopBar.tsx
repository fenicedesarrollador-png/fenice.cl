"use client";

import { usePathname } from "next/navigation";
import { Menu, ChevronRight, Home } from "lucide-react";
import Link from "next/link";

const ROUTE_LABELS: Record<string, string> = {
  admin: "Dashboard",
  leads: "Leads",
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

  return (
    <header className="h-14 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center px-4 gap-3 shrink-0 sticky top-0 z-30">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 rounded-lg text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 transition-all"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      <nav className="flex items-center gap-1.5 min-w-0 flex-1" aria-label="Breadcrumb">
        <Link href="/admin" className="text-slate-400 hover:text-[#1a6b3c] transition-colors shrink-0">
          <Home className="w-4 h-4" />
        </Link>
        {crumbs.slice(1).map((crumb, i) => {
          const isLast = i === crumbs.length - 2;
          return (
            <span key={crumb.href} className="flex items-center gap-1.5 min-w-0">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              {isLast ? (
                <span className="text-[13px] font-bold text-[#0a1628] truncate">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-[13px] text-slate-400 hover:text-[#1a6b3c] transition-colors truncate">
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 hover:text-[#1a6b3c] border border-slate-200 hover:border-[#1a6b3c]/30 px-3 py-1.5 rounded-lg transition-all bg-white hover:bg-[#ecfdf3] shrink-0"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#1a6b3c]" />
        fenice.cl
      </a>
    </header>
  );
}
