import Link from "next/link";
import { Fuel, MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { COMUNAS, SERVICIOS } from "@/lib/config";
import type { SiteConfig } from "@/lib/getSiteConfig";

export default function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="bg-slate-950 text-slate-400">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                <Fuel className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div className="leading-none">
                <p className="text-base font-bold text-white">Fenice</p>
                <p className="text-[10px] font-semibold text-orange-400 tracking-widest uppercase">SPA</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Distribución de petróleo diesel e instalación de estanques certificados para empresas
              e industria en la Región Metropolitana.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <span>{config.direccion}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{config.horario}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href={`tel:${config.telefono}`} className="hover:text-orange-400 transition-colors">
                  {config.telefono}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href={`mailto:${config.email}`} className="hover:text-orange-400 transition-colors text-xs break-all">
                  {config.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">Servicios</h3>
            <ul className="space-y-2.5">
              {SERVICIOS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/servicios/${s.slug}`}
                    className="flex items-center gap-1.5 text-sm hover:text-orange-400 transition-colors group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-orange-400 transition-colors" />
                    {s.nombre}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/productos" className="flex items-center gap-1.5 text-sm hover:text-orange-400 transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-orange-400 transition-colors" />
                  Productos
                </Link>
              </li>
            </ul>
          </div>

          {/* Cobertura */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">Cobertura RM</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {COMUNAS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                    className="text-xs hover:text-orange-400 transition-colors"
                  >
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">Empresa</h3>
            <ul className="space-y-2.5 text-sm mb-8">
              {[
                { href: "/nosotros", label: "Quiénes somos" },
                { href: "/testimonios", label: "Clientes" },
                { href: "/blog", label: "Blog técnico" },
                { href: "/preguntas-frecuentes", label: "FAQ" },
                { href: "/contacto", label: "Contacto" },
                { href: "/politica-de-privacidad", label: "Privacidad" },
                { href: "/aviso-legal", label: "Aviso legal" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-1.5 hover:text-orange-400 transition-colors group">
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-orange-400 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <a
              href={config.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm border border-slate-700 hover:border-orange-400 text-slate-400 hover:text-orange-400 px-4 py-2 rounded-lg transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              @fenice.combustible
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Fenice SPA · La Granja, Santiago, Chile · Todos los derechos reservados</p>
          <div className="flex items-center gap-4">
            <Link href="/politica-de-privacidad" className="hover:text-slate-400 transition-colors">Privacidad</Link>
            <Link href="/aviso-legal" className="hover:text-slate-400 transition-colors">Legal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
