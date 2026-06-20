import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { SITE_CONFIG } from "@/lib/config";
import { Fuel, Flame, Home, ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";

type FuelPrice = {
  id: string;
  code: string;
  name: string;
  price: number | null;
  unit: string;
  accent_color: string;
  is_available: boolean;
  is_visible: boolean;
  display_order: number;
  note: string | null;
  updated_at: string;
};

const CODE_META: Record<string, { label: string; icon: React.ElementType; bg: string; border: string }> = {
  diesel:          { label: "D",  icon: Fuel,  bg: "bg-[#f5a623]/10", border: "border-[#f5a623]/20" },
  kerosene:        { label: "K",  icon: Flame, bg: "bg-[#ea8c00]/10", border: "border-[#ea8c00]/20" },
  gas_residencial: { label: "GE", icon: Home,  bg: "bg-[#1a6b3c]/10", border: "border-[#1a6b3c]/20" },
};

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-CL");
}

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  const time = d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  return isToday ? `Actualizado hoy, ${time}` : `Actualizado ${d.toLocaleDateString("es-CL", { day: "numeric", month: "short" })}, ${time}`;
}

async function getFuelPrices(): Promise<FuelPrice[] | null> {
  if (!hasUsableSupabasePublicConfig()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fuel_prices")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true });
    if (error) return null;
    return data as FuelPrice[];
  } catch {
    return null;
  }
}

export default async function PreciosCombustible() {
  const prices = await getFuelPrices();

  const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero solicitar un despacho de combustible.")}`;

  return (
    <section className="bg-white border-b border-slate-100" aria-label="Precios de combustible vigentes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-px w-6 bg-[#f5a623]" />
              <p className="text-[11px] font-bold text-[#f5a623] uppercase tracking-widest">Precios vigentes</p>
            </div>
            <h2 className="text-xl font-extrabold text-[#0a1628] leading-tight">
              Precios de combustible
            </h2>
          </div>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#f5a623] hover:bg-[#d4891a] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-[#f5a623]/20 shrink-0 w-fit"
            aria-label="Solicitar despacho de combustible por WhatsApp"
          >
            Solicitar despacho
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>

        {/* Error: Supabase no configurado o fallo */}
        {prices === null && (
          <div className="grid sm:grid-cols-3 gap-4">
            {["Diésel", "Kerosene", "Gas Envasado"].map((name) => (
              <PriceCardSkeleton key={name} name={name} />
            ))}
          </div>
        )}

        {/* Cards de precios */}
        {prices !== null && prices.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">No hay precios publicados actualmente.</p>
        )}

        {prices !== null && prices.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible">
            <div className="contents">
              {prices.map((fp, i) => (
                <PriceCard key={fp.id} fp={fp} index={i} waUrl={WA_URL} />
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-6 max-w-2xl mx-auto leading-relaxed">
          Valores referenciales. Confirma cobertura, condiciones y disponibilidad antes de solicitar despacho.
        </p>
      </div>
    </section>
  );
}

function PriceCard({ fp, index, waUrl }: { fp: FuelPrice; index: number; waUrl: string }) {
  const meta = CODE_META[fp.code] ?? { label: fp.code.toUpperCase(), icon: Fuel, bg: "bg-slate-100", border: "border-slate-200" };
  const Icon = meta.icon;
  const accent = fp.accent_color;

  return (
    <article
      className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 transition-all hover:shadow-md flex flex-col gap-4 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
      aria-label={`Precio de ${fp.name}`}
    >
      {/* Top row: código + icono */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
            style={{ background: `${accent}18`, borderColor: `${accent}30` }}
            aria-hidden="true"
          >
            <Icon className="w-5 h-5" style={{ color: accent }} strokeWidth={1.8} />
          </div>
          <div>
            <span
              className="text-2xl font-black leading-none tracking-tight"
              style={{ color: accent }}
              aria-hidden="true"
            >
              {meta.label}
            </span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5">
              {fp.code === "gas_residencial" ? "RESIDENCIAL" : fp.unit}
            </p>
          </div>
        </div>

        {/* Estado disponibilidad */}
        {fp.is_available ? (
          <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-full" role="status">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
            Disponible
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full" role="status">
            <AlertCircle className="w-3 h-3" aria-hidden="true" />
            Sin disponibilidad
          </span>
        )}
      </div>

      {/* Nombre */}
      <div>
        <h3 className="font-extrabold text-[#0a1628] text-base leading-tight">{fp.name}</h3>
      </div>

      {/* Precio */}
      <div className="flex items-baseline gap-1.5">
        {fp.is_available && fp.price !== null ? (
          <>
            <span
              className="text-3xl font-black tracking-tight"
              style={{ color: accent }}
              aria-label={`Precio: ${formatPrice(fp.price)} por ${fp.unit.replace("$/", "")}`}
            >
              {formatPrice(fp.price)}
            </span>
            <span className="text-sm font-bold text-slate-400">{fp.unit.replace("$", "")}</span>
          </>
        ) : (
          <span className="text-sm font-semibold text-slate-400 italic">
            {fp.is_available ? "Precio temporalmente no disponible" : "Consultar disponibilidad"}
          </span>
        )}
      </div>

      {/* Nota */}
      {fp.note && (
        <p className="text-[11px] text-slate-400 leading-relaxed -mt-2">{fp.note}</p>
      )}

      {/* Footer: updated_at + botón */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1 text-[11px] text-slate-400" aria-label={`Última actualización: ${formatUpdatedAt(fp.updated_at)}`}>
          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
          {formatUpdatedAt(fp.updated_at)}
        </span>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm"
          style={{ color: accent, borderColor: `${accent}40` }}
          aria-label={`Cotizar despacho de ${fp.name} por WhatsApp`}
        >
          Cotizar despacho
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function PriceCardSkeleton({ name }: { name: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4" aria-busy="true" aria-label={`Cargando precio de ${name}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 animate-pulse" />
          <div className="space-y-1.5">
            <div className="w-8 h-5 bg-slate-100 rounded animate-pulse" />
            <div className="w-12 h-3 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-20 h-5 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="w-32 h-4 bg-slate-100 rounded animate-pulse" />
      <div className="w-24 h-8 bg-slate-100 rounded animate-pulse" />
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="w-28 h-3 bg-slate-100 rounded animate-pulse" />
        <div className="w-24 h-6 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
