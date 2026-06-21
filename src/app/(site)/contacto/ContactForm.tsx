"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { COMUNAS } from "@/lib/config";
import { useAnalytics } from "@/components/analytics/AnalyticsProvider";

const TIPOS = [
  "Petróleo a domicilio",
  "Transporte de combustible",
  "Instalación de estanque",
  "Otro",
];

const VOLUMENES = [
  "Menos de 500 litros",
  "500 – 2.000 litros",
  "2.000 – 10.000 litros",
  "Más de 10.000 litros",
  "No lo sé aún",
];

export default function ContactForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const startedRef = useRef(false);
  const { sessionId, trackEvent, trackFormStart, visitorId } = useAnalytics();

  function ensureFormStartTracked() {
    if (startedRef.current) {
      return;
    }

    startedRef.current = true;
    // Fire-and-forget: el tracking nunca debe bloquear ni romper el formulario.
    void trackFormStart("contacto");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Leer el formulario de forma SÍNCRONA antes de cualquier await:
    // React recicla el evento tras el primer await y e.currentTarget pasa a null.
    const fd = new FormData(e.currentTarget);

    ensureFormStartTracked();
    setLoading(true);
    setError("");

    const payload = {
      nombre: fd.get("nombre") as string,
      telefono: fd.get("telefono") as string,
      email: fd.get("email") as string,
      comuna: fd.get("comuna") as string,
      tipo_operacion: fd.get("tipo_operacion") as string,
      volumen: fd.get("volumen") as string,
      mensaje: fd.get("mensaje") as string,
      estado: "nuevo",
    };

    let trackedFailure = false;

    try {
      const response = await fetch("/api/public/contacto", {
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
          formName: "contacto",
          metadata: {
            error_code: `http_${response.status}`,
          },
        });
        trackedFailure = true;
        throw new Error(result.error ?? "No se pudo enviar el formulario.");
      }

      void trackEvent(
        {
          eventType: "form_submit_success",
          formName: "contacto",
        },
        { preferBeacon: true },
      );
      router.push("/gracias");
    } catch {
      if (!trackedFailure) {
        void trackEvent({
          eventType: "form_submit_error",
          formName: "contacto",
          metadata: {
            error_code: "request_failed",
          },
        });
      }
      setError("Hubo un problema al enviar el formulario. Por favor, contáctanos por WhatsApp.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} onFocusCapture={ensureFormStartTracked} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre o empresa *
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Tu nombre o razón social"
          />
        </div>
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="+56 9 XXXX XXXX"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="tu@empresa.cl"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="comuna" className="block text-sm font-medium text-gray-700 mb-1">
            Comuna *
          </label>
          <select
            id="comuna"
            name="comuna"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="">Selecciona tu comuna</option>
            {COMUNAS.map((c) => (
              <option key={c.slug} value={c.nombre}>{c.nombre}</option>
            ))}
            <option value="Otra">Otra</option>
          </select>
        </div>
        <div>
          <label htmlFor="tipo_operacion" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de servicio *
          </label>
          <select
            id="tipo_operacion"
            name="tipo_operacion"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
          >
            <option value="">Selecciona</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="volumen" className="block text-sm font-medium text-gray-700 mb-1">
          Volumen estimado
        </label>
        <select
          id="volumen"
          name="volumen"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
        >
          <option value="">Selecciona</option>
          {VOLUMENES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
          Mensaje adicional
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Cuéntanos más sobre tu requerimiento: tipo de maquinaria, frecuencia de despacho, condiciones de acceso, etc."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {loading ? "Enviando..." : "Enviar cotización"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Al enviar este formulario aceptas nuestra{" "}
        <a href="/politica-de-privacidad" className="underline hover:text-gray-600">
          política de privacidad
        </a>
        .
      </p>
    </form>
  );
}
