import type { Metadata } from "next";
import VehiculoForm from "../../_VehiculoForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Nuevo vehículo" };

export default function NuevoVehiculoPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[860px] mx-auto admin-rise">
      <FormPageHeader
        title="Agregar vehículo"
        subtitle="Aparecerá en la sección de flota certificada de la Home."
        backHref="/admin/flota/vehiculos"
      />
      <VehiculoForm />
    </div>
  );
}
