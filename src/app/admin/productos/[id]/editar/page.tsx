import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductoForm from "../../_ProductoForm";

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar producto</h1>
      <ProductoForm producto={producto} />
    </div>
  );
}
