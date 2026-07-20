import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, PrimaryLink, StatCard } from "../_components/ui";
import FlotaDashboardTable, { type DocRow } from "./_FlotaDashboardTable";
import {
  Truck, Plus, FileText, ShieldCheck, Clock, AlertTriangle,
  ClipboardCheck, CalendarClock, FileWarning,
} from "lucide-react";
import {
  computeDocumentStatus, formatDateCL,
  type FleetVehicleRow, type FleetDocumentRow,
} from "@/lib/fleet";

export const metadata: Metadata = { title: "Documentación de flota" };

export default async function AdminFlotaPage() {
  let vehicles: FleetVehicleRow[] = [];
  let documents: FleetDocumentRow[] = [];

  try {
    const supabase = await createClient();
    const [vehiclesRes, documentsRes] = await Promise.all([
      supabase.from("fleet_vehicles").select("*").order("display_order"),
      supabase.from("fleet_documents").select("*").order("display_order"),
    ]);
    if (vehiclesRes.data) vehicles = vehiclesRes.data as FleetVehicleRow[];
    if (documentsRes.data) documents = documentsRes.data as FleetDocumentRow[];
  } catch {}

  const vehicleById = new Map(vehicles.map((v) => [v.id, v]));

  const rows: DocRow[] = documents.map((d) => {
    const v = vehicleById.get(d.vehicle_id);
    const status = computeDocumentStatus(d);
    return {
      id: d.id,
      vehicle_id: d.vehicle_id,
      plate: v?.plate ?? "—",
      vehicleLabel: v ? [v.brand, v.model].filter(Boolean).join(" ") || "Sin marca/modelo" : "Vehículo eliminado",
      document_type: d.document_type,
      title: d.title,
      folio: d.folio,
      certificate_number: d.certificate_number,
      issued_at: d.issued_at,
      expires_at: d.expires_at,
      is_public: d.is_public,
      is_active: d.is_active,
      review_status: d.review_status,
      sanitized_confirmed: d.sanitized_confirmed,
      public_file_path: d.public_file_path,
      statusKey: status.key,
    };
  });

  const activeNonHistorical = documents.filter((d) => d.is_active && !d.is_historical);
  const vehiculosPublicos = vehicles.filter((v) => v.is_public && v.is_active).length;
  const vigentes = activeNonHistorical.filter((d) => ["vigente", "vigente_advertencia"].includes(computeDocumentStatus(d).key)).length;
  const proximosAVencer = activeNonHistorical.filter((d) => computeDocumentStatus(d).key === "proximo_a_vencer").length;
  const vencidos = activeNonHistorical.filter((d) => computeDocumentStatus(d).key === "vencido").length;
  const pendientes = activeNonHistorical.filter((d) => d.review_status === "pending").length;

  const proximoVencimiento = activeNonHistorical
    .filter((d) => d.expires_at && new Date(d.expires_at) >= new Date(new Date().toDateString()))
    .sort((a, b) => (a.expires_at! < b.expires_at! ? -1 : 1))[0];

  // ── Alertas administrativas ──────────────────────────────────────────
  type Alert = { key: string; icon: typeof AlertTriangle; label: string; tone: "red" | "amber" | "blue"; href: string };
  const alerts: Alert[] = [];

  if (vencidos > 0) alerts.push({ key: "vencidos", icon: AlertTriangle, label: `${vencidos} documento${vencidos > 1 ? "s" : ""} vencido${vencidos > 1 ? "s" : ""}`, tone: "red", href: "/admin/flota?estado=vencido" });

  const d15 = activeNonHistorical.filter((d) => { const s = computeDocumentStatus(d); return s.key === "proximo_a_vencer" && s.daysUntil !== null && s.daysUntil <= 15; }).length;
  if (d15 > 0) alerts.push({ key: "d15", icon: Clock, label: `${d15} documento${d15 > 1 ? "s" : ""} vence${d15 > 1 ? "n" : ""} en 15 días o menos`, tone: "red", href: "/admin/flota" });

  const d30 = activeNonHistorical.filter((d) => { const s = computeDocumentStatus(d); return s.key === "proximo_a_vencer" && s.daysUntil !== null && s.daysUntil > 15 && s.daysUntil <= 30; }).length;
  if (d30 > 0) alerts.push({ key: "d30", icon: Clock, label: `${d30} documento${d30 > 1 ? "s" : ""} vence${d30 > 1 ? "n" : ""} en 30 días o menos`, tone: "amber", href: "/admin/flota" });

  const d60 = activeNonHistorical.filter((d) => computeDocumentStatus(d).key === "vigente_advertencia").length;
  if (d60 > 0) alerts.push({ key: "d60", icon: CalendarClock, label: `${d60} documento${d60 > 1 ? "s" : ""} vence${d60 > 1 ? "n" : ""} en 60 días o menos`, tone: "amber", href: "/admin/flota" });

  const sinPdfPublico = documents.filter((d) => d.is_public && !d.public_file_path).length;
  if (sinPdfPublico > 0) alerts.push({ key: "sinpdf", icon: FileWarning, label: `${sinPdfPublico} documento${sinPdfPublico > 1 ? "s" : ""} público${sinPdfPublico > 1 ? "s" : ""} sin PDF`, tone: "red", href: "/admin/flota" });

  const sinConfirmacion = documents.filter((d) => (d.is_public || d.review_status === "approved") && !d.sanitized_confirmed).length;
  if (sinConfirmacion > 0) alerts.push({ key: "sinconf", icon: FileWarning, label: `${sinConfirmacion} documento${sinConfirmacion > 1 ? "s" : ""} sin confirmación de sanitización`, tone: "amber", href: "/admin/flota" });

  if (pendientes > 0) alerts.push({ key: "pendientes", icon: ClipboardCheck, label: `${pendientes} documento${pendientes > 1 ? "s" : ""} pendiente${pendientes > 1 ? "s" : ""} de aprobación`, tone: "blue", href: "/admin/flota" });

  const ALERT_TONE_CLASSES: Record<string, string> = {
    red: "bg-red-50 border-red-200 text-red-700",
    amber: "bg-[#f5a623]/10 border-[#f5a623]/25 text-[#b87608]",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-7 max-w-[1280px] mx-auto space-y-5 admin-rise">
      <PageHeader icon={FileText} accent="green" title="Documentación de flota" subtitle={`${vehicles.length} vehículo${vehicles.length !== 1 ? "s" : ""} · ${documents.length} documento${documents.length !== 1 ? "s" : ""} registrados`}>
        <Link href="/admin/flota/vehiculos" className="admin-btn-ghost">
          <Truck className="w-4 h-4" /> Vehículos
        </Link>
        <PrimaryLink href="/admin/flota/documentos/nuevo" icon={Plus}>Nuevo documento</PrimaryLink>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard label="Vehículos públicos" value={vehiculosPublicos} icon={Truck} color="navy" />
        <StatCard label="Vigentes" value={vigentes} icon={ShieldCheck} color="green" />
        <StatCard label="Próximos a vencer" value={proximosAVencer} icon={Clock} color="amber" />
        <StatCard label="Vencidos" value={vencidos} icon={AlertTriangle} color="red" />
        <StatCard label="Pendientes de revisión" value={pendientes} icon={ClipboardCheck} color="blue" />
      </div>

      {proximoVencimiento && (
        <div className="admin-card px-4 py-3 flex items-center gap-3 text-[12.5px]">
          <CalendarClock className="w-4 h-4 text-[#1a6b3c] shrink-0" />
          <span className="text-slate-500">Próximo vencimiento activo: </span>
          <span className="font-bold text-[#0a1628]">{formatDateCL(proximoVencimiento.expires_at)}</span>
          <span className="text-slate-400">· {proximoVencimiento.title} ({vehicleById.get(proximoVencimiento.vehicle_id)?.plate})</span>
        </div>
      )}

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {alerts.map((a) => (
            <Link key={a.key} href={a.href} className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-[12px] font-bold transition-all hover:shadow-sm ${ALERT_TONE_CLASSES[a.tone]}`}>
              <a.icon className="w-4 h-4 shrink-0" />
              {a.label}
            </Link>
          ))}
        </div>
      )}

      {/* Tabla con filtros */}
      <FlotaDashboardTable documents={rows} vehicles={vehicles.map((v) => ({ id: v.id, plate: v.plate }))} />
    </div>
  );
}
