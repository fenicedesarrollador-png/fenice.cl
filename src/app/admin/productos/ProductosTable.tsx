"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, X, Star, ExternalLink, Edit2, Trash2, Package,
  ToggleLeft, ToggleRight,
} from "lucide-react";

type Producto = {
  id: string;
  nombre: string;
  categoria?: string;
  activo: boolean;
  destacado: boolean;
  slug: string;
  imagen_url?: string;
};

export default function ProductosTable({ productos: initialProductos }: { productos: Producto[] }) {
  const router = useRouter();
  const [productos, setProductos] = useState(initialProductos);
  const [search, setSearch] = useState("");
  const [filterActivo, setFilterActivo] = useState<"todos" | "activos" | "inactivos">("todos");
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = productos;
    if (filterActivo === "activos") result = result.filter((p) => p.activo);
    if (filterActivo === "inactivos") result = result.filter((p) => !p.activo);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.categoria?.toLowerCase().includes(q) ||
          p.slug.includes(q)
      );
    }
    return result;
  }, [productos, search, filterActivo]);

  async function toggleActivo(id: string, current: boolean) {
    setToggling(id);
    const supabase = createClient();
    const { error } = await supabase.from("productos").update({ activo: !current }).eq("id", id);
    if (!error) {
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !current } : p)));
    }
    setToggling(null);
  }

  async function deleteProducto(id: string) {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  const activos = productos.filter((p) => p.activo).length;
  const inactivos = productos.filter((p) => !p.activo).length;
  const destacados = productos.filter((p) => p.destacado).length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total", value: productos.length, color: "text-slate-900" },
          { label: "Activos", value: activos, color: "text-green-600" },
          { label: "Destacados", value: destacados, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto, categoría…"
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all placeholder:text-slate-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(["todos", "activos", "inactivos"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterActivo(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                filterActivo === f
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {f === "todos" ? `Todos (${productos.length})` : f === "activos" ? `Activos (${activos})` : `Inactivos (${inactivos})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Package className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">Sin productos</p>
          <p className="text-slate-400 text-xs mt-1">Cambia los filtros o crea un nuevo producto</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Producto</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${!p.activo ? "opacity-60" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {p.imagen_url ? (
                          <img
                            src={p.imagen_url}
                            alt={p.nombre}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{p.nombre}</p>
                          {p.destacado && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-[10px] text-amber-600 font-bold">Destacado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {p.categoria ? (
                        <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg">
                          {p.categoria}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => toggleActivo(p.id, p.activo)}
                        disabled={toggling === p.id}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all disabled:opacity-50 ${
                          p.activo
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                        }`}
                        title={p.activo ? "Click para desactivar" : "Click para activar"}
                      >
                        {p.activo ? (
                          <ToggleRight className="w-3.5 h-3.5" />
                        ) : (
                          <ToggleLeft className="w-3.5 h-3.5" />
                        )}
                        {toggling === p.id ? "…" : p.activo ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/productos/${p.id}/editar`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                        >
                          <Edit2 className="w-3 h-3" />
                          Editar
                        </Link>
                        <a
                          href={`/productos/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                          title="Ver en sitio"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteProducto(p.id)}
                          disabled={deleting === p.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-50">
            {filtered.map((p) => (
              <div key={p.id} className={`px-4 py-4 ${!p.activo ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-3 mb-3">
                  {p.imagen_url ? (
                    <img src={p.imagen_url} alt={p.nombre} className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">{p.nombre}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {p.categoria && <span className="text-[10px] text-slate-500">{p.categoria}</span>}
                      {p.destacado && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleActivo(p.id, p.activo)}
                    disabled={toggling === p.id}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                      p.activo ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}
                  >
                    {p.activo ? "Activo" : "Inactivo"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/productos/${p.id}/editar`}
                    className="flex-1 text-center text-xs font-bold text-slate-700 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteProducto(p.id)}
                    className="px-3 py-2 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
