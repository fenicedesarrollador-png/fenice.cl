import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSiteConfig } from "@/lib/getSiteConfig";

interface Props {
  heading?: string;
  subheading?: string;
  mensaje?: string;
}

export default async function CTASection({
  heading = "¿Necesitas petróleo a domicilio para tu empresa?",
  subheading = "Respondemos en minutos. Coordinamos a tu horario. Despacho RM, Valparaíso y Rancagua.",
  mensaje = "Hola, quiero cotizar petróleo a domicilio para mi empresa.",
}: Props) {
  const config = await getSiteConfig();

  return (
    <section className="py-16 bg-[#0a1628]" data-analytics-section="cta">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-reveal="zoom"
          className="bg-gradient-to-br from-[#f5a623] to-[#d4891a] rounded-2xl p-8 lg:p-12 relative overflow-hidden shadow-2xl shadow-[#f5a623]/20"
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }} />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white mb-2">{heading}</h2>
              <p className="text-amber-100 text-sm lg:text-base">{subheading}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${config.whatsapp_numero}?text=${encodeURIComponent(mensaje)}`}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics-id="cta_whatsapp"
                data-analytics-label="WhatsApp"
                data-analytics-cta="whatsapp"
                className="inline-flex items-center justify-center gap-2.5 bg-[#1a6b3c] hover:bg-[#145530] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-md"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
                WhatsApp
              </a>
              <Link
                href="/cotizacion"
                data-analytics-id="cta_formulario"
                data-analytics-label="Cotizar"
                data-analytics-cta="quote"
                className="inline-flex items-center justify-center gap-2 bg-[#0a1628]/25 hover:bg-[#0a1628]/40 border border-white/25 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                Cotizar ahora <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${config.telefono}`}
                data-analytics-id="cta_telefono"
                data-analytics-label={config.telefono}
                data-analytics-cta="phone"
                className="inline-flex items-center justify-center gap-2 text-white/85 hover:text-white font-medium text-sm transition-colors"
              >
                <Phone className="w-4 h-4" /> {config.telefono}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
