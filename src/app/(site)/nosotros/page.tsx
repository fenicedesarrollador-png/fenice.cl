import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import { SITE_CONFIG } from "@/lib/config";
import { Shield, Users, Truck, Award, CheckCircle2, Building2, Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Quiénes Somos | Distribución de Petróleo RM",
  description:
    "Fenice SPA es una empresa chilena especializada en distribución de petróleo diesel e instalación de estanques certificados para la industria en la Región Metropolitana.",
  alternates: { canonical: "https://fenice.cl/nosotros" },
};

const valores = [
  {
    icon: Shield,
    title: "Cumplimiento normativo",
    desc: "Operamos con toda la documentación exigida por la SEC y la normativa chilena para transporte e instalación de combustibles.",
  },
  {
    icon: Users,
    title: "Trato directo",
    desc: "Coordinamos directamente con el responsable de operaciones de tu empresa, sin call centers ni intermediarios.",
  },
  {
    icon: Truck,
    title: "Despacho confiable",
    desc: "Cumplimos los plazos acordados. Tu operación no se detiene por falta de combustible.",
  },
  {
    icon: Award,
    title: "Experiencia técnica",
    desc: "Equipo formado en manejo de combustibles, normativa SEC y seguridad industrial.",
  },
];

const sectores = [
  "Construcción e infraestructura",
  "Manufactura e industria",
  "Minería y faenas periurbanas",
  "Generación eléctrica y grupos electrógenos",
  "Transporte pesado y flotas",
  "Agroindustria y agricultura",
  "Condominios y edificios corporativos",
  "Eventos y operaciones temporales",
];

export default function NosotrosPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Empresa</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Quiénes somos
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Empresa chilena especializada en distribución de petróleo diesel e instalación de
            estanques certificados para la industria y empresa en la Región Metropolitana.
          </p>
        </div>
      </section>

      {/* Sobre nosotros */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-3 space-y-5">
              <h2 className="text-2xl font-bold text-slate-900">Nuestra empresa</h2>
              <p className="text-slate-600 leading-relaxed">
                Fenice SPA es una empresa chilena con base operativa en La Granja, Santiago, dedicada
                a la distribución de petróleo diesel e instalación de estanques de almacenamiento de
                combustible certificados por la Superintendencia de Electricidad y Combustibles (SEC).
              </p>
              <p className="text-slate-600 leading-relaxed">
                Nacimos con el objetivo de ofrecer a las empresas e industria de la Región Metropolitana
                un proveedor de combustible confiable, ágil y con trato directo, sin la burocracia
                asociada a los grandes distribuidores.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Nuestra experiencia en el rubro nos ha permitido atender a clientes en construcción,
                manufactura, minería, generación eléctrica y agroindustria, adaptándonos a las
                necesidades específicas de cada operación.
              </p>

              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Sectores que atendemos</h3>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {sectores.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card datos empresa */}
            <div className="lg:col-span-2">
              <div className="bg-slate-900 rounded-2xl p-7 text-white sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Datos de la empresa</h3>
                </div>
                <dl className="space-y-4">
                  {[
                    { icon: Building2, label: "Razón social", value: "Fenice SPA" },
                    { icon: MapPin, label: "Base operativa", value: SITE_CONFIG.direccion },
                    { icon: MapPin, label: "Zona principal", value: "Región Metropolitana" },
                    { icon: MapPin, label: "Zonas adicionales", value: "Valparaíso · Rancagua" },
                    { icon: Phone, label: "Contacto", value: SITE_CONFIG.telefono },
                    { icon: Mail, label: "Email", value: SITE_CONFIG.email },
                    { icon: Clock, label: "Horario", value: SITE_CONFIG.horario },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0">
                      <item.icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                      <div>
                        <dt className="text-xs text-slate-500 mb-0.5">{item.label}</dt>
                        <dd className="text-sm text-slate-200">{item.value}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Nuestros valores</h2>
            <p className="text-slate-500 text-sm">Los principios que guían cada operación</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valores.map((v) => (
              <div key={v.title} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
