"use client";

import { useState } from "react";

interface Props {
  name: string;
  label: string;
  defaultValue?: string;
  maxLength: number;
  required?: boolean;
  isTextArea?: boolean;
  hint?: string;
}

export default function SeoFieldsCounter({ name, label, defaultValue = "", maxLength, required, isTextArea, hint }: Props) {
  const [value, setValue] = useState(defaultValue);
  const remaining = maxLength - value.length;
  const over = remaining < 0;
  const close = remaining <= 15 && remaining >= 0;
  const pct = Math.min(100, (value.length / maxLength) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="admin-label !mb-0">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className={`text-[11px] font-bold tabular-nums ${over ? "text-red-600" : close ? "text-[#b87608]" : "text-slate-500"}`}>
          {value.length}/{maxLength}
        </span>
      </div>
      {isTextArea ? (
        <textarea name={name} value={value} onChange={(e) => setValue(e.target.value)} required={required} rows={3} className="admin-input" />
      ) : (
        <input type="text" name={name} value={value} onChange={(e) => setValue(e.target.value)} required={required} className="admin-input" />
      )}
      {/* Barra de progreso */}
      <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${over ? "bg-red-500" : close ? "bg-[#f5a623]" : "bg-[#1a6b3c]"}`} style={{ width: `${pct}%` }} />
      </div>
      {hint && !over && <p className="text-[11px] text-slate-500 mt-1">{hint}</p>}
      {over && <p className="text-[11px] text-red-600 mt-1 font-medium">Excede el límite recomendado para SEO.</p>}
    </div>
  );
}
