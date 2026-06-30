import React from "react";

const LoadingSkeleton = ({
  variant = "default",
  className = "",
  count = 4,
}) => {
  const renderSkeleton = () => {
    if (variant === "card") {
      return (
        <div className="space-y-4 p-6">
          <div className="h-10 w-32 animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-4 w-5/6 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      );
    }

    if (variant === "table") {
      return (
        <div className="space-y-4 p-6">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="grid gap-4 sm:grid-cols-4">
              <div className="h-4 w-full animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-4 w-full animate-pulse rounded-2xl bg-slate-200" />
            </div>
          ))}
        </div>
      );
    }

    if (variant === "form") {
      return (
        <div className="space-y-4 p-6">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-4 w-1/3 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-12 w-full animate-pulse rounded-3xl bg-slate-200" />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="h-4 w-full animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`rounded-3xl bg-white shadow-sm ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default LoadingSkeleton;
