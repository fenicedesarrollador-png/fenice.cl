import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

/* ============================================================
   Sistema UI del panel Admin — Dark Cockpit Premium (Fenice)
   navy base · verde #2bbe6a · ámbar #f5a623
   ============================================================ */

const ACCENTS: Record<string, { tint: string; ring: string }> = {
  green: { tint: "bg-[#2bbe6a]/12 text-[#2bbe6a]", ring: "ring-[#2bbe6a]/25" },
  amber: { tint: "bg-[#f5a623]/12 text-[#f5a623]", ring: "ring-[#f5a623]/25" },
  navy: { tint: "bg-white/8 text-slate-200", ring: "ring-white/15" },
  blue: { tint: "bg-blue-400/12 text-blue-300", ring: "ring-blue-400/25" },
  purple: { tint: "bg-purple-400/12 text-purple-300", ring: "ring-purple-400/25" },
  pink: { tint: "bg-pink-400/12 text-pink-300", ring: "ring-pink-400/25" },
  teal: { tint: "bg-teal-400/12 text-teal-300", ring: "ring-teal-400/25" },
  indigo: { tint: "bg-indigo-400/12 text-indigo-300", ring: "ring-indigo-400/25" },
};

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
  accent?: keyof typeof ACCENTS;
  children?: React.ReactNode;
}) {
  const a = ACCENTS[accent] ?? ACCENTS.green;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ring-1 ${a.tint} ${a.ring}`}>
            <Icon className="w-5 h-5" strokeWidth={2.2} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-[#e8eef7] tracking-tight leading-tight">{title}</h1>
          {subtitle && <p className="text-[#94a7c2] text-[13px] mt-0.5 font-medium">{subtitle}</p>}
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
  const valColor: Record<string, string> = {
    navy: "text-[#e8eef7]",
    green: "text-[#2bbe6a]",
    amber: "text-[#f5a623]",
    red: "text-red-400",
    blue: "text-blue-300",
  };
  const iconBg: Record<string, string> = {
    navy: "bg-white/8 text-slate-300",
    green: "bg-[#2bbe6a]/12 text-[#2bbe6a]",
    amber: "bg-[#f5a623]/12 text-[#f5a623]",
    red: "bg-red-500/12 text-red-400",
    blue: "bg-blue-400/12 text-blue-300",
  };
  return (
    <div className="admin-card px-4 py-3.5 flex items-center gap-3.5">
      {Icon && (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg[color]}`}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </div>
      )}
      <div className="min-w-0">
        <p className={`text-2xl font-black tabular-nums leading-none ${valColor[color]}`}>{value}</p>
        <p className="text-[11px] text-[#94a7c2] font-semibold mt-1 truncate">{label}</p>
        {hint && <p className="text-[10px] text-[#5f739a] mt-0.5">{hint}</p>}
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
    neutral: "bg-white/5 text-slate-300 border-white/10",
    green: "bg-[#2bbe6a]/12 text-[#5fe39a] border-[#2bbe6a]/25",
    amber: "bg-[#f5a623]/12 text-[#f8c46a] border-[#f5a623]/25",
    red: "bg-red-500/12 text-red-300 border-red-500/25",
    blue: "bg-blue-400/12 text-blue-200 border-blue-400/25",
    purple: "bg-purple-400/12 text-purple-200 border-purple-400/25",
  };
  const dots: Record<string, string> = {
    neutral: "bg-slate-400",
    green: "bg-[#2bbe6a]",
    amber: "bg-[#f5a623]",
    red: "bg-red-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
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
    <div className="text-center py-16 admin-card border-dashed !border-white/12">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-[#5f739a]" />
      </div>
      <p className="text-[#e8eef7] font-bold text-sm">{title}</p>
      {description && <p className="text-[#94a7c2] text-xs mt-1">{description}</p>}
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
        <div className="pb-3 border-b border-white/8">
          <h3 className="text-sm font-black text-[#e8eef7]">{title}</h3>
          {description && <p className="text-[12px] text-[#94a7c2] mt-0.5">{description}</p>}
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
        {label} {required && <span className="text-[#f5a623]">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#5f739a] mt-1">{hint}</p>}
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
        <span className="block w-10 h-6 rounded-full bg-white/12 peer-checked:bg-[#2bbe6a] transition-colors" />
        <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </span>
      <span>
        <span className="block text-[13px] font-bold text-[#e8eef7]">{label}</span>
        {description && <span className="block text-[11px] text-[#94a7c2]">{description}</span>}
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
        <div className="bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-3 text-red-300 text-[13px] font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
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
      <Link href={backHref} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#94a7c2] hover:text-[#2bbe6a] transition-colors mb-3">
        <span className="text-base leading-none">‹</span> Volver
      </Link>
      <h1 className="text-xl sm:text-2xl font-black text-[#e8eef7] tracking-tight">{title}</h1>
      {subtitle && <p className="text-[#94a7c2] text-[13px] mt-0.5 font-medium">{subtitle}</p>}
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
      className="p-2 rounded-lg text-[#94a7c2] hover:text-[#2bbe6a] hover:bg-[#2bbe6a]/10 transition-all"
      title="Ver en sitio"
    >
      <ArrowUpRight className="w-4 h-4" />
    </a>
  );
}
