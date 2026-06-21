import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

/* ============================================================
   Sistema de componentes UI del panel Admin — marca Fenice
   navy #0a1628 · verde #1a6b3c · ámbar #f5a623
   ============================================================ */

/* ---------- Encabezado de página ---------- */
export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent = "green",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  accent?: "green" | "amber" | "navy" | "blue" | "purple" | "pink" | "teal" | "indigo";
  children?: React.ReactNode;
}) {
  const accents: Record<string, string> = {
    green: "bg-[#ecfdf3] text-[#1a6b3c] ring-[#1a6b3c]/15",
    amber: "bg-[#fff7ec] text-[#d98a0e] ring-[#f5a623]/20",
    navy: "bg-slate-100 text-[#0a1628] ring-slate-200",
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    pink: "bg-pink-50 text-pink-600 ring-pink-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  };
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ring-1 ${accents[accent]}`}>
            <Icon className="w-5 h-5" strokeWidth={2.2} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-[#0a1628] tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-slate-500 text-[13px] mt-0.5 font-medium">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}

/* ---------- Tarjeta de estadística ---------- */
export function StatCard({
  label,
  value,
  color = "navy",
  icon: Icon,
  hint,
}: {
  label: string;
  value: string | number;
  color?: "navy" | "green" | "amber" | "red" | "blue";
  icon?: LucideIcon;
  hint?: string;
}) {
  const colors: Record<string, string> = {
    navy: "text-[#0a1628]",
    green: "text-[#1a6b3c]",
    amber: "text-[#d98a0e]",
    red: "text-red-600",
    blue: "text-blue-600",
  };
  const iconBg: Record<string, string> = {
    navy: "bg-slate-100 text-slate-500",
    green: "bg-[#ecfdf3] text-[#1a6b3c]",
    amber: "bg-[#fff7ec] text-[#d98a0e]",
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
  };
  return (
    <div className="admin-card px-4 py-3.5 flex items-center gap-3.5">
      {Icon && (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg[color]}`}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </div>
      )}
      <div className="min-w-0">
        <p className={`text-2xl font-black tabular-nums leading-none ${colors[color]}`}>{value}</p>
        <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate">{label}</p>
        {hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>}
      </div>
    </div>
  );
}

/* ---------- Badge de estado ---------- */
export function Badge({
  children,
  tone = "neutral",
  dot,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue" | "purple";
  dot?: boolean;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
    green: "bg-[#ecfdf3] text-[#1a6b3c] border-[#1a6b3c]/20",
    amber: "bg-[#fff7ec] text-[#b87608] border-[#f5a623]/30",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
  };
  const dots: Record<string, string> = {
    neutral: "bg-slate-400",
    green: "bg-[#1a6b3c]",
    amber: "bg-[#f5a623]",
    red: "bg-red-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${tones[tone]}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dots[tone]}`} />}
      {children}
    </span>
  );
}

/* ---------- Estado vacío ---------- */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="text-center py-16 admin-card border-dashed">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-[#0a1628] font-bold text-sm">{title}</p>
      {description && <p className="text-slate-400 text-xs mt-1">{description}</p>}
      {action && (
        <Link href={action.href} className="admin-btn-primary mt-4 !text-xs !py-2 !px-3.5">
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ---------- Botón primario como Link ---------- */
export function PrimaryLink({
  href,
  children,
  icon: Icon,
  variant = "green",
}: {
  href: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: "green" | "amber";
}) {
  return (
    <Link href={href} className={variant === "amber" ? "admin-btn-amber" : "admin-btn-primary"}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </Link>
  );
}

/* ---------- Fieldset de formulario (sección con título) ---------- */
export function FormSection({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card p-5 sm:p-6 space-y-4">
      {title && (
        <div className="pb-3 border-b border-slate-50">
          <h3 className="text-sm font-black text-[#0a1628]">{title}</h3>
          {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- Campo de formulario (label + control) ---------- */
export function Field({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="admin-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

/* ---------- Toggle switch ---------- */
export function Toggle({
  name,
  defaultChecked,
  label,
  description,
}: {
  name: string;
  defaultChecked?: boolean;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group">
      <span className="relative inline-block shrink-0">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="block w-10 h-6 rounded-full bg-slate-200 peer-checked:bg-[#1a6b3c] transition-colors" />
        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </span>
      <span>
        <span className="block text-[13px] font-bold text-[#0a1628]">{label}</span>
        {description && <span className="block text-[11px] text-slate-400">{description}</span>}
      </span>
    </label>
  );
}

/* ---------- Barra de acciones de formulario (sticky) ---------- */
export function FormActions({
  submitLabel,
  loading,
  onCancel,
  error,
}: {
  submitLabel: string;
  loading?: boolean;
  onCancel?: () => void;
  error?: string;
}) {
  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-[13px] font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}
      <div className="flex items-center gap-2.5 sticky bottom-4 z-10">
        <button type="submit" disabled={loading} className="admin-btn-primary">
          {loading ? "Guardando…" : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="admin-btn-ghost !py-2.5">
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Cabecera de página de formulario ---------- */
export function FormPageHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
}) {
  return (
    <div className="mb-6">
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-400 hover:text-[#1a6b3c] transition-colors mb-3">
        <span className="text-base leading-none">‹</span> Volver
      </Link>
      <h1 className="text-xl sm:text-2xl font-black text-[#0a1628] tracking-tight">{title}</h1>
      {subtitle && <p className="text-slate-500 text-[13px] mt-0.5 font-medium">{subtitle}</p>}
    </div>
  );
}

/* ---------- Link externo "ver en sitio" ---------- */
export function SiteLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg text-slate-400 hover:text-[#1a6b3c] hover:bg-[#ecfdf3] transition-all"
      title="Ver en sitio"
    >
      <ArrowUpRight className="w-4 h-4" />
    </a>
  );
}
