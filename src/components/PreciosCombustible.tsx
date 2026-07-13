import { createClient } from "@/lib/supabase/public";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import { SITE_CONFIG } from "@/lib/config";
import { getSiteConfig, fetchWithTimeout } from "@/lib/getSiteConfig";
import { Fuel, Flame, Home, ArrowRight, Clock, CheckCircle2, AlertCircle, Tag } from "lucide-react";

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
  vence_at: string | null;
};

type FuelPromo = {
  fuel_code: string;
  titulo: string;
  descuento_tipo: "porcentaje" | "monto" | null;
  descuento_valor: number | null;
  descuento_texto: string | null;
};

/* Columnas públicas explícitas: el rol anon tiene grants por columna y NO
   puede leer precio_programado/programado_at (datos comerciales internos). */
const PUBLIC_COLUMNS =
  "id, code, name, price, unit, accent_color, is_available, is_visible, display_order, note, updated_at, vence_at";

const CODE_META: Record<string, { label: string; icon: React.ElementType }> = {
  diesel:          { label: "D",  icon: Fuel },
  kerosene:        { label: "K",  icon: Flame },
  gas_residencial: { label: "GE", icon: Home },
};

function formatPrice(price: number): string {
  return "$" + Math.round(price).toLocaleString("es-CL");
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

/** Precio con descuento aplicado, o null si el descuento no reduce el precio. */
function discountedPrice(price: number, promo: FuelPromo): number | null {
  if (!promo.descuento_tipo || promo.descuento_valor == null || promo.descuento_valor <= 0) return null;
  const d =
    promo.descuento_tipo === "porcentaje"
      ? price * (1 - promo.descuento_valor / 100)
      : price - promo.descuento_valor;
  const rounded = Math.max(0, Math.round(d));
  return rounded < price ? rounded : null;
}

/** Etiqueta corta del descuento para el badge de la tarjeta. */
function promoBadge(promo: FuelPromo): string {
  if (promo.descuento_texto?.trim()) return promo.descuento_texto.trim();
  if (promo.descuento_tipo === "porcentaje" && promo.descuento_valor) return `-${promo.descuento_valor}%`;
  if (promo.descuento_tipo === "monto" && promo.descuento_valor) return `-${formatPrice(promo.descuento_valor)}`;
  return "Oferta";
}

async function getFuelPrices(): Promise<FuelPrice[] | null> {
  if (!hasUsableSupabasePublicConfig()) return null;
  try {
    const supabase = await createClient();

    // Publica los precios programados cuya hora llegó (función SQL idempotente).
    // Con ISR de 60 s, la publicación automática tiene precisión de ~1 minuto.
    await fetchWithTimeout(supabase.rpc("aplicar_precios_programados"), 2000);

    let { data, error } = await supabase
      .from("fuel_prices")
      .select(PUBLIC_COLUMNS)
      .eq("is_visible", true)
      .order("display_order", { ascending: true });

    // Compatibilidad: si la migración de caducidad aún no se ejecutó
    // (columna vence_at inexistente), usar el esquema anterior.
    if (error) {
      const legacy = await supabase
        .from("fuel_prices")
        .select("id, code, name, price, unit, accent_color, is_available, is_visible, display_order, note, updated_at")
        .eq("is_visible", true)
        .order("display_order", { ascending: true });
      data = legacy.data as typeof data;
      error = legacy.error;
    }
    if (error || !data) return null;

    // Caducidad: un precio vencido no se muestra (se oculta automáticamente).
    const now = Date.now();
    return (data as FuelPrice[]).filter(
      (fp) => !fp.vence_at || new Date(fp.vence_at).getTime() > now,
    );
  } catch {
    return null;
  }
}

/** Promociones vigentes ligadas a un combustible (RLS filtra activo + vigencia). */
async function getFuelPromos(): Promise<Record<string, FuelPromo>> {
  if (!hasUsableSupabasePublicConfig()) return {};
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("promociones")
      .select("fuel_code, titulo, descuento_tipo, descuento_valor, descuento_texto")
      .not("fuel_code", "is", null)
      .order("created_at", { ascending: false });
    if (error || !data) return {};
    const map: Record<string, FuelPromo> = {};
    for (const p of data as FuelPromo[]) {
      // Primera (más reciente) promo por combustible.
      if (p.fuel_code && !map[p.fuel_code]) map[p.fuel_code] = p;
    }
    return map;
  } catch {
    return {};
  }
}

export default async function PreciosCombustible() {
  // Toggle global desde /admin/precios-combustible (clave precios_visibles).
  const config = await getSiteConfig();
  const preciosVisibles = (config.precios_visibles ?? "true") !== "false";

  if (!preciosVisibles) return null;

  const [prices, promos] = await Promise.all([getFuelPrices(), getFuelPromos()]);

  const showSkeletons = prices === null; // Supabase sin configurar (solo dev)
  const showPrecios = prices !== null && prices.length > 0;

  // Nada que mostrar → la sección completa desaparece.
  if (!showSkeletons && !showPrecios) return null;

  const WA_URL = `https://wa.me/${SITE_CONFIG.whatsapp_numero}?text=${encodeURIComponent("Hola, quiero solicitar un despacho de combustible.")}`;

  return (
    <section className="bg-white border-b border-slate-100" aria-label="Precios de combustible">
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

        {/* Supabase no configurado (entorno local): skeletons */}
        {showSkeletons && (
          <div className="flex flex-wrap justify-center gap-4">
            {["Diésel", "Kerosene", "Gas Envasado"].map((name) => (
              <PriceCardSkeleton key={name} name={name} />
            ))}
          </div>
        )}

        {/* Flex + justify-center: con 3 tarjetas llenan la fila; si ocultas alguna,
            las restantes quedan CENTRADAS en vez de alinearse a la izquierda. */}
        {showPrecios && (
          <div className="flex flex-wrap justify-center gap-4">
            {prices.map((fp, i) => (
              <PriceCard key={fp.id} fp={fp} index={i} waUrl={WA_URL} promo={promos[fp.code]} />
            ))}
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

function PriceCard({ fp, index, waUrl, promo }: { fp: FuelPrice; index: number; waUrl: string; promo?: FuelPromo }) {
  const meta = CODE_META[fp.code] ?? { label: fp.code.toUpperCase(), icon: Fuel };
  const Icon = meta.icon;
  const accent = fp.accent_color;

  const hasPrice = fp.is_available && fp.price !== null;
  const nuevoPrecio = hasPrice && promo ? discountedPrice(fp.price!, promo) : null;
  const enOferta = hasPrice && promo && nuevoPrecio !== null;

  return (
    <article
      className={`group relative w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] max-w-md bg-white border rounded-2xl p-5 transition-all hover:shadow-md flex flex-col gap-4 animate-fade-in ${enOferta ? "border-[#f5a623]/50 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}
      style={{ animationDelay: `${index * 80}ms` }}
      aria-label={`Precio de ${fp.name}`}
    >
      {/* Cinta de oferta */}
      {enOferta && (
        <div className="absolute -top-2.5 right-4 inline-flex items-center gap-1 bg-[#f5a623] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-sm shadow-[#f5a623]/30" role="status">
          <Tag className="w-3 h-3" aria-hidden="true" />
          {promoBadge(promo!)}
        </div>
      )}

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
            <span className="text-2xl font-black leading-none tracking-tight" style={{ color: accent }} aria-hidden="true">
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
        {enOferta && <p className="text-[11px] font-bold text-[#b87608] mt-0.5 line-clamp-1">{promo!.titulo}</p>}
      </div>

      {/* Precio */}
      <div>
        {hasPrice ? (
          enOferta ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-3xl font-black tracking-tight" style={{ color: accent }} aria-label={`Precio con descuento: ${formatPrice(nuevoPrecio!)}`}>
                {formatPrice(nuevoPrecio!)}
              </span>
              <span className="text-sm font-bold text-slate-400">{fp.unit.replace("$", "")}</span>
              <span className="text-sm font-semibold text-slate-400 line-through" aria-label={`Precio normal: ${formatPrice(fp.price!)}`}>
                {formatPrice(fp.price!)}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight" style={{ color: accent }} aria-label={`Precio: ${formatPrice(fp.price!)}`}>
                {formatPrice(fp.price!)}
              </span>
              <span className="text-sm font-bold text-slate-400">{fp.unit.replace("$", "")}</span>
            </div>
          )
        ) : (
          <span className="text-sm font-semibold text-slate-400 italic">
            {fp.is_available ? "Precio temporalmente no disponible" : "Consultar disponibilidad"}
          </span>
        )}
      </div>

      {/* Nota */}
      {fp.note && <p className="text-[11px] text-slate-400 leading-relaxed -mt-2">{fp.note}</p>}

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
    <div className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] max-w-md bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4" aria-busy="true" aria-label={`Cargando precio de ${name}`}>
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
