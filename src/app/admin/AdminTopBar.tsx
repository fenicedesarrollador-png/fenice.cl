"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, ChevronRight, Home } from "lucide-react";
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
    const label = ROUTE_LABELS[seg] ?? (seg.length === 36 ? "Detalle" : seg);
    crumbs.push({ label, href: path });
  }
  return crumbs;
}

export default function AdminTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const current = crumbs[crumbs.length - 1];

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-3 shrink-0 sticky top-0 z-30">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 min-w-0 flex-1" aria-label="Breadcrumb">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
          <Home className="w-3.5 h-3.5" />
        </Link>
        {crumbs.slice(1).map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1 min-w-0">
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {i === crumbs.length - 2 ? (
              <span className="text-sm font-semibold text-slate-800 truncate">{crumb.label}</span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm text-slate-400 hover:text-slate-700 transition-colors truncate"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Notification bell placeholder */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
          <Bell className="w-4 h-4" />
        </button>

        {/* Site link - visible desktop */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-orange-600 border border-slate-200 hover:border-orange-300 px-3 py-1.5 rounded-lg transition-all bg-white hover:bg-orange-50"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
          fenice.cl
        </a>
      </div>
    </header>
  );
}
