import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Petróleo a Domicilio",
  description:
    "Respuestas a las preguntas más comunes sobre despacho de petróleo a domicilio, instalación de estanques y transporte de combustible en Santiago y la RM.",
  alternates: { canonical: "https://fenice.cl/preguntas-frecuentes" },
};

const faqs = [
  {
    q: "¿Hacen despacho de petróleo a domicilio en Santiago?",
    a: "Sí. Realizamos despacho de petróleo a domicilio en toda la Región Metropolitana para clientes empresariales e industriales, con requerimientos programados o puntuales.",
    cat: "Despacho",
  },
  {
    q: "¿En qué comunas de Santiago trabajan?",
    a: "Atendemos comunas del Gran Santiago como La Granja, Providencia, Las Condes, Maipú, Pudahuel, Quilicura, Puente Alto y San Bernardo, además de Lampa, Buin y Colina. También cubrimos Valparaíso y Rancagua.",
    cat: "Cobertura",
  },
  {
    q: "¿Atienden a empresas o también a particulares?",
    a: "Nuestro servicio está orientado principalmente a empresas, industria, construcción y operaciones que requieren volúmenes significativos. Consulta por tus requerimientos específicos.",
    cat: "Clientes",
  },
  {
    q: "¿Cómo puedo cotizar el precio del petróleo?",
    a: "Puedes cotizar directamente por WhatsApp al +56 9 3957 9658 o mediante nuestro formulario de contacto. Respondemos en minutos en horario Lun-Vie 09:00–19:00.",
    cat: "Precios",
  },
  {
    q: "¿Cuánto tiempo demora el despacho?",
    a: "Los tiempos dependen del volumen, la disponibilidad y tu ubicación. En la mayoría de los casos coordinamos el despacho en el mismo día o al siguiente hábil. Los despachos programados se agendan con anticipación según tu ciclo de consumo.",
    cat: "Despacho",
  },
  {
    q: "¿Emiten factura electrónica?",
    a: "Sí, emitimos factura electrónica para todos nuestros clientes empresariales. Puedes solicitarla al momento de coordinar el despacho.",
    cat: "Facturación",
  },
  {
    q: "¿Cuál es el volumen mínimo de pedido?",
    a: "Consulta el volumen mínimo directamente por WhatsApp ya que puede variar según zona y disponibilidad de la flota. Atendemos desde despachos puntuales hasta contratos de suministro recurrente.",
    cat: "Pedidos",
  },
  {
    q: "¿Qué diferencia tiene el petróleo del diésel?",
    a: "En Chile, el término 'petróleo' se usa informalmente para referirse al petróleo diésel, que es el mismo producto. El petróleo diésel (D2) es el combustible estándar para maquinaria, camiones, generadores y equipamiento industrial.",
    cat: "Producto",
  },
  {
    q: "¿Instalan estanques de almacenamiento?",
    a: "Sí. Ofrecemos el servicio de instalación de estanques de petróleo certificados por la SEC. El proceso incluye asesoría, instalación, tramitación ante la SEC y puesta en marcha.",
    cat: "Estanques",
  },
  {
    q: "¿Qué normativa regula los estanques de combustible en Chile?",
    a: "La instalación de estanques está regulada por el Decreto N° 160 del Ministerio de Economía y la NCh 2597. La SEC fiscaliza el cumplimiento de estas normas. Nuestro equipo realiza las instalaciones cumpliendo con toda la normativa vigente.",
    cat: "Estanques",
  },
  {
    q: "¿Tienen servicio de despacho de urgencia?",
    a: "Disponemos de despachos urgentes sujetos a disponibilidad de flota. Contáctanos por WhatsApp para evaluar la disponibilidad en tu fecha y zona.",
    cat: "Despacho",
  },
  {
    q: "¿Cómo calcular cuánto petróleo necesita mi operación?",
    a: "El consumo depende del tipo de maquinaria, horas de operación y carga de trabajo. Puedes revisar nuestro artículo en el blog sobre cómo calcular el consumo de petróleo industrial, o contactarnos para asesorarte.",
    cat: "Producto",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">FAQ</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Preguntas frecuentes
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Resolvemos las dudas más comunes sobre despacho de combustible, instalación de estanques
            y transporte de petróleo en Santiago y la Región Metropolitana.
          </p>
        </div>
      </section>

      {/* FAQ accordion */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none">
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-[10px] font-semibold rounded uppercase tracking-wider shrink-0">
                      {faq.cat}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm leading-snug">{faq.q}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 pt-0">
                  <div className="pl-0 sm:pl-[calc(theme(spacing.10)+theme(spacing.3))]">
                    <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">{faq.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-10 bg-orange-50 border border-orange-100 rounded-xl p-6 text-center">
            <p className="font-semibold text-slate-900 mb-1">¿No encontraste lo que buscabas?</p>
            <p className="text-slate-600 text-sm mb-4">Escríbenos directamente y respondemos en minutos.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/56939579658?text=${encodeURIComponent("Hola, tengo una consulta sobre petróleo a domicilio.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-orange-300 text-slate-700 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                Formulario de contacto
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
