import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUpRight, Fuel } from "lucide-react";
import ConsentPreferencesButton from "@/components/analytics/ConsentPreferencesButton";
import { COMUNAS, SERVICIOS } from "@/lib/config";
import type { SiteConfig } from "@/lib/getSiteConfig";

export default function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="bg-[#0a1628] text-slate-400" data-analytics-section="footer">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand — spans 2 cols on large */}
          <div className="lg:col-span-2">
            <Link href="/" data-analytics-id="footer_logo" data-analytics-label="Fenice" data-analytics-cta="footer_navigation" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a6b3c] to-[#0d4a28] flex items-center justify-center shadow-md shrink-0">
                <svg viewBox="0 0 24 30" className="w-5 h-6" fill="none">
                  <path d="M12 2C12 2 5 10 5 16a7 7 0 0014 0C19 10 12 2 12 2z" fill="#f5a623"/>
                  <path d="M12 11c0 0-3 3.5-3 5.5a3 3 0 006 0C15 14.5 12 11 12 11z" fill="white" opacity="0.85"/>
                </svg>
              </div>
              <div className="leading-none">
                <p className="text-lg font-extrabold text-white">Fenice</p>
                <p className="text-[10px] font-bold text-[#f5a623] tracking-[0.2em] uppercase">SPA</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Distribución de petróleo diesel e instalación de estanques certificados para empresas
              e industria en la Región Metropolitana.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#f5a623] mt-0.5 shrink-0" />
                <span>{config.direccion}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#f5a623] shrink-0" />
                <span>{config.horario}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#f5a623] shrink-0" />
                <a href={`tel:${config.telefono}`} data-analytics-id="footer_phone" data-analytics-label={config.telefono} data-analytics-cta="phone" className="hover:text-[#f5a623] transition-colors">
                  {config.telefono}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#f5a623] shrink-0" />
                <a href={`mailto:${config.email}`} data-analytics-id="footer_email" data-analytics-label={config.email} data-analytics-cta="email" className="hover:text-[#f5a623] transition-colors text-xs break-all">
                  {config.email}
                </a>
              </li>
            </ul>

            {/* Instagram */}
            <a
              href={config.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-id="footer_instagram"
              data-analytics-label="@fenice.combustible"
              data-analytics-cta="social"
              className="inline-flex items-center gap-2 mt-6 text-sm border border-white/10 hover:border-[#f5a623]/40 text-slate-400 hover:text-[#f5a623] px-4 py-2 rounded-xl transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              @fenice.combustible
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          {/* Servicios */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Servicios</h3>
            <ul className="space-y-2.5">
              {SERVICIOS.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`} data-analytics-id={`footer_service_${s.slug}`} data-analytics-label={s.nombre} data-analytics-cta="footer_navigation" className="flex items-center gap-1.5 text-sm hover:text-[#f5a623] transition-colors group">
                    <span className="w-1 h-1 rounded-full bg-[#f5a623]/40 group-hover:bg-[#f5a623] transition-colors" />
                    {s.nombre}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/venta-petroleo-diesel" data-analytics-id="footer_venta_diesel" data-analytics-label="Venta de Petróleo Diésel" data-analytics-cta="footer_navigation" className="flex items-center gap-1.5 text-sm hover:text-[#f5a623] transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-[#f5a623]/40 group-hover:bg-[#f5a623] transition-colors" />
                  Venta de Petróleo Diésel
                </Link>
              </li>
              <li>
                <Link href="/petroleo-a-domicilio" data-analytics-id="footer_petroleo_domicilio" data-analytics-label="Petróleo a Domicilio" data-analytics-cta="footer_navigation" className="flex items-center gap-1.5 text-sm hover:text-[#f5a623] transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-[#f5a623]/40 group-hover:bg-[#f5a623] transition-colors" />
                  Petróleo a Domicilio
                </Link>
              </li>
              <li>
                <Link href="/empresas-faenas-flotas" data-analytics-id="footer_empresas" data-analytics-label="Empresas / Faenas / Flotas" data-analytics-cta="footer_navigation" className="flex items-center gap-1.5 text-sm hover:text-[#f5a623] transition-colors group">
                  <span className="w-1 h-1 rounded-full bg-[#f5a623]/40 group-hover:bg-[#f5a623] transition-colors" />
                  Empresas / Faenas / Flotas
                </Link>
              </li>
            </ul>
          </div>

          {/* Cobertura */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Cobertura RM</h3>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2">
              {COMUNAS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                    data-analytics-id={`footer_cobertura_${c.slug}`}
                    data-analytics-label={c.nombre}
                    data-analytics-cta="footer_navigation"
                    className="text-xs hover:text-[#f5a623] transition-colors leading-tight block"
                  >
                    {c.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-5">Empresa</h3>
            <ul className="space-y-2.5 text-sm mb-6">
              {[
                { href: "/", label: "Inicio" },
                { href: "/nosotros", label: "Quiénes somos" },
                { href: "/empresas-faenas-flotas", label: "Empresas / Faenas / Flotas" },
                { href: "/cobertura", label: "Cobertura" },
                { href: "/blog", label: "Blog técnico" },
                { href: "/preguntas-frecuentes", label: "Preguntas frecuentes" },
                { href: "/contacto", label: "Contacto" },
                { href: "/cotizacion", label: "Solicitar cotización" },
                { href: "/politica-de-privacidad", label: "Privacidad" },
                { href: "/aviso-legal", label: "Aviso legal" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} data-analytics-id={`footer_${item.label.toLowerCase().replaceAll(" ", "_").replaceAll("/", "_")}`} data-analytics-label={item.label} data-analytics-cta="footer_navigation" className="flex items-center gap-1.5 hover:text-[#f5a623] transition-colors group text-sm">
                    <span className="w-1 h-1 rounded-full bg-[#f5a623]/40 group-hover:bg-[#f5a623] transition-colors shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/cotizacion"
              data-analytics-id="footer_cta_cotizacion"
              data-analytics-label="Solicitar cotización"
              data-analytics-cta="quote"
              className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#f5a623]/20"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Fenice SPA · La Granja, Santiago, Chile · Todos los derechos reservados</p>
          <div className="flex items-center gap-4">
            <Link href="/politica-de-privacidad" data-analytics-id="footer_privacidad" data-analytics-label="Privacidad" data-analytics-cta="footer_navigation" className="hover:text-slate-400 transition-colors">Privacidad</Link>
            <Link href="/aviso-legal" data-analytics-id="footer_legal" data-analytics-label="Legal" data-analytics-cta="footer_navigation" className="hover:text-slate-400 transition-colors">Legal</Link>
            <ConsentPreferencesButton className="hover:text-slate-400 transition-colors">
              Cookies
            </ConsentPreferencesButton>
            <span className="text-slate-700">fenicespa.cl</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
