import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ClienteForm from "../../_ClienteForm";
export const metadata: Metadata = { title: "Editar Cliente" };
export default async function EditarClientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let cliente = null;
  try { const supabase = await createClient(); const { data } = await supabase.from("clientes").select("*").eq("id", id).single(); if (data) cliente = data; } catch {}
  if (!cliente) notFound();
  return <div className="max-w-2xl"><h1 className="text-2xl font-bold text-gray-900 mb-6">Editar cliente</h1><ClienteForm cliente={cliente} /></div>;
}
