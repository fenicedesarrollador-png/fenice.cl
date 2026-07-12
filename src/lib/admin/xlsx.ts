import ExcelJS from "exceljs";

/**
 * Generador de Excel corporativo Fenice.
 * Hoja con banda de título navy, fila de encabezados verde, zebra rows,
 * autofiltro, anchos automáticos y panel congelado.
 */

const NAVY = "FF0A1628";
const GREEN = "FF1A6B3C";
const AMBER = "FFF5A623";
const ZEBRA = "FFF4F7FB";
const BORDER = "FFD8E0EC";

export type XlsxColumn = {
  header: string;
  key: string;
  width?: number;
};

export async function buildWorkbook({
  sheetName,
  title,
  subtitle,
  columns,
  rows,
}: {
  sheetName: string;
  title: string;
  subtitle?: string;
  columns: XlsxColumn[];
  rows: Record<string, string | number | null | undefined>[];
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Fenice SPA — Panel Administrativo";
  wb.created = new Date();

  const ws = wb.addWorksheet(sheetName, {
    views: [{ state: "frozen", ySplit: 4 }],
  });

  const lastCol = columns.length;

  // Fila 1 — título corporativo
  ws.mergeCells(1, 1, 1, lastCol);
  const titleCell = ws.getCell(1, 1);
  titleCell.value = `FENICE SPA — ${title}`;
  titleCell.font = { name: "Calibri", size: 15, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  titleCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(1).height = 30;

  // Fila 2 — subtítulo / metadata
  ws.mergeCells(2, 1, 2, lastCol);
  const subCell = ws.getCell(2, 1);
  const generado = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date());
  subCell.value = `${subtitle ? `${subtitle} · ` : ""}${rows.length} registro${rows.length !== 1 ? "s" : ""} · Generado el ${generado} · fenice.cl`;
  subCell.font = { name: "Calibri", size: 10, color: { argb: "FFB9C6DA" } };
  subCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  subCell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
  ws.getRow(2).height = 18;

  // Fila 3 — línea de acento ámbar
  ws.mergeCells(3, 1, 3, lastCol);
  ws.getCell(3, 1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: AMBER } };
  ws.getRow(3).height = 4;

  // Fila 4 — encabezados
  const headerRow = ws.getRow(4);
  columns.forEach((col, i) => {
    const cell = headerRow.getCell(i + 1);
    cell.value = col.header;
    cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN } };
    cell.alignment = { vertical: "middle", horizontal: "left", indent: 1 };
    cell.border = { bottom: { style: "medium", color: { argb: NAVY } } };
  });
  headerRow.height = 22;

  // Datos
  rows.forEach((row, rIdx) => {
    const excelRow = ws.getRow(5 + rIdx);
    columns.forEach((col, cIdx) => {
      const cell = excelRow.getCell(cIdx + 1);
      const value = row[col.key];
      cell.value = value === null || value === undefined || value === "" ? "—" : value;
      cell.font = { name: "Calibri", size: 10.5, color: { argb: "FF1E293B" } };
      cell.alignment = { vertical: "middle", horizontal: "left", indent: 1, wrapText: true };
      if (rIdx % 2 === 1) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ZEBRA } };
      }
      cell.border = { bottom: { style: "thin", color: { argb: BORDER } } };
    });
    excelRow.height = 18;
  });

  // Anchos: definidos o calculados según contenido (con tope)
  columns.forEach((col, i) => {
    if (col.width) {
      ws.getColumn(i + 1).width = col.width;
      return;
    }
    const maxLen = Math.max(
      col.header.length,
      ...rows.slice(0, 200).map((r) => String(r[col.key] ?? "").length),
    );
    ws.getColumn(i + 1).width = Math.min(Math.max(maxLen + 4, 12), 48);
  });

  // Autofiltro sobre los encabezados
  ws.autoFilter = {
    from: { row: 4, column: 1 },
    to: { row: 4 + rows.length, column: lastCol },
  };

  const buffer = await wb.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

export function xlsxResponse(buffer: Buffer, filename: string) {
  return new Response(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
