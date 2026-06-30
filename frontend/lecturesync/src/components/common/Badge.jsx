import React from "react";

const styleMap = {
  default: "bg-slate-100 text-slate-800",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-blue-100 text-blue-700",
};

const Badge = ({ label, variant = "default", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styleMap[variant] ?? styleMap.default} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
