import type { Metadata } from "next";
import { Handshake } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../_components/ui";
import { ADMIN_COLLABORATOR_COLUMNS, type Collaborator } from "@/lib/collaborators";
import ColaboradoresManager from "./_ColaboradoresManager";

export const metadata: Metadata = { title: "Colaboradores" };

// El panel siempre debe mostrar el estado real de la tabla, nunca una copia
// cacheada: la gestión posterior ocurre en el cliente sin recargar la página.
export const dynamic = "force-dynamic";

export default async function AdminColaboradoresPage() {
  let colaboradores: Collaborator[] = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collaborators")
      .select(ADMIN_COLLABORATOR_COLUMNS)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) console.error("[colaboradores] error al listar:", error);
    if (data) colaboradores = data as Collaborator[];
  } catch (err) {
    console.error("[colaboradores] error al listar:", err);
  }

  const activos = colaboradores.filter((c) => c.is_active).length;

  return (
    <div className="admin-rise mx-auto max-w-[1200px] p-4 sm:p-6 lg:p-7">
      <PageHeader
        icon={Handshake}
        accent="green"
        title="Colaboradores"
        subtitle={`${colaboradores.length} empresa${colaboradores.length !== 1 ? "s" : ""} asociada${
          colaboradores.length !== 1 ? "s" : ""
        } · ${activos} visible${activos !== 1 ? "s" : ""} en el carrusel de la Home`}
      />
      <ColaboradoresManager initial={colaboradores} />
    </div>
  );
}
