import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { PageHeader, PrimaryLink, EmptyState } from "../_components/ui";
import { Users, Plus, Edit2, Mail, UserRound } from "lucide-react";

export const metadata: Metadata = { title: "Equipo" };

export default async function AdminEquipoPage() {
  let miembros: {
    id: string; nombre: string; cargo: string; email?: string;
    foto_url?: string; bio?: string; activo: boolean; orden: number;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("equipo")
      .select("id, nombre, cargo, email, foto_url, bio, activo, orden")
      .order("orden");
    if (data) miembros = data;
  } catch {}

  const activos = miembros.filter((m) => m.activo).length;

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader
        icon={Users}
        accent="amber"
        title="Equipo"
        subtitle={`${miembros.length} miembro${miembros.length !== 1 ? "s" : ""} · ${activos} visible${activos !== 1 ? "s" : ""} en /nosotros`}
      >
        <PrimaryLink href="/admin/equipo/nuevo" icon={Plus}>Agregar miembro</PrimaryLink>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: miembros.length, color: "text-[#e8eef7]" },
          { label: "Visibles", value: activos, color: "text-[#2bbe6a]" },
          { label: "Con foto", value: miembros.filter((m) => m.foto_url).length, color: "text-[#f5a623]" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-[#94a7c2] font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {miembros.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aún no hay miembros del equipo"
          description="Ejecuta la migración migration_equipo_clientes.sql en Supabase o agrega el primer miembro."
          action={{ href: "/admin/equipo/nuevo", label: "Agregar miembro" }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {miembros.map((m) => (
            <div key={m.id} className={`admin-card overflow-hidden group transition-all hover:shadow-md ${!m.activo ? "opacity-60" : ""}`}>
              <div className="h-40 flex items-center justify-center relative border-b border-white/[0.06] bg-white/[0.03] overflow-hidden">
                <span className={`absolute top-2.5 right-2.5 z-10 w-2 h-2 rounded-full ${m.activo ? "bg-[#2bbe6a]" : "bg-slate-400"}`} title={m.activo ? "Visible" : "Oculto"} />
                {m.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- foto por URL en panel privado
                  <img src={m.foto_url} alt={m.nombre} className="absolute inset-0 w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#f5a623]/12 flex items-center justify-center">
                    <UserRound className="w-8 h-8 text-[#f5a623]" />
                  </div>
                )}
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-black text-[#e8eef7] text-sm leading-snug truncate">{m.nombre}</h3>
                    <span className="inline-block text-[10px] bg-[#f5a623]/12 text-[#f8c46a] font-bold px-1.5 py-0.5 rounded-md mt-1.5">{m.cargo}</span>
                  </div>
                  <span className="text-[10px] text-[#5f739a] font-bold shrink-0">#{m.orden}</span>
                </div>
                {m.email && (
                  <p className="flex items-center gap-1.5 text-[11px] text-[#94a7c2] mt-2 truncate">
                    <Mail className="w-3 h-3 shrink-0 text-[#5f739a]" />
                    {m.email}
                  </p>
                )}
                <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-white/[0.06]">
                  <Link href={`/admin/equipo/${m.id}/editar`} className="flex-1 inline-flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#cdd9ea] hover:text-[#2bbe6a] py-2 rounded-xl border border-white/12 hover:border-[#2bbe6a]/40 hover:bg-[#2bbe6a]/12 transition-all">
                    <Edit2 className="w-3 h-3" />Editar
                  </Link>
                  <DeleteButton table="equipo" id={m.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
