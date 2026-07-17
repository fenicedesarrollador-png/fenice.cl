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
    q: "¿Cuál es la cantidad mínima de combustible que puedo comprar?",
    a: "La compra mínima es de 50 litros, tanto para petróleo diésel como para kerosene. Desde ese volumen coordinamos el despacho en la fecha y horario acordados.",
    cat: "Pedidos",
  },
  {
    q: "¿Realizan despachos de emergencia?",
    a: "Sí, atendemos requerimientos urgentes sujetos a disponibilidad operacional y previa coordinación telefónica o por WhatsApp. Contáctanos y evaluamos la entrega más rápida posible para tu comuna y volumen.",
    cat: "Despacho",
  },
  {
    q: "¿Puedo programar entregas semanales o mensuales?",
    a: "Sí. Puedes programar abastecimientos semanales o mensuales según el consumo de tu operación, generador, caldera o maquinaria. La programación periódica reduce el riesgo de quedarte sin combustible y simplifica tu gestión logística.",
    cat: "Despacho",
  },
  {
    q: "¿Qué información necesito para cotizar?",
    a: "Para cotizar necesitamos: nombre y RUT de la empresa, persona de contacto, teléfono, correo, dirección exacta y comuna del despacho, tipo de combustible (diésel o kerosene), cantidad requerida en litros, fecha estimada de entrega y el tipo de instalación o maquinaria que será abastecida.",
    cat: "Cotización",
  },
  {
    q: "¿Qué formas de pago aceptan?",
    a: "Aceptamos transferencia bancaria, tarjetas de débito, tarjetas de crédito y cheque, este último previa evaluación o consulta. Emitimos factura electrónica por cada despacho.",
    cat: "Pagos",
  },
  {
    q: "¿En qué comunas realizan despachos?",
    a: "Cubrimos las 52 comunas de la Región Metropolitana —con foco en Santiago, Lampa, Colina, Buin, María Pinto, Melipilla, Curacaví, Talagante, Isla de Maipo y San Ramón— además de la Región de Valparaíso, Los Andes, Rancagua y Santa Cruz. Las entregas se programan según disponibilidad operacional, comuna y volumen.",
    cat: "Cobertura",
  },
  {
    q: "¿Despachan combustible para generadores eléctricos?",
    a: "Sí, es uno de nuestros servicios principales. Abastecemos generadores de edificios, condominios, clínicas, centros de salud, hoteles, establecimientos educacionales e industrias, con despachos programados o urgentes previa coordinación.",
    cat: "Servicios",
  },
  {
    q: "¿Atienden maquinaria pesada en terreno?",
    a: "Sí. Cargamos directamente en faena excavadoras, retroexcavadoras, cargadores frontales, grúas, maquinaria agrícola y equipos de movimiento de tierra, sin que necesites trasladar los equipos.",
    cat: "Servicios",
  },
  {
    q: "¿El precio del diésel cambia semanalmente?",
    a: "Los precios de los combustibles varían según las condiciones del mercado, por lo que se confirman antes de cada despacho. En los abastecimientos programados te informamos el precio vigente al coordinar cada entrega.",
    cat: "Precios",
  },
  {
    q: "¿Cómo puedo consultar el estado de un despacho?",
    a: "Puedes consultar el estado de tu despacho directamente por WhatsApp al +56 9 3957 9658 o al correo notifica@fenice.cl. Mantenemos comunicación directa desde la coordinación hasta la entrega.",
    cat: "Despacho",
  },
  {
    q: "¿Emiten factura electrónica?",
    a: "Sí. Una vez aceptada la cotización se genera la orden de compra, se realiza el despacho y se emite la factura electrónica correspondiente. Para temas de facturación y pagos puedes escribir a finanzas@fenice.cl.",
    cat: "Pagos",
  },
  {
    q: "¿Qué diferencia tiene el petróleo del diésel?",
    a: "En Chile, el término 'petróleo' se usa informalmente para referirse al petróleo diésel, que es el mismo producto. Es el combustible estándar para maquinaria pesada, camiones, generadores eléctricos y calderas.",
    cat: "Producto",
  },
  {
    q: "¿Instalan y mantienen estanques de almacenamiento?",
    a: "Sí. Realizamos instalación de estanques para almacenamiento de combustible, mantención preventiva y correctiva, evaluación de requerimientos de almacenamiento y apoyo en la planificación del abastecimiento.",
    cat: "Estanques",
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
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden" data-analytics-section="faq_hero">
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
      <section className="py-16 bg-white" data-analytics-section="faq">
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
                data-analytics-id="faq_whatsapp"
                data-analytics-label="WhatsApp"
                data-analytics-cta="whatsapp"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="/contacto"
                data-analytics-id="faq_formulario_contacto"
                data-analytics-label="Formulario de contacto"
                data-analytics-cta="lead_form"
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
