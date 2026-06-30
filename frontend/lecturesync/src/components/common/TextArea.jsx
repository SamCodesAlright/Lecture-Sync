import React, { forwardRef } from "react";

const TextArea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      error,
      disabled = false,
      required = false,
      description,
      maxLength,
      className = "",
      rows = 4,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={`space-y-2 ${className}`}>
        {label && (
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor={name}
              className="text-sm font-medium text-slate-700"
            >
              {label}
              {required && <span className="ml-1 text-rose-500">*</span>}
            </label>
          </div>
        )}

        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          ref={ref}
          maxLength={maxLength}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 ${error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200"}`}
          {...props}
        />

        {error && <p className="text-sm text-rose-600">{error}</p>}
        {description && !error && (
          <p className="text-sm text-slate-500">{description}</p>
        )}
      </div>
    );
  },
);

export default TextArea;
