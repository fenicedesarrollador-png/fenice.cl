"use client";

import { useState } from "react";

interface Props {
  name: string;
  label: string;
  defaultValue?: string;
  maxLength: number;
  required?: boolean;
  isTextArea?: boolean;
}

export default function SeoFieldsCounter({ name, label, defaultValue = "", maxLength, required, isTextArea }: Props) {
  const [value, setValue] = useState(defaultValue);
  const remaining = maxLength - value.length;
  const isOverLimit = remaining < 0;
  const isClose = remaining <= 15 && remaining >= 0;

  const className = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required={required}
          className={className}
        />
      )}
      <p className={`text-xs mt-1 ${isOverLimit ? "text-red-600" : isClose ? "text-yellow-600" : "text-gray-400"}`}>
        {value.length}/{maxLength} caracteres{isOverLimit ? " — demasiado largo" : ""}
      </p>
    </div>
  );
}
