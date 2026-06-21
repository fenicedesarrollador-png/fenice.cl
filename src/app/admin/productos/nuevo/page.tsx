import type { Metadata } from "next";
import ProductoForm from "../_ProductoForm";
import { FormPageHeader } from "../../_components/ui";

export const metadata: Metadata = { title: "Nuevo Producto" };

export default function NuevoProductoPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Nuevo producto" subtitle="Agrega un producto al catálogo del sitio" backHref="/admin/productos" />
      <ProductoForm />
    </div>
  );
}
