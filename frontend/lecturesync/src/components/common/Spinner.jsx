import React from "react";

const Spinner = ({ size = 20, className = "", label = "Loading..." }) => {
  return (
    <div
      className={`inline-flex items-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"
        style={{ width: size, height: size }}
      />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
};

export default Spinner;
