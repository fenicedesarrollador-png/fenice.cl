import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

/**
 * PDF corporativo de una solicitud de cotización (formato A4).
 * Diseño: banda navy con marca, línea ámbar, secciones con títulos verdes,
 * grilla de datos label/valor, bloque de mensaje y pie institucional.
 * Fuentes estándar Helvetica (WinAnsi: soporta acentos y ñ).
 */

export type CotizacionPdfData = {
  id: string;
  nombre: string;
  empresa: string;
  rut_empresa: string | null;
  email: string;
  telefono: string;
  comuna: string | null;
  servicio_solicitado: string;
  volumen_estimado: string | null;
  frecuencia: string | null;
  mensaje: string | null;
  estado: string;
  created_at: string;
  // Campos del formulario potenciado (migration_potenciacion_comercial.sql)
  tipo_combustible?: string | null;
  direccion_entrega?: string | null;
  fecha_estimada?: string | null;
  tipo_instalacion?: string | null;
};

const NAVY = rgb(0.039, 0.086, 0.157); // #0a1628
const GREEN = rgb(0.102, 0.42, 0.235); // #1a6b3c
const AMBER = rgb(0.961, 0.651, 0.137); // #f5a623
const INK = rgb(0.118, 0.161, 0.231); // slate-800
const MUTED = rgb(0.392, 0.455, 0.545); // slate-500
const LIGHT = rgb(0.956, 0.973, 0.984); // slate-50
const LINE = rgb(0.847, 0.882, 0.925); // slate-200

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;

const ESTADO_LABEL: Record<string, string> = {
  nuevo: "NUEVO",
  en_proceso: "EN PROCESO",
  cotizado: "COTIZADO",
  cerrado: "CERRADO",
  contactado: "CONTACTADO",
};

/** Elimina caracteres fuera de WinAnsi (emojis, etc.) para evitar errores de codificación. */
function sanitize(text: string): string {
  return text.replace(/[^\x20-\x7E -ÿ–—‘’“”•]/g, "");
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = sanitize(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export async function buildCotizacionPdf(data: CotizacionPdfData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  pdf.setTitle(`Cotización ${data.empresa} — Fenice SPA`);
  pdf.setAuthor("Fenice SPA");
  pdf.setSubject("Solicitud de cotización de combustible");
  pdf.setCreator("Panel administrativo fenice.cl");

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  const contentW = PAGE_W - MARGIN * 2;

  const folio = data.id.slice(0, 8).toUpperCase();
  const fecha = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date(data.created_at));

  /* ── Encabezado corporativo ─────────────────────────────────── */
  function drawHeader(p: PDFPage) {
    p.drawRectangle({ x: 0, y: PAGE_H - 108, width: PAGE_W, height: 108, color: NAVY });
    p.drawRectangle({ x: 0, y: PAGE_H - 112, width: PAGE_W, height: 4, color: AMBER });

    p.drawText("FENICE", { x: MARGIN, y: PAGE_H - 52, size: 26, font: bold, color: rgb(1, 1, 1) });
    const feniceW = bold.widthOfTextAtSize("FENICE", 26);
    p.drawText("SPA", { x: MARGIN + feniceW + 8, y: PAGE_H - 52, size: 13, font: bold, color: AMBER });
    p.drawText("Distribución de combustible · Región Metropolitana", {
      x: MARGIN, y: PAGE_H - 70, size: 9, font: helv, color: rgb(0.58, 0.65, 0.76),
    });
    p.drawText("notifica@fenice.cl · +56 9 3957 9658 · fenice.cl", {
      x: MARGIN, y: PAGE_H - 84, size: 9, font: helv, color: rgb(0.58, 0.65, 0.76),
    });

    const docTitle = "SOLICITUD DE COTIZACIÓN";
    const dtW = bold.widthOfTextAtSize(docTitle, 13);
    p.drawText(docTitle, { x: PAGE_W - MARGIN - dtW, y: PAGE_H - 48, size: 13, font: bold, color: rgb(1, 1, 1) });
    const folioTxt = `Folio N° ${folio}`;
    const fW = helv.widthOfTextAtSize(folioTxt, 10);
    p.drawText(folioTxt, { x: PAGE_W - MARGIN - fW, y: PAGE_H - 66, size: 10, font: helv, color: AMBER });
    const fechaTxt = sanitize(`Recibida: ${fecha}`);
    const feW = helv.widthOfTextAtSize(fechaTxt, 8.5);
    p.drawText(fechaTxt, { x: PAGE_W - MARGIN - feW, y: PAGE_H - 82, size: 8.5, font: helv, color: rgb(0.58, 0.65, 0.76) });
  }

  /* ── Pie de página ──────────────────────────────────────────── */
  function drawFooter(p: PDFPage, pageNum: number, totalHint: number) {
    p.drawLine({ start: { x: MARGIN, y: 64 }, end: { x: PAGE_W - MARGIN, y: 64 }, thickness: 0.75, color: LINE });
    p.drawText("FENICE SpA · Calle La Granja 8396, San Ramón, Región Metropolitana · Declaraciones TC4 / TC10A · DS 160", {
      x: MARGIN, y: 50, size: 7.5, font: helv, color: MUTED,
    });
    p.drawText("Documento generado desde el panel administrativo de fenice.cl — uso interno y comercial.", {
      x: MARGIN, y: 39, size: 7.5, font: helv, color: MUTED,
    });
    const pg = `Página ${pageNum}${totalHint > 1 ? ` de ${totalHint}` : ""}`;
    const pgW = helv.widthOfTextAtSize(pg, 7.5);
    p.drawText(pg, { x: PAGE_W - MARGIN - pgW, y: 50, size: 7.5, font: helv, color: MUTED });
  }

  drawHeader(page);
  let y = PAGE_H - 150;

  function ensureSpace(needed: number) {
    if (y - needed < 90) {
      page = pdf.addPage([PAGE_W, PAGE_H]);
      drawHeader(page);
      y = PAGE_H - 150;
    }
  }

  /* ── Badge de estado ────────────────────────────────────────── */
  const estadoTxt = ESTADO_LABEL[data.estado] ?? data.estado.toUpperCase();
  const badgeW = bold.widthOfTextAtSize(estadoTxt, 9) + 20;
  page.drawRectangle({ x: MARGIN, y: y - 6, width: badgeW, height: 20, color: GREEN });
  page.drawText(estadoTxt, { x: MARGIN + 10, y: y, size: 9, font: bold, color: rgb(1, 1, 1) });
  const estadoNote = sanitize("Estado actual de la solicitud en el panel administrativo");
  page.drawText(estadoNote, { x: MARGIN + badgeW + 10, y: y, size: 8.5, font: helv, color: MUTED });
  y -= 40;

  /* ── Sección: título verde con línea ────────────────────────── */
  function sectionTitle(text: string) {
    ensureSpace(40);
    page.drawText(text.toUpperCase(), { x: MARGIN, y, size: 10.5, font: bold, color: GREEN });
    page.drawLine({
      start: { x: MARGIN, y: y - 7 },
      end: { x: PAGE_W - MARGIN, y: y - 7 },
      thickness: 1.2,
      color: GREEN,
    });
    y -= 28;
  }

  /* ── Grilla de pares label/valor en dos columnas ────────────── */
  function fieldGrid(fields: { label: string; value: string | null | undefined }[]) {
    const colW = contentW / 2;
    const rowH = 34;
    const rowsCount = Math.ceil(fields.length / 2);
    ensureSpace(rowsCount * rowH + 8);

    fields.forEach((f, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const fx = MARGIN + col * colW;
      const fy = y - row * rowH;

      page.drawText(f.label.toUpperCase(), { x: fx, y: fy, size: 7.5, font: bold, color: MUTED });
      const value = sanitize(f.value?.trim() || "—");
      const lines = wrapText(value, helv, 10.5, colW - 24);
      page.drawText(lines[0] ?? "—", { x: fx, y: fy - 13, size: 10.5, font: helv, color: INK });
      if (lines.length > 1) {
        page.drawText(`${lines[1].slice(0, 40)}…`, { x: fx, y: fy - 25, size: 8.5, font: helv, color: MUTED });
      }
    });
    y -= rowsCount * rowH + 8;
  }

  sectionTitle("Datos del solicitante");
  fieldGrid([
    { label: "Empresa u organización", value: data.empresa },
    { label: "Nombre de contacto", value: data.nombre },
    { label: "RUT empresa", value: data.rut_empresa },
    { label: "Correo electrónico", value: data.email },
    { label: "Teléfono", value: data.telefono },
    { label: "Comuna / zona de entrega", value: data.comuna },
    ...(data.direccion_entrega ? [{ label: "Dirección de entrega", value: data.direccion_entrega }] : []),
  ]);

  sectionTitle("Detalle del requerimiento");
  fieldGrid([
    { label: "Servicio solicitado", value: data.servicio_solicitado },
    ...(data.tipo_combustible ? [{ label: "Tipo de combustible", value: data.tipo_combustible }] : []),
    { label: "Volumen estimado por despacho", value: data.volumen_estimado },
    { label: "Frecuencia de despacho", value: data.frecuencia },
    ...(data.fecha_estimada ? [{ label: "Fecha estimada de entrega", value: data.fecha_estimada }] : []),
    ...(data.tipo_instalacion ? [{ label: "Instalación / equipo a abastecer", value: data.tipo_instalacion }] : []),
    { label: "Fecha de recepción", value: fecha },
  ]);

  /* ── Mensaje del cliente (bloque con fondo) ─────────────────── */
  if (data.mensaje?.trim()) {
    sectionTitle("Mensaje del cliente");
    const msgLines = wrapText(data.mensaje, helv, 10, contentW - 32);
    const lineH = 15;

    let idx = 0;
    while (idx < msgLines.length) {
      const available = Math.floor((y - 100) / lineH);
      const chunk = msgLines.slice(idx, idx + Math.max(available, 1));
      const boxH = chunk.length * lineH + 22;
      ensureSpace(boxH + 10);
      page.drawRectangle({ x: MARGIN, y: y - boxH + 14, width: contentW, height: boxH, color: LIGHT });
      page.drawRectangle({ x: MARGIN, y: y - boxH + 14, width: 3, height: boxH, color: AMBER });
      chunk.forEach((line, i) => {
        page.drawText(line, { x: MARGIN + 16, y: y - 8 - i * lineH, size: 10, font: helv, color: INK });
      });
      y -= boxH + 14;
      idx += chunk.length;
    }
  }

  /* ── Bloque de siguiente paso ───────────────────────────────── */
  const pasoLines = wrapText(
    `Contactar a ${data.nombre} (${data.empresa}) para confirmar condiciones, precio y coordinación del despacho.`,
    helv,
    9.5,
    contentW - 32,
  ).slice(0, 3);
  const pasoBoxH = 44 + pasoLines.length * 13;
  ensureSpace(pasoBoxH + 18);
  page.drawRectangle({ x: MARGIN, y: y - pasoBoxH + 6, width: contentW, height: pasoBoxH, color: NAVY });
  page.drawRectangle({ x: MARGIN, y: y - pasoBoxH + 6, width: 3, height: pasoBoxH, color: AMBER });
  page.drawText("PRÓXIMO PASO", { x: MARGIN + 16, y: y - 12, size: 8, font: bold, color: AMBER });
  pasoLines.forEach((line, i) => {
    page.drawText(line, { x: MARGIN + 16, y: y - 27 - i * 13, size: 9.5, font: helv, color: rgb(1, 1, 1) });
  });
  page.drawText(sanitize(`Respuesta directa: ${data.email} · ${data.telefono}`), {
    x: MARGIN + 16, y: y - 27 - pasoLines.length * 13 - 2, size: 9, font: helv, color: rgb(0.7, 0.76, 0.85),
  });

  /* ── Pies de página ─────────────────────────────────────────── */
  const pages = pdf.getPages();
  pages.forEach((p, i) => drawFooter(p, i + 1, pages.length));

  return pdf.save();
}
