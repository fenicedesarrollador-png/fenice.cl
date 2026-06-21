"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Search, X, Star, Edit2, Trash2, Package, ToggleLeft, ToggleRight, ArrowUpRight, AlertTriangle,
} from "lucide-react";

type Producto = {
  id: string; nombre: string; categoria?: string;
  activo: boolean; destacado: boolean; slug: string; imagen_url?: string;
};

export default function ProductosTable({ productos: initial }: { productos: Producto[] }) {
  const [productos, setProductos] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterActivo, setFilterActivo] = useState<"todos" | "activos" | "inactivos">("todos");
  const [toggling, setToggling] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = productos;
    if (filterActivo === "activos") r = r.filter((p) => p.activo);
    if (filterActivo === "inactivos") r = r.filter((p) => !p.activo);
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((p) => p.nombre.toLowerCase().includes(q) || p.categoria?.toLowerCase().includes(q) || p.slug.includes(q));
    }
    return r;
  }, [productos, search, filterActivo]);

  async function toggleActivo(id: string, current: boolean) {
    setToggling(id);
    const { error } = await createClient().from("productos").update({ activo: !current }).eq("id", id);
    if (!error) setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, activo: !current } : p)));
    setToggling(null);
  }
  async function del(id: string) {
    setDeleting(id);
    await createClient().from("productos").delete().eq("id", id);
    setProductos((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null); setConfirmDel(null);
  }

  const activos = productos.filter((p) => p.activo).length;
  const destacados = productos.filter((p) => p.destacado).length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: productos.length, color: "text-[#0a1628]" },
          { label: "Activos", value: activos, color: "text-[#1a6b3c]" },
          { label: "Destacados", value: destacados, color: "text-[#d98a0e]" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto, categoría…" className="admin-input !pl-10 !pr-9" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2">
          {(["todos", "activos", "inactivos"] as const).map((f) => (
            <button key={f} onClick={() => setFilterActivo(f)} className={`px-3.5 py-2 rounded-xl text-[12px] font-bold transition-all border capitalize ${filterActivo === f ? "bg-[#1a6b3c] text-white border-[#1a6b3c] shadow-sm shadow-[#1a6b3c]/20" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 admin-card border-dashed">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3"><Package className="w-6 h-6 text-slate-300" /></div>
          <p className="text-[#0a1628] font-bold text-sm">{productos.length === 0 ? "Aún no hay productos" : "Sin resultados"}</p>
          <p className="text-slate-400 text-xs mt-1">{productos.length === 0 ? "Crea tu primer producto del catálogo." : "Ajusta la búsqueda o filtros."}</p>
          {productos.length === 0 && <Link href="/admin/productos/nuevo" className="admin-btn-primary mt-4 !text-xs !py-2 !px-4">Crear producto</Link>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <div key={p.id} className={`admin-card overflow-hidden group transition-all hover:shadow-md ${!p.activo ? "opacity-70" : ""}`}>
              <div className="flex items-center gap-3 p-3.5">
                {p.imagen_url ? (
                  <img src={p.imagen_url} alt={p.nombre} className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0"><Package className="w-5 h-5 text-slate-300" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#0a1628] text-sm truncate">{p.nombre}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {p.categoria && <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-md">{p.categoria}</span>}
                    {p.destacado && <span className="inline-flex items-center gap-0.5 text-[10px] text-[#d98a0e] font-bold"><Star className="w-2.5 h-2.5 fill-current" />Destacado</span>}
                  </div>
                </div>
              </div>
              <div className="px-3.5 py-2.5 border-t border-slate-50 flex items-center gap-1.5">
                <button onClick={() => toggleActivo(p.id, p.activo)} disabled={toggling === p.id} className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-lg border transition-all disabled:opacity-50 ${p.activo ? "bg-[#ecfdf3] text-[#1a6b3c] border-[#1a6b3c]/20" : "bg-slate-50 text-slate-500 border-slate-200"}`}>
                  {p.activo ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  {p.activo ? "Activo" : "Inactivo"}
                </button>
                <div className="ml-auto flex items-center gap-1">
                  <Link href={`/admin/productos/${p.id}/editar`} className="p-1.5 rounded-lg text-slate-400 hover:text-[#1a6b3c] hover:bg-[#ecfdf3] transition-all" title="Editar"><Edit2 className="w-3.5 h-3.5" /></Link>
                  <a href={`/productos/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all" title="Ver"><ArrowUpRight className="w-3.5 h-3.5" /></a>
                  {confirmDel === p.id ? (
                    <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      <button onClick={() => del(p.id)} disabled={deleting === p.id} className="text-[10px] text-red-600 font-bold">{deleting === p.id ? "…" : "Sí"}</button>
                      <button onClick={() => setConfirmDel(null)} className="text-slate-400"><X className="w-3 h-3" /></button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDel(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Eliminar"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
