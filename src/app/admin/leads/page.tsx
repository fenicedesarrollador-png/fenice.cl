import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage() {
  let leads: { id: string; nombre: string; email?: string; telefono?: string; comuna?: string; tipo_operacion?: string; volumen?: string; mensaje?: string; estado: string; created_at: string }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) leads = data;
  } catch {}

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-slate-500 text-sm mt-0.5">Solicitudes del formulario de contacto</p>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
