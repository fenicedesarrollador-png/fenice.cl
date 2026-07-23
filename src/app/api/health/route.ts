import { NextResponse } from "next/server";

// Endpoint de salud ultraliviano para "keep-warm": un ping periódico lo llama
// para evitar que el servicio de Render se duerma (el cold-start hace que las
// páginas /admin —que son no-store— tarden 20-50s y el móvil corte con
// "This page couldn't load"). No toca base de datos ni hace trabajo pesado.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, ts: Date.now() },
    { headers: { "cache-control": "no-store" } },
  );
}
