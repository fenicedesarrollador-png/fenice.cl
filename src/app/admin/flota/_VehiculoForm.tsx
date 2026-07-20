"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUpload from "../_components/ImageUpload";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";
import { logFleetAudit } from "@/lib/admin/fleetUpload";
import { FLEET_VEHICLE_PHOTOS_BUCKET, type FleetVehicleRow } from "@/lib/fleet";

const FUEL_TYPES_SUGERIDOS = [
  "Combustible líquido Clase II",
  "Combustible líquido Clase III",
  "Petróleo diésel",
  "Kerosene",
];

export default function VehiculoForm({ vehiculo }: { vehiculo?: FleetVehicleRow }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const payload = {
      plate: (fd.get("plate") as string).trim(),
      brand: (fd.get("brand") as string).trim() || null,
      model: (fd.get("model") as string).trim() || null,
      manufacture_year: fd.get("manufacture_year") ? Number(fd.get("manufacture_year")) : null,
      tank_capacity_liters: fd.get("tank_capacity_liters") ? Number(fd.get("tank_capacity_liters")) : null,
      compartments: fd.get("compartments") ? Number(fd.get("compartments")) : null,
      authorized_fuel_type: (fd.get("authorized_fuel_type") as string).trim() || null,
      image_path: (fd.get("image_path") as string) || null,
      short_description: (fd.get("short_description") as string).trim() || null,
      is_public: fd.get("is_public") === "on",
      is_active: fd.get("is_active") === "on",
      display_order: Number(fd.get("display_order")) || 0,
    };

    if (!payload.plate) { setError("La patente es obligatoria."); setLoading(false); return; }

    const { data: saved, error: dbError } = vehiculo
      ? await supabase.from("fleet_vehicles").update({ ...payload, updated_by: user?.id ?? null }).eq("id", vehiculo.id).select("id").single()
      : await supabase.from("fleet_vehicles").insert({ ...payload, created_by: user?.id ?? null, updated_by: user?.id ?? null }).select("id").single();

    if (dbError || !saved) {
      setError(dbError?.message?.includes("duplicate") || dbError?.message?.includes("unique")
        ? "Ya existe un vehículo con esa patente."
        : (dbError?.message || "No se pudo guardar el vehículo."));
      setLoading(false);
      return;
    }

    await logFleetAudit(supabase, {
      vehicleId: saved.id,
      action: vehiculo ? "update" : "create",
      previousData: vehiculo ?? null,
      newData: payload,
      performedBy: user?.id ?? null,
    });

    await Promise.allSettled(["/"].map((p) => fetch(`/api/revalidate?path=${encodeURIComponent(p)}`, { method: "POST" })));
    router.push("/admin/flota/vehiculos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <FormSection title="Identificación">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Patente" required hint="Se normaliza automáticamente para evitar duplicados.">
            <input name="plate" type="text" required defaultValue={vehiculo?.plate} className="admin-input" placeholder="Ej: TJZV-39" />
          </Field>
          <Field label="Combustible autorizado">
            <input name="authorized_fuel_type" type="text" list="fuel-types-sugeridos" defaultValue={vehiculo?.authorized_fuel_type ?? ""} className="admin-input" placeholder="Ej: Combustible líquido Clase II" />
            <datalist id="fuel-types-sugeridos">
              {FUEL_TYPES_SUGERIDOS.map((f) => <option key={f} value={f} />)}
            </datalist>
          </Field>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Marca">
            <input name="brand" type="text" defaultValue={vehiculo?.brand ?? ""} className="admin-input" placeholder="Ej: Chevrolet" />
          </Field>
          <Field label="Modelo">
            <input name="model" type="text" defaultValue={vehiculo?.model ?? ""} className="admin-input" placeholder="Ej: FTR 1524" />
          </Field>
          <Field label="Año de fabricación">
            <input name="manufacture_year" type="number" min={1980} max={2100} defaultValue={vehiculo?.manufacture_year ?? ""} className="admin-input" />
          </Field>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Capacidad nominal del tanque (L)">
            <input name="tank_capacity_liters" type="number" min={0} defaultValue={vehiculo?.tank_capacity_liters ?? ""} className="admin-input" placeholder="Ej: 10000" />
          </Field>
          <Field label="Compartimientos">
            <input name="compartments" type="number" min={0} defaultValue={vehiculo?.compartments ?? ""} className="admin-input" placeholder="Ej: 2" />
          </Field>
        </div>
        <Field label="Descripción breve" hint="Aparece en la tarjeta pública del vehículo.">
          <textarea name="short_description" rows={2} defaultValue={vehiculo?.short_description ?? ""} className="admin-input" />
        </Field>
      </FormSection>

      <FormSection title="Fotografía">
        <ImageUpload bucket={FLEET_VEHICLE_PHOTOS_BUCKET} name="image_path" defaultUrl={vehiculo?.image_path ?? ""} label="Foto del camión" />
      </FormSection>

      <FormSection title="Publicación">
        <div className="grid sm:grid-cols-2 gap-5 items-center">
          <Field label="Orden de aparición" hint="Menor número aparece primero en la Home.">
            <input name="display_order" type="number" defaultValue={vehiculo?.display_order ?? 0} className="admin-input" />
          </Field>
          <div className="flex flex-col gap-3 sm:pt-6">
            <Toggle name="is_public" defaultChecked={vehiculo?.is_public ?? true} label="Visible públicamente" description="Aparece en la sección de flota de la Home" />
            <Toggle name="is_active" defaultChecked={vehiculo?.is_active ?? true} label="Vehículo activo" description="Desactívalo si salió de la flota" />
          </div>
        </div>
      </FormSection>

      <FormActions submitLabel={vehiculo ? "Guardar cambios" : "Agregar vehículo"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
