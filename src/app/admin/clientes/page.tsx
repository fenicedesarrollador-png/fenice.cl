import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminClientesPage() {
  let clientes: { id: string; nombre: string; logo_url?: string; testimonio?: string; activo: boolean; orden: number }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("clientes").select("id, nombre, logo_url, testimonio, activo, orden").order("orden");
    if (data) clientes = data;
  } catch {}

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clientes / Logos</h1>
        <Link href="/admin/clientes/nuevo" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          + Agregar cliente
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((c) => (
          <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4">
            {c.logo_url && <img src={c.logo_url} alt={c.nombre} className="h-12 object-contain mb-3" width={120} height={48} />}
            <h3 className="font-semibold text-gray-900 mb-1">{c.nombre}</h3>
            {c.testimonio && <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{c.testimonio}</p>}
            <div className="flex items-center gap-3 mt-3">
              <Link href={`/admin/clientes/${c.id}/editar`} className="text-blue-600 hover:underline text-xs font-medium">Editar</Link>
              <DeleteButton table="clientes" id={c.id} />
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${c.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {c.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
        ))}
        {clientes.length === 0 && (
          <div className="col-span-3 text-center py-16 text-gray-400">No hay clientes agregados.</div>
        )}
      </div>
    </div>
  );
}
