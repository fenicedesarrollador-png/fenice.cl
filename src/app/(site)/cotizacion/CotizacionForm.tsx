"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2, Mail, Home } from "lucide-react";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";
import { COMUNAS, whatsappUrl } from "@/lib/config";
import {
  formatPhoneInput,
  formatRutInput,
  hasCompletePhone,
  normalizePhoneForStorage,
  normalizeRutForStorage,
} from "@/lib/contactFormat";

const SERVICIOS_OPS = [
  "Petróleo diésel a domicilio (empresa)",
  "Kerosene a domicilio",
  "Combustible para maquinaria pesada / faena",
  "Combustible para generador eléctrico",
  "Combustible para caldera",
  "Abastecimiento para flota",
  "Instalación o mantención de estanque",
  "Contrato de suministro periódico",
  "Otro",
];

const COMBUSTIBLES = ["Petróleo diésel", "Kerosene", "No estoy seguro"];

const VOLUMENES = [
  "50 – 500 litros (compra mínima: 50 L)",
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
  const [rutEmpresa, setRutEmpresa] = useState("");
  const [telefono, setTelefono] = useState("");
  const startedRef = useRef(false);
  const { sessionId, trackEvent, trackFormStart, visitorId } = useAnalytics();

  function ensureFormStartTracked() {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    // Fire-and-forget: el tracking nunca debe bloquear ni romper el formulario.
    void trackFormStart("cotizacion");
    void trackEvent({
      eventType: "quote_started",
      formName: "cotizacion",
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Leer el formulario de forma SÍNCRONA antes de cualquier await:
    // React recicla el evento tras el primer await y e.currentTarget pasa a null.
    const fd = new FormData(e.currentTarget);
    const rawTelefono = (fd.get("telefono") as string).trim();

    ensureFormStartTracked();
    setLoading(true);
    setError("");

    if (!hasCompletePhone(rawTelefono)) {
      setError("Ingresa un teléfono válido de 8 dígitos después del +56 9.");
      setLoading(false);
      return;
    }

    const payload = {
      nombre: (fd.get("nombre") as string).trim(),
      empresa: (fd.get("empresa") as string).trim(),
      rut_empresa: normalizeRutForStorage((fd.get("rut_empresa") as string).trim()),
      email: (fd.get("email") as string).trim(),
      telefono: normalizePhoneForStorage(rawTelefono),
      comuna: (fd.get("comuna") as string).trim() || null,
      servicio_solicitado: (fd.get("servicio_solicitado") as string),
      tipo_combustible: (fd.get("tipo_combustible") as string) || null,
      direccion_entrega: (fd.get("direccion_entrega") as string).trim() || null,
      fecha_estimada: (fd.get("fecha_estimada") as string) || null,
      tipo_instalacion: (fd.get("tipo_instalacion") as string).trim() || null,
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

    let trackedFailure = false;

    try {
      const response = await fetch("/api/public/cotizacion", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(visitorId ? { "x-fenice-visitor-id": visitorId } : {}),
          ...(sessionId ? { "x-fenice-session-id": sessionId } : {}),
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        void trackEvent({
          eventType: "form_submit_error",
          formName: "cotizacion",
          metadata: {
            error_code: `http_${response.status}`,
          },
        });
        trackedFailure = true;
        throw new Error(result.error ?? "No se pudo crear la cotización.");
      }

      void trackEvent({
        eventType: "form_submit_success",
        formName: "cotizacion",
      });
      void trackEvent({
        eventType: "quote_submitted",
        formName: "cotizacion",
      });
      setSuccess(true);
    } catch (err: unknown) {
      if (!trackedFailure) {
        void trackEvent({
          eventType: "form_submit_error",
          formName: "cotizacion",
          metadata: {
            error_code: "request_failed",
          },
        });
      }
      const msg = err instanceof Error ? err.message : "Error inesperado. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-[#f0faf4] border border-[#1a6b3c]/20 rounded-2xl p-8 sm:p-10 text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-[#1a6b3c]/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-[#1a6b3c]" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#0a1628] mb-3">¡Cotización enviada!</h3>
        <p className="text-slate-600 leading-relaxed max-w-md mx-auto">
          Recibimos tu solicitud y ya fue notificada a nuestro equipo comercial.
          Un asesor de Fenice SPA se comunicará contigo a la brevedad en el horario
          Lun-Vie 09:00–19:00.
        </p>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 mt-5">
          <Mail className="w-4 h-4 text-[#1a6b3c] shrink-0" />
          Te enviamos un correo de confirmación con el resumen de tu solicitud.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
          <a
            href={whatsappUrl("Hola, acabo de enviar una cotización desde fenice.cl y quiero agilizar mi solicitud.")}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-id="cotizacion_exito_whatsapp"
            data-analytics-cta="whatsapp"
            className="inline-flex items-center justify-center gap-2 bg-[#1a6b3c] hover:bg-[#145530] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto"
          >
            Agilizar por WhatsApp <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-[#1a6b3c]/40 text-slate-600 font-semibold px-6 py-3 rounded-xl text-sm transition-colors w-full sm:w-auto"
          >
            <Home className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={ensureFormStartTracked} className="space-y-6">
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
              value={rutEmpresa}
              onChange={(e) => setRutEmpresa(formatRutInput(e.target.value))}
              placeholder="76.XXX.XXX-X"
              autoComplete="off"
              maxLength={12}
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Teléfono <span className="text-red-500">*</span></label>
            <input
              name="telefono"
              type="tel"
              required
              value={telefono}
              onFocus={() => setTelefono((current) => formatPhoneInput(current, { forcePrefix: true }))}
              onBlur={() => setTelefono((current) => formatPhoneInput(current))}
              onChange={(e) => setTelefono(formatPhoneInput(e.target.value, { forcePrefix: e.target.value.trim().length > 0 }))}
              placeholder="+56 9 XXXX XXXX"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={15}
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
              list="comunas-cobertura"
              placeholder="Maipú, Pudahuel, Quilicura…"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
            <datalist id="comunas-cobertura">
              {COMUNAS.map((c) => <option key={c.slug} value={c.nombre} />)}
            </datalist>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Dirección exacta del despacho</label>
            <input
              name="direccion_entrega"
              type="text"
              placeholder="Calle, número, referencia de acceso…"
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

      {/* Detalle del despacho */}
      <div>
        <h3 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#f5a623] text-white text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
          Detalle del despacho
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo de combustible</label>
            <select
              name="tipo_combustible"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            >
              <option value="">Seleccionar…</option>
              {COMBUSTIBLES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
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
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fecha estimada de entrega</label>
            <input
              name="fecha_estimada"
              type="date"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Instalación, equipo o maquinaria a abastecer</label>
            <input
              name="tipo_instalacion"
              type="text"
              placeholder="Generador eléctrico, caldera, excavadora, estanque, flota…"
              className="w-full border border-slate-200 focus:border-[#1a6b3c] rounded-xl px-4 py-3 text-sm outline-none transition-colors"
            />
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
