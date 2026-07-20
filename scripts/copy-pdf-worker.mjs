// Copia el worker de pdfjs-dist a /public para servirlo como asset estático
// en una ruta fija ("/pdf.worker.min.mjs"). Evitamos `new URL(..., import.meta.url)`
// porque en producción (Vercel + Turbopack) esa resolución puede fallar y el
// visor de documentos de /admin/flota y la Home quedan en blanco con
// "No se pudo cargar el documento". Se ejecuta en postinstall para que el
// archivo siempre coincida con la versión instalada de pdfjs-dist (la API y
// el worker deben tener la MISMA versión, o pdf.js falla).
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, "node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const destDir = join(root, "public");
const dest = join(destDir, "pdf.worker.min.mjs");

if (!existsSync(src)) {
  console.warn("[copy-pdf-worker] pdfjs-dist no está instalado todavía, se omite la copia.");
  process.exit(0);
}
if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log("[copy-pdf-worker] pdf.worker.min.mjs copiado a /public");
