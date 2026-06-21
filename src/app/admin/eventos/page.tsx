import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { PageHeader, PrimaryLink, Badge, EmptyState, SiteLink } from "../_components/ui";
import { Plus, CalendarDays, MapPin, Edit2 } from "lucide-react";

export const metadata: Metadata = { title: "Eventos" };

export default async function AdminEventosPage() {
  let eventos: {
    id: string; titulo: string; fecha_inicio: string; fecha_fin?: string;
    ubicacion?: string; activo: boolean; slug: string; descripcion_corta?: string;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("eventos").select("id, titulo, fecha_inicio, fecha_fin, ubicacion, activo, slug, descripcion_corta").order("fecha_inicio", { ascending: false });
    if (data) eventos = data;
  } catch {}

  const activos = eventos.filter((e) => e.activo).length;
  const futuros = eventos.filter((e) => new Date(e.fecha_inicio) > new Date()).length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1100px] mx-auto admin-rise">
      <PageHeader icon={CalendarDays} accent="teal" title="Eventos" subtitle={`${eventos.length} evento${eventos.length !== 1 ? "s" : ""} · ${futuros} próximo${futuros !== 1 ? "s" : ""}`}>
        <PrimaryLink href="/admin/eventos/nuevo" icon={Plus}>Nuevo evento</PrimaryLink>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: eventos.length, color: "text-[#0a1628]" },
          { label: "Activos", value: activos, color: "text-[#1a6b3c]" },
          { label: "Próximos", value: futuros, color: "text-teal-600" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {eventos.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Aún no hay eventos" description="Programa tu primer evento." action={{ href: "/admin/eventos/nuevo", label: "Crear evento" }} />
      ) : (
        <div className="space-y-2.5">
          {eventos.map((ev) => {
            const futuro = new Date(ev.fecha_inicio) > new Date();
            return (
              <div key={ev.id} className={`admin-card p-3.5 flex items-center gap-3 transition-all hover:shadow-md ${!ev.activo ? "opacity-65" : ""}`}>
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex flex-col items-center justify-center shrink-0 text-teal-600">
                  <span className="text-[15px] font-black leading-none">{new Date(ev.fecha_inicio).getDate()}</span>
                  <span className="text-[9px] font-bold uppercase">{new Date(ev.fecha_inicio).toLocaleDateString("es-CL", { month: "short" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-[#0a1628] text-sm line-clamp-1">{ev.titulo}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {ev.ubicacion && <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{ev.ubicacion}</span>}
                    {futuro && <span className="text-[10px] text-teal-600 font-black">● Próximo</span>}
                  </div>
                </div>
                <div className="hidden sm:block shrink-0"><Badge tone={ev.activo ? "green" : "neutral"} dot>{ev.activo ? "Activo" : "Inactivo"}</Badge></div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/admin/eventos/${ev.id}/editar`} className="p-2 rounded-lg text-slate-400 hover:text-[#1a6b3c] hover:bg-[#ecfdf3] transition-all" title="Editar"><Edit2 className="w-4 h-4" /></Link>
                  {ev.slug && <SiteLink href={`/eventos/${ev.slug}`} />}
                  <DeleteButton table="eventos" id={ev.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
