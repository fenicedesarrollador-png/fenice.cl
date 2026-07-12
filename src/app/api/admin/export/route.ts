import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { buildWorkbook, xlsxResponse, type XlsxColumn } from "@/lib/admin/xlsx";

export const dynamic = "force-dynamic";

type Row = Record<string, string | number | null | undefined>;

function fmtFecha(iso: string | null | undefined) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Santiago",
  }).format(new Date(iso));
}

const ESTADO_LABEL: Record<string, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  en_proceso: "En proceso",
  cotizado: "Cotizado",
  cerrado: "Cerrado",
};

/* Configuración por dataset: query + columnas + mapeo de fila */
type DatasetConfig = {
  titulo: string;
  hoja: string;
  tabla: string;
  select: string;
  dateField: string;
  columns: XlsxColumn[];
  map: (r: Record<string, unknown>) => Row;
};

const DATASETS: Record<string, DatasetConfig> = {
  cotizaciones: {
    titulo: "Cotizaciones",
    hoja: "Cotizaciones",
    tabla: "cotizaciones",
    select:
      "id, nombre, empresa, rut_empresa, email, telefono, comuna, servicio_solicitado, volumen_estimado, frecuencia, mensaje, estado, created_at",
    dateField: "created_at",
    columns: [
      { header: "Fecha", key: "fecha", width: 17 },
      { header: "Empresa", key: "empresa" },
      { header: "Contacto", key: "nombre" },
      { header: "RUT empresa", key: "rut" },
      { header: "Email", key: "email" },
      { header: "Teléfono", key: "telefono", width: 16 },
      { header: "Comuna", key: "comuna" },
      { header: "Servicio solicitado", key: "servicio" },
      { header: "Volumen estimado", key: "volumen" },
      { header: "Frecuencia", key: "frecuencia" },
      { header: "Estado", key: "estado", width: 13 },
      { header: "Mensaje", key: "mensaje", width: 46 },
    ],
    map: (r) => ({
      fecha: fmtFecha(r.created_at as string),
      empresa: r.empresa as string,
      nombre: r.nombre as string,
      rut: r.rut_empresa as string,
      email: r.email as string,
      telefono: r.telefono as string,
      comuna: r.comuna as string,
      servicio: r.servicio_solicitado as string,
      volumen: r.volumen_estimado as string,
      frecuencia: r.frecuencia as string,
      estado: ESTADO_LABEL[r.estado as string] ?? (r.estado as string),
      mensaje: r.mensaje as string,
    }),
  },
  leads: {
    titulo: "Contactos (Leads)",
    hoja: "Contactos",
    tabla: "leads",
    select: "id, nombre, telefono, email, comuna, tipo_operacion, volumen, mensaje, estado, notas, created_at",
    dateField: "created_at",
    columns: [
      { header: "Fecha", key: "fecha", width: 17 },
      { header: "Nombre", key: "nombre" },
      { header: "Teléfono", key: "telefono", width: 16 },
      { header: "Email", key: "email" },
      { header: "Comuna", key: "comuna" },
      { header: "Tipo de operación", key: "tipo" },
      { header: "Volumen", key: "volumen" },
      { header: "Estado", key: "estado", width: 13 },
      { header: "Mensaje", key: "mensaje", width: 42 },
      { header: "Notas internas", key: "notas", width: 32 },
    ],
    map: (r) => ({
      fecha: fmtFecha(r.created_at as string),
      nombre: r.nombre as string,
      telefono: r.telefono as string,
      email: r.email as string,
      comuna: r.comuna as string,
      tipo: r.tipo_operacion as string,
      volumen: r.volumen as string,
      estado: ESTADO_LABEL[r.estado as string] ?? (r.estado as string),
      mensaje: r.mensaje as string,
      notas: r.notas as string,
    }),
  },
  clientes: {
    titulo: "Clientes",
    hoja: "Clientes",
    tabla: "clientes",
    select: "id, nombre, sector, descripcion, testimonio, sitio_web, orden, activo, created_at",
    dateField: "created_at",
    columns: [
      { header: "Empresa", key: "nombre" },
      { header: "Sector", key: "sector" },
      { header: "Trabajos realizados", key: "descripcion", width: 48 },
      { header: "Testimonio", key: "testimonio", width: 42 },
      { header: "Sitio web", key: "web" },
      { header: "Orden", key: "orden", width: 9 },
      { header: "Visible", key: "activo", width: 10 },
      { header: "Creado", key: "fecha", width: 17 },
    ],
    map: (r) => ({
      nombre: r.nombre as string,
      sector: r.sector as string,
      descripcion: r.descripcion as string,
      testimonio: r.testimonio as string,
      web: r.sitio_web as string,
      orden: r.orden as number,
      activo: r.activo ? "Sí" : "No",
      fecha: fmtFecha(r.created_at as string),
    }),
  },
  equipo: {
    titulo: "Equipo",
    hoja: "Equipo",
    tabla: "equipo",
    select: "id, nombre, cargo, email, bio, orden, activo, created_at",
    dateField: "created_at",
    columns: [
      { header: "Nombre", key: "nombre" },
      { header: "Cargo", key: "cargo" },
      { header: "Email", key: "email" },
      { header: "Bio", key: "bio", width: 50 },
      { header: "Orden", key: "orden", width: 9 },
      { header: "Visible", key: "activo", width: 10 },
      { header: "Creado", key: "fecha", width: 17 },
    ],
    map: (r) => ({
      nombre: r.nombre as string,
      cargo: r.cargo as string,
      email: r.email as string,
      bio: r.bio as string,
      orden: r.orden as number,
      activo: r.activo ? "Sí" : "No",
      fecha: fmtFecha(r.created_at as string),
    }),
  },
};

export async function GET(request: Request) {
  const { user, supabase } = await requireAdmin();
  if (!user || !supabase) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const url = new URL(request.url);
  const tipo = url.searchParams.get("tipo") ?? "";

  // Caso especial: bandeja unificada (cotizaciones + contactos)
  if (tipo === "solicitudes") {
    return exportSolicitudes(supabase, url);
  }

  const config = DATASETS[tipo];
  if (!config) {
    return NextResponse.json(
      { error: `Tipo de exportación inválido. Disponibles: ${Object.keys(DATASETS).join(", ")}` },
      { status: 400 },
    );
  }

  const desde = url.searchParams.get("desde");
  const hasta = url.searchParams.get("hasta");
  const estado = url.searchParams.get("estado");

  let query = supabase
    .from(config.tabla)
    .select(config.select)
    .order(config.dateField, { ascending: false })
    .limit(5000);

  if (desde) query = query.gte(config.dateField, `${desde}T00:00:00`);
  if (hasta) query = query.lte(config.dateField, `${hasta}T23:59:59`);
  if (estado && estado !== "todos") query = query.eq("estado", estado);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = ((data ?? []) as unknown as Record<string, unknown>[]).map(config.map);
  const rango =
    desde || hasta
      ? `Período: ${desde ?? "inicio"} a ${hasta ?? "hoy"}`
      : "Historial completo";

  const buffer = await buildWorkbook({
    sheetName: config.hoja,
    title: config.titulo,
    subtitle: `${rango}${estado && estado !== "todos" ? ` · Estado: ${ESTADO_LABEL[estado] ?? estado}` : ""}`,
    columns: config.columns,
    rows,
  });

  const fecha = new Date().toISOString().slice(0, 10);
  return xlsxResponse(buffer, `fenice_${tipo}_${fecha}.xlsx`);
}

/* Bandeja unificada: normaliza cotizaciones + leads en una sola hoja */
async function exportSolicitudes(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>,
  url: URL,
) {
  const desde = url.searchParams.get("desde");
  const hasta = url.searchParams.get("hasta");
  const estado = url.searchParams.get("estado");
  const origen = url.searchParams.get("origen"); // todos | cotizacion | contacto

  const wantCot = origen !== "contacto";
  const wantLead = origen !== "cotizacion";

  async function fetchTabla(tabla: "cotizaciones" | "leads", select: string) {
    let query = supabase
      .from(tabla)
      .select(select)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (desde) query = query.gte("created_at", `${desde}T00:00:00`);
    if (hasta) query = query.lte("created_at", `${hasta}T23:59:59`);
    if (estado && estado !== "todos") query = query.eq("estado", estado);
    const { data, error } = await query;
    return { data: (data ?? []) as unknown as Record<string, unknown>[], error };
  }

  const [cotRes, leadRes] = await Promise.all([
    wantCot
      ? fetchTabla("cotizaciones", "nombre, empresa, rut_empresa, email, telefono, comuna, servicio_solicitado, volumen_estimado, frecuencia, mensaje, estado, created_at")
      : Promise.resolve({ data: [] as Record<string, unknown>[], error: null }),
    wantLead
      ? fetchTabla("leads", "nombre, telefono, email, comuna, tipo_operacion, volumen, mensaje, estado, notas, created_at")
      : Promise.resolve({ data: [] as Record<string, unknown>[], error: null }),
  ]);

  if (cotRes.error || leadRes.error) {
    return NextResponse.json(
      { error: cotRes.error?.message ?? leadRes.error?.message ?? "Error al exportar." },
      { status: 500 },
    );
  }

  type SolRow = Row & { _ts: number };
  const rows: SolRow[] = [
    ...cotRes.data.map((r): SolRow => ({
      _ts: new Date(r.created_at as string).getTime(),
      fecha: fmtFecha(r.created_at as string),
      origen: "Cotización",
      nombre: r.nombre as string,
      empresa: r.empresa as string,
      rut: r.rut_empresa as string,
      email: r.email as string,
      telefono: r.telefono as string,
      comuna: r.comuna as string,
      servicio: r.servicio_solicitado as string,
      volumen: r.volumen_estimado as string,
      frecuencia: r.frecuencia as string,
      estado: ESTADO_LABEL[r.estado as string] ?? (r.estado as string),
      mensaje: r.mensaje as string,
      notas: "",
    })),
    ...leadRes.data.map((r): SolRow => ({
      _ts: new Date(r.created_at as string).getTime(),
      fecha: fmtFecha(r.created_at as string),
      origen: "Contacto",
      nombre: r.nombre as string,
      empresa: "",
      rut: "",
      email: r.email as string,
      telefono: r.telefono as string,
      comuna: r.comuna as string,
      servicio: r.tipo_operacion as string,
      volumen: r.volumen as string,
      frecuencia: "",
      estado: ESTADO_LABEL[r.estado as string] ?? (r.estado as string),
      mensaje: r.mensaje as string,
      notas: r.notas as string,
    })),
  ].sort((a, b) => b._ts - a._ts);

  const buffer = await buildWorkbook({
    sheetName: "Solicitudes",
    title: "Solicitudes (Cotizaciones + Contactos)",
    subtitle: `${desde || hasta ? `Período: ${desde ?? "inicio"} a ${hasta ?? "hoy"}` : "Historial completo"}${origen && origen !== "todos" ? ` · Origen: ${origen}` : ""}${estado && estado !== "todos" ? ` · Estado: ${ESTADO_LABEL[estado] ?? estado}` : ""}`,
    columns: [
      { header: "Fecha", key: "fecha", width: 17 },
      { header: "Origen", key: "origen", width: 12 },
      { header: "Nombre", key: "nombre" },
      { header: "Empresa", key: "empresa" },
      { header: "RUT", key: "rut", width: 14 },
      { header: "Email", key: "email" },
      { header: "Teléfono", key: "telefono", width: 16 },
      { header: "Comuna", key: "comuna" },
      { header: "Servicio / Operación", key: "servicio" },
      { header: "Volumen", key: "volumen" },
      { header: "Frecuencia", key: "frecuencia" },
      { header: "Estado", key: "estado", width: 13 },
      { header: "Mensaje", key: "mensaje", width: 42 },
      { header: "Notas internas", key: "notas", width: 30 },
    ],
    rows: rows.map(({ _ts, ...rest }) => { void _ts; return rest; }),
  });

  const fecha = new Date().toISOString().slice(0, 10);
  return xlsxResponse(buffer, `fenice_solicitudes_${fecha}.xlsx`);
}
