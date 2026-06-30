import React from "react";

const EmptyState = ({ Icon, title, description, action, className = "" }) => {
  return (
    <div
      className={`rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center shadow-sm ${className}`}
    >
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-blue-500" aria-hidden="true" />
      )}
      <h3 className="mt-6 text-xl font-semibold text-slate-900">{title}</h3>
      {description && (
        <p className="mt-3 text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
