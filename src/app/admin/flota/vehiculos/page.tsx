import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "../../_components/DeleteButton";
import { PageHeader, PrimaryLink, EmptyState } from "../../_components/ui";
import { Truck, Plus, Edit2, FileText } from "lucide-react";
import { formatLiters, type FleetVehicleRow } from "@/lib/fleet";

export const metadata: Metadata = { title: "Vehículos de la flota" };

export default async function AdminFlotaVehiculosPage() {
  let vehiculos: FleetVehicleRow[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("fleet_vehicles").select("*").order("display_order");
    if (data) vehiculos = data as FleetVehicleRow[];
  } catch {}

  const publicos = vehiculos.filter((v) => v.is_public && v.is_active).length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader icon={Truck} accent="green" title="Vehículos de la flota" subtitle={`${vehiculos.length} vehículo${vehiculos.length !== 1 ? "s" : ""} · ${publicos} público${publicos !== 1 ? "s" : ""} en el sitio`}>
        <Link href="/admin/flota" className="admin-btn-ghost">Documentación</Link>
        <PrimaryLink href="/admin/flota/vehiculos/nuevo" icon={Plus}>Agregar vehículo</PrimaryLink>
      </PageHeader>

      {vehiculos.length === 0 ? (
        <EmptyState icon={Truck} title="Aún no hay vehículos" description="Agrega los camiones de la flota para gestionar su documentación." action={{ href: "/admin/flota/vehiculos/nuevo", label: "Agregar vehículo" }} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {vehiculos.map((v) => (
            <div key={v.id} className={`admin-card overflow-hidden group transition-all hover:shadow-md ${!v.is_active ? "opacity-60" : ""}`}>
              <div className="bg-slate-50 h-32 flex items-center justify-center relative border-b border-slate-100 overflow-hidden">
                <span className={`absolute top-2.5 right-2.5 z-10 w-2 h-2 rounded-full ${v.is_public && v.is_active ? "bg-[#1a6b3c]" : "bg-slate-300"}`} title={v.is_public && v.is_active ? "Público" : "No público"} />
                {v.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element -- preview en panel admin privado
                  <img src={v.image_path} alt={v.plate} className="w-full h-full object-cover" />
                ) : (
                  <Truck className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-[#0a1628] text-sm leading-snug">{v.plate}</h3>
                  <span className="text-[10px] text-slate-400 font-bold shrink-0">#{v.display_order}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{[v.brand, v.model].filter(Boolean).join(" ") || "Sin marca/modelo"}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{formatLiters(v.tank_capacity_liters)} · {v.compartments ?? "—"} comp.</p>
                <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-100">
                  <Link href={`/admin/flota?vehicle=${v.id}`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-slate-700 hover:text-[#1a6b3c] py-2 rounded-xl border border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-[#1a6b3c]/12 transition-all"><FileText className="w-3 h-3" />Documentos</Link>
                  <Link href={`/admin/flota/vehiculos/${v.id}/editar`} className="p-2 rounded-lg text-slate-500 hover:text-[#1a6b3c] hover:bg-[#1a6b3c]/10 transition-all" title="Editar"><Edit2 className="w-3.5 h-3.5" /></Link>
                  <DeleteButton table="fleet_vehicles" id={v.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
