import { Handshake } from "lucide-react";
import { getCollaborators } from "@/lib/getContent";
import CollaboratorsCarouselClient from "./CollaboratorsCarouselClient";

/**
 * Sección pública "Colaboradores que trabajan con nosotros".
 *
 * Se alimenta de la tabla `collaborators` (editable en /admin/colaboradores).
 * Si no hay ningún colaborador activo NO se renderiza nada: no debe quedar
 * un título con un carrusel vacío.
 */
export default async function CollaboratorsSection() {
  const collaborators = await getCollaborators();
  if (collaborators.length === 0) return null;

  return (
    <section
      className="border-y border-slate-100 bg-slate-50 py-16"
      aria-labelledby="colaboradores-heading"
      data-analytics-section="colaboradores"
    >
      <div className="mx-auto mb-9 max-w-7xl px-4 text-center sm:px-6 lg:px-8" data-reveal>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1a6b3c]/20 bg-[#1a6b3c]/10 px-3 py-1">
          <Handshake className="h-3.5 w-3.5 text-[#1a6b3c]" strokeWidth={2.2} />
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#1a6b3c]">
            Colaboradores
          </p>
        </div>
        <h2
          id="colaboradores-heading"
          className="text-2xl font-extrabold leading-tight text-[#0a1628] sm:text-3xl"
        >
          Colaboradores que trabajan con nosotros
        </h2>
        <div className="mx-auto my-4 h-1 w-12 rounded-full bg-[#f5a623]" />
        <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Empresas y organizaciones que confían, colaboran y trabajan junto a Fenice.
        </p>
      </div>

      <div className="mx-auto max-w-7xl" data-reveal data-reveal-delay="120">
        <CollaboratorsCarouselClient collaborators={collaborators} />
      </div>
    </section>
  );
}
