import type { Metadata } from "next";
import ClienteForm from "../_ClienteForm";
import { FormPageHeader } from "../../_components/ui";

export const metadata: Metadata = { title: "Nuevo Cliente" };

export default function NuevoClientePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl mx-auto admin-rise">
      <FormPageHeader title="Agregar cliente" subtitle="Suma una empresa o logo al sitio" backHref="/admin/clientes" />
      <ClienteForm />
    </div>
  );
}
