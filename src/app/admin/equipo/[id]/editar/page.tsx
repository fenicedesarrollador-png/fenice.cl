import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EquipoForm from "../../_EquipoForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar miembro del equipo" };

export default async function EditarMiembroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let miembro = null;
  try { const supabase = await createClient(); const { data } = await supabase.from("equipo").select("*").eq("id", id).single(); if (data) miembro = data; } catch {}
  if (!miembro) notFound();
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[860px] mx-auto admin-rise">
      <FormPageHeader title="Editar miembro" subtitle={miembro.nombre} backHref="/admin/equipo" />
      <EquipoForm miembro={miembro} />
    </div>
  );
}
