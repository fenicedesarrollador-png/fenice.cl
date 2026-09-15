import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { buildMetadata, serviceSchema as buildServiceSchema, faqSchema, jsonLd } from "@/lib/seo";
import {
  Zap, Building2, CheckCircle2, CalendarCheck, PhoneCall, ShieldCheck,
  Hospital, Hotel, GraduationCap, Factory, Home, ChevronRight,
} from "lucide-react";

export const metadata = buildMetadata({
  title: "Combustible para Generadores Eléctricos | Diésel a Domicilio",
  description:
    "Abastecimiento de petróleo diésel para generadores eléctricos de edificios, condominios, clínicas, hoteles e industrias en Santiago y la Región Metropolitana. Despachos programados y atención de urgencias previa coordinación.",
  path: "/servicios/combustible-para-generadores-electricos",
  keywords: [
    "combustible para generadores eléctricos",
    "petróleo para generadores de edificios",
    "diesel para generadores santiago",
    "suministro de diesel para clínicas",
    "diesel para condominios",
    "abastecimiento de generadores región metropolitana",
  ],
});

const serviceSchema = buildServiceSchema({
  name: "Combustible para Generadores Eléctricos",
  description:
    "Abastecimiento programado o urgente de petróleo diésel para generadores eléctricos de edificios, condominios, clínicas, centros de salud, hoteles, industrias e instalaciones comerciales en la Región Metropolitana.",
  slug: "combustible-para-generadores-electricos",
});

const faqItems = [
  {
    q: "¿Despachan diésel para el generador de un edificio o condominio?",
    a: "Sí. Abastecemos generadores eléctricos de edificios, condominios y comunidades en toda la Región Metropolitana. Coordinamos el despacho con la administración en fecha, horario y cantidad.",
  },
  {
    q: "¿Puedo programar el abastecimiento del generador de forma periódica?",
    a: "Sí. Puedes programar abastecimientos semanales o mensuales según el consumo de tu generador, de modo que el estanque nunca quede bajo el nivel de respaldo que necesitas.",
  },
  {
    q: "¿Atienden urgencias si el generador se está quedando sin combustible?",
    a: "Atendemos requerimientos urgentes sujetos a disponibilidad operacional y previa coordinación telefónica o por WhatsApp. Contáctanos y evaluamos la entrega más rápida posible para tu zona.",
  },
  {
    q: "¿Cuál es la compra mínima?",
    a: "La compra mínima es de 50 litros. El precio se confirma antes de cada despacho, ya que varía según las condiciones del mercado.",
  },
];

const genFaqSchema = faqSchema(faqItems);

const instalaciones = [
  { icon: Building2, label: "Edificios y condominios" },
  { icon: Hospital, label: "Clínicas y centros de salud" },
  { icon: GraduationCap, label: "Establecimientos educacionales" },
  { icon: Hotel, label: "Hoteles y centros recreativos" },
  { icon: Factory, label: "Industrias y centros operacionales" },
  { icon: Home, label: "Instalaciones comerciales" },
];

const beneficios = [
  { icon: ShieldCheck, text: "Respaldo eléctrico asegurado: su generador siempre con combustible disponible" },
  { icon: CalendarCheck, text: "Despachos programados semanales o mensuales según el consumo real" },
  { icon: PhoneCall, text: "Atención de requerimientos urgentes, previa coordinación y sujeta a disponibilidad" },
  { icon: CheckCircle2, text: "Coordinación directa con administradores, mayordomos o encargados de mantención" },
  { icon: CheckCircle2, text: "Precios actualizados según mercado, confirmados antes de cada despacho" },
  { icon: CheckCircle2, text: "Factura electrónica y respaldo documental de cada entrega" },
];

export default function GeneradoresPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(genFaqSchema)} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[
            { name: "Inicio", href: "/" },
            { name: "Servicios", href: "/servicios/petroleo-a-domicilio-santiago" },
            { name: "Combustible para Generadores Eléctricos" },
          ]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute top-0 right-0 w-96 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Servicio</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl">
            Combustible para generadores eléctricos
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Abastecemos con petróleo diésel los generadores de edificios, condominios, clínicas,
            hoteles e industrias en Santiago y la Región Metropolitana. Que un corte de energía
            nunca detenga su operación.
          </p>
          <WhatsAppButton
            mensaje="Hola, necesito cotizar diésel para un generador eléctrico."
            className="bg-orange-500 hover:bg-orange-600 text-white"
          />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Su generador siempre listo para responder
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Un generador eléctrico sin combustible es un respaldo que no respalda. En FENICE
                  entregamos <strong className="text-slate-800">petróleo diésel para generadores eléctricos</strong> directamente
                  en su edificio, clínica, hotel o planta, con despachos coordinados en fecha,
                  horario y cantidad, para que su instalación mantenga energía de respaldo
                  disponible en todo momento.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Trabajamos con administradores de edificios y condominios, encargados de
                  mantención y jefes de operaciones que necesitan <strong className="text-slate-800">continuidad
                  operacional</strong>: abastecimientos programados según el consumo real del equipo y
                  capacidad de respuesta ante requerimientos urgentes, previa coordinación.
                </p>
              </div>

              {/* Instalaciones */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Instalaciones que abastecemos</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {instalaciones.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-orange-200 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficios */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Beneficios del servicio</h2>
                <ul className="space-y-3">
                  {beneficios.map((item, i) => (
                    <li key={i} className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:border-orange-200 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 group-hover:border-orange-200 flex items-center justify-center shrink-0 transition-all">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <span className="text-slate-700 text-sm leading-relaxed pt-1">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">Preguntas frecuentes</h2>
                <div className="space-y-3">
                  {faqItems.map((item, i) => (
                    <details key={i} className="group bg-white border border-slate-200 hover:border-orange-200 rounded-xl overflow-hidden transition-colors">
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none select-none">
                        <span className="font-semibold text-slate-900 text-sm pr-4">{item.q}</span>
                        <ChevronRight className="w-4 h-4 text-orange-500 shrink-0 group-open:rotate-90 transition-transform" />
                      </summary>
                      <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Cross-links */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-3">Servicios relacionados</h3>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link href="/servicios/combustible-para-calderas" className="text-orange-600 hover:underline font-medium">Combustible para calderas →</Link>
                  <Link href="/servicios/instalacion-de-estanques" className="text-orange-600 hover:underline font-medium">Instalación y mantención de estanques →</Link>
                  <Link href="/venta-petroleo-diesel" className="text-orange-600 hover:underline font-medium">Venta de petróleo diésel →</Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-400" />
                  Resumen del servicio
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Combustible", val: "Petróleo diésel" },
                    { label: "Compra mínima", val: "50 litros" },
                    { label: "Modalidad", val: "Programado o urgente*" },
                    { label: "Cobertura", val: "RM, Valparaíso y O'Higgins" },
                    { label: "Pago", val: "Transferencia, tarjetas, cheque" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between text-sm pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-medium text-right max-w-[55%]">{item.val}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                  *Urgencias sujetas a disponibilidad operacional y coordinación previa.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Programe su abastecimiento</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Indíquenos el consumo de su generador y le proponemos un plan de abastecimiento
                  periódico para no quedar nunca sin respaldo.
                </p>
                <WhatsAppButton
                  mensaje="Hola, quiero programar el abastecimiento de diésel para un generador eléctrico."
                  className="w-full justify-center"
                />
                <Link
                  href="/cotizacion"
                  className="mt-3 block text-center text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                >
                  O solicite una cotización →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection heading="Evite interrupciones por falta de combustible" mensaje="Hola, quiero cotizar diésel para un generador eléctrico." />
    </>
  );
}
