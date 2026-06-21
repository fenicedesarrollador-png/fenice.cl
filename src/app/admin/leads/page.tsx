import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import SolicitudesTable, { type Solicitud } from "./SolicitudesTable";
import { PageHeader } from "../_components/ui";
import { Inbox } from "lucide-react";

export const metadata: Metadata = { title: "Solicitudes" };

export default async function SolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<{ origen?: string }>;
}) {
  const { origen } = await searchParams;
  const origenInicial = origen === "cotizacion" || origen === "contacto" ? origen : "todos";

  let leads: Record<string, unknown>[] = [];
  let cotizaciones: Record<string, unknown>[] = [];

  try {
    const supabase = await createClient();
    const [leadsRes, cotRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("cotizaciones").select("*").order("created_at", { ascending: false }),
    ]);
    if (leadsRes.data) leads = leadsRes.data;
    if (cotRes.data) cotizaciones = cotRes.data;
  } catch {}

  // Normalizar ambas fuentes a un tipo común con su origen marcado
  const solicitudes: Solicitud[] = [
    ...leads.map((l): Solicitud => ({
      id: l.id as string,
      origen: "contacto",
      nombre: (l.nombre as string) ?? "",
      empresa: null,
      rut_empresa: null,
      email: (l.email as string) ?? null,
      telefono: (l.telefono as string) ?? null,
      comuna: (l.comuna as string) ?? null,
      servicio: (l.tipo_operacion as string) ?? null,
      volumen: (l.volumen as string) ?? null,
      frecuencia: null,
      mensaje: (l.mensaje as string) ?? null,
      estado: (l.estado as string) ?? "nuevo",
      notas: (l.notas as string) ?? null,
      created_at: l.created_at as string,
    })),
    ...cotizaciones.map((c): Solicitud => ({
      id: c.id as string,
      origen: "cotizacion",
      nombre: (c.nombre as string) ?? "",
      empresa: (c.empresa as string) ?? null,
      rut_empresa: (c.rut_empresa as string) ?? null,
      email: (c.email as string) ?? null,
      telefono: (c.telefono as string) ?? null,
      comuna: (c.comuna as string) ?? null,
      servicio: (c.servicio_solicitado as string) ?? null,
      volumen: (c.volumen_estimado as string) ?? null,
      frecuencia: (c.frecuencia as string) ?? null,
      mensaje: (c.mensaje as string) ?? null,
      estado: (c.estado as string) ?? "nuevo",
      notas: null,
      created_at: c.created_at as string,
    })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1200px] mx-auto admin-rise">
      <PageHeader
        icon={Inbox}
        accent="green"
        title="Solicitudes"
        subtitle="Cotizaciones y mensajes de contacto, todo en una bandeja"
      />
      <SolicitudesTable solicitudes={solicitudes} origenInicial={origenInicial} />
    </div>
  );
}
