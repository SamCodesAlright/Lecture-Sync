import React, { forwardRef } from "react";

const Select = forwardRef(
  (
    {
      label,
      name,
      options = [],
      placeholder = "Select an option",
      error,
      disabled = false,
      required = false,
      description,
      className = "",
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
            {description && (
              <span className="text-xs text-slate-500">{description}</span>
            )}
          </div>
        )}

        <div className="relative">
          <select
            id={name}
            name={name}
            disabled={disabled}
            ref={ref}
            className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-slate-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 ${error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200"}`}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M6 8l4 4 4-4"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    );
  },
);

export default Select;
