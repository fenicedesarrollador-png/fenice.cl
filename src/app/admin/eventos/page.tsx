import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
export const metadata: Metadata = { title: "Eventos" };
export default async function AdminEventosPage() {
  let eventos: { id: string; titulo: string; fecha_inicio: string; ubicacion?: string; activo: boolean; slug: string }[] = [];
  try { const supabase = await createClient(); const { data } = await supabase.from("eventos").select("id, titulo, fecha_inicio, ubicacion, activo, slug").order("fecha_inicio", { ascending: false }); if (data) eventos = data; } catch {}
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <Link href="/admin/eventos/nuevo" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">+ Nuevo evento</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200"><tr>
            <th className="text-left px-4 py-3 text-gray-600 font-medium">Título</th>
            <th className="text-left px-4 py-3 text-gray-600 font-medium hidden sm:table-cell">Fecha</th>
            <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
            <th className="text-right px-4 py-3 text-gray-600 font-medium">Acciones</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {eventos.map((ev) => (
              <tr key={ev.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{ev.titulo}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{new Date(ev.fecha_inicio).toLocaleDateString("es-CL")}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ev.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{ev.activo ? "Activo" : "Inactivo"}</span></td>
                <td className="px-4 py-3 text-right"><div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/eventos/${ev.id}/editar`} className="text-blue-600 hover:underline text-xs font-medium">Editar</Link>
                  <DeleteButton table="eventos" id={ev.id} />
                </div></td>
              </tr>
            ))}
            {eventos.length === 0 && <tr><td colSpan={4} className="px-4 py-16 text-center text-gray-400">No hay eventos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
