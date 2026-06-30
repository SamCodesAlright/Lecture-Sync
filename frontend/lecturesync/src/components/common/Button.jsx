import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const variantStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary:
    "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-blue-500",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-blue-500",
};

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-4 text-base",
};

const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,
      icon: Icon,
      iconPosition = "left",
      className = "",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading}
        className={`inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl border border-transparent font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : "inline-flex"} ${className}`}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          Icon &&
          iconPosition === "left" && (
            <Icon className="h-4 w-4" aria-hidden="true" />
          )
        )}

        {children}

        {!loading && Icon && iconPosition === "right" && (
          <Icon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );
  },
);

export default Button;
