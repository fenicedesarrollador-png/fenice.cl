"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle, ArrowDown, ArrowUp, Check, Edit2, ExternalLink, Eye, EyeOff,
  GripVertical, Handshake, Loader2, Search, Trash2, X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  ADMIN_COLLABORATOR_COLUMNS, displayHost, isSafeHttpUrl, resolveAltText,
  sortCollaborators, validateCollaboratorInput, type Collaborator,
} from "@/lib/collaborators";
import {
  LogoUploadError, removeCollaboratorLogo, uploadCollaboratorLogo,
} from "@/lib/admin/collaboratorUpload";
import { Badge, EmptyState } from "../_components/ui";
import ColaboradorForm, { type ColaboradorFormValues } from "./_ColaboradorForm";

type Filter = "todos" | "activos" | "inactivos";
type SortKey = "orden" | "nombre" | "fecha" | "estado";
type SortDir = "asc" | "desc";
type Toast = { kind: "ok" | "error"; text: string } | null;

/** Mensaje genérico: los detalles técnicos van a consola, no a la pantalla. */
const GENERIC_DB_ERROR = "No fue posible guardar el colaborador. Intente nuevamente.";

export default function ColaboradoresManager({ initial }: { initial: Collaborator[] }) {
  const [rows, setRows] = useState<Collaborator[]>(() => sortCollaborators(initial));
  const [editing, setEditing] = useState<Collaborator | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("Guardando…");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState<Toast>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("todos");
  const [sortKey, setSortKey] = useState<SortKey>("orden");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [rowBusyId, setRowBusyId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  /* ---------- notificaciones efímeras ---------- */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  /** Refresca el carrusel público (ISR) sin recargar el panel. */
  const revalidateHome = useCallback(async () => {
    await fetch("/api/revalidate?path=%2F", { method: "POST" }).catch(() => {});
  }, []);

  /* ============================================================
     Alta y edición
     ============================================================ */
  async function handleSubmit(values: ColaboradorFormValues) {
    setFormError("");

    const parsed = validateCollaboratorInput({
      name: values.name,
      website_url: values.website_url,
      alt_text: values.alt_text,
      display_order: values.display_order,
      is_active: values.is_active,
    });
    if (!parsed.ok) {
      setFormError(parsed.error);
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const target = editing;

    try {
      let logo: { url: string; path: string } | null = null;
      if (values.file) {
        setBusyLabel("Subiendo logo…");
        logo = await uploadCollaboratorLogo(supabase, values.file, parsed.value.name);
      }

      setBusyLabel("Guardando colaborador…");

      if (target) {
        const payload = {
          ...parsed.value,
          ...(logo ? { logo_url: logo.url, logo_path: logo.path } : {}),
        };
        const { data, error } = await supabase
          .from("collaborators")
          .update(payload)
          .eq("id", target.id)
          .select(ADMIN_COLLABORATOR_COLUMNS)
          .single();

        if (error || !data) {
          // Si ya se había subido el logo nuevo, se retira para no dejar huérfanos.
          if (logo) await removeCollaboratorLogo(supabase, logo.path);
          throw error ?? new Error("update sin datos");
        }

        // El logo anterior sólo se borra cuando el UPDATE ya está confirmado.
        if (logo) await removeCollaboratorLogo(supabase, target.logo_path);

        setRows((prev) => sortCollaborators(prev.map((r) => (r.id === data.id ? (data as Collaborator) : r))));
        setEditing(null);
        setToast({ kind: "ok", text: "Colaborador actualizado correctamente." });
      } else {
        if (!logo) throw new LogoUploadError("El logo es obligatorio.");
        const { data, error } = await supabase
          .from("collaborators")
          .insert({ ...parsed.value, logo_url: logo.url, logo_path: logo.path })
          .select(ADMIN_COLLABORATOR_COLUMNS)
          .single();

        if (error || !data) {
          await removeCollaboratorLogo(supabase, logo.path);
          throw error ?? new Error("insert sin datos");
        }

        setRows((prev) => sortCollaborators([...prev, data as Collaborator]));
        setToast({ kind: "ok", text: "Colaborador agregado correctamente." });
      }

      await revalidateHome();
    } catch (err) {
      console.error("[colaboradores] error al guardar:", err);
      setFormError(err instanceof LogoUploadError ? err.message : GENERIC_DB_ERROR);
    } finally {
      setBusy(false);
      setBusyLabel("Guardando…");
    }
  }

  function startEdit(row: Collaborator) {
    setEditing(row);
    setFormError("");
    setConfirmingId(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ============================================================
     Activar / desactivar
     ============================================================ */
  async function toggleActive(row: Collaborator) {
    setRowBusyId(row.id);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("collaborators")
      .update({ is_active: !row.is_active })
      .eq("id", row.id)
      .select(ADMIN_COLLABORATOR_COLUMNS)
      .single();

    if (error || !data) {
      console.error("[colaboradores] error al cambiar el estado:", error);
      setToast({ kind: "error", text: "No fue posible cambiar el estado. Intente nuevamente." });
    } else {
      setRows((prev) => prev.map((r) => (r.id === data.id ? (data as Collaborator) : r)));
      if (editing?.id === data.id) setEditing(data as Collaborator);
      setToast({
        kind: "ok",
        text: (data as Collaborator).is_active
          ? "Colaborador activado. Ya aparece en el sitio."
          : "Colaborador desactivado. Se ocultó del sitio.",
      });
      await revalidateHome();
    }
    setRowBusyId(null);
  }

  /* ============================================================
     Eliminar (registro + archivo en Storage)
     ============================================================ */
  async function remove(row: Collaborator) {
    setRowBusyId(row.id);
    const supabase = createClient();
    const { error } = await supabase.from("collaborators").delete().eq("id", row.id);

    if (error) {
      console.error("[colaboradores] error al eliminar:", error);
      setToast({ kind: "error", text: "No fue posible eliminar el colaborador. Intente nuevamente." });
      setRowBusyId(null);
      return;
    }

    await removeCollaboratorLogo(supabase, row.logo_path);
    setRows((prev) => prev.filter((r) => r.id !== row.id));
    if (editing?.id === row.id) setEditing(null);
    setConfirmingId(null);
    setRowBusyId(null);
    setToast({ kind: "ok", text: "Colaborador eliminado correctamente." });
    await revalidateHome();
  }

  /* ============================================================
     Reordenamiento (drag & drop en escritorio, flechas siempre)
     ============================================================ */
  /** Escribe en la base sólo las filas cuyo display_order cambió. */
  const persistOrder = useCallback(async (changed: Collaborator[]) => {
    if (changed.length === 0) return;
    const supabase = createClient();
    const results = await Promise.all(
      changed.map((r) =>
        supabase.from("collaborators").update({ display_order: r.display_order }).eq("id", r.id),
      ),
    );
    const failed = results.find((r) => r.error);
    if (failed) {
      console.error("[colaboradores] error al guardar el orden:", failed.error);
      setToast({ kind: "error", text: "No fue posible guardar el nuevo orden. Intente nuevamente." });
      return;
    }
    await revalidateHome();
  }, [revalidateHome]);

  /**
   * Renumera la lista completa (1..n) para dejar un orden sin huecos y
   * persiste únicamente la diferencia. La UI se actualiza de inmediato.
   */
  const applyOrder = useCallback((next: Collaborator[], previous: Collaborator[]) => {
    const renumbered = next.map((r, i) => ({ ...r, display_order: i + 1 }));
    const changed = renumbered.filter((r) => {
      const before = previous.find((p) => p.id === r.id);
      return !before || before.display_order !== r.display_order;
    });
    setRows(renumbered);
    void persistOrder(changed);
  }, [persistOrder]);

  function moveBy(id: string, delta: number) {
    const base = sortCollaborators(rows);
    const from = base.findIndex((r) => r.id === id);
    const to = from + delta;
    if (from < 0 || to < 0 || to >= base.length) return;
    const next = [...base];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    applyOrder(next, rows);
  }

  function handleDrop(targetId: string) {
    const base = sortCollaborators(rows);
    const from = base.findIndex((r) => r.id === dragId);
    const to = base.findIndex((r) => r.id === targetId);
    setDragId(null);
    setOverId(null);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...base];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    applyOrder(next, rows);
  }

  /* ============================================================
     Búsqueda, filtros y ordenamiento de la tabla
     ============================================================ */
  const total = rows.length;
  const activos = useMemo(() => rows.filter((r) => r.is_active).length, [rows]);
  const inactivos = total - activos;

  // El drag & drop sólo tiene sentido sobre la lista completa sin reordenar.
  const dragEnabled = query.trim() === "" && filter === "todos" && sortKey === "orden" && sortDir === "asc";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = rows.filter((r) => {
      if (filter === "activos" && !r.is_active) return false;
      if (filter === "inactivos" && r.is_active) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        (r.website_url ?? "").toLowerCase().includes(q) ||
        (r.alt_text ?? "").toLowerCase().includes(q)
      );
    });

    const dir = sortDir === "asc" ? 1 : -1;
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "nombre":
          return dir * a.name.localeCompare(b.name, "es", { sensitivity: "base" });
        case "fecha":
          return dir * a.created_at.localeCompare(b.created_at);
        case "estado":
          return dir * (Number(a.is_active) - Number(b.is_active));
        default:
          if (a.display_order !== b.display_order) return dir * (a.display_order - b.display_order);
          return dir * a.created_at.localeCompare(b.created_at);
      }
    });
    return list;
  }, [rows, query, filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const FILTERS: { key: Filter; label: string; count: number }[] = [
    { key: "todos", label: "Todos", count: total },
    { key: "activos", label: "Activos", count: activos },
    { key: "inactivos", label: "Inactivos", count: inactivos },
  ];

  return (
    <>
      {/* ── Indicadores ─────────────────────────────────────────────────── */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: total, color: "text-[#0a1628]" },
          { label: "Activos", value: activos, color: "text-[#1a6b3c]" },
          { label: "Inactivos", value: inactivos, color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="admin-card px-4 py-3 text-center">
            <p className={`text-[26px] font-black leading-none tabular-nums ${s.color}`}>{s.value}</p>
            <p className="mt-1.5 text-[11px] font-bold text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Formulario ──────────────────────────────────────────────────── */}
      <div ref={formRef} className="mb-5 scroll-mt-6">
        <ColaboradorForm
          key={editing?.id ?? "nuevo"}
          editing={editing}
          busy={busy}
          busyLabel={busyLabel}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={() => { setEditing(null); setFormError(""); }}
        />
      </div>

      {/* ── Buscador y filtros ──────────────────────────────────────────── */}
      <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar colaborador…"
            aria-label="Buscar colaborador"
            className="admin-input !pl-9"
          />
        </div>
        <div className="inline-flex items-center gap-1 self-start rounded-xl border border-slate-200 bg-slate-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all ${
                filter === f.key ? "bg-white text-[#0a1628] shadow-sm" : "text-slate-500 hover:text-[#0a1628]"
              }`}
            >
              {f.label}
              <span className="ml-1.5 tabular-nums text-slate-400">{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Tabla ───────────────────────────────────────────────────────── */}
      {total === 0 ? (
        <EmptyState
          icon={Handshake}
          title="Aún no existen colaboradores registrados."
          description="Usa el formulario de arriba para agregar la primera empresa asociada."
        />
      ) : visible.length === 0 ? (
        <div className="admin-card border-dashed !border-slate-200 py-12 text-center">
          <p className="text-sm font-bold text-[#0a1628]">Sin resultados</p>
          <p className="mt-1 text-xs text-slate-500">
            Ningún colaborador coincide con la búsqueda o el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <Th className="w-[86px]">Logo</Th>
                  <Th sortable active={sortKey === "nombre"} dir={sortDir} onClick={() => toggleSort("nombre")}>
                    Colaborador
                  </Th>
                  <Th>URL</Th>
                  <Th sortable active={sortKey === "estado"} dir={sortDir} onClick={() => toggleSort("estado")}>
                    Estado
                  </Th>
                  <Th sortable active={sortKey === "orden"} dir={sortDir} onClick={() => toggleSort("orden")} className="w-[120px]">
                    Orden
                  </Th>
                  <Th sortable active={sortKey === "fecha"} dir={sortDir} onClick={() => toggleSort("fecha")} className="w-[110px]">
                    Fecha
                  </Th>
                  <Th className="w-[160px] text-right">Acciones</Th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => {
                  const host = displayHost(row.website_url);
                  const rowBusy = rowBusyId === row.id;
                  return (
                    <tr
                      key={row.id}
                      draggable={dragEnabled}
                      onDragStart={() => dragEnabled && setDragId(row.id)}
                      onDragOver={(e) => { if (dragEnabled && dragId) { e.preventDefault(); setOverId(row.id); } }}
                      onDragLeave={() => setOverId((id) => (id === row.id ? null : id))}
                      onDrop={(e) => { if (dragEnabled && dragId) { e.preventDefault(); handleDrop(row.id); } }}
                      onDragEnd={() => { setDragId(null); setOverId(null); }}
                      className={`border-b border-slate-100 transition-colors last:border-0 ${
                        editing?.id === row.id ? "bg-[#1a6b3c]/[0.06]" : "hover:bg-slate-50/70"
                      } ${overId === row.id ? "ring-2 ring-inset ring-[#1a6b3c]/40" : ""} ${
                        dragId === row.id ? "opacity-50" : ""
                      } ${!row.is_active ? "opacity-70" : ""}`}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex h-12 w-16 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-1.5">
                          {/* eslint-disable-next-line @next/next/no-img-element -- miniatura en panel admin privado */}
                          <img
                            src={row.logo_url}
                            alt={resolveAltText(row.name, row.alt_text)}
                            width={64}
                            height={48}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          {dragEnabled && (
                            <GripVertical
                              className="h-4 w-4 shrink-0 cursor-grab text-slate-300"
                              aria-hidden="true"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-black text-[#0a1628]">{row.name}</p>
                            {row.alt_text && (
                              <p className="truncate text-[11px] text-slate-400">{row.alt_text}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-2.5">
                        {isSafeHttpUrl(row.website_url) ? (
                          <a
                            href={row.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-600 transition-colors hover:text-[#1a6b3c]"
                          >
                            {host}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[12px] text-slate-300">—</span>
                        )}
                      </td>

                      <td className="px-3 py-2.5">
                        <Badge tone={row.is_active ? "green" : "neutral"} dot>
                          {row.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>

                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          <span className="w-6 text-[12px] font-bold tabular-nums text-slate-500">
                            {row.display_order}
                          </span>
                          <button
                            type="button"
                            onClick={() => moveBy(row.id, -1)}
                            title="Subir"
                            aria-label={`Subir ${row.name}`}
                            className="rounded-md p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-[#1a6b3c]"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBy(row.id, 1)}
                            title="Bajar"
                            aria-label={`Bajar ${row.name}`}
                            className="rounded-md p-1 text-slate-400 transition-all hover:bg-slate-100 hover:text-[#1a6b3c]"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-[12px] tabular-nums text-slate-500">
                        {formatDate(row.created_at)}
                      </td>

                      <td className="px-3 py-2.5">
                        {confirmingId === row.id ? (
                          <div className="flex items-center justify-end gap-1.5 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5">
                            <AlertTriangle className="h-3 w-3 shrink-0 text-red-500" />
                            <span className="text-[11px] font-semibold text-red-700">
                              ¿Está seguro de eliminar este colaborador?
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(row)}
                              disabled={rowBusy}
                              className="text-[11px] font-bold text-red-600 transition-colors hover:text-red-800 disabled:opacity-50"
                            >
                              {rowBusy ? "…" : "Confirmar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              aria-label="Cancelar"
                              className="text-slate-500 transition-colors hover:text-slate-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => toggleActive(row)}
                              disabled={rowBusy}
                              title={row.is_active ? "Desactivar (ocultar del sitio)" : "Activar (publicar en el sitio)"}
                              aria-label={row.is_active ? `Desactivar ${row.name}` : `Activar ${row.name}`}
                              className={`rounded-lg p-1.5 transition-all disabled:opacity-50 ${
                                row.is_active
                                  ? "text-[#1a6b3c] hover:bg-[#1a6b3c]/10"
                                  : "text-slate-400 hover:bg-slate-100"
                              }`}
                            >
                              {rowBusy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : row.is_active ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => startEdit(row)}
                              title="Editar"
                              aria-label={`Editar ${row.name}`}
                              className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-[#1a6b3c]/10 hover:text-[#1a6b3c]"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(row.id)}
                              title="Eliminar"
                              aria-label={`Eliminar ${row.name}`}
                              className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {dragEnabled && visible.length > 1 && (
            <p className="border-t border-slate-100 bg-slate-50/70 px-3 py-2 text-[11px] text-slate-400">
              Arrastra las filas para cambiar el orden del carrusel, o usa las flechas de la columna «Orden».
            </p>
          )}
        </div>
      )}

      {/* ── Notificación ────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`admin-toast-in fixed bottom-5 right-5 z-50 flex max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3 text-[13px] font-semibold shadow-lg ${
            toast.kind === "ok"
              ? "border-[#1a6b3c]/25 bg-white text-[#0d4a28]"
              : "border-red-200 bg-white text-red-600"
          }`}
        >
          {toast.kind === "ok" ? (
            <Check className="h-4 w-4 shrink-0 text-[#1a6b3c]" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          )}
          {toast.text}
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Cerrar notificación"
            className="ml-1 text-slate-400 transition-colors hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </>
  );
}

/* ============================================================
   Encabezado de columna (con ordenamiento opcional)
   ============================================================ */
function Th({
  children, className = "", sortable, active, dir, onClick,
}: {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  active?: boolean;
  dir?: SortDir;
  onClick?: () => void;
}) {
  return (
    <th
      scope="col"
      aria-sort={sortable ? (active ? (dir === "asc" ? "ascending" : "descending") : "none") : undefined}
      className={`px-3 py-2.5 text-[11px] font-black uppercase tracking-wide text-slate-500 ${className}`}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onClick}
          className={`inline-flex items-center gap-1 transition-colors hover:text-[#0a1628] ${
            active ? "text-[#0a1628]" : ""
          }`}
        >
          {children}
          <span className="text-[9px] text-slate-400">{active ? (dir === "asc" ? "▲" : "▼") : "↕"}</span>
        </button>
      ) : (
        children
      )}
    </th>
  );
}

/**
 * dd/mm/aaaa en horario de Chile. La zona se fija explícitamente para que el
 * render del servidor (UTC en Vercel) y el del navegador coincidan: si se
 * usara la zona local se produciría un desajuste de hidratación en las fechas
 * cercanas a medianoche.
 */
const DATE_FMT = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return DATE_FMT.format(d);
}
