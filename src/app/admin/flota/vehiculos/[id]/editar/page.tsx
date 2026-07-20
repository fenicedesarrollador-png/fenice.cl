import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import VehiculoForm from "../../../_VehiculoForm";
import { FormPageHeader } from "../../../../_components/ui";
import type { FleetVehicleRow } from "@/lib/fleet";

export const metadata: Metadata = { title: "Editar vehículo" };

export default async function EditarVehiculoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let vehiculo: FleetVehicleRow | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("fleet_vehicles").select("*").eq("id", id).single();
    if (data) vehiculo = data as FleetVehicleRow;
  } catch {}
  if (!vehiculo) notFound();

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[860px] mx-auto admin-rise">
      <FormPageHeader title="Editar vehículo" subtitle={vehiculo.plate} backHref="/admin/flota/vehiculos" />
      <VehiculoForm vehiculo={vehiculo} />
    </div>
  );
}
