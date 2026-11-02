import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import GeneratorCalculator from "@/components/GeneratorCalculator";
import { buildMetadata, faqSchema, jsonLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/config";

export const metadata = buildMetadata({
  title: "Calculadora de Consumo de Diésel para Generadores",
  description: "Calcula consumo de diésel, autonomía y reposición para tu generador con litros por hora y horas de uso. Solicita abastecimiento en Santiago y la RM.",
  path: "/herramientas/calculadora-consumo-generador",
});

const faqs = [
  { q: "¿Puedo calcular el consumo de diésel solo con los kVA?", a: "No. La potencia nominal no determina por sí sola el consumo. Usa el dato en litros por hora del fabricante para el nivel de carga previsto, o un consumo medido en tu operación." },
  { q: "¿La autonomía calculada incluye la reserva?", a: "La autonomía se calcula con los litros disponibles menos la reserva que definiste. Si el combustible disponible es igual o menor que la reserva, la autonomía antes de usar esa reserva es cero." },
  { q: "¿Los litros calculados corresponden a una cotización?", a: "No. El resultado es una estimación de planificación. El volumen de compra, precio, capacidad útil del estanque, acceso y disponibilidad de despacho se confirman con el equipo comercial. El pedido mínimo informado es de 50 litros." },
];

export default function GeneratorCalculatorPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
      "@context": "https://schema.org", "@type": "WebApplication",
      name: "Calculadora de consumo y autonomía de un generador diésel",
      url: `${SITE_CONFIG.site_url}/herramientas/calculadora-consumo-generador`,
      applicationCategory: "BusinessApplication", operatingSystem: "Web",
      isAccessibleForFree: true, inLanguage: "es-CL", publisher: { "@id": `${SITE_CONFIG.site_url}/#organization` },
    })} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faqSchema(faqs))} />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"><Breadcrumb crumbs={[{ name: "Inicio", href: "/" }, { name: "Combustible para generadores", href: "/servicios/combustible-para-generadores-electricos" }, { name: "Calculadora de consumo" }]} /></div>
    <section className="py-10 sm:py-14 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1a6b3c] mb-3">Planificación de abastecimiento</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0a1628] leading-tight mb-4">Calculadora de consumo y autonomía de un generador diésel</h1>
          <p className="text-slate-600 leading-relaxed">Estima cuánto combustible consumirá tu generador, cuánto tiempo puedes operar antes de usar la reserva y cuántos litros adicionales necesitas. Una herramienta para administraciones de edificios, empresas y encargados de mantención.</p>
        </header>
        <GeneratorCalculator />
      </div>
    </section>
    <section className="py-14 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-slate-600 leading-relaxed">
        <div><h2 className="text-2xl font-extrabold text-[#0a1628] mb-4">Cómo calcular el consumo de diésel</h2><p>Multiplica el consumo por hora del equipo por las horas de funcionamiento que necesitas. Si un generador consume 12 L/h y debe operar durante 8 horas, el consumo estimado del período es de 96 litros. Este ejemplo ilustra la fórmula; el consumo de tu equipo puede ser diferente.</p><p className="mt-3">El dato debe corresponder al nivel de carga previsto. Revisa la tabla del fabricante o un registro de consumo real. Si cambia la carga durante el día, calcula cada tramo por separado y suma sus consumos.</p></div>
        <div><h2 className="text-2xl font-extrabold text-[#0a1628] mb-4">Autonomía y reposición con reserva</h2><p>La autonomía antes de usar la reserva es el combustible disponible, menos la reserva definida, dividido por el consumo por hora. Los litros adicionales son el consumo del período más la reserva, menos lo que ya tienes. Si el resultado es negativo, la reposición calculada se muestra como cero.</p><div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mt-4"><p className="font-semibold text-[#0a1628] mb-2">Ejemplo de planificación</p><p>Con 100 litros disponibles, una reserva de 20 litros y un consumo de 12 L/h, puedes operar aproximadamente 6,67 horas antes de usar la reserva. Para operar 8 horas y conservar esos 20 litros, la reposición calculada es de 16 litros.</p><p className="text-sm mt-3">Los 16 litros del ejemplo son una necesidad matemática. El pedido mínimo de FENICE es de 50 litros; confirma la capacidad útil del estanque y el volumen adecuado con el equipo comercial.</p></div></div>
        <div><h2 className="text-2xl font-extrabold text-[#0a1628] mb-4">Del cálculo al despacho de combustible</h2><p>Ten a mano la comuna, dirección de entrega, consumo del equipo, litros disponibles, capacidad útil del estanque y fecha de operación. El botón de cotización conserva el cálculo como información editable de tu solicitud; después puedes añadir los datos de entrega y contacto.</p><p className="mt-3">FENICE coordina el <Link href="/servicios/combustible-para-generadores-electricos" className="text-[#1a6b3c] font-semibold underline">abastecimiento de diésel para generadores en Santiago y la Región Metropolitana</Link>. El precio y la disponibilidad se confirman en horario de atención, de lunes a viernes, de 09:00 a 19:00.</p><p className="mt-3">Para preparar un plan periódico, revisa la <Link href="/blog/calcular-consumo-diesel-generador-electrico" className="text-[#1a6b3c] font-semibold underline">guía de consumo y carga de generadores</Link> y las <Link href="/cobertura" className="text-[#1a6b3c] font-semibold underline">zonas de cobertura</Link>.</p></div>
        <div><h2 className="text-2xl font-extrabold text-[#0a1628] mb-4">Preguntas sobre el cálculo</h2><div className="divide-y divide-slate-200">{faqs.map((faq) => <details key={faq.q} className="py-4"><summary className="font-bold text-[#0a1628] cursor-pointer">{faq.q}</summary><p className="mt-3 text-sm">{faq.a}</p></details>)}</div></div>
      </div>
    </section>
  </>;
}
