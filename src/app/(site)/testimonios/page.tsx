import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Testimonios y Clientes",
  description:
    "Empresas que confían en Fenice SPA para el despacho de petróleo a domicilio y la instalación de estanques certificados en la Región Metropolitana de Santiago.",
  alternates: { canonical: "https://fenice.cl/testimonios" },
};

const staticClients = [
  { nombre: "Empresa Constructora Regional", testimonio: "Llevamos más de dos años trabajando con Fenice SPA para el abastecimiento de combustible en nuestras obras. Puntualidad y trato profesional en cada entrega.", sector: "Construcción" },
  { nombre: "Planta Industrial Santiago", testimonio: "Fenice nos resolvió un problema de abastecimiento de urgencia en tiempo récord. Desde entonces son nuestro proveedor preferido para combustible industrial.", sector: "Manufactura" },
  { nombre: "Agrícola del Sur RM", testimonio: "En temporada de cosecha el combustible es crítico. Con Fenice coordinamos el despacho con anticipación y nunca hemos tenido problemas de stock.", sector: "Agroindustria" },
];

export default async function TestimoniosPage() {
  let dbClients: { nombre: string; testimonio?: string; logo_url?: string }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("clientes")
      .select("nombre, testimonio, logo_url")
      .eq("activo", true)
      .not("testimonio", "is", null)
      .order("orden");
    if (data && data.length > 0) dbClients = data;
  } catch {}

  return (
    <>
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
            Empresas que confían en Fenice SPA
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Trabajamos con empresas de construcción, industria, agroindustria y generación eléctrica
            en toda la Región Metropolitana.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(dbClients.length > 0 ? dbClients : staticClients).map((c, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col"
              >
                {"sector" in c && (
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-3">
                    {(c as typeof staticClients[0]).sector}
                  </span>
                )}
                <blockquote className="text-gray-600 leading-relaxed italic flex-1 mb-4">
                  &ldquo;{c.testimonio}&rdquo;
                </blockquote>
                <p className="font-semibold text-gray-900 text-sm">{c.nombre}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-orange-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¿Eres cliente de Fenice SPA?
            </h2>
            <p className="text-gray-600 mb-6">
              Si ya trabajas con nosotros y quieres compartir tu experiencia en Google, nos ayudas
              a que más empresas de la Región Metropolitana puedan encontrarnos.
            </p>
            <a
              href="https://www.google.com/search?q=Fenice+SPA+La+Granja+Santiago"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Dejar reseña en Google
            </a>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
