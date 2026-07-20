import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Edge Functions de Supabase: corren en Deno, no en el proyecto Next.
    "supabase/functions/**",
    // Worker de pdfjs-dist copiado a /public en postinstall (ver
    // scripts/copy-pdf-worker.mjs): es un build minificado de terceros, no
    // código fuente del proyecto.
    "public/pdf.worker.min.mjs",
  ]),
]);

export default eslintConfig;
