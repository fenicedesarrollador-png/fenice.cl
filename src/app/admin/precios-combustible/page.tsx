import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import PreciosEditor, { VisibilidadGlobal } from "./PreciosEditor";
import { Fuel, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPreciosCombustiblePage() {
  if (!hasUsableSupabasePublicConfig()) {
    return (
      <div className="p-10 text-center text-slate-500">
        Supabase no configurado. Agrega las variables de entorno para usar esta sección.
      </div>
    );
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: prices, error }, { data: visRow }] = await Promise.all([
    supabase.from("fuel_prices").select("*").order("display_order", { ascending: true }),
    supabase.from("configuracion_sitio").select("valor").eq("clave", "precios_visibles").maybeSingle(),
  ]);
  const preciosVisibles = (visRow?.valor ?? "true") !== "false";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-7 admin-rise">
      {/* Page header */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-[#f5a623]/12 border border-[#f5a623]/20 flex items-center justify-center shrink-0">
          <Fuel className="w-5 h-5 text-[#b87608]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0a1628] tracking-tight leading-tight">Precios de combustible</h1>
          <p className="text-[13px] text-slate-500 mt-0.5 font-medium">Edita y publica los precios que se muestran en el sitio.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Error al cargar precios: {error.message}
        </div>
      )}

      {!error && (!prices || prices.length === 0) && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-4 text-sm">
          <p className="font-semibold mb-1">No hay registros en la tabla <code>fuel_prices</code>.</p>
          <p>Ejecuta el archivo <code>supabase/migration_fuel_prices.sql</code> en tu Supabase SQL Editor para crear e inicializar la tabla.</p>
        </div>
      )}

      {prices && prices.length > 0 && (
        <div className="space-y-6">
          {/* Toggle global de visibilidad de la sección en la web */}
          <VisibilidadGlobal visible={preciosVisibles} />
          <PreciosEditor initialPrices={prices} />
        </div>
      )}

      {/* How-to note */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-500">
        <p className="font-semibold text-slate-700 mb-1">¿Cómo funciona?</p>
        <ul className="list-disc list-inside space-y-1">
          <li>El interruptor superior <strong>muestra u oculta toda la sección de precios</strong> de la web pública (el catálogo de productos no se ve afectado).</li>
          <li>La <strong>fecha de caducidad</strong> es interna: al vencer, ese precio desaparece automáticamente del sitio hasta que se actualice.</li>
          <li><strong>Alertas por correo:</strong> a las 10:00 del día anterior al vencimiento se envía un aviso a los correos internos (ventas, Rubén, Cecilia y Erika).</li>
          <li>La <strong>publicación programada</strong> reemplaza el precio actual por el nuevo en la fecha/hora indicada, de forma automática (~1 min de precisión).</li>
          <li>Deja el campo <strong>Precio vacío</strong> para mostrar &quot;Consultar disponibilidad&quot;; desactiva <strong>Visible</strong> para ocultar solo ese combustible.</li>
          <li>Al guardar, los cambios se publican inmediatamente en el sitio web.</li>
        </ul>
      </div>
    </div>
  );
}
