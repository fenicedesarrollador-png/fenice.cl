import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DeleteButton from "../_components/DeleteButton";
import { PageHeader, PrimaryLink, Badge, EmptyState } from "../_components/ui";
import { Plus, Tag, Star, Calendar } from "lucide-react";

export const metadata: Metadata = { title: "Promociones" };

export default async function AdminPromocionesPage() {
  let promos: {
    id: string; titulo: string; descripcion?: string;
    fecha_inicio: string; fecha_fin: string; activo: boolean; destacado: boolean;
    descuento_texto?: string; codigo?: string;
  }[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("promociones").select("id, titulo, descripcion, fecha_inicio, fecha_fin, activo, destacado, descuento_texto, codigo").order("created_at", { ascending: false });
    if (data) promos = data;
  } catch {}

  const activas = promos.filter((p) => p.activo).length;
  const destacadas = promos.filter((p) => p.destacado).length;
  const isVigente = (i: string, f: string) => { const n = new Date(); return new Date(i) <= n && new Date(f) >= n; };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1100px] mx-auto admin-rise">
      <PageHeader icon={Tag} accent="pink" title="Promociones" subtitle={`${promos.length} promocion${promos.length !== 1 ? "es" : ""} · ${activas} activa${activas !== 1 ? "s" : ""}`}>
        <PrimaryLink href="/admin/promociones/nuevo" icon={Plus}>Nueva promo</PrimaryLink>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Total", value: promos.length, color: "text-[#0a1628]" },
          { label: "Activas", value: activas, color: "text-[#1a6b3c]" },
          { label: "Destacadas", value: destacadas, color: "text-[#d98a0e]" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] leading-none font-black tabular-nums ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {promos.length === 0 ? (
        <EmptyState icon={Tag} title="Aún no hay promociones" description="Crea campañas con descuentos y códigos." action={{ href: "/admin/promociones/nuevo", label: "Crear promoción" }} />
      ) : (
        <div className="space-y-2.5">
          {promos.map((p) => {
            const vigente = isVigente(p.fecha_inicio, p.fecha_fin);
            return (
              <div key={p.id} className={`admin-card p-3.5 flex items-center gap-3 transition-all hover:shadow-md ${!p.activo ? "opacity-65" : ""}`}>
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 text-pink-500"><Tag className="w-4.5 h-4.5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {p.destacado && <Star className="w-3.5 h-3.5 text-[#f5a623] fill-[#f5a623] shrink-0" />}
                    <p className="font-black text-[#0a1628] text-sm line-clamp-1">{p.titulo}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {p.descuento_texto && <span className="text-[10px] bg-[#fff7ec] text-[#b87608] font-black px-1.5 py-0.5 rounded-md border border-[#f5a623]/20">{p.descuento_texto}</span>}
                    {p.codigo && <span className="text-[10px] font-mono bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-md tracking-wider">{p.codigo}</span>}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.fecha_inicio).toLocaleDateString("es-CL", { dateStyle: "short" })} → {new Date(p.fecha_fin).toLocaleDateString("es-CL", { dateStyle: "short" })}</span>
                    {vigente && p.activo && <span className="text-[10px] text-[#1a6b3c] font-black">● En curso</span>}
                  </div>
                </div>
                <div className="hidden sm:block shrink-0"><Badge tone={p.activo ? "green" : "neutral"} dot>{p.activo ? "Activa" : "Inactiva"}</Badge></div>
                <div className="flex items-center gap-1 shrink-0">
                  <DeleteButton table="promociones" id={p.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
