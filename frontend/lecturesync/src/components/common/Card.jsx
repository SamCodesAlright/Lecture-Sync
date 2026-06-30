import React from "react";

const Card = ({
  header,
  footer,
  children,
  hover = false,
  padded = true,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-200 ${hover ? "hover:-translate-y-0.5 hover:shadow-md" : ""} ${className}`}
      {...props}
    >
      {header && (
        <div className="border-b border-slate-200 px-6 py-5">
          {typeof header === "string" ? (
            <h2 className="text-lg font-semibold text-slate-900">{header}</h2>
          ) : (
            header
          )}
        </div>
      )}

      <div className={padded ? "px-6 py-5" : ""}>{children}</div>

      {footer && (
        <div className="border-t border-slate-200 px-6 py-4">{footer}</div>
      )}
    </div>
  );
};

export default Card;
