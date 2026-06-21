import type { Metadata } from "next";
import EventoForm from "../_EventoForm";
import { FormPageHeader } from "../../_components/ui";

export const metadata: Metadata = { title: "Nuevo Evento" };

export default function NuevoEventoPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl mx-auto admin-rise">
      <FormPageHeader title="Nuevo evento" subtitle="Programa un evento para el sitio" backHref="/admin/eventos" />
      <EventoForm />
    </div>
  );
}
