"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, UploadCloud, X, Check } from "lucide-react";
import { FormSection, Field } from "../_components/ui";
import {
  ALLOWED_LOGO_ACCEPT,
  defaultAltText,
  validateLogoFile,
  type Collaborator,
} from "@/lib/collaborators";

export type ColaboradorFormValues = {
  name: string;
  website_url: string;
  alt_text: string;
  display_order: string;
  is_active: boolean;
  file: File | null;
};

/**
 * Formulario de alta/edición de colaborador.
 *
 * No habla con Supabase: sólo valida en el cliente y entrega los valores al
 * componente contenedor, que es quien orquesta subida + persistencia. Así el
 * mismo formulario sirve para "Agregar" y para "Editar" sin duplicar lógica.
 */
export default function ColaboradorForm({
  editing,
  busy,
  busyLabel,
  error,
  onSubmit,
  onCancel,
}: {
  editing: Collaborator | null;
  busy: boolean;
  busyLabel: string;
  error: string;
  onSubmit: (values: ColaboradorFormValues) => void;
  onCancel: () => void;
}) {
  // El contenedor remonta este componente con `key={editing?.id ?? "new"}`,
  // así que el estado inicial siempre corresponde al registro correcto y no
  // hace falta sincronizarlo después con un efecto.
  const [name, setName] = useState(editing?.name ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(editing?.website_url ?? "");
  const [altText, setAltText] = useState(editing?.alt_text ?? "");
  const [displayOrder, setDisplayOrder] = useState(String(editing?.display_order ?? 0));
  const [isActive, setIsActive] = useState(editing?.is_active ?? true);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(editing?.logo_url ?? "");
  const [fileError, setFileError] = useState("");
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // URL de objeto creada localmente: hay que revocarla para no filtrar memoria.
  const objectUrlRef = useRef<string | null>(null);

  const releasePreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  /* Revoca la URL de objeto pendiente al desmontar (cambio de registro o salida). */
  useEffect(() => releasePreview, []);

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    const invalid = validateLogoFile(f);
    if (invalid) {
      setFileError(invalid);
      return;
    }
    setFileError("");
    releasePreview();
    const url = URL.createObjectURL(f);
    objectUrlRef.current = url;
    setFile(f);
    setPreviewUrl(url);
  }

  function clearFile() {
    releasePreview();
    setFile(null);
    setPreviewUrl(editing ? editing.logo_url : "");
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    // El logo es obligatorio al crear; al editar puede conservarse el actual.
    if (!editing && !file) {
      setFileError("El logo es obligatorio. Sube una imagen PNG, JPG o WebP.");
      return;
    }
    onSubmit({
      name,
      website_url: websiteUrl,
      alt_text: altText,
      display_order: displayOrder,
      is_active: isActive,
      file,
    });
  }

  const altPlaceholder = name.trim() ? defaultAltText(name) : "Logo de Copec";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormSection
        title={editing ? `Editar colaborador · ${editing.name}` : "Nuevo colaborador"}
        description={
          editing
            ? "Modifica los datos y guarda los cambios. Si subes un logo nuevo, el anterior se elimina del almacenamiento."
            : "Registra una empresa, proveedor o marca. Los colaboradores activos aparecen en el carrusel de la página de inicio."
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {/* ── Columna izquierda: datos ───────────────────────────────── */}
          <div className="space-y-4">
            <Field label="Nombre del colaborador" required>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                className="admin-input"
                placeholder="Ej: Copec"
              />
            </Field>

            <Field
              label="URL del colaborador"
              hint="Opcional. Si escribes «www.copec.cl» se normaliza a «https://www.copec.cl»."
            >
              <input
                type="text"
                inputMode="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                maxLength={500}
                className="admin-input"
                placeholder="https://www.copec.cl"
              />
            </Field>

            <Field
              label="Texto ALT"
              hint="Opcional. Describe el logo para accesibilidad y SEO. Si lo dejas vacío se genera automáticamente."
            >
              <input
                type="text"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                maxLength={180}
                className="admin-input"
                placeholder={altPlaceholder}
              />
            </Field>

            <div className="grid items-center gap-4 sm:grid-cols-2">
              <Field label="Orden" hint="Menor número aparece primero.">
                <input
                  type="number"
                  min={0}
                  max={9999}
                  step={1}
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="admin-input"
                />
              </Field>
              <div className="sm:pt-5">
                <label className="admin-label">Estado</label>
                <ToggleControlled
                  checked={isActive}
                  onChange={setIsActive}
                  label={isActive ? "Activo" : "Inactivo"}
                  description={isActive ? "Visible en el carrusel público" : "Oculto del sitio"}
                />
              </div>
            </div>
          </div>

          {/* ── Columna derecha: logo + preview ────────────────────────── */}
          <div>
            <label className="admin-label">
              Logo / Imagen {!editing && <span className="text-[#b87608]">*</span>}
            </label>

            {previewUrl ? (
              <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex h-40 items-center justify-center p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local/Storage en panel privado */}
                  <img
                    src={previewUrl}
                    alt="Vista previa del logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#0a1628]/0 opacity-0 transition-all group-hover:bg-[#0a1628]/45 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0a1628]"
                  >
                    Cambiar
                  </button>
                  {file && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <X className="h-3 w-3" />
                      Descartar
                    </button>
                  )}
                </div>
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#1a6b3c]">
                  <Check className="h-3 w-3" />
                  {file ? "Logo nuevo listo" : "Logo actual"}
                </span>
              </div>
            ) : (
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); pickFile(e.dataTransfer.files?.[0]); }}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  drag
                    ? "border-[#1a6b3c] bg-[#1a6b3c]/10"
                    : "border-slate-200 hover:border-[#1a6b3c]/40 hover:bg-slate-100"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a6b3c]/10">
                    <UploadCloud className="h-5 w-5 text-[#1a6b3c]" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Arrastra o haz clic para subir</p>
                  <p className="text-[11px] text-slate-500">PNG, JPG o WebP · máximo 5 MB</p>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept={ALLOWED_LOGO_ACCEPT}
              onChange={(e) => pickFile(e.target.files?.[0])}
              className="hidden"
            />

            <p className="mt-1.5 flex items-start gap-1.5 text-[11px] text-slate-400">
              <ImageIcon className="mt-0.5 h-3 w-3 shrink-0" />
              <span>
                El logo se convierte a WebP y se reescala a 480 px de ancho antes de subirse, conservando la
                transparencia.
              </span>
            </p>

            {fileError && (
              <p className="mt-1.5 flex items-start gap-1 text-[11px] font-medium text-red-600">
                <X className="mt-0.5 h-3 w-3 shrink-0" />
                <span>{fileError}</span>
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-2.5 border-t border-slate-100 pt-4">
          <button type="submit" disabled={busy} className="admin-btn-primary">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {busyLabel}
              </>
            ) : editing ? (
              "Guardar cambios"
            ) : (
              "Agregar colaborador"
            )}
          </button>
          {editing && (
            <button type="button" onClick={onCancel} disabled={busy} className="admin-btn-ghost !py-2.5">
              Cancelar edición
            </button>
          )}
        </div>
      </FormSection>
    </form>
  );
}

/* Toggle controlado — la versión de `ui.tsx` es no controlada (defaultChecked)
   y aquí el estado tiene que reflejar el registro que se está editando. */
function ToggleControlled({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="group flex cursor-pointer select-none items-center gap-3">
      <span className="relative inline-block shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span className="block h-6 w-10 rounded-full bg-slate-200 transition-colors peer-checked:bg-[#1a6b3c]" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
      </span>
      <span>
        <span className="block text-[13px] font-bold text-[#0a1628]">{label}</span>
        {description && <span className="block text-[11px] text-slate-500">{description}</span>}
      </span>
    </label>
  );
}
