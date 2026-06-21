import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductoForm from "../../_ProductoForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar Producto" };

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let producto = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("*").eq("id", id).single();
    if (data) producto = data;
  } catch {}
  if (!producto) notFound();
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-3xl mx-auto admin-rise">
      <FormPageHeader title="Editar producto" subtitle={producto.nombre} backHref="/admin/productos" />
      <ProductoForm producto={producto} />
    </div>
  );
}
