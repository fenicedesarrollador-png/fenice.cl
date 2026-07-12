"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, AlertCircle, Save, Eye, EyeOff, RefreshCw } from "lucide-react";

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

  async function save(fp: FuelPrice) {
    const st = states[fp.id];
    const priceNum = st.price.trim() === "" ? null : parsePrice(st.price);

    if (st.price.trim() !== "" && priceNum === null) {
      setResults((prev) => ({ ...prev, [fp.id]: { ok: false, msg: "Precio inválido. Ingresa un número mayor a 0." } }));
      return;
    }

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
        updated_at: new Date().toISOString(),
      })
      .eq("id", fp.id);

    setSaving((prev) => ({ ...prev, [fp.id]: false }));

    if (error) {
      setResults((prev) => ({ ...prev, [fp.id]: { ok: false, msg: `Error: ${error.message}` } }));
      return;
    }

    setResults((prev) => ({ ...prev, [fp.id]: { ok: true, msg: "Guardado y publicado correctamente." } }));

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

        return (
          <div
            key={fp.id}
            className="admin-card rounded-2xl overflow-hidden shadow-sm"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg"
                  style={{ background: `${st.accent_color}20`, color: st.accent_color }}
                >
                  {codeLabel(fp.code)}
                </div>
                <div>
                  <p className="font-bold text-[#0a1628] text-sm leading-tight">{fp.code}</p>
                  <p className="text-xs text-slate-500">Código interno</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                    st.is_visible
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-slate-100 border-slate-200 text-slate-500"
                  }`}
                >
                  {st.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {st.is_visible ? "Visible al público" : "Oculto"}
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
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623]"
                  placeholder="Nombre del combustible"
                />
              </div>

              {/* Precio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Precio (dejar vacío = no disponible)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={st.price}
                    onChange={(e) => update(fp.id, "price", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623]"
                    placeholder="0"
                  />
                </div>
                {st.price && parsePrice(st.price) !== null && (
                  <p className="text-xs text-green-600 font-medium">
                    Vista previa: {formatPrice(parsePrice(st.price)!)} {st.unit.replace("$", "")}
                  </p>
                )}
              </div>

              {/* Unidad */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Unidad</label>
                <select
                  value={st.unit}
                  onChange={(e) => update(fp.id, "unit", e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623] bg-slate-50"
                >
                  <option value="$/L">$/L (litro)</option>
                  <option value="$/kg">$/kg (kilogramo)</option>
                  <option value="$/m³">$/m³ (metro cúbico)</option>
                </select>
              </div>

              {/* Nota */}
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nota (opcional)</label>
                <input
                  type="text"
                  value={st.note}
                  onChange={(e) => update(fp.id, "note", e.target.value)}
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623]"
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
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623]"
                  placeholder="Nombre del responsable"
                />
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
                  className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0a1628] focus:outline-none focus:ring-2 focus:ring-[#f5a623]/40 focus:border-[#f5a623]"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-3">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={st.is_available}
                      onClick={() => update(fp.id, "is_available", !st.is_available)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${st.is_available ? "bg-green-500" : "bg-slate-300"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50 rounded-full shadow transition-transform ${st.is_available ? "translate-x-5" : "translate-x-0"}`}
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
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-slate-50 rounded-full shadow transition-transform ${st.is_visible ? "translate-x-5" : "translate-x-0"}`}
                      />
                    </button>
                    <span className="text-sm font-medium text-slate-700">
                      {st.is_visible ? "Visible en el sitio" : "Oculto del sitio"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Save row */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/60">
              {res && (
                <span
                  className={`flex items-center gap-1.5 text-sm font-medium ${res.ok ? "text-green-600" : "text-red-600"}`}
                >
                  {res.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {res.msg}
                </span>
              )}
              {!res && <span />}

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
    </div>
  );
}
