import type { Metadata } from "next";
import Link from "next/link";
import {
  Fuel, Truck, Container, ArrowRight, Phone, CheckCircle2,
  MapPin, Clock, Building2, Zap, ShieldCheck, FileText,
  ChevronRight, TrendingUp, Users, Award
} from "lucide-react";
import { COMUNAS, SERVICIOS, SITE_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: "Petróleo a Domicilio en Santiago | Despacho Rápido RM | Fenice SPA",
  description:
    "Despacho de petróleo a domicilio para empresas e industria en toda la Región Metropolitana. Cotiza por WhatsApp y recibe respuesta en minutos. Cobertura RM, Valparaíso y Rancagua.",
  alternates: { canonical: "https://fenice.cl/" },
};

const faqItems = [
  { q: "¿Hacen despacho de petróleo a domicilio en Santiago?", a: "Sí. Realizamos despacho de petróleo a domicilio en toda la Región Metropolitana para empresas e industria, con despachos programados o urgentes según sus necesidades." },
  { q: "¿En qué comunas de Santiago trabajan?", a: "Atendemos La Granja, Providencia, Las Condes, Maipú, Pudahuel, Quilicura, Puente Alto, San Bernardo, Lampa, Buin, Colina, además de Valparaíso y Rancagua." },
  { q: "¿Qué tipo de empresas pueden cotizar petróleo?", a: "Industria manufacturera, construcción, minería, faenas, generadores eléctricos, flotas de maquinaria y cualquier organización con requerimiento de combustible." },
  { q: "¿Cómo cotizo el precio del petróleo?", a: "Por WhatsApp al +56 9 3957 9658 o mediante el formulario de contacto. Respondemos en minutos Lun-Vie 09:00–19:00." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const SERVICIO_ICONS = [Fuel, Truck, Container];
const STATS = [
  { value: "12+", label: "Comunas RM", icon: MapPin },
  { value: "24h", label: "Tiempo respuesta", icon: Clock },
  { value: "B2B", label: "Especialistas", icon: Building2 },
  { value: "SEC", label: "Certificado", icon: Award },
];

const TRUST_POINTS = [
  { icon: ShieldCheck, title: "Certificación SEC", desc: "Instalación de estanques bajo normativa vigente Decreto N°160 y NCh 2597." },
  { icon: Zap, title: "Respuesta inmediata", desc: "Coordinación directa por WhatsApp sin call centers. Cotización en minutos." },
  { icon: FileText, title: "Facturación empresarial", desc: "Factura electrónica para tu departamento de compras en cada despacho." },
  { icon: TrendingUp, title: "Suministro recurrente", desc: "Contratos de abastecimiento programado para operaciones de alto volumen." },
];

const SECTORES = [
  "Construcción e inmobiliaria",
  "Manufactura y planta industrial",
  "Minería y extracción",
  "Generadores eléctricos",
  "Flota de maquinaria pesada",
  "Agroindustria y agricultura",
];

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-slate-950 overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }} />
        {/* Gradient glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                Distribución industrial · Región Metropolitana
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                Petróleo a domicilio<br />
                <span className="text-orange-400">para tu empresa</span><br />
                en Santiago
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-xl">
                Distribuimos petróleo diesel e instalamos estanques certificados para industria,
                construcción y generadores en la Región Metropolitana. Despacho programado o urgente,
                con coordinación directa y facturación empresarial.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-sm"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                  Cotizar por WhatsApp
                </a>
                <Link
                  href="/contacto"
                  className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm"
                >
                  Solicitar cotización formal
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {["Despacho toda la RM", "Factura electrónica", "Estanques SEC", "Respuesta en minutos"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="hidden lg:block">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6">Cobertura operativa</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {STATS.map(({ value, label, icon: Icon }) => (
                    <div key={label} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                      <Icon className="w-4 h-4 text-orange-400 mb-2" />
                      <p className="text-2xl font-bold text-white">{value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-700/50 pt-6">
                  <p className="text-xs text-slate-400 mb-3">Sectores que atendemos</p>
                  <div className="flex flex-wrap gap-2">
                    {SECTORES.map((s) => (
                      <span key={s} className="text-xs bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICIOS ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-3">Servicios</p>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Soluciones integrales de combustible industrial</h2>
            <p className="text-slate-500 leading-relaxed">
              Cubrimos todo el ciclo de abastecimiento: desde el transporte y despacho hasta la
              instalación y certificación de estanques de almacenamiento.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICIOS.map((s, i) => {
              const Icon = SERVICIO_ICONS[i] ?? Fuel;
              return (
                <Link
                  key={s.slug}
                  href={`/servicios/${s.slug}`}
                  className="group relative bg-white border border-slate-200 hover:border-orange-200 rounded-2xl p-7 transition-all hover:shadow-lg hover:shadow-orange-500/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center mb-5 transition-colors">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.nombre}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{s.descripcion}</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-orange-500 group-hover:gap-2.5 transition-all">
                    Ver detalle <ArrowRight className="w-4 h-4" />
                  </div>
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-7 right-7 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── POR QUÉ FENICE ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-3">Por qué elegirnos</p>
              <h2 className="text-3xl font-bold text-slate-900 mb-5">
                Un proveedor de combustible que entiende tu operación
              </h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Trabajamos con empresas que no pueden permitirse interrupciones. Por eso
                operamos con trato directo, despachos confiables y documentación completa en
                cada entrega.
              </p>
              <p className="text-slate-500 leading-relaxed mb-8">
                Desde nuestra base en La Granja cubrimos toda la RM, Valparaíso y Rancagua con
                tiempos de respuesta que la gran distribución no puede ofrecer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/nosotros"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Conocer la empresa <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  Solicitar cotización
                </Link>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {TRUST_POINTS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-orange-200 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COBERTURA ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-3">Cobertura</p>
              <h2 className="text-3xl font-bold text-slate-900">Despacho en toda la Región Metropolitana</h2>
            </div>
            <Link href="/cobertura" className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 whitespace-nowrap transition-colors">
              Ver todas las zonas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMUNAS.map((c) => (
              <Link
                key={c.slug}
                href={`/cobertura/petroleo-a-domicilio-${c.slug}`}
                className="group flex items-center justify-between bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl px-4 py-3 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 shrink-0 transition-colors" />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{c.nombre}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-orange-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none select-none">
                  <span className="font-semibold text-slate-800 text-sm pr-4">{item.q}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/preguntas-frecuentes" className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
              Ver todas las preguntas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-4">¿Listo para cotizar?</p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Solicita tu despacho de petróleo hoy
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Respondemos en minutos. Coordinamos a tu horario. Despacho para empresas en toda la RM.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              Cotizar por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm"
            >
              Formulario de contacto
            </Link>
            <a href={`tel:${SITE_CONFIG.telefono}`} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
              <Phone className="w-4 h-4" /> {SITE_CONFIG.telefono}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
