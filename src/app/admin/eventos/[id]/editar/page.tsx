import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EventoForm from "../../_EventoForm";
import { FormPageHeader } from "../../../_components/ui";

export const metadata: Metadata = { title: "Editar Evento" };

export default async function EditarEventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let evento = null;
  try { const supabase = await createClient(); const { data } = await supabase.from("eventos").select("*").eq("id", id).single(); if (data) evento = data; } catch {}
  if (!evento) notFound();
  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-2xl mx-auto admin-rise">
      <FormPageHeader title="Editar evento" subtitle={evento.titulo} backHref="/admin/eventos" />
      <EventoForm evento={evento} />
    </div>
  );
}
