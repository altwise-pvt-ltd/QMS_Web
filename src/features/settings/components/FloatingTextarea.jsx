import React, { useState } from "react";
import { AlertCircle } from "lucide-react";

const FloatingTextarea = ({
  name,
  label,
  value,
  onChange,
  icon: Icon,
  rows = 4,
  required = false,
  placeholder = "",
  error = "",
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = focused || hasValue;

  return (
    <div className="relative group pt-2">
      <label
        htmlFor={name}
        className={`
          absolute left-5 transition-all duration-200 pointer-events-none z-10 font-semibold
          ${
            isActive
              ? "-top-0.5 text-[10px] tracking-wider uppercase px-2 bg-white rounded"
              : "top-4.5 text-sm"
          }
          ${error ? "text-red-500" : focused ? "text-blue-600" : "text-slate-400"}
        `}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          disabled={disabled}
          placeholder={focused ? placeholder : ""}
          aria-required={required}
          aria-invalid={!!error}
          className={`
            w-full rounded-2xl px-5 py-4 pr-12 text-sm font-semibold text-slate-800
            border-2 bg-white transition-all duration-200 outline-none resize-none
            placeholder:text-slate-300 placeholder:font-normal
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-200"
            }
          `}
        />
        {Icon && (
          <Icon
            size={16}
            className={`absolute right-5 top-5 transition-colors duration-200
              ${error ? "text-red-400" : focused ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400"}`}
          />
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 ml-1 text-xs font-medium text-red-500 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingTextarea;
