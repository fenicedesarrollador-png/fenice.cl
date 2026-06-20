"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

const SERVICIOS_OPS = [
  "Petróleo a domicilio (empresa)",
  "Transporte de combustible RM",
  "Abastecimiento para faena",
  "Abastecimiento para flota",
  "Instalación de estanque",
  "Contrato de suministro periódico",
  "Otro",
];

const VOLUMENES = [
  "Menos de 500 litros",
  "500 – 2.000 litros",
  "2.000 – 5.000 litros",
  "5.000 – 15.000 litros",
  "Más de 15.000 litros",
  "No estoy seguro aún",
];

const FRECUENCIAS = [
  "Una vez (puntual)",
  "Semanal",
  "Quincenal",
  "Mensual",
  "Trimestral o según necesidad",
];

export default function CotizacionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);

    const payload = {
      nombre: (fd.get("nombre") as string).trim(),
      empresa: (fd.get("empresa") as string).trim(),
      rut_empresa: (fd.get("rut_empresa") as string).trim() || null,
      email: (fd.get("email") as string).trim(),
      telefono: (fd.get("telefono") as string).trim(),
      comuna: (fd.get("comuna") as string).trim() || null,
      servicio_solicitado: (fd.get("servicio_solicitado") as string),
      volumen_estimado: (fd.get("volumen_estimado") as string) || null,
      frecuencia: (fd.get("frecuencia") as string) || null,
      mensaje: (fd.get("mensaje") as string).trim() || null,
      estado: "nuevo",
    };

    if (!payload.nombre || !payload.empresa || !payload.email || !payload.telefono || !payload.servicio_solicitado) {
      setError("Por favor completa los campos obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: dbErr } = await supabase.from("cotizaciones").insert([payload]);
      if (dbErr) throw new Error(dbErr.message);
      setSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-[#f0faf4] border border-[#1a6b3c]/20 rounded-2xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-[#1a6b3c]/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-[#1a6b3c]" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#0a1628] mb-3">¡Cotización enviada!</h3>
        <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
          Recibimos tu solicitud. Un asesor de Fenice SPA se comunicará contigo a la brevedad
          en el horario Lun-Vie 09:00–19:00.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Datos de contacto */}
      <div>
        <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#f5a623] text-white text-xs font-extrabold flex items-center justify-center shrink-0">1</span>
          Datos de contacto
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nombre completo <span className="text-red-500">*</span></label>
            <input
              name="nombre"
              type="text"
              required
              placeholder="Juan Pérez"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Empresa u organización <span className="text-red-500">*</span></label>
            <input
              name="empresa"
              type="text"
              required
              placeholder="Constructora XYZ Ltda."
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">RUT empresa (opcional)</label>
            <input
              name="rut_empresa"
              type="text"
              placeholder="76.XXX.XXX-X"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teléfono <span className="text-red-500">*</span></label>
            <input
              name="telefono"
              type="tel"
              required
              placeholder="+56 9 XXXX XXXX"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Correo electrónico <span className="text-red-500">*</span></label>
            <input
              name="email"
              type="email"
              required
              placeholder="contacto@empresa.cl"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Comuna / Zona de entrega</label>
            <input
              name="comuna"
              type="text"
              placeholder="Maipú, Pudahuel, Quilicura…"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Tipo de servicio */}
      <div>
        <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#f5a623] text-white text-xs font-extrabold flex items-center justify-center shrink-0">2</span>
          Tipo de servicio requerido <span className="text-red-500">*</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {SERVICIOS_OPS.map((s) => (
            <label key={s} className="flex items-center gap-3 border border-slate-200 hover:border-[#1a6b3c]/40 rounded-xl px-4 py-3 cursor-pointer transition-colors group has-[:checked]:border-[#1a6b3c] has-[:checked]:bg-[#f0faf4]">
              <input type="radio" name="servicio_solicitado" value={s} required className="accent-[#1a6b3c]" />
              <span className="text-sm text-slate-700 font-medium">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Volumen y frecuencia */}
      <div>
        <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#f5a623] text-white text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
          Volumen y frecuencia estimados
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Volumen estimado por despacho</label>
            <select
              name="volumen_estimado"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            >
              <option value="">Seleccionar…</option>
              {VOLUMENES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Frecuencia de despacho</label>
            <select
              name="frecuencia"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            >
              <option value="">Seleccionar…</option>
              {FRECUENCIAS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Mensaje */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Información adicional o detalles de la operación</label>
        <textarea
          name="mensaje"
          rows={4}
          placeholder="Describe brevemente tu operación, necesidades específicas, dirección de entrega, tipo de maquinaria, etc."
          className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2.5 bg-[#f5a623] hover:bg-[#d4891a] disabled:opacity-60 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md shadow-[#f5a623]/20 text-sm"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        {loading ? "Enviando solicitud…" : "Enviar solicitud de cotización"}
      </button>

      <p className="text-xs text-slate-400">
        Al enviar este formulario aceptas que Fenice SPA procese tu información para responder a tu solicitud.
        Consultamos en el horario Lun-Vie 09:00–19:00.
      </p>
    </form>
  );
}
