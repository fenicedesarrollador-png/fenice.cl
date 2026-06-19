import type { Metadata } from "next";
import ProductoForm from "../_ProductoForm";

export const metadata: Metadata = { title: "Nuevo Producto" };

export default function NuevoProductoPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nuevo producto</h1>
      <ProductoForm />
    </div>
  );
}
