import Link from "next/link";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import { COMUNAS_COBERTURA, PROVINCIAS_RM } from "@/lib/comunas";
import { buildMetadata } from "@/lib/seo";
import { MapPin, ChevronRight } from "lucide-react";

export const metadata = buildMetadata({
  title: "Cobertura de Petróleo a Domicilio | Todas las Comunas de la RM",
  description:
    "Fenice SPA despacha petróleo diesel a domicilio en las 52 comunas de la Región Metropolitana de Santiago, además de Valparaíso y Rancagua. Encuentra tu comuna y cotiza por WhatsApp.",
  path: "/cobertura",
  keywords: [
    "cobertura petróleo a domicilio santiago",
    "comunas despacho de combustible RM",
    "petróleo a domicilio región metropolitana",
    "distribuidor de combustible santiago",
    "petróleo a domicilio todas las comunas",
  ],
});

const rmComunas = COMUNAS_COBERTURA.filter((c) => c.region === "Región Metropolitana");
const otrasComunas = COMUNAS_COBERTURA.filter((c) => c.region !== "Región Metropolitana");
const totalRM = rmComunas.length;

function ComunaCard({ nombre, slug, perfil }: { nombre: string; slug: string; perfil: string }) {
  return (
    <Link
      href={`/cobertura/petroleo-a-domicilio-${slug}`}
      data-analytics-id={`cobertura_${slug}`}
      data-analytics-label={nombre}
      data-analytics-cta="coverage_navigation"
      className="group flex items-start gap-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md rounded-xl p-5 transition-all"
    >
      <div className="w-9 h-9 rounded-lg bg-white group-hover:bg-orange-50 border border-slate-200 group-hover:border-orange-200 flex items-center justify-center shrink-0 transition-all">
        <MapPin className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900 group-hover:text-orange-700 transition-colors leading-tight mb-1">
          Petróleo en {nombre}
        </p>
        <p className="text-slate-500 text-xs leading-relaxed capitalize">Perfil {perfil}.</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 shrink-0 mt-0.5 transition-colors" />
    </Link>
  );
}

export default function CoberturaPage() {
  return (
    <>
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[{ name: "Inicio", href: "/" }, { name: "Cobertura" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Zonas de despacho</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Cobertura de petróleo a domicilio en toda la Región Metropolitana
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Fenice SPA despacha petróleo diesel e instala estanques en las {totalRM} comunas de la
            Región Metropolitana de Santiago, además de zonas de Valparaíso y Rancagua.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { val: `${totalRM}`, label: "Comunas de la RM" },
              { val: "6", label: "Provincias cubiertas" },
              { val: "24h", label: "Despacho urgente" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="text-2xl font-bold text-orange-400">{s.val}</span>
                <span className="text-slate-400 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid comunas agrupado por provincia */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 max-w-3xl mb-12 leading-relaxed">
            Desde nuestra base operativa en La Granja, cubrimos toda la Región Metropolitana con
            despacho de petróleo a domicilio para empresas e industria. Selecciona tu comuna para ver
            información específica de cobertura, tiempos de despacho y cómo cotizar.
          </p>

          <div className="space-y-14">
            {PROVINCIAS_RM.map((provincia) => {
              const comunas = rmComunas.filter((c) => c.provincia === provincia);
              if (comunas.length === 0) return null;
              return (
                <div key={provincia}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-lg font-bold text-slate-900">{provincia}</h2>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                      {comunas.length} comunas
                    </span>
                    <span className="flex-1 h-px bg-slate-100" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {comunas.map((c) => (
                      <ComunaCard key={c.slug} nombre={c.nombre} slug={c.slug} perfil={c.perfil} />
                    ))}
                  </div>
                </div>
              );
            })}

            {otrasComunas.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-lg font-bold text-slate-900">Cobertura extendida (otras regiones)</h2>
                  <span className="flex-1 h-px bg-slate-100" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otrasComunas.map((c) => (
                    <ComunaCard key={c.slug} nombre={c.nombre} slug={c.slug} perfil={c.perfil} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info adicional */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Base operativa",
                desc: "San Ramón, Santiago — centro estratégico para cubrir toda la Región Metropolitana en tiempos óptimos.",
              },
              {
                title: "Cobertura extendida",
                desc: "También llegamos a Valparaíso y Rancagua para clientes con operaciones en múltiples regiones.",
              },
              {
                title: "¿Operación en varias comunas?",
                desc: "Coordinamos despachos programados y rutas fijas para empresas con faenas o sucursales en distintas comunas de la RM.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
