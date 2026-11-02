"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";
import { calculateGeneratorSupply, generatorQuoteHref, type GeneratorInput } from "@/lib/supplyPlanning";
import { whatsappUrl } from "@/lib/config";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";

const format = (value: number) => value.toLocaleString("es-CL", { maximumFractionDigits: 2 });
type Calculation = { input: GeneratorInput; result: ReturnType<typeof calculateGeneratorSupply> };

export default function GeneratorCalculator() {
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [error, setError] = useState("");
  const { trackEvent } = useAnalytics();

  function calculate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input: GeneratorInput = {
      consumption: Number(data.get("consumption")), hours: Number(data.get("hours")),
      available: Number(data.get("available")), reserve: Number(data.get("reserve")),
    };
    try {
      const result = calculateGeneratorSupply(input);
      setCalculation({ input, result });
      setError("");
      void trackEvent({ eventType: "click", elementId: "generator_calculation", sectionId: "calculadora_generador", metadata: { action: "calculate" } });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Revisa los valores ingresados.");
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8" data-analytics-section="calculadora_generador">
      <form onSubmit={calculate} onChange={() => { setCalculation(null); setError(""); }} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#0a1628] mb-2 flex items-center gap-2"><Calculator className="w-5 h-5 text-[#1a6b3c]" />Datos de tu generador</h2>
        <p className="text-sm text-slate-600 mb-6">Usa el consumo en litros por hora de la ficha del equipo para la carga prevista, o un consumo medido.</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="generator-consumption" className="block text-sm font-semibold mb-2">Consumo del equipo (L/h)</label>
            <input id="generator-consumption" name="consumption" type="number" inputMode="decimal" required min="0.001" max="10000" step="0.001" placeholder="Ej.: 12" aria-describedby="generator-consumption-help" className="w-full border border-slate-300 rounded-xl px-3 py-3 text-base" />
            <p id="generator-consumption-help" className="text-xs text-slate-500 mt-2">Los kVA por sí solos no indican el consumo.</p>
          </div>
          <div>
            <label htmlFor="generator-hours" className="block text-sm font-semibold mb-2">Horas que necesitas operar</label>
            <input id="generator-hours" name="hours" type="number" inputMode="decimal" required min="0.001" max="8760" step="0.001" placeholder="Ej.: 8" className="w-full border border-slate-300 rounded-xl px-3 py-3 text-base" />
          </div>
          <div>
            <label htmlFor="generator-available" className="block text-sm font-semibold mb-2">Combustible disponible (L)</label>
            <input id="generator-available" name="available" type="number" inputMode="decimal" required min="0" max="1000000" step="0.001" placeholder="Ej.: 100" className="w-full border border-slate-300 rounded-xl px-3 py-3 text-base" />
          </div>
          <div>
            <label htmlFor="generator-reserve" className="block text-sm font-semibold mb-2">Reserva que deseas conservar (L)</label>
            <input id="generator-reserve" name="reserve" type="number" inputMode="decimal" required min="0" max="1000000" step="0.001" defaultValue="0" aria-describedby="generator-reserve-help" className="w-full border border-slate-300 rounded-xl px-3 py-3 text-base" />
            <p id="generator-reserve-help" className="text-xs text-slate-500 mt-2">Define esta reserva con el responsable del equipo.</p>
          </div>
        </div>
        {error && <p role="alert" className="text-red-700 text-sm mt-4">{error}</p>}
        <button type="submit" className="mt-6 flex items-center justify-center gap-2 w-full rounded-xl bg-[#1a6b3c] hover:bg-[#145530] text-white font-bold px-5 py-3">Calcular consumo y autonomía<ArrowRight className="w-4 h-4" /></button>
      </form>

      <div className="rounded-2xl bg-[#0a1628] p-5 sm:p-8 text-white" aria-live="polite" aria-atomic="true">
        <h2 className="text-xl font-extrabold mb-2">Tu planificación de combustible</h2>
        {!calculation ? (
          <div className="py-10">
            <Calculator className="w-10 h-10 text-[#f5a623] mb-5" />
            <p className="text-slate-300 leading-relaxed">Completa los cuatro datos para conocer el consumo estimado, las horas disponibles antes de usar tu reserva y los litros adicionales que necesitarías.</p>
            <p className="text-slate-400 text-sm mt-5">El cálculo es gratuito y no requiere datos de contacto.</p>
          </div>
        ) : <>
          <dl className="divide-y divide-white/10 mt-5">
            {[
              ["Consumo para el período", `${format(calculation.result.consumptionLitres)} L`],
              ["Autonomía antes de usar la reserva", `${format(calculation.result.autonomyHours)} h`],
              ["Litros adicionales calculados", `${format(calculation.result.refillLitres)} L`],
            ].map(([label, value]) => <div key={label} className="py-4 flex flex-wrap items-center justify-between gap-3"><dt className="text-sm text-slate-300 max-w-[65%]">{label}</dt><dd className="text-2xl font-extrabold text-[#f5a623]">{value}</dd></div>)}
          </dl>
          <p className="text-sm text-slate-300 mt-4 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 shrink-0 text-[#f5a623] mt-0.5" />{calculation.result.refillLitres === 0 ? "Con los valores ingresados, el combustible disponible cubre el período y la reserva indicada." : "La reposición calculada cubre el período indicado y la reserva que definiste."}</p>
          <Link href={generatorQuoteHref(calculation.input)} data-analytics-id="calculator_quote" data-analytics-cta="quote" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#f5a623] hover:bg-[#d4891a] text-[#0a1628] font-bold px-5 py-3 text-center">Cotizar abastecimiento con estos datos<ArrowRight className="w-4 h-4 shrink-0" /></Link>
          <a href={whatsappUrl(`Hola FENICE, quiero coordinar diésel para un generador. Consumo: ${format(calculation.input.consumption)} L/h; operación prevista: ${format(calculation.input.hours)} h; disponible: ${format(calculation.input.available)} L; reserva: ${format(calculation.input.reserve)} L. Reposición calculada: ${format(calculation.result.refillLitres)} L. Quiero confirmar volumen de compra y despacho.`)} target="_blank" rel="noopener noreferrer" data-analytics-id="calculator_whatsapp" data-analytics-cta="whatsapp" className="mt-4 block text-center text-sm font-semibold underline underline-offset-4">Consultar por WhatsApp</a>
        </>}
        <p className="text-xs text-slate-400 border-t border-white/10 pt-4 mt-6 leading-relaxed">Estimación con consumo constante. Confirma el consumo a la carga real, la capacidad útil del estanque y el volumen final de compra. Pedido mínimo informado: 50 L; despacho sujeto a disponibilidad.</p>
      </div>
    </div>
  );
}
