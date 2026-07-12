"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { FormSection, Field, Toggle, FormActions } from "../_components/ui";
import { Tag, Percent, DollarSign } from "lucide-react";

interface Promo {
  id: string;
  titulo: string;
  descripcion?: string;
  descuento_texto?: string;
  codigo?: string;
  fuel_code?: string | null;
  descuento_tipo?: string | null;
  descuento_valor?: number | null;
  fecha_inicio: string;
  fecha_fin: string;
  destacado: boolean;
  activo: boolean;
}

const FUELES = [
  { code: "", label: "General (no ligada a un combustible)" },
  { code: "diesel", label: "Diésel" },
  { code: "kerosene", label: "Kerosene" },
  { code: "gas_residencial", label: "Gas envasado residencial" },
];

/** Texto de badge sugerido a partir del tipo/valor de descuento. */
function badgeSugerido(tipo: string, valor: string): string {
  const n = parseFloat(valor.replace(/[^0-9.]/g, ""));
  if (!n || n <= 0) return "";
  if (tipo === "porcentaje") return `-${n}%`;
  if (tipo === "monto") return `-$${n.toLocaleString("es-CL")}`;
  return "";
}

export default function PromoForm({ promo }: { promo?: Promo }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fuelCode, setFuelCode] = useState(promo?.fuel_code ?? "");
  const [descTipo, setDescTipo] = useState(promo?.descuento_tipo ?? "porcentaje");
  const [descValor, setDescValor] = useState(promo?.descuento_valor != null ? String(promo.descuento_valor) : "");
  const [descTexto, setDescTexto] = useState(promo?.descuento_texto ?? "");

  const preview = badgeSugerido(descTipo, descValor);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    const valorNum = descValor.trim() === "" ? null : parseFloat(descValor.replace(/[^0-9.]/g, ""));
    if (fuelCode && (valorNum === null || valorNum <= 0)) {
      setError("Para una promo de combustible, ingresa un valor de descuento mayor a 0.");
      setLoading(false);
      return;
    }
    if (descTipo === "porcentaje" && valorNum !== null && valorNum > 90) {
      setError("El descuento en porcentaje no puede superar 90%.");
      setLoading(false);
      return;
    }

    const inicio = fd.get("fecha_inicio") as string;
    const fin = fd.get("fecha_fin") as string;
    if (new Date(fin).getTime() <= new Date(inicio).getTime()) {
      setError("La fecha de término debe ser posterior a la de inicio.");
      setLoading(false);
      return;
    }

    const payload = {
      titulo: (fd.get("titulo") as string).trim(),
      descripcion: (fd.get("descripcion") as string).trim() || null,
      descuento_texto: descTexto.trim() || preview || null,
      codigo: (fd.get("codigo") as string).trim() || null,
      fuel_code: fuelCode || null,
      descuento_tipo: fuelCode ? descTipo : (valorNum !== null ? descTipo : null),
      descuento_valor: valorNum,
      fecha_inicio: inicio,
      fecha_fin: fin,
      destacado: fd.get("destacado") === "on",
      activo: fd.get("activo") === "on",
    };

    const supabase = createClient();
    const { error: dbError } = promo
      ? await supabase.from("promociones").update(payload).eq("id", promo.id)
      : await supabase.from("promociones").insert(payload);
    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }
    // La promo puede afectar la tarjeta de precios en la home.
    await fetch("/api/revalidate?path=/", { method: "POST" }).catch(() => {});
    router.push("/admin/promociones");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection title="Datos de la promoción">
        <Field label="Título" required>
          <input name="titulo" type="text" required defaultValue={promo?.titulo} className="admin-input" placeholder="Ej: Descuento de invierno en diésel" />
        </Field>
        <Field label="Descripción">
          <textarea name="descripcion" rows={2} defaultValue={promo?.descripcion} className="admin-input" />
        </Field>
        <Field label="Código promocional" hint="Opcional.">
          <input name="codigo" type="text" defaultValue={promo?.codigo} className="admin-input" placeholder="INVIERNO10" />
        </Field>
      </FormSection>

      <FormSection
        title="Descuento en combustible"
        description="Liga la promoción a un combustible publicado en Precios de combustible. La oferta se mostrará automáticamente en su tarjeta en la web."
      >
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Combustible">
            <select value={fuelCode} onChange={(e) => setFuelCode(e.target.value)} className="admin-input">
              {FUELES.map((f) => (
                <option key={f.code} value={f.code}>{f.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Tipo de descuento">
            <select value={descTipo} onChange={(e) => setDescTipo(e.target.value)} className="admin-input">
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto">Monto en pesos ($)</option>
            </select>
          </Field>
          <Field label={descTipo === "porcentaje" ? "Valor (%)" : "Valor ($)"}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {descTipo === "porcentaje" ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={descValor}
                onChange={(e) => setDescValor(e.target.value)}
                className="admin-input !pl-9"
                placeholder={descTipo === "porcentaje" ? "10" : "50"}
              />
            </div>
          </Field>
        </div>

        <Field label="Texto del badge" hint="Lo que se ve en la tarjeta. Si lo dejas vacío, se usa el sugerido.">
          <input
            type="text"
            value={descTexto}
            onChange={(e) => setDescTexto(e.target.value)}
            className="admin-input"
            placeholder={preview || "-10%"}
          />
        </Field>

        {/* Vista previa del badge */}
        {(descTexto.trim() || preview) && (
          <div className="flex items-center gap-2 text-[12px] text-slate-500">
            Vista previa:
            <span className="inline-flex items-center gap-1 bg-[#f5a623] text-white text-[11px] font-black px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {descTexto.trim() || preview}
            </span>
            {fuelCode && <span className="text-slate-400">se mostrará en la tarjeta de {FUELES.find((f) => f.code === fuelCode)?.label}</span>}
          </div>
        )}
      </FormSection>

      <FormSection title="Vigencia">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Fecha y hora de inicio" required>
            <input name="fecha_inicio" type="datetime-local" required defaultValue={promo?.fecha_inicio?.slice(0, 16)} className="admin-input" />
          </Field>
          <Field label="Fecha y hora de fin" required>
            <input name="fecha_fin" type="datetime-local" required defaultValue={promo?.fecha_fin?.slice(0, 16)} className="admin-input" />
          </Field>
        </div>
        <p className="text-[11px] text-slate-400">Fuera de este rango, la oferta no se muestra en la web (aunque esté activa).</p>
      </FormSection>

      <FormSection title="Visibilidad">
        <div className="flex flex-col sm:flex-row gap-5">
          <Toggle name="activo" defaultChecked={promo?.activo ?? true} label="Activa" description="Visible en el sitio" />
          <Toggle name="destacado" defaultChecked={promo?.destacado ?? false} label="Destacada" description="Prioridad en la página de inicio" />
        </div>
      </FormSection>

      <FormActions submitLabel={promo ? "Guardar cambios" : "Crear promoción"} loading={loading} onCancel={() => router.back()} error={error} />
    </form>
  );
}
