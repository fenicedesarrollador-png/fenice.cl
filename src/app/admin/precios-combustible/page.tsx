import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasUsableSupabasePublicConfig } from "@/lib/supabase/config";
import PreciosEditor from "./PreciosEditor";
import { Fuel, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPreciosCombustiblePage() {
  if (!hasUsableSupabasePublicConfig()) {
    return (
      <div className="p-10 text-center text-slate-400">
        Supabase no configurado. Agrega las variables de entorno para usar esta sección.
      </div>
    );
  }

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: prices, error } = await supabase
    .from("fuel_prices")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#f5a623]/10 border border-[#f5a623]/20 flex items-center justify-center">
          <Fuel className="w-5 h-5 text-[#f5a623]" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a1628] leading-tight">Precios de combustible</h1>
          <p className="text-sm text-slate-500 mt-0.5">Edita y publica los precios que se muestran en el sitio web.</p>
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
        <PreciosEditor initialPrices={prices} />
      )}

      {/* How-to note */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm text-slate-500">
        <p className="font-semibold text-slate-600 mb-1">¿Cómo funciona?</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Deja el campo <strong>Precio vacío</strong> para mostrar "Consultar disponibilidad".</li>
          <li>Desactiva <strong>Visible en el sitio</strong> para ocultar un producto sin eliminarlo.</li>
          <li>Desactiva <strong>Disponible</strong> para mostrar la tarjeta pero marcarla sin stock.</li>
          <li>Al guardar se publica inmediatamente en el sitio web.</li>
        </ul>
      </div>
    </div>
  );
}
