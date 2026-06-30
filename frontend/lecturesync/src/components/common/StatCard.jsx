import React from "react";

const StatCard = ({
  title,
  value,
  delta,
  description,
  icon,
  className = "",
}) => {
  const deltaColor = delta?.includes("-")
    ? "text-rose-600"
    : "text-emerald-600";

  return (
    <div
      className={`rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {title}
          </p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
        </div>
        {icon && (
          <div className="rounded-3xl bg-blue-100 p-3 text-blue-700">
            {icon}
          </div>
        )}
      </div>

      {delta && (
        <p className={`mt-4 text-sm font-semibold ${deltaColor}`}>{delta}</p>
      )}
      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
};

export default StatCard;
