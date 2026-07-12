"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CheckCircle2, AlertCircle, Save, Eye, EyeOff, RefreshCw,
  CalendarClock, Timer, BellRing, X, Globe, Clock3,
} from "lucide-react";

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
  updated_by: string | null;
  updated_at: string;
  vence_at: string | null;
  precio_programado: number | null;
  programado_at: string | null;
  vence_programado_at: string | null;
};

type EditState = {
  price: string;
  name: string;
  unit: string;
  accent_color: string;
  is_available: boolean;
  is_visible: boolean;
  display_order: string;
  note: string;
  updated_by: string;
  vence_at: string;             // datetime-local
  precio_programado: string;
  programado_at: string;        // datetime-local
  vence_programado_at: string;  // datetime-local
};

function formatPrice(p: number): string {
  return "$" + p.toLocaleString("es-CL");
}

function parsePrice(raw: string): number | null {
  const cleaned = raw.replace(/[$.\s]/g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return isNaN(n) || n <= 0 ? null : n;
}

function codeLabel(code: string): string {
  return { diesel: "D", kerosene: "K", gas_residencial: "GE" }[code] ?? code.toUpperCase();
}

/** ISO → valor para <input type="datetime-local"> en hora local del navegador. */
function isoToLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Valor de <input datetime-local> → ISO UTC (o null si vacío). */
function localInputToIso(value: string): string | null {
  if (!value.trim()) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

function formatVence(iso: string): string {
  return new Date(iso).toLocaleString("es-CL", {
    weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

/** Estado de vigencia del precio publicado. */
function vigencia(venceInput: string): { tone: "ok" | "warn" | "expired" | "none"; label: string } {
  if (!venceInput.trim()) return { tone: "none", label: "Sin fecha de caducidad" };
  const vence = new Date(venceInput).getTime();
  if (isNaN(vence)) return { tone: "none", label: "Fecha inválida" };
  const diff = vence - Date.now();
  if (diff <= 0) return { tone: "expired", label: "VENCIDO — oculto del sitio" };
  const horas = Math.floor(diff / 3_600_000);
  if (horas < 24) return { tone: "warn", label: `Vence en ${horas === 0 ? "menos de 1 h" : `${horas} h`}` };
  const dias = Math.floor(horas / 24);
  return { tone: "ok", label: `Vigente — vence en ${dias} día${dias !== 1 ? "s" : ""} (${horas % 24} h)` };
}

const VIGENCIA_STYLES: Record<string, string> = {
  ok: "bg-green-50 border-green-200 text-green-700",
  warn: "bg-amber-50 border-amber-200 text-amber-700",
  expired: "bg-red-50 border-red-200 text-red-600",
  none: "bg-slate-100 border-slate-200 text-slate-500",
};

const INPUT_CLS =
  "border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623] bg-white";

/* ============================================================
   Toggle global: mostrar/ocultar la sección de precios en la web
   ============================================================ */
export function VisibilidadGlobal({ visible }: { visible: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState(visible);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const next = !value;
    setSaving(true); setError("");
    const supabase = createClient();
    const { error: dbError } = await supabase.from("configuracion_sitio").upsert(
      { clave: "precios_visibles", valor: next ? "true" : "false", updated_at: new Date().toISOString() },
      { onConflict: "clave" },
    );
    if (dbError) { setError(dbError.message); setSaving(false); return; }
    setValue(next);
    try {
      await fetch("/api/revalidate?path=/", { method: "POST" });
    } catch {}
    setSaving(false);
    router.refresh();
  }

  return (
    <div className={`admin-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-l-4 ${value ? "!border-l-[#1a6b3c]" : "!border-l-red-400"}`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${value ? "bg-[#1a6b3c]/10 text-[#1a6b3c]" : "bg-red-50 text-red-500"}`}>
        <Globe className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[#0a1628] text-sm">
          Sección de precios en la web pública:{" "}
          <span className={value ? "text-[#1a6b3c]" : "text-red-600"}>{value ? "VISIBLE" : "OCULTA"}</span>
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">
          {value
            ? "Los visitantes ven los precios vigentes en la página de inicio. Los precios vencidos se ocultan automáticamente."
            : "Toda la sección informativa de precios está oculta del sitio."}
        </p>
        {error && <p className="text-[12px] text-red-600 font-semibold mt-1">{error}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={toggle}
        disabled={saving}
        className={`relative w-14 h-7 rounded-full transition-colors shrink-0 disabled:opacity-60 ${value ? "bg-[#1a6b3c]" : "bg-slate-300"}`}
        title={value ? "Ocultar precios de la web" : "Mostrar precios en la web"}
      >
        <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center transition-transform ${value ? "translate-x-7" : "translate-x-0"}`}>
          {saving ? <RefreshCw className="w-3 h-3 text-slate-400 animate-spin" /> : value ? <Eye className="w-3 h-3 text-[#1a6b3c]" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
        </span>
      </button>
    </div>
  );
}

/* ============================================================
   Editor por combustible
   ============================================================ */
export default function PreciosEditor({ initialPrices }: { initialPrices: FuelPrice[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [states, setStates] = useState<Record<string, EditState>>(() =>
    Object.fromEntries(
      initialPrices.map((fp) => [
        fp.id,
        {
          price: fp.price !== null ? String(fp.price) : "",
          name: fp.name,
          unit: fp.unit,
          accent_color: fp.accent_color,
          is_available: fp.is_available,
          is_visible: fp.is_visible,
          display_order: String(fp.display_order),
          note: fp.note ?? "",
          updated_by: fp.updated_by ?? "",
          vence_at: isoToLocalInput(fp.vence_at),
          precio_programado: fp.precio_programado !== null ? String(fp.precio_programado) : "",
          programado_at: isoToLocalInput(fp.programado_at),
          vence_programado_at: isoToLocalInput(fp.vence_programado_at),
        },
      ])
    )
  );

  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, { ok: boolean; msg: string } | null>>({});

  function update(id: string, field: keyof EditState, value: string | boolean) {
    setStates((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
    setResults((prev) => ({ ...prev, [id]: null }));
  }

  function cancelarProgramacion(id: string) {
    setStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], precio_programado: "", programado_at: "", vence_programado_at: "" },
    }));
    setResults((prev) => ({ ...prev, [id]: { ok: true, msg: "Programación quitada. Presiona Guardar para confirmar." } }));
  }

  async function save(fp: FuelPrice) {
    const st = states[fp.id];
    const priceNum = st.price.trim() === "" ? null : parsePrice(st.price);
    const fail = (msg: string) => setResults((prev) => ({ ...prev, [fp.id]: { ok: false, msg } }));

    if (st.price.trim() !== "" && priceNum === null) {
      return fail("Precio inválido. Ingresa un número mayor a 0.");
    }

    // ── Validación de programación ────────────────────────────────
    const progPrecio = st.precio_programado.trim() === "" ? null : parsePrice(st.precio_programado);
    const progAt = localInputToIso(st.programado_at);
    const progVence = localInputToIso(st.vence_programado_at);
    const tieneProgramacion = st.precio_programado.trim() !== "" || st.programado_at.trim() !== "";

    if (tieneProgramacion) {
      if (progPrecio === null) return fail("El precio programado es inválido. Ingresa un número mayor a 0.");
      if (!progAt) return fail("Indica la fecha y hora en que se publicará el precio programado.");
      if (new Date(progAt).getTime() <= Date.now()) {
        return fail("La fecha de publicación programada debe ser futura. Para publicar ahora, usa el campo Precio y guarda.");
      }
      if (progVence && new Date(progVence).getTime() <= new Date(progAt).getTime()) {
        return fail("La caducidad del precio programado debe ser posterior a su fecha de publicación.");
      }
    }

    const venceAt = localInputToIso(st.vence_at);

    setSaving((prev) => ({ ...prev, [fp.id]: true }));
    setResults((prev) => ({ ...prev, [fp.id]: null }));

    const supabase = createClient();
    const { error } = await supabase
      .from("fuel_prices")
      .update({
        name: st.name.trim(),
        price: priceNum,
        unit: st.unit.trim(),
        accent_color: st.accent_color,
        is_available: st.is_available,
        is_visible: st.is_visible,
        display_order: parseInt(st.display_order) || 0,
        note: st.note.trim() || null,
        updated_by: st.updated_by.trim() || null,
        vence_at: venceAt,
        precio_programado: tieneProgramacion ? progPrecio : null,
        programado_at: tieneProgramacion ? progAt : null,
        vence_programado_at: tieneProgramacion ? progVence : null,
        alerta_enviada_at: null, // nueva vigencia ⇒ nuevo ciclo de alertas
        updated_at: new Date().toISOString(),
      })
      .eq("id", fp.id);

    setSaving((prev) => ({ ...prev, [fp.id]: false }));

    if (error) {
      return fail(`Error: ${error.message}`);
    }

    const partes = ["Guardado correctamente."];
    if (tieneProgramacion && progAt) partes.push(`Se publicará ${formatVence(progAt)}.`);
    if (venceAt && new Date(venceAt).getTime() > Date.now()) partes.push(`Caduca ${formatVence(venceAt)}.`);
    setResults((prev) => ({ ...prev, [fp.id]: { ok: true, msg: partes.join(" ") } }));

    try {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
    } catch {}

    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      {initialPrices.map((fp) => {
        const st = states[fp.id];
        const res = results[fp.id];
        const isSaving = saving[fp.id];
        const vig = vigencia(st.vence_at);
        const progActiva = st.precio_programado.trim() !== "" && st.programado_at.trim() !== "";

        return (
          <div key={fp.id} className="admin-card rounded-2xl overflow-hidden shadow-sm">
            {/* Card header */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                  style={{ background: `${st.accent_color}20`, color: st.accent_color }}
                >
                  {codeLabel(fp.code)}
                </div>
                <div>
                  <p className="font-bold text-[#0a1628] text-sm leading-tight">{st.name || fp.code}</p>
                  <p className="text-xs text-slate-500">Código: {fp.code}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Estado de vigencia */}
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${VIGENCIA_STYLES[vig.tone]}`}>
                  <CalendarClock className="w-3 h-3" />
                  {vig.label}
                </span>
                {/* Programación pendiente */}
                {progActiva && parsePrice(st.precio_programado) !== null && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border bg-blue-50 border-blue-200 text-blue-700">
                    <Timer className="w-3 h-3" />
                    Programado: {formatPrice(parsePrice(st.precio_programado)!)} → {st.programado_at ? formatVence(new Date(st.programado_at).toISOString()) : ""}
                  </span>
                )}
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                    st.is_visible
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}
                >
                  {st.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {st.is_visible ? "Visible" : "Oculto"}
                </span>
              </div>
            </div>

            {/* Form */}
            <div className="px-6 py-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nombre</label>
                <input
                  type="text"
                  value={st.name}
                  onChange={(e) => update(fp.id, "name", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Nombre del combustible"
                />
              </div>

              {/* Precio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Precio actual (vacío = no disponible)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={st.price}
                    onChange={(e) => update(fp.id, "price", e.target.value)}
                    className={`w-full ${INPUT_CLS} !pl-7`}
                    placeholder="0"
                  />
                </div>
                {st.price && parsePrice(st.price) !== null && (
                  <p className="text-xs text-green-600 font-medium">
                    Vista previa: {formatPrice(parsePrice(st.price)!)} {st.unit.replace("$", "")}
                  </p>
                )}
              </div>

              {/* Caducidad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarClock className="w-3.5 h-3.5 text-[#b87608]" />
                  Fecha de caducidad del precio
                </label>
                <input
                  type="datetime-local"
                  value={st.vence_at}
                  onChange={(e) => update(fp.id, "vence_at", e.target.value)}
                  className={INPUT_CLS}
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Solo visible internamente. Al vencer, el precio se oculta
                  automáticamente de la web. Vacío = sin caducidad.
                </p>
              </div>

              {/* Unidad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Unidad</label>
                <select
                  value={st.unit}
                  onChange={(e) => update(fp.id, "unit", e.target.value)}
                  className={`${INPUT_CLS} bg-slate-50`}
                >
                  <option value="$/L">$/L (litro)</option>
                  <option value="$/kg">$/kg (kilogramo)</option>
                  <option value="$/m³">$/m³ (metro cúbico)</option>
                </select>
              </div>

              {/* Nota */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nota (opcional)</label>
                <input
                  type="text"
                  value={st.note}
                  onChange={(e) => update(fp.id, "note", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Ej: Precio sujeto a zona de despacho"
                  maxLength={120}
                />
              </div>

              {/* Actualizado por */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Actualizado por</label>
                <input
                  type="text"
                  value={st.updated_by}
                  onChange={(e) => update(fp.id, "updated_by", e.target.value)}
                  className={INPUT_CLS}
                  placeholder="Nombre del responsable"
                />
              </div>

              {/* ── PUBLICACIÓN PROGRAMADA ──────────────────────────── */}
              <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <p className="text-xs font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Timer className="w-3.5 h-3.5" />
                    Publicación programada (temporizador)
                  </p>
                  {progActiva && (
                    <button
                      type="button"
                      onClick={() => cancelarProgramacion(fp.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 bg-white border border-red-200 hover:border-red-300 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <X className="w-3 h-3" /> Cancelar programación
                    </button>
                  )}
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Nuevo precio</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">$</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={st.precio_programado}
                        onChange={(e) => update(fp.id, "precio_programado", e.target.value)}
                        className={`w-full ${INPUT_CLS} !pl-7`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Se publica el</label>
                    <input
                      type="datetime-local"
                      value={st.programado_at}
                      onChange={(e) => update(fp.id, "programado_at", e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Caducidad del nuevo precio</label>
                    <input
                      type="datetime-local"
                      value={st.vence_programado_at}
                      onChange={(e) => update(fp.id, "vence_programado_at", e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-blue-700/80 mt-3 leading-relaxed">
                  El nuevo precio reemplazará automáticamente al actual en la fecha y hora indicadas
                  (precisión ~1 minuto), sin intervención manual. Ejemplo: ingresa el precio a las 20:00
                  y prográmalo para las 23:59 — se publicará solo.
                </p>
              </div>

              {/* Color acento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Color acento</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={st.accent_color}
                    onChange={(e) => update(fp.id, "accent_color", e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 p-0.5 cursor-pointer"
                  />
                  <span className="text-sm font-mono text-slate-500">{st.accent_color}</span>
                </div>
              </div>

              {/* Orden */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Orden de display</label>
                <input
                  type="number"
                  min={0}
                  value={st.display_order}
                  onChange={(e) => update(fp.id, "display_order", e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1 justify-center">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={st.is_available}
                    onClick={() => update(fp.id, "is_available", !st.is_available)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${st.is_available ? "bg-green-500" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${st.is_available ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    {st.is_available ? "Disponible para despacho" : "Sin disponibilidad"}
                  </span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={st.is_visible}
                    onClick={() => update(fp.id, "is_visible", !st.is_visible)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${st.is_visible ? "bg-[#f5a623]" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${st.is_visible ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                  <span className="text-sm font-medium text-slate-700">
                    {st.is_visible ? "Visible en el sitio" : "Oculto del sitio"}
                  </span>
                </label>
              </div>
            </div>

            {/* Save row */}
            <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/60">
              <div className="flex items-center gap-4 min-w-0">
                {res ? (
                  <span
                    className={`flex items-center gap-1.5 text-sm font-medium ${res.ok ? "text-green-600" : "text-red-600"}`}
                  >
                    {res.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    {res.msg}
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <BellRing className="w-3.5 h-3.5 shrink-0 text-[#b87608]" />
                    Alerta interna por correo a las 10:00 del día anterior al vencimiento.
                  </span>
                )}
              </div>

              <button
                onClick={() => save(fp)}
                disabled={isSaving || isPending}
                className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#112040] disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Guardando…" : "Guardar y publicar"}
              </button>
            </div>
          </div>
        );
      })}

      {/* Nota sobre horario */}
      <p className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
        <Clock3 className="w-3.5 h-3.5 shrink-0" />
        Las fechas se ingresan en tu hora local (Chile) y se aplican con esa zona horaria.
      </p>
    </div>
  );
}
