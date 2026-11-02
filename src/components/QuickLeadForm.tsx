"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";
import { COMUNAS, whatsappUrl } from "@/lib/config";
import { formatPhoneInput, hasCompletePhone, normalizePhoneForStorage } from "@/lib/contactFormat";

export default function QuickLeadForm() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const started = useRef(false);
  const { trackFormStart, trackEvent, visitorId, sessionId } = useAnalytics();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const form = new FormData(event.currentTarget);
    setError("");
    if (!hasCompletePhone(phone)) {
      setError("Ingresa los 8 dígitos de tu teléfono después de +56 9.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/public/contacto", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(visitorId ? { "x-fenice-visitor-id": visitorId } : {}),
          ...(sessionId ? { "x-fenice-session-id": sessionId } : {}),
        },
        body: JSON.stringify({
          nombre: form.get("nombre"), telefono: normalizePhoneForStorage(phone),
          comuna: form.get("comuna"), tipo_operacion: form.get("tipo_operacion"),
          website: form.get("website"), mensaje: "Solicitud comercial desde el formulario rápido de inicio.",
        }),
      });
      if (!response.ok) throw new Error("No se pudo registrar tu solicitud. Intenta nuevamente o contáctanos por WhatsApp.");
      setSuccess(true);
      void trackEvent({ eventType: "form_submit_success", formName: "inicio_rapido" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No pudimos registrar la solicitud.");
      void trackEvent({ eventType: "form_submit_error", formName: "inicio_rapido" });
    } finally {
      setLoading(false);
    }
  }

  if (success) return (
    <div role="status" className="rounded-2xl border border-[#1a6b3c]/20 bg-white p-6">
      <CheckCircle2 className="text-[#1a6b3c] h-7 w-7 mb-3" />
      <h3 className="font-bold text-[#0a1628] mb-2">Recibimos tu solicitud</h3>
      <p className="text-sm text-slate-600">El equipo comercial te contactará en horario de atención para confirmar precio y disponibilidad.</p>
      <a href={whatsappUrl("Hola, envié una solicitud desde fenice.cl y quisiera coordinar mi despacho.")} target="_blank" rel="noopener noreferrer" data-analytics-id="home_lead_success_whatsapp" data-analytics-cta="whatsapp" className="inline-block mt-4 text-sm font-bold text-[#1a6b3c]">Continuar por WhatsApp →</a>
    </div>
  );

  return (
    <form onSubmit={submit} onFocusCapture={() => {
      if (!started.current) { started.current = true; void trackFormStart("inicio_rapido"); }
    }} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quick-name" className="block text-sm font-semibold mb-1.5">Nombre o empresa</label>
          <input id="quick-name" name="nombre" required maxLength={150} autoComplete="name" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="quick-phone" className="block text-sm font-semibold mb-1.5">Teléfono de contacto</label>
          <input id="quick-phone" name="telefono" type="tel" required autoComplete="tel" inputMode="tel" placeholder="+56 9 XXXX XXXX" maxLength={15} value={phone} onChange={(e) => setPhone(formatPhoneInput(e.target.value))} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
        </div>
        <div>
          <label htmlFor="quick-comuna" className="block text-sm font-semibold mb-1.5">Comuna de entrega</label>
          <input id="quick-comuna" name="comuna" list="quick-comunas" required maxLength={100} autoComplete="address-level2" placeholder="Ej.: Quilicura" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" />
          <datalist id="quick-comunas">{COMUNAS.map((c) => <option key={c.slug} value={c.nombre} />)}</datalist>
        </div>
        <div>
          <label htmlFor="quick-service" className="block text-sm font-semibold mb-1.5">¿Qué necesitas?</label>
          <select id="quick-service" name="tipo_operacion" required defaultValue="" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm">
            <option value="" disabled>Seleccionar servicio</option>
            <option>Petróleo diésel a domicilio</option><option>Parafina (kerosene) a domicilio</option>
            <option>Combustible para generador</option><option>Combustible para maquinaria o flota</option>
            <option>Combustible para caldera</option><option>Instalación de estanque</option>
          </select>
        </div>
      </div>
      <div className="hidden" aria-hidden="true"><label htmlFor="quick-website">Sitio web</label><input id="quick-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error} <a href={whatsappUrl()} className="underline" data-analytics-cta="whatsapp">WhatsApp</a></p>}
      <button type="submit" disabled={loading} className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-[#1a6b3c] hover:bg-[#145530] text-white font-bold px-5 py-3 text-sm disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        {loading ? "Enviando…" : "Solicitar precio y disponibilidad"}
      </button>
      <p className="mt-3 text-xs text-slate-500">Usaremos tus datos para responder esta solicitud. <Link href="/politica-de-privacidad" className="underline">Política de privacidad</Link>.</p>
    </form>
  );
}
