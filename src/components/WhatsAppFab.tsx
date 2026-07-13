import { whatsappUrl } from "@/lib/config";

// Boton flotante de WhatsApp (abajo a la derecha). Abre un chat con la empresa
// con un mensaje de cotizacion prellenado. Queda por debajo del loader (que usa
// un z-index altisimo), asi que no se ve durante la pantalla de carga.
const WA_MESSAGE = "Hola Fenice, quisiera cotizar con ustedes.";

export default function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(WA_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Cotizar por WhatsApp"
      data-analytics-id="fab_whatsapp"
      data-analytics-label="WhatsApp flotante"
      data-analytics-cta="whatsapp"
      className="group fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6"
    >
      {/* Tooltip (solo desktop) */}
      <span className="pointer-events-none absolute right-[4.25rem] top-1/2 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-lg bg-[#0a1628] px-3 py-2 text-sm font-semibold text-white opacity-0 shadow-xl transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
        Cotiza por WhatsApp
        <span className="absolute right-[-4px] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-45 bg-[#0a1628]" />
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center">
        {/* Anillo pulsante para llamar la atencion (se detiene si el usuario prefiere menos movimiento) */}
        <span
          aria-hidden="true"
          className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-60 motion-safe:animate-ping"
        />
        <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.856L0 24l6.335-1.509A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.81 9.81 0 01-5.003-1.371l-.359-.214-3.754.894.954-3.652-.234-.374A9.785 9.785 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
