import React from "react";

const FormField = ({
  label,
  children,
  description,
  error,
  required = false,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm font-semibold text-slate-900">
            {label}
            {required && <span className="ml-1 text-rose-600">*</span>}
          </label>
          {description && (
            <span className="text-xs text-slate-500">{description}</span>
          )}
        </div>
      )}
      <div>{children}</div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
};

export default FormField;
