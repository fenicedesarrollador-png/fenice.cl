import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { Building2, Plus, Edit2, Star } from "lucide-react";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminClientesPage() {
  let clientes: {
    id: string; nombre: string; logo_url?: string;
    testimonio?: string; activo: boolean; orden: number; sector?: string;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("clientes")
      .select("id, nombre, logo_url, testimonio, activo, orden, sector")
      .order("orden");
    if (data) clientes = data;
  } catch {}

  const activos = clientes.filter((c) => c.activo).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Clientes</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {clientes.length} empresa{clientes.length !== 1 ? "s" : ""} · {activos} activa{activos !== 1 ? "s" : ""} en sitio
            </p>
          </div>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Agregar cliente</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total clientes", value: clientes.length, color: "text-slate-900" },
          { label: "Activos en sitio", value: activos, color: "text-emerald-600" },
          { label: "Con testimonio", value: clientes.filter((c) => c.testimonio).length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {clientes.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">No hay clientes aún</p>
          <Link href="/admin/clientes/nuevo" className="mt-3 inline-flex items-center gap-2 text-orange-500 text-sm font-bold hover:underline">
            <Plus className="w-4 h-4" /> Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clientes.map((c) => (
            <div
              key={c.id}
              className={`bg-white border rounded-2xl overflow-hidden transition-all hover:shadow-md hover:shadow-slate-100 group ${
                c.activo ? "border-slate-100" : "border-slate-100 opacity-60"
              }`}
            >
              {/* Logo area */}
              <div className="bg-slate-50 border-b border-slate-100 h-24 flex items-center justify-center px-6 relative">
                {c.activo ? (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-400" title="Activo" />
                ) : (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-300" title="Inactivo" />
                )}
                {c.logo_url ? (
                  <img
                    src={c.logo_url}
                    alt={c.nombre}
                    className="max-h-16 max-w-full object-contain"
                    width={160}
                    height={64}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-200 flex items-center justify-center">
                    <span className="text-xl font-black text-slate-400">
                      {c.nombre.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{c.nombre}</h3>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">#{c.orden}</span>
                </div>

                {c.sector && (
                  <span className="inline-block text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-lg mb-2">
                    {c.sector}
                  </span>
                )}

                {c.testimonio && (
                  <div className="flex items-start gap-1.5 mb-3">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{c.testimonio}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-slate-50">
                  <Link
                    href={`/admin/clientes/${c.id}/editar`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                    Editar
                  </Link>
                  <DeleteButton table="clientes" id={c.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
