import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      type = "text",
      error,
      disabled = false,
      required = false,
      icon: Icon,
      description,
      className = "",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={"space-y-2"}>
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
              <p className="text-xs text-slate-500">{description}</p>
            )}
          </div>
        )}

        <div className="relative">
          {Icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
          )}

          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            ref={ref}
            className={`w-full rounded-xl border px-4 py-3 text-sm text-slate-900 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400 ${Icon ? "pl-11" : ""} ${error ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100" : "border-slate-200"} ${className}`}
            {...props}
          />
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    );
  },
);

export default Input;
