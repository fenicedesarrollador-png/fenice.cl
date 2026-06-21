import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { Plus, CalendarDays, MapPin, Edit2, ExternalLink } from "lucide-react";

export const metadata: Metadata = { title: "Eventos" };

export default async function AdminEventosPage() {
  let eventos: {
    id: string; titulo: string; fecha_inicio: string;
    fecha_fin?: string; ubicacion?: string; activo: boolean; slug: string;
    descripcion_corta?: string;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("eventos")
      .select("id, titulo, fecha_inicio, fecha_fin, ubicacion, activo, slug, descripcion_corta")
      .order("fecha_inicio", { ascending: false });
    if (data) eventos = data;
  } catch {}

  const activos = eventos.filter((e) => e.activo).length;
  const futuros = eventos.filter((e) => new Date(e.fecha_inicio) > new Date()).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5 text-teal-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Eventos</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              {eventos.length} evento{eventos.length !== 1 ? "s" : ""} · {activos} activo{activos !== 1 ? "s" : ""} · {futuros} próximo{futuros !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Link
          href="/admin/eventos/nuevo"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo evento</span>
          <span className="sm:hidden">Nuevo</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total eventos", value: eventos.length, color: "text-slate-900" },
          { label: "Activos", value: activos, color: "text-green-600" },
          { label: "Próximos", value: futuros, color: "text-teal-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm text-center">
            <p className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-2xl">
          <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold text-sm">No hay eventos aún</p>
          <Link href="/admin/eventos/nuevo" className="mt-3 inline-flex items-center gap-2 text-orange-500 text-sm font-bold hover:underline">
            <Plus className="w-4 h-4" /> Crear el primero
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Evento</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
                  <th className="text-center px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {eventos.map((ev) => {
                  const esFuturo = new Date(ev.fecha_inicio) > new Date();
                  return (
                    <tr key={ev.id} className={`hover:bg-slate-50/60 transition-colors ${!ev.activo ? "opacity-60" : ""}`}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900 text-sm">{ev.titulo}</p>
                        {ev.descripcion_corta && (
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{ev.descripcion_corta}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(ev.fecha_inicio).toLocaleDateString("es-CL", { dateStyle: "medium" })}
                        </div>
                        {esFuturo && (
                          <span className="text-[10px] text-teal-600 font-bold mt-0.5 block">● Próximo</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {ev.ubicacion ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="line-clamp-1">{ev.ubicacion}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl border ${
                          ev.activo
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ev.activo ? "bg-green-500" : "bg-slate-400"}`} />
                          {ev.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/eventos/${ev.id}/editar`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                          >
                            <Edit2 className="w-3 h-3" />
                            Editar
                          </Link>
                          {ev.slug && (
                            <a
                              href={`/eventos/${ev.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                              title="Ver en sitio"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <DeleteButton table="eventos" id={ev.id} />
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
            {eventos.map((ev) => {
              const esFuturo = new Date(ev.fecha_inicio) > new Date();
              return (
                <div key={ev.id} className={`bg-white border border-slate-100 rounded-2xl p-4 ${!ev.activo ? "opacity-60" : ""}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-bold text-slate-900 text-sm">{ev.titulo}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                      ev.activo ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-500"
                    }`}>
                      {ev.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <CalendarDays className="w-3 h-3 text-slate-400" />
                      {new Date(ev.fecha_inicio).toLocaleDateString("es-CL")}
                    </div>
                    {ev.ubicacion && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {ev.ubicacion}
                      </div>
                    )}
                    {esFuturo && <span className="text-[10px] text-teal-600 font-bold">● Próximo</span>}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/eventos/${ev.id}/editar`}
                      className="flex-1 text-center text-xs font-bold text-slate-700 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                      Editar
                    </Link>
                    <DeleteButton table="eventos" id={ev.id} />
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
