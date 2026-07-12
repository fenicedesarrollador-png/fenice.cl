import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { buildCotizacionPdf, type CotizacionPdfData } from "@/lib/admin/cotizacionPdf";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { user, supabase } = await requireAdmin();
  if (!user || !supabase) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const { data, error } = await supabase
    .from("cotizaciones")
    .select(
      "id, nombre, empresa, rut_empresa, email, telefono, comuna, servicio_solicitado, volumen_estimado, frecuencia, mensaje, estado, created_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Cotización no encontrada." }, { status: 404 });
  }

  const pdfBytes = await buildCotizacionPdf(data as CotizacionPdfData);
  const empresaSlug = (data.empresa as string)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  return new Response(new Uint8Array(pdfBytes), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="cotizacion_${empresaSlug}_${(data.id as string).slice(0, 8)}.pdf"`,
      "cache-control": "no-store",
    },
  });
}
