import React from "react";
import Button from "./Button.jsx";

const PageHeader = ({ title, subtitle, action, className = "" }) => {
  return (
    <div
      className={`flex flex-col gap-4 rounded-3xl bg-white px-6 py-6 shadow-sm transition ${className}`}
    >
      <div className="flex flex-col gap-2 sm:items-center sm:justify-between sm:flex-row">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          )}
        </div>

        {action && (
          <div>
            {typeof action === "string" ? <Button>{action}</Button> : action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
