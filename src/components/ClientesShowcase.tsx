import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { getClientes } from "@/lib/getContent";

/**
 * Franja de logos de empresas cliente (autoridad) para la Home.
 * Se alimenta de la tabla `clientes` (editable en /admin/clientes).
 * Si no hay clientes activos con logo, no se renderiza nada.
 */
export default async function ClientesShowcase() {
  const clientes = await getClientes();
  const conLogo = clientes.filter((c) => c.logo_url);
  if (conLogo.length === 0) return null;

  // Duplicamos la lista para el efecto marquee continuo.
  const marquee = [...conLogo, ...conLogo];

  return (
    <section className="py-14 bg-white border-y border-slate-100" data-analytics-section="clientes_logos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8" data-reveal>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#1a6b3c]" />
              <p className="text-xs font-bold text-[#1a6b3c] uppercase tracking-widest">
                Confían en nosotros
              </p>
            </div>
            <h2 className="text-2xl font-extrabold text-[#0a1628]">
              Empresas que abastecemos en la Región Metropolitana
            </h2>
          </div>
          <Link
            href="/clientes"
            data-analytics-id="home_ver_clientes"
            data-analytics-label="Ver empresas y proyectos"
            data-analytics-cta="secondary_navigation"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#f5a623] hover:text-[#d4891a] whitespace-nowrap transition-colors"
          >
            Ver empresas y proyectos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Marquee de logos — pausa al pasar el mouse */}
      <div className="relative overflow-hidden" aria-label="Logos de empresas cliente">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="logo-marquee items-center gap-12 py-2 px-6">
          {marquee.map((c, i) => (
            <div key={`${c.id}-${i}`} className="flex items-center justify-center shrink-0" aria-hidden={i >= conLogo.length}>
              {/* eslint-disable-next-line @next/next/no-img-element -- logos cargados por URL desde el admin (host variable) */}
              <img
                src={c.logo_url!}
                alt={`Logo de ${c.nombre}, cliente de Fenice SPA`}
                loading="lazy"
                className="h-12 sm:h-14 w-auto max-w-[160px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
