"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  X, ChevronLeft, ChevronRight, FileText, FileCheck2, BadgeCheck, Truck,
  Loader2, AlertTriangle, ShieldQuestion, ZoomIn, ZoomOut, Calendar,
  Fuel, Layers, ShieldCheck, Award, ClipboardCheck,
  MessageCircle, Info,
} from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { BadgeTone, DocumentType } from "@/lib/fleet";
import { DOCUMENT_TYPE_LABELS, formatDateCL, formatLiters } from "@/lib/fleet";
import type { PublicFleetDocument, PublicFleetVehicle } from "./FlotaVehiculoCard";

const DOCUMENT_TYPE_ICONS: Record<DocumentType, typeof FileText> = {
  sec_tc10a: ShieldCheck,
  tank_tc8: Award,
  hermeticity_test: FileCheck2,
  periodic_inspection: ClipboardCheck,
  visual_inspection: ClipboardCheck,
  manufacturing_certificate: Award,
  circulation_permit: FileCheck2,
  technical_revision: ClipboardCheck,
  insurance: ShieldCheck,
  other: FileText,
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-600 border-slate-200",
  green: "bg-[#1a6b3c]/12 text-[#0d4a28] border-[#1a6b3c]/25",
  amber: "bg-[#f5a623]/12 text-[#b87608] border-[#f5a623]/25",
  red: "bg-red-50 text-red-600 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function DocumentStatusBadge({ tone, label }: { tone: BadgeTone; label: string }) {
  return (
    <span className={`shrink-0 inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${TONE_CLASSES[tone]}`}>
      {label}
    </span>
  );
}

/* ============================================================
   Visor de PDF en canvas (pdf.js) — sin botón de descarga nativo,
   clic derecho deshabilitado y marca de agua discreta. Esto reduce
   la fricción para copiar el archivo, pero ninguna medida de software
   puede impedir una captura de pantalla a nivel de sistema operativo.
   ============================================================ */
function SecurePdfViewer({ url, plate }: { url: string; plate: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [retryToken, setRetryToken] = useState(0);

  // Carga el documento al montar (o al reintentar). El padre remonta este
  // componente con `key={documento.id}` al cambiar de documento, así que el
  // estado inicial (loading=true, page=1, zoom=1) ya cumple el rol de "reset".
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Reset dentro de la función async (no al tope del efecto): en un
      // reintento el estado anterior tiene loading=false/error=mensaje y hay
      // que limpiarlo antes de la nueva carga.
      setLoading(true);
      setError("");
      try {
        // 1) Traemos los bytes con fetch() directo (no con la lógica interna
        //    de pdf.js): evita que pdf.js intente peticiones por rangos
        //    (Range) que pueden fallar por CORS aunque una descarga normal
        //    funcione. Si esto falla, el mensaje de error es específico
        //    (código HTTP / red), no genérico.
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "El archivo no existe en el bucket (404). Verifica que el PDF público se haya subido correctamente en /admin/flota."
              : `El servidor respondió con un error (HTTP ${response.status}).`,
          );
        }
        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength === 0) throw new Error("El archivo PDF está vacío.");

        // 2) Recién ahora entra pdf.js, a partir de los bytes ya descargados.
        const pdfjsLib = await import("pdfjs-dist");
        // Ruta estática fija (copiada a /public en postinstall) en vez de
        // `new URL(..., import.meta.url)`: esa resolución depende del
        // bundler y puede fallar en producción, dejando el visor en blanco.
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) { doc.destroy(); return; }
        pdfRef.current = doc;
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (e) {
        console.error("[FlotaDocumentViewerModal] error al cargar el PDF:", url, e);
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : "";
          const isNetwork = e instanceof TypeError; // fetch rechaza con TypeError en fallos de red/CORS
          setError(
            isNetwork
              ? "No se pudo conectar con el archivo (red o CORS). Revisa tu conexión e intenta de nuevo."
              : msg || "No se pudo cargar el documento. Intenta nuevamente.",
          );
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      pdfRef.current?.destroy();
      pdfRef.current = null;
    };
  }, [url, retryToken]);

  // Renderiza la página activa.
  useEffect(() => {
    if (!pdfRef.current || !canvasRef.current || loading) return;
    let cancelled = false;

    (async () => {
      const doc = pdfRef.current;
      if (!doc) return;
      try {
        const pdfPage = await doc.getPage(page);
        if (cancelled) return;
        const containerWidth = containerRef.current?.clientWidth ?? 800;
        const baseViewport = pdfPage.getViewport({ scale: 1 });
        const fitScale = (containerWidth - 32) / baseViewport.width;
        const viewport = pdfPage.getViewport({ scale: fitScale * zoom * (window.devicePixelRatio || 1) });

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / (window.devicePixelRatio || 1)}px`;
        canvas.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;

        renderTaskRef.current?.cancel();
        const task = pdfPage.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = task;
        await task.promise;
      } catch {
        // Render cancelado (cambio de página rápido) o error puntual: no bloquea la UI.
      }
    })();

    return () => { cancelled = true; };
  }, [page, zoom, loading]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-slate-100">
      {/* Barra de herramientas */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            aria-label="Página anterior"
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[12px] font-bold text-[#0a1628] tabular-nums min-w-[76px] text-center">
            {numPages > 0 ? `Página ${page} de ${numPages}` : "—"}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            disabled={page >= numPages || loading}
            aria-label="Página siguiente"
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.2).toFixed(1)))} disabled={loading} aria-label="Alejar" className="p-1.5 rounded-lg text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 disabled:opacity-30 transition-all">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold text-slate-400 tabular-nums w-9 text-center">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((z) => Math.min(2, +(z + 0.2).toFixed(1)))} disabled={loading} aria-label="Acercar" className="p-1.5 rounded-lg text-slate-500 hover:text-[#0a1628] hover:bg-slate-100 disabled:opacity-30 transition-all">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lienzo */}
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        className="relative flex-1 min-h-0 overflow-auto flex items-start justify-center p-4 select-none"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm font-medium">Cargando documento…</span>
          </div>
        )}
        {!loading && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <p className="text-sm text-slate-500 font-medium max-w-sm">{error}</p>
            <button
              type="button"
              onClick={() => setRetryToken((t) => t + 1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0a1628] hover:bg-[#0d2040] px-3.5 py-2 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}
        {!error && (
          <div className="relative shadow-lg" aria-label={`Vista previa del documento, patente ${plate}, página ${page} de ${numPages}`}>
            <canvas ref={canvasRef} className="block bg-white" />
            {/* Marca de agua discreta: disuade la reutilización sin bloquear la lectura. */}
            {!loading && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-wrap content-around justify-around opacity-[0.07] overflow-hidden"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <span key={i} className="text-[11px] font-bold text-[#0a1628] -rotate-[28deg] whitespace-nowrap">
                    FENICE SPA · {plate} · solo lectura
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlotaDocumentViewerModal({
  vehicle,
  waUrl,
  onClose,
}: {
  vehicle: PublicFleetVehicle;
  waUrl: string;
  onClose: () => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(vehicle.documents[0]?.id ?? null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const selected = useMemo(() => vehicle.documents.find((d) => d.id === selectedId) ?? null, [vehicle.documents, selectedId]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flota-doc-modal-title"
    >
      <div className="absolute inset-0 bg-[#0a1628]/70 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-6xl h-[94vh] sm:h-[88vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col outline-none animate-fade-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-slate-200 shrink-0 bg-[#0a1628]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-[#f5a623]" />
            </div>
            <div className="min-w-0">
              <p id="flota-doc-modal-title" className="text-sm font-black text-white truncate">
                Documentación verificable
              </p>
              <p className="text-[11px] text-slate-400">Flota certificada Fenice SPA</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar visor de documentación"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-all shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Cuerpo: izquierda info, derecha visor */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Panel izquierdo */}
          <div className="w-full md:w-[400px] shrink-0 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col min-h-0 max-h-[46vh] md:max-h-none bg-slate-50/60">
            {/* Resumen del vehículo */}
            <div className="shrink-0 bg-white">
              <div className="relative aspect-[16/9]">
                {vehicle.imageUrl ? (
                  <Image src={vehicle.imageUrl} alt="" fill sizes="400px" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                    <Truck className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/85 via-[#0a1628]/10 to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center bg-[#0a1628]/85 backdrop-blur-sm text-white text-xs font-black tracking-wider px-2.5 py-1 rounded-lg">
                  {vehicle.plate}
                </span>
                <span className={`absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${TONE_CLASSES[vehicle.vehicleStatusTone]}`}>
                  {vehicle.vehicleStatusLabel}
                </span>
                <p className="absolute bottom-3 left-3 right-3 text-white text-[13px] font-bold leading-tight">
                  {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
                </p>
              </div>
              <dl className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                <div className="flex flex-col items-center gap-1 py-3 text-center">
                  <Calendar className="w-3.5 h-3.5 text-[#1a6b3c]" />
                  <dt className="sr-only">Año</dt>
                  <dd className="text-[11.5px] font-bold text-[#0a1628]">{vehicle.manufacture_year ?? "—"}</dd>
                </div>
                <div className="flex flex-col items-center gap-1 py-3 text-center">
                  <Fuel className="w-3.5 h-3.5 text-[#1a6b3c]" />
                  <dt className="sr-only">Capacidad</dt>
                  <dd className="text-[11.5px] font-bold text-[#0a1628]">{formatLiters(vehicle.tank_capacity_liters)}</dd>
                </div>
                <div className="flex flex-col items-center gap-1 py-3 text-center">
                  <Layers className="w-3.5 h-3.5 text-[#1a6b3c]" />
                  <dt className="sr-only">Compartimientos</dt>
                  <dd className="text-[11.5px] font-bold text-[#0a1628]">{vehicle.compartments ?? "—"} comp.</dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-2.5 border-b border-slate-100 shrink-0 flex items-center justify-between">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Documentos ({vehicle.documents.length})</p>
            </div>

            {vehicle.documents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-8">
                <ShieldQuestion className="w-6 h-6 text-slate-400 mb-2" />
                <p className="text-[12.5px] text-slate-500 leading-relaxed">Aún no hay documentos públicos disponibles para este vehículo.</p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[12.5px] font-bold text-[#1a6b3c] hover:text-[#0d4a28]">
                  Solicitar antecedentes por WhatsApp
                </a>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
                {vehicle.documents.map((doc) => (
                  <DocumentListItem key={doc.id} doc={doc} selected={doc.id === selectedId} onSelect={() => setSelectedId(doc.id)} />
                ))}
              </div>
            )}

            {/* Pie: confianza + contacto — evita dejar espacio vacío y refuerza autoridad */}
            <div className="shrink-0 border-t border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Estos antecedentes tienen fines informativos. Verifica vigencia y autenticidad con los folios y códigos indicados.
                </p>
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#1a6b3c] hover:bg-[#0d4a28] text-white font-bold text-[12.5px] px-4 py-2.5 rounded-xl transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Consultar por esta documentación
              </a>
            </div>
          </div>

          {/* Panel derecho: visor */}
          <div className="flex-1 min-h-0 min-w-0">
            {selected ? (
              <SecurePdfViewer key={selected.id} url={selected.fileUrl} plate={vehicle.plate} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400 px-6 text-center">
                <FileText className="w-8 h-8" />
                <p className="text-sm font-medium">Selecciona un documento para visualizarlo aquí.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaField({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <dt className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">{label}</dt>
      <dd className="text-[12px] font-semibold text-[#0a1628] leading-snug break-words">{value}</dd>
    </div>
  );
}

function DocumentListItem({
  doc, selected, onSelect,
}: {
  doc: PublicFleetDocument;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = DOCUMENT_TYPE_ICONS[doc.document_type as DocumentType] ?? FileText;
  const toneBorder: Record<BadgeTone, string> = {
    neutral: "border-l-slate-300",
    green: "border-l-[#1a6b3c]",
    amber: "border-l-[#f5a623]",
    red: "border-l-red-400",
    blue: "border-l-blue-400",
    purple: "border-l-purple-400",
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 border-l-4 bg-white overflow-hidden transition-all ${toneBorder[doc.statusTone]} ${selected ? "shadow-sm ring-1 ring-[#1a6b3c]/20" : ""}`}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="w-full text-left px-3.5 py-3 flex items-start gap-2.5 hover:bg-slate-50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-[#1a6b3c]/12" : "bg-slate-100"}`}>
          <Icon className={`w-4 h-4 ${selected ? "text-[#1a6b3c]" : "text-slate-500"}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9.5px] font-bold text-[#1a6b3c] uppercase tracking-wider">
            {DOCUMENT_TYPE_LABELS[doc.document_type as keyof typeof DOCUMENT_TYPE_LABELS] ?? "Documento"}
          </p>
          <p className={`text-[13px] leading-snug ${selected ? "font-black text-[#0a1628]" : "font-bold text-[#0a1628]/90"}`}>{doc.title}</p>
        </div>
        <DocumentStatusBadge tone={doc.statusTone} label={doc.statusLabel} />
      </button>

      {selected && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100">
          {doc.description && <p className="text-[11.5px] text-slate-500 leading-relaxed my-2.5">{doc.description}</p>}
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 bg-slate-50 rounded-lg p-3 my-2.5">
            {doc.issuing_entity && <MetaField label="Entidad" value={doc.issuing_entity} span />}
            {doc.certificate_number && <MetaField label="N° certificado" value={doc.certificate_number} />}
            {doc.folio && <MetaField label="Folio" value={doc.folio} />}
            {doc.verification_code && <MetaField label="Código de verificación" value={doc.verification_code} span />}
            {doc.issued_at && <MetaField label="Emisión" value={formatDateCL(doc.issued_at)} />}
            {doc.expires_at && <MetaField label="Vencimiento" value={formatDateCL(doc.expires_at)} />}
            {doc.next_inspection_at && <MetaField label="Próxima inspección" value={formatDateCL(doc.next_inspection_at)} span />}
          </dl>
          {doc.verification_url && isSafeExternalUrl(doc.verification_url) && (
            <a
              href={doc.verification_url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1a6b3c] bg-[#1a6b3c]/10 hover:bg-[#1a6b3c]/15 px-3 py-1.5 rounded-lg transition-colors"
            >
              <BadgeCheck className="w-3 h-3" aria-hidden="true" /> Verificar
            </a>
          )}
        </div>
      )}
    </div>
  );
}
