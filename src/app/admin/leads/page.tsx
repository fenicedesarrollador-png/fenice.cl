import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";
import { PageHeader } from "../_components/ui";
import { Inbox } from "lucide-react";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage() {
  let leads: {
    id: string; nombre: string; email?: string; telefono?: string;
    comuna?: string; tipo_operacion?: string; volumen?: string;
    mensaje?: string; estado: string; created_at: string; notas?: string;
  }[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) leads = data;
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader icon={Inbox} accent="green" title="Leads" subtitle="Solicitudes de contacto del sitio web" />
      <LeadsTable leads={leads} />
    </div>
  );
}
