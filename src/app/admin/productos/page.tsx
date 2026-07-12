import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Package } from "lucide-react";
import { PageHeader, PrimaryLink } from "../_components/ui";
import ExportButton from "../_components/ExportButton";
import ProductosTable from "./ProductosTable";

export const metadata: Metadata = { title: "Productos" };

export default async function AdminProductosPage() {
  let productos: {
    id: string; nombre: string; categoria?: string;
    activo: boolean; destacado: boolean; slug: string; imagen_url?: string;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("id, nombre, categoria, activo, destacado, slug, imagen_url").order("created_at", { ascending: false });
    if (data) productos = data;
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader icon={Package} accent="purple" title="Productos" subtitle={`${productos.length} producto${productos.length !== 1 ? "s" : ""} en el catálogo`}>
        <ExportButton tipo="productos" label="Excel" />
        <PrimaryLink href="/admin/productos/nuevo" icon={Package}>Nuevo producto</PrimaryLink>
      </PageHeader>
      <ProductosTable productos={productos} />
    </div>
  );
}
