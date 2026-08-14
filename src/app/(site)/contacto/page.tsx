import ContactForm from "./ContactForm";
import { SITE_CONFIG } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Contacto y Cotización de Combustible en Santiago",
  description:
    "Contacta a Fenice para cotizar diésel, kerosene o instalación de estanques en la RM. WhatsApp, teléfono y correo, Lun-Vie 09:00–19:00.",
  path: "/contacto",
  keywords: [
    "contacto petróleo a domicilio santiago",
    "cotizar combustible RM",
    "teléfono distribuidor de petróleo santiago",
    "whatsapp petróleo a domicilio",
  ],
});

const contactItems = [
  {
    icon: MessageCircle,
    label: "WhatsApp (canal principal)",
    value: SITE_CONFIG.telefono,
    href: `https://wa.me/${SITE_CONFIG.whatsapp_numero}`,
    analyticsId: "contacto_card_whatsapp",
    analyticsCta: "whatsapp",
    color: "text-green-500",
    bgColor: "bg-green-50",
    note: "Atención Lun-Vie 09:00–19:00",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: SITE_CONFIG.telefono,
    href: `tel:${SITE_CONFIG.telefono}`,
    analyticsId: "contacto_card_telefono",
    analyticsCta: "phone",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    note: null,
  },
  {
    icon: Mail,
    label: "Correo comercial",
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
    analyticsId: "contacto_card_email",
    analyticsCta: "email",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    note: "Cotizaciones, consultas comerciales y seguimiento",
  },
  {
    icon: Mail,
    label: "Correo de finanzas",
    value: SITE_CONFIG.email_finanzas,
    href: `mailto:${SITE_CONFIG.email_finanzas}`,
    analyticsId: "contacto_card_email_finanzas",
    analyticsCta: "email",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    note: "Comprobantes de pago, facturación y documentación",
  },
  {
    icon: MapPin,
    label: "Dirección comercial",
    value: SITE_CONFIG.direccion,
    href: null,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    note: null,
  },
  {
    icon: Clock,
    label: "Horario de atención",
    value: SITE_CONFIG.horario,
    href: null,
    color: "text-slate-500",
    bgColor: "bg-slate-50",
    note: null,
  },
];

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-20 relative overflow-hidden" data-analytics-section="contacto_hero">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-orange-500" />
            <span className="text-orange-400 text-xs font-semibold uppercase tracking-widest">Contacto</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Cotiza ahora
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Petróleo a domicilio, transporte de combustible e instalación de estanques.
            Confirma precio y disponibilidad por WhatsApp en nuestro horario de atención.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white" data-analytics-section="contacto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 items-start">

            {/* Datos de contacto */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Canales de contacto</h2>

              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                  <div className={`w-10 h-10 rounded-lg ${item.bgColor} flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        data-analytics-id={item.analyticsId}
                        data-analytics-label={item.label}
                        data-analytics-cta={item.analyticsCta}
                        className="text-sm font-semibold text-slate-800 hover:text-orange-600 transition-colors break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                    )}
                    {item.note && <p className="text-xs text-green-600 font-medium mt-0.5">{item.note}</p>}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA destacado */}
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero cotizar petróleo a domicilio para mi empresa.")}`}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="contacto_whatsapp_principal"
                data-analytics-label="Abrir WhatsApp"
                data-analytics-cta="whatsapp"
                className="flex items-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white px-5 py-4 rounded-xl transition-colors mt-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                <div>
                  <p className="font-bold text-sm">Abrir WhatsApp</p>
                  <p className="text-green-100 text-xs">Consulta precio y disponibilidad</p>
                </div>
              </a>
            </div>

            {/* Formulario */}
            <div className="lg:col-span-3">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8" data-analytics-section="formulario_contacto">
                <h2 className="text-xl font-bold text-slate-900 mb-1">Formulario de cotización</h2>
                <p className="text-slate-500 text-sm mb-6">Revisamos tu solicitud dentro del horario de atención informado.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
