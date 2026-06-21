import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { PageHeader, PrimaryLink, EmptyState } from "../_components/ui";
import { Building2, Plus, Edit2, Star } from "lucide-react";

export const metadata: Metadata = { title: "Clientes" };

export default async function AdminClientesPage() {
  let clientes: {
    id: string; nombre: string; logo_url?: string;
    testimonio?: string; activo: boolean; orden: number; sector?: string;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("clientes").select("id, nombre, logo_url, testimonio, activo, orden, sector").order("orden");
    if (data) clientes = data;
  } catch {}

  const activos = clientes.filter((c) => c.activo).length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader icon={Building2} accent="green" title="Clientes" subtitle={`${clientes.length} empresa${clientes.length !== 1 ? "s" : ""} · ${activos} activa${activos !== 1 ? "s" : ""} en el sitio`}>
        <PrimaryLink href="/admin/clientes/nuevo" icon={Plus}>Agregar cliente</PrimaryLink>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: clientes.length, color: "text-[#0a1628]" },
          { label: "Activos", value: activos, color: "text-[#1a6b3c]" },
          { label: "Con testimonio", value: clientes.filter((c) => c.testimonio).length, color: "text-[#d98a0e]" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {clientes.length === 0 ? (
        <EmptyState icon={Building2} title="Aún no hay clientes" description="Agrega empresas y logos que aparecen en el sitio." action={{ href: "/admin/clientes/nuevo", label: "Agregar cliente" }} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {clientes.map((c) => (
            <div key={c.id} className={`admin-card overflow-hidden group transition-all hover:shadow-md ${!c.activo ? "opacity-60" : ""}`}>
              <div className="bg-slate-50/80 h-24 flex items-center justify-center px-6 relative border-b border-slate-100">
                <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full ${c.activo ? "bg-[#1a6b3c]" : "bg-slate-300"}`} title={c.activo ? "Activo" : "Inactivo"} />
                {c.logo_url ? (
                  <img src={c.logo_url} alt={c.nombre} className="max-h-14 max-w-full object-contain" width={160} height={56} />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#ecfdf3] flex items-center justify-center"><span className="text-lg font-black text-[#1a6b3c]">{c.nombre.slice(0, 2).toUpperCase()}</span></div>
                )}
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-black text-[#0a1628] text-sm leading-snug">{c.nombre}</h3>
                  <span className="text-[10px] text-slate-300 font-bold shrink-0">#{c.orden}</span>
                </div>
                {c.sector && <span className="inline-block text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-md mt-1.5">{c.sector}</span>}
                {c.testimonio && (
                  <div className="flex items-start gap-1.5 mt-2">
                    <Star className="w-3 h-3 text-[#f5a623] fill-[#f5a623] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{c.testimonio}</p>
                  </div>
                )}
                <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-50">
                  <Link href={`/admin/clientes/${c.id}/editar`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-[#1a6b3c] py-2 rounded-xl border border-slate-200 hover:border-[#1a6b3c]/30 hover:bg-[#ecfdf3] transition-all"><Edit2 className="w-3 h-3" />Editar</Link>
                  <DeleteButton table="clientes" id={c.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
