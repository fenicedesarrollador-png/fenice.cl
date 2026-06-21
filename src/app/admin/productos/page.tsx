import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import ProductosTable from "./ProductosTable";

export const metadata: Metadata = { title: "Productos" };

export default async function AdminProductosPage() {
  let productos: {
    id: string; nombre: string; categoria?: string;
    activo: boolean; destacado: boolean; slug: string; imagen_url?: string;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("productos")
      .select("id, nombre, categoria, activo, destacado, slug, imagen_url")
      .order("created_at", { ascending: false });
    if (data) productos = data;
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Productos</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">{productos.length} producto{productos.length !== 1 ? "s" : ""} en catálogo</p>
          </div>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo producto</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      <ProductosTable productos={productos} />
    </div>
  );
}
