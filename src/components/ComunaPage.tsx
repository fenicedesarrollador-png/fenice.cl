import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { SERVICIOS, SITE_CONFIG } from "@/lib/config";
import { buildMetadata, comunaKeywords } from "@/lib/seo";

interface ComunaConfig {
  nombre: string;
  slug: string;
  sector: string; // e.g. "poniente", "norte"
  perfil: string; // tipo de clientes dominante
  contexto: string; // párrafo de contexto único
  beneficios: string[]; // 3-4 bullets únicos
  region?: string; // Región administrativa (default: Región Metropolitana)
}

const REGION_DEFAULT = "Región Metropolitana";

export function buildComunaMetadata(c: ComunaConfig): Metadata {
  const region = c.region ?? REGION_DEFAULT;
  return buildMetadata({
    title: `Petróleo a Domicilio en ${c.nombre} | Despacho de Diesel para Empresas`,
    description: `Distribuidor de petróleo diesel a domicilio en ${c.nombre}, ${region}. Despacho rápido para empresas e industria, coordinación por WhatsApp y factura electrónica. Cotiza ahora.`,
    path: `/cobertura/petroleo-a-domicilio-${c.slug}`,
    keywords: comunaKeywords(c.nombre),
  });
}

export function buildComunaSchema(c: ComunaConfig) {
  const base = SITE_CONFIG.site_url;
  const region = c.region ?? REGION_DEFAULT;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Petróleo a domicilio en ${c.nombre}`,
    serviceType: `Despacho de petróleo a domicilio en ${c.nombre}`,
    url: `${base}/cobertura/petroleo-a-domicilio-${c.slug}`,
    provider: { "@id": `${base}/#localbusiness` },
    areaServed: { "@type": "City", name: c.nombre, containedInPlace: { "@type": "AdministrativeArea", name: region } },
    description: `Despacho de petróleo diesel para empresas e industria en ${c.nombre}, ${region}.`,
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${base}/cotizacion`,
      servicePhone: SITE_CONFIG.telefono,
    },
  };
}

export default function ComunaPage({ config }: { config: ComunaConfig }) {
  const schema = buildComunaSchema(config);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb crumbs={[
          { name: "Inicio", href: "/" },
          { name: "Cobertura", href: "/cobertura" },
          { name: config.nombre },
        ]} />
      </div>

      <section className="bg-[#0a1628] text-white py-16 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a6b3c] via-[#f5a623] to-[#1a6b3c]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 bg-[#f5a623]/10 border border-[#f5a623]/25 text-[#f5a623] text-xs font-bold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623]" />
            Cobertura · {config.nombre}
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
            Petróleo a domicilio en {config.nombre} para empresas e industria
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Fenice SPA despacha petróleo diesel a domicilio en {config.nombre} para clientes empresariales
            e industriales, con despachos programados o puntuales según tus requerimientos.
          </p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Despacho de petróleo en {config.nombre}: cobertura y servicio
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">{config.contexto}</p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Desde nuestra base en San Ramón, Santiago, llegamos a {config.nombre} con tiempos de
            despacho competitivos. Coordinamos por WhatsApp para ajustarnos a tu horario de operación
            y emitimos factura electrónica para tu departamento de compras.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            Clientes que atendemos en {config.nombre}
          </h2>
          <p className="text-gray-600 mb-4">
            {config.nombre} tiene un perfil predominantemente {config.perfil}. Los principales
            clientes que atendemos en esta zona incluyen:
          </p>
          <ul className="space-y-2 text-gray-600 mb-6">
            {config.beneficios.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-[#1a6b3c] mt-1 shrink-0">→</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            ¿Cómo cotizar petróleo a domicilio en {config.nombre}?
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            El proceso es simple: contáctanos por WhatsApp indicando tu dirección en {config.nombre},
            el volumen estimado de combustible que necesitas y la fecha aproximada de entrega.
            Te respondemos con precio y disponibilidad en minutos, en horario Lun-Vie 09:00–19:00.
          </p>

          <div className="bg-[#ecfdf3] border border-[#1a6b3c]/15 rounded-xl p-6 mb-8">
            <h3 className="font-bold text-[#0a1628] mb-3">
              Servicios disponibles en {config.nombre}
            </h3>
            <ul className="space-y-2">
              {SERVICIOS.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicios/${s.slug}`} className="text-[#1a6b3c] hover:text-[#145530] hover:underline font-semibold">
                    {s.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <WhatsAppButton
            mensaje={`Hola, necesito cotizar petróleo a domicilio en ${config.nombre}.`}
            className="text-lg px-8 py-4"
          />
        </div>
      </section>

      <CTASection
        heading={`¿Necesitas petróleo a domicilio en ${config.nombre}?`}
        mensaje={`Hola, quiero cotizar petróleo a domicilio en ${config.nombre}.`}
      />
    </>
  );
}
