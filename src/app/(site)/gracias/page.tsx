import type { Metadata } from "next";
import Link from "next/link";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Gracias por tu mensaje",
  description: "Recibimos tu cotización. Te contactaremos a la brevedad.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center py-20 bg-white" data-analytics-section="gracias">
      <div className="max-w-xl mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          ¡Gracias por contactarnos!
        </h1>
        <p className="text-gray-600 mb-2 leading-relaxed">
          Recibimos tu cotización. Nuestro equipo la revisará y te contactará a la brevedad
          en horario Lun-Vie 09:00–19:00.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Si necesitas respuesta más rápida, escríbenos por WhatsApp.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <WhatsAppButton
            mensaje="Hola, acabo de enviar un formulario de cotización en fenice.cl."
            analyticsId="gracias_whatsapp"
          />
          <Link
            href="/"
            data-analytics-id="gracias_volver_inicio"
            data-analytics-label="Volver al inicio"
            data-analytics-cta="secondary_navigation"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
