import Link from "next/link";
import {
  Building2, ArrowRight, Quote, ExternalLink, BadgeCheck,
  Factory, Hammer, Tractor, Zap, Truck, HardHat,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Certificaciones from "@/components/Certificaciones";
import CTASection from "@/components/CTASection";
import { getClientes } from "@/lib/getContent";
import { SITE_CONFIG } from "@/lib/config";
import { buildMetadata, jsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "Clientes y Proyectos de Abastecimiento",
  description:
    "Conoce los sectores, servicios y proyectos que Fenice atiende con diésel, kerosene, abastecimiento programado e instalación de estanques en la RM.",
  path: "/clientes",
  keywords: [
    "clientes fenice spa",
    "proveedor de combustible para empresas santiago",
    "abastecimiento de diesel para faenas",
    "petróleo diesel para flotas región metropolitana",
    "instalación de estanques para empresas",
    "distribuidor de combustible confiable RM",
  ],
});

const SECTORES = [
  { icon: Hammer, label: "Construcción e inmobiliaria" },
  { icon: Factory, label: "Manufactura e industria" },
  { icon: HardHat, label: "Minería y faenas" },
  { icon: Zap, label: "Generación eléctrica" },
  { icon: Truck, label: "Flotas y maquinaria" },
  { icon: Tractor, label: "Agroindustria" },
];

export default async function ClientesPage() {
  const clientes = await getClientes();
  const destacados = clientes.filter((c) => c.descripcion || c.testimonio);
  const soloLogo = clientes.filter((c) => !c.descripcion && !c.testimonio && c.logo_url);

  const itemListSchema = clientes.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Empresas cliente de Fenice SPA",
        itemListElement: clientes.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Organization",
            name: c.nombre,
            ...(c.sitio_web ? { url: c.sitio_web } : {}),
            ...(c.logo_url ? { logo: c.logo_url } : {}),
          },
        })),
      }
    : null;

  return (
    <>
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(itemListSchema)} />
      )}

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0a1628] text-white" data-analytics-section="clientes_hero">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-6">
          <Breadcrumb crumbs={[{ name: "Inicio", href: "/" }, { name: "Clientes" }]} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16 pt-8 sm:pb-20">
          <div className="max-w-3xl">
            <div className="hero-rise inline-flex items-center gap-2 bg-[#f5a623]/10 border border-[#f5a623]/25 text-[#f5a623] text-[11px] sm:text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              Autoridad y experiencia comprobable
            </div>
            <h1 className="hero-rise-1 text-3xl sm:text-5xl font-extrabold leading-[1.12] tracking-tight mb-5">
              Empresas que confían su operación a{" "}
              <span className="text-[#f5a623]">Fenice SPA</span>
            </h1>
            <p className="hero-rise-2 text-slate-300 leading-relaxed text-sm sm:text-base max-w-2xl">
              Abastecemos con petróleo diesel a empresas, faenas y flotas de la Región
              Metropolitana, e instalamos estanques con respaldo técnico y carga periódica
              según la necesidad de cada operación. Estos son algunos de los trabajos
              y relaciones comerciales que respaldan nuestra experiencia.
            </p>
            <div className="hero-rise-3 flex flex-wrap gap-2 mt-7">
              {SECTORES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-xs bg-white/8 text-slate-200 border border-white/15 px-3 py-1.5 rounded-full font-medium"
                >
                  <Icon className="w-3.5 h-3.5 text-[#f5a623]" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EMPRESAS Y TRABAJOS REALIZADOS ───────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white" data-analytics-section="clientes_trabajos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {clientes.length === 0 ? (
            /* Estado sin datos: nunca inventamos clientes — se cargan desde /admin/clientes */
            <div className="max-w-2xl mx-auto text-center py-10" data-reveal>
              <div className="w-16 h-16 rounded-2xl bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-8 h-8 text-[#1a6b3c]" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0a1628] mb-4">
                Portafolio de clientes en actualización
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Estamos documentando los proyectos y relaciones comerciales de Fenice SPA
                con empresas de construcción, industria, minería, generación eléctrica y
                agroindustria en la Región Metropolitana. Si quieres conocer referencias
                de nuestro trabajo, contáctanos directamente.
              </p>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-[#f5a623]/25 text-sm"
              >
                Solicitar referencias <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-12" data-reveal>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-[#f5a623]" />
                  <p className="text-xs font-bold text-[#1a6b3c] uppercase tracking-widest">
                    Trabajos realizados
                  </p>
                </div>
                <h2 className="text-3xl font-extrabold text-[#0a1628]">
                  Proyectos y relaciones comerciales
                </h2>
              </div>

              {destacados.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mb-14">
                  {destacados.map((c, i) => (
                    <article
                      key={c.id}
                      data-reveal
                      data-reveal-delay={String((i % 2) * 100)}
                      className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:border-[#1a6b3c]/30 hover:-translate-y-1 transition-all p-7 flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-4 mb-5">
                        <div className="flex items-center gap-4 min-w-0">
                          {c.logo_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element -- logo por URL desde el admin */
                            <img
                              src={c.logo_url}
                              alt={`Logo de ${c.nombre}`}
                              loading="lazy"
                              className="h-14 w-14 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1.5 shrink-0"
                            />
                          ) : (
                            <div className="h-14 w-14 rounded-xl bg-[#1a6b3c]/10 border border-[#1a6b3c]/20 flex items-center justify-center shrink-0">
                              <Building2 className="w-6 h-6 text-[#1a6b3c]" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-extrabold text-[#0a1628] leading-tight truncate">{c.nombre}</h3>
                            {c.sector && (
                              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-[#1a6b3c] bg-[#1a6b3c]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                {c.sector}
                              </span>
                            )}
                          </div>
                        </div>
                        {c.sitio_web && (
                          <a
                            href={c.sitio_web}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            aria-label={`Sitio web de ${c.nombre}`}
                            className="text-slate-300 hover:text-[#f5a623] transition-colors shrink-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {c.descripcion && (
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">{c.descripcion}</p>
                      )}
                      {c.testimonio && (
                        <blockquote className="relative mt-auto bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <Quote className="absolute -top-2.5 left-4 w-5 h-5 text-[#f5a623] fill-[#f5a623]" />
                          <p className="text-sm text-slate-500 italic leading-relaxed pt-1.5">
                            “{c.testimonio}”
                          </p>
                        </blockquote>
                      )}
                      <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-400">
                        <BadgeCheck className="w-4 h-4 text-[#1a6b3c]" />
                        Cliente de Fenice SPA
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {soloLogo.length > 0 && (
                <div data-reveal>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">
                    También confían en nosotros
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
                    {soloLogo.map((c) => (
                      /* eslint-disable-next-line @next/next/no-img-element -- logo por URL desde el admin */
                      <img
                        key={c.id}
                        src={c.logo_url!}
                        alt={`Logo de ${c.nombre}, cliente de Fenice SPA`}
                        loading="lazy"
                        title={c.nombre}
                        className="h-12 w-auto max-w-[150px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── SECTORES QUE ATENDEMOS ────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50 border-y border-slate-100" data-analytics-section="clientes_sectores">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" data-reveal>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-12 bg-[#f5a623]" />
              <p className="text-xs font-bold text-[#f5a623] uppercase tracking-widest">Sectores que atendemos</p>
              <span className="h-px w-12 bg-[#f5a623]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#0a1628]">
              Combustible para cada tipo de operación
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SECTORES.map(({ icon: Icon, label }, i) => (
              <div
                key={label}
                data-reveal
                data-reveal-delay={String(i * 60)}
                className="flex flex-col items-center gap-3 bg-white border border-slate-200 hover:border-[#1a6b3c]/30 rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-[#1a6b3c]/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#1a6b3c]" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-bold text-[#0a1628] leading-tight">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-8 max-w-2xl mx-auto" data-reveal>
            ¿Tu rubro no está en la lista? Atendemos cualquier operación que requiera
            petróleo diesel, instalación de estanques o abastecimiento periódico en{" "}
            {SITE_CONFIG.region}, Valparaíso y Rancagua.
          </p>
        </div>
      </section>

      {/* ── CERTIFICACIONES ───────────────────────────────────────────────── */}
      <Certificaciones variant="dark" />

      <CTASection />
    </>
  );
}
