import type { Metadata } from "next";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import { COMUNAS } from "@/lib/config";
import { MapPin, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cobertura de Despacho de Petróleo | Comunas RM",
  description:
    "Fenice SPA despacha petróleo a domicilio en las principales comunas de la Región Metropolitana de Santiago y en Valparaíso y Rancagua. Consulta si llegamos a tu zona.",
  alternates: { canonical: "https://fenice.cl/cobertura/" },
};

const comunaDescriptions: Record<string, string> = {
  "maipu": "Zona industrial y residencial de alto consumo en el poniente de Santiago.",
  "pudahuel": "Sector logístico e industrial, cercano al Aeropuerto de Santiago.",
  "quilicura": "Parques industriales y bodegas en el norte de Santiago.",
  "puente-alto": "La comuna más poblada de Chile, con fuerte presencia industrial.",
  "san-bernardo": "Sector industrial y de construcción al sur de Santiago.",
  "colina": "Zona periurbana con faenas agrícolas, mineras y generadores.",
  "lampa": "Sector rural-industrial con alta demanda de combustible para maquinaria.",
  "buin": "Zona agrícola y vitivinícola al sur de la RM.",
  "las-condes": "Sector corporativo con edificios y generadores de respaldo.",
  "providencia": "Zona comercial y corporativa del sector oriente de Santiago.",
  "valparaiso": "Principal puerto de Chile, con industria naviera y manufacturera.",
  "rancagua": "Capital de la Región de O'Higgins, con fuerte actividad minera.",
};

export default function CoberturaPage() {
  return (
    <>
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
            Cobertura de petróleo a domicilio
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Fenice SPA despacha petróleo e instala estanques en las principales comunas de Santiago
            y en zonas de Valparaíso y Rancagua.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { val: "12+", label: "Comunas cubiertas" },
              { val: "3", label: "Regiones" },
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

      {/* Grid comunas */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 max-w-2xl mb-10 leading-relaxed">
            Desde nuestra base operativa en La Granja, cubrimos la Región Metropolitana con despacho
            de petróleo a domicilio para empresas e industria. Selecciona tu comuna para ver
            información específica de cobertura, tiempos de despacho y cómo cotizar.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMUNAS.map((c) => (
              <Link
                key={c.slug}
                href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                className="group flex items-start gap-4 bg-slate-50 hover:bg-white border border-slate-100 hover:border-orange-200 hover:shadow-md rounded-xl p-5 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-white group-hover:bg-orange-50 border border-slate-200 group-hover:border-orange-200 flex items-center justify-center shrink-0 transition-all">
                  <MapPin className="w-4 h-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900 group-hover:text-orange-700 transition-colors leading-tight mb-1">
                    Petróleo en {c.nombre}
                  </p>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                    {comunaDescriptions[c.slug] ?? "Cobertura de despacho de petróleo a domicilio."}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
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
                desc: "La Granja, Santiago — centro estratégico para cubrir toda la Región Metropolitana en tiempos óptimos.",
              },
              {
                title: "Cobertura extendida",
                desc: "También llegamos a Valparaíso y Rancagua para clientes con operaciones en múltiples regiones.",
              },
              {
                title: "¿No ves tu comuna?",
                desc: "Contáctanos y evaluamos la cobertura. Ampliamos nuestras rutas según la demanda de clientes industriales.",
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
