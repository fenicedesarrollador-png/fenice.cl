import CTASection from "@/components/CTASection";
import Breadcrumb from "@/components/Breadcrumb";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import { buildMetadata, jsonLd, serviceSchema as buildServiceSchema } from "@/lib/seo";
import { Shield, ClipboardCheck, MapPin, Calendar, FileText, Truck, CheckCircle2 } from "lucide-react";

export const metadata = buildMetadata({
  title: "Transporte de Combustible para Empresas en Santiago",
  description:
    "Transporte de diésel para empresas e industria en la RM, con trazabilidad, documentación de entrega y coordinación directa. Cotiza por WhatsApp.",
  path: "/servicios/transporte-de-combustible-rm",
  keywords: [
    "transporte de combustible santiago",
    "transporte de combustible región metropolitana",
    "flota certificada combustible RM",
    "traslado de petróleo diesel empresas",
  ],
});

const serviceSchema = buildServiceSchema({
  name: "Transporte de Combustible RM",
  description: "Transporte documentado de combustible para industria y empresas en la Región Metropolitana de Santiago.",
  slug: "transporte-de-combustible-rm",
});

const caracteristicas = [
  {
    icon: Truck,
    title: "Flota documentada",
    desc: "Camiones tanque con documentación técnica, revisiones e inspecciones aplicables vigentes.",
  },
  {
    icon: Shield,
    title: "Conductores capacitados",
    desc: "Personal con la licencia profesional correspondiente al vehículo y capacitación documentada para sustancias peligrosas.",
  },
  {
    icon: ClipboardCheck,
    title: "Trazabilidad total",
    desc: "Documentación de cada entrega con guía de despacho y registro de volumen entregado.",
  },
  {
    icon: MapPin,
    title: "Cobertura RM completa",
    desc: "Operamos en toda la Región Metropolitana desde nuestra base en San Ramón, Santiago.",
  },
  {
    icon: Calendar,
    title: "Despachos programados",
    desc: "Planificación de despachos recurrentes para tu ciclo de abastecimiento industrial.",
  },
  {
    icon: FileText,
    title: "Facturación electrónica",
    desc: "Emisión de factura electrónica para tus procesos contables y de compras.",
  },
];

export default function TransporteCombustiblePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema)} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb crumbs={[
            { name: "Inicio", href: "/" },
            { name: "Servicios", href: "/petroleo-a-domicilio" },
            { name: "Transporte de Combustible RM" },
          ]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Servicio</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl">
            Transporte de combustible en la Región Metropolitana
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-8">
            Fenice SPA opera una flota documentada para el transporte de combustible a clientes industriales
            y empresariales en toda la Región Metropolitana de Santiago.
          </p>
          <WhatsAppButton
            mensaje="Hola, necesito cotizar transporte de combustible en la RM para mi empresa."
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
                  Servicio de transporte de combustible para empresas en la RM
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  El <strong className="text-slate-800">transporte de combustible en la Región Metropolitana</strong> exige cumplimiento
                  normativo estricto, flota en buen estado y conductores capacitados en manejo de materiales
                  peligrosos. Fenice SPA cuenta con los permisos y la experiencia para operar este servicio
                  de forma segura y confiable para tu empresa.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Nuestro servicio de transporte incluye principalmente petróleo diesel para uso industrial,
                  generadores y maquinaria pesada. Consulta por otros productos energéticos para tu operación.
                </p>
              </div>

              {/* Cards características */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-5">
                  Características del servicio
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {caracteristicas.map((item) => (
                    <div key={item.title} className="bg-slate-50 border border-slate-100 rounded-xl p-5 hover:border-orange-200 hover:bg-orange-50/30 transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 group-hover:border-orange-200 flex items-center justify-center mb-3 transition-all">
                        <item.icon className="w-4 h-4 text-orange-500" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 text-sm">{item.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Normativa */}
              <div className="bg-slate-900 text-white rounded-2xl p-8">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  Cumplimiento normativo
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  El transporte de combustible en Chile está regulado por la normativa de transporte de
                  materiales peligrosos (DS N° 298/94) y los requerimientos de la Superintendencia de
                  Electricidad y Combustibles (SEC). Nuestros vehículos y conductores cumplen con todas
                  las exigencias vigentes.
                </p>
                <ul className="space-y-2">
                  {[
                    "Vehículos con revisión técnica y permisos de circulación al día",
                    "Conductores con licencia profesional acorde al vehículo y capacitación documentada",
                    "Documentación de transporte completa en cada servicio",
                    "Seguro de responsabilidad civil para cargas peligrosas",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-400" />
                  Características del servicio
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Zona de operación", val: "Región Metropolitana" },
                    { label: "Tipo de carga", val: "Petróleo diesel" },
                    { label: "Clientes", val: "B2B empresas" },
                    { label: "Coordinación", val: "WhatsApp directo" },
                    { label: "Facturación", val: "Factura electrónica" },
                    { label: "Horario", val: "Lun-Vie 09:00–19:00" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between text-sm pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-medium">{item.val}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">Solicitar cotización</h3>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  Escríbenos con la zona, volumen y frecuencia de despacho requerida.
                </p>
                <WhatsAppButton
                  mensaje="Hola, necesito cotizar transporte de combustible en la RM para mi empresa."
                  className="w-full justify-center"
                />
                <Link
                  href="/contacto"
                  className="mt-3 block text-center text-sm text-slate-600 hover:text-orange-600 font-medium transition-colors"
                >
                  O usa el formulario →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection heading="¿Necesitas transporte de combustible en la RM?" mensaje="Hola, quiero cotizar transporte de combustible en la Región Metropolitana." />
    </>
  );
}
