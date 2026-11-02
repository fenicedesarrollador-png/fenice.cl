import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

export default function GeneratorToolLink() {
  return (
    <aside className="rounded-2xl border border-[#1a6b3c]/20 bg-[#f0faf4] p-6 sm:p-8" aria-label="Herramienta para planificar diésel">
      <Calculator className="w-7 h-7 text-[#1a6b3c] mb-3" />
      <h2 className="font-extrabold text-xl text-[#0a1628] mb-2">¿Cuánto diésel necesita tu generador?</h2>
      <p className="text-slate-600 text-sm leading-relaxed mb-4">Calcula consumo, autonomía y litros de reposición con los datos de tu equipo. Lleva el resultado a tu cotización.</p>
      <Link href="/herramientas/calculadora-consumo-generador" data-analytics-id="generator_calculator_link" data-analytics-cta="calculator" className="inline-flex items-center gap-2 text-sm font-bold text-[#1a6b3c] underline underline-offset-4">Calcular consumo y autonomía<ArrowRight className="w-4 h-4 shrink-0" /></Link>
    </aside>
  );
}
