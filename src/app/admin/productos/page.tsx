import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { Plus, ExternalLink, Star } from "lucide-react";

export const metadata: Metadata = { title: "Productos" };

export default async function AdminProductosPage() {
  let productos: { id: string; nombre: string; categoria?: string; activo: boolean; destacado: boolean; slug: string }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("productos").select("id, nombre, categoria, activo, destacado, slug").order("created_at", { ascending: false });
    if (data) productos = data;
  } catch {}

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 text-sm mt-0.5">{productos.length} producto{productos.length !== 1 ? "s" : ""} en catálogo</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nuevo producto
        </Link>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-100 rounded-xl">
          <p className="text-slate-400 text-sm">No hay productos aún.</p>
          <Link href="/admin/productos/nuevo" className="mt-3 inline-flex items-center gap-2 text-orange-500 text-sm font-medium hover:underline">
            <Plus className="w-4 h-4" /> Crear el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {productos.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-900">{p.nombre}</div>
                    {p.destacado && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] text-amber-600 font-semibold">Destacado</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-slate-500 hidden sm:table-cell">{p.categoria || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold border ${
                      p.activo
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-green-500" : "bg-slate-400"}`} />
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/productos/${p.id}/editar`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded-lg border border-blue-100 hover:bg-blue-50 transition-all"
                      >
                        Editar
                      </Link>
                      <a
                        href={`/productos/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                        title="Ver en sitio"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <DeleteButton table="productos" id={p.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
