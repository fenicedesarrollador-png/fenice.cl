import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import LeadsTable from "./LeadsTable";
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
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) leads = data;
  } catch {}

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">Leads</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">Solicitudes de contacto del sitio web</p>
          </div>
        </div>
      </div>
      <LeadsTable leads={leads} />
    </div>
  );
}
