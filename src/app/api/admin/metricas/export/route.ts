import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildAnalyticsRpcArgs, formatDuration, resolveAnalyticsFilters } from "@/lib/analytics/admin";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = resolveAnalyticsFilters(Object.fromEntries(url.searchParams.entries()));
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("analytics_export_sessions", buildAnalyticsRpcArgs(filters));

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Array<{
    session_id: string;
    started_at: string;
    last_seen_at: string;
    visitor_label: string;
    identity_state: string;
    source: string;
    medium: string;
    campaign: string;
    landing_path: string;
    last_path: string;
    page_count: number;
    event_count: number;
    duration_seconds: number;
    conversion: string | null;
    lead_id: string | null;
    cotizacion_id: string | null;
    client_id: string | null;
  }>;

  const headers = [
    "session_id",
    "started_at",
    "last_seen_at",
    "visitor_label",
    "identity_state",
    "source",
    "medium",
    "campaign",
    "landing_path",
    "last_path",
    "page_count",
    "event_count",
    "duration_seconds",
    "duration_label",
    "conversion",
    "lead_id",
    "cotizacion_id",
    "client_id",
  ];

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.session_id,
        row.started_at,
        row.last_seen_at,
        row.visitor_label,
        row.identity_state,
        row.source,
        row.medium,
        row.campaign,
        row.landing_path,
        row.last_path,
        row.page_count,
        row.event_count,
        row.duration_seconds,
        formatDuration(row.duration_seconds),
        row.conversion ?? "",
        row.lead_id ?? "",
        row.cotizacion_id ?? "",
        row.client_id ?? "",
      ]
        .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
        .join(","),
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="fenice-metricas-${filters.dateFrom}-${filters.dateTo}.csv"`,
    },
  });
}

