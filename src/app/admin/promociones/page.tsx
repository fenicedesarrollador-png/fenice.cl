import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { Plus, Tag, Star, Calendar, Edit2 } from "lucide-react";

export const metadata: Metadata = { title: "Promociones" };

export default async function AdminPromocionesPage() {
  let promos: {
    id: string; titulo: string; descripcion?: string;
    fecha_inicio: string; fecha_fin: string;
    activo: boolean; destacado: boolean;
    descuento?: string; codigo?: string;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("promociones")
      .select("id, titulo, descripcion, fecha_inicio, fecha_fin, activo, destacado, descuento, codigo")
      .order("created_at", { ascending: false });
    if (data) promos = data;
  } catch {}

  const activas = promos.filter((p) => p.activo).length;
  const destacadas = promos.filter((p) => p.destacado).length;

  function isVigente(inicio: string, fin: string) {
    const now = new Date();
    return new Date(inicio) <= now && new Date(fin) >= now;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pink-50 border border-pink-100 rounded-xl flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Promociones</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {promos.length} promocion{promos.length !== 1 ? "es" : ""} · {activas} activa{activas !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/admin/promociones/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nueva promo</span>
          <span className="sm:hidden">Nueva</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total", value: promos.length, color: "text-slate-900" },
          { label: "Activas", value: activas, color: "text-green-600" },
          { label: "Destacadas", value: destacadas, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {promos.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Tag className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">No hay promociones aún</p>
          <Link href="/admin/promociones/nuevo" className="mt-3 inline-flex items-center gap-2 text-orange-500 text-sm font-bold hover:underline">
            <Plus className="w-4 h-4" /> Crear la primera
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Título</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vigencia</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {promos.map((p) => {
                  const vigente = isVigente(p.fecha_inicio, p.fecha_fin);
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/60 transition-colors ${!p.activo ? "opacity-60" : ""}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          {p.destacado && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />}
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{p.titulo}</p>
                            {p.descuento && (
                              <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-lg border border-orange-100">
                                {p.descuento}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(p.fecha_inicio).toLocaleDateString("es-CL", { dateStyle: "short" })}
                            {" → "}
                            {new Date(p.fecha_fin).toLocaleDateString("es-CL", { dateStyle: "short" })}
                          </span>
                        </div>
                        {vigente && p.activo && (
                          <span className="text-[10px] text-green-600 font-bold mt-1 block">● En curso</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {p.codigo ? (
                          <span className="text-xs font-mono bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg tracking-widest">
                            {p.codigo}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                          p.activo
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.activo ? "bg-green-500" : "bg-slate-400"}`} />
                          {p.activo ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/promociones/${p.id}/editar`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                          >
                            <Edit2 className="w-3 h-3" />
                            Editar
                          </Link>
                          <DeleteButton table="promociones" id={p.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {promos.map((p) => {
              const vigente = isVigente(p.fecha_inicio, p.fecha_fin);
              return (
                <div key={p.id} className={`bg-white border border-slate-100 rounded-2xl p-4 ${!p.activo ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {p.destacado && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        <p className="font-bold text-slate-900 text-sm">{p.titulo}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {p.descuento && (
                          <span className="text-[10px] bg-orange-50 text-orange-600 font-bold px-2 py-0.5 rounded-lg">{p.descuento}</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                          p.activo ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-500"
                        }`}>
                          {p.activo ? "Activa" : "Inactiva"}
                        </span>
                        {vigente && p.activo && (
                          <span className="text-[10px] text-green-600 font-bold">● En curso</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    {new Date(p.fecha_inicio).toLocaleDateString("es-CL")} → {new Date(p.fecha_fin).toLocaleDateString("es-CL")}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/promociones/${p.id}/editar`}
                      className="flex-1 text-center text-xs font-bold text-slate-700 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                      Editar
                    </Link>
                    <DeleteButton table="promociones" id={p.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
