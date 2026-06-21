import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ClienteForm from "../../_ClienteForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar Cliente" };

export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let cliente = null;
  try { const supabase = await createClient(); const { data } = await supabase.from("clientes").select("*").eq("id", id).single(); if (data) cliente = data; } catch {}
  if (!cliente) notFound();
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl mx-auto admin-rise">
      <FormPageHeader title="Editar cliente" subtitle={cliente.nombre} backHref="/admin/clientes" />
      <ClienteForm cliente={cliente} />
    </div>
  );
}
