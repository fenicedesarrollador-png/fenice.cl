import type { Metadata } from "next";
import EquipoForm from "../_EquipoForm";
import { FormPageHeader } from "../../_components/ui";

export const metadata: Metadata = { title: "Nuevo miembro del equipo" };

export default function NuevoMiembroPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[860px] mx-auto admin-rise">
      <FormPageHeader
        title="Agregar miembro del equipo"
        subtitle="Aparecerá en la sección Equipo de la página Nosotros."
        backHref="/admin/equipo"
      />
      <EquipoForm />
    </div>
  );
}
