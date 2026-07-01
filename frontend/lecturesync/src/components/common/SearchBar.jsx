import React, { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar — calls onChange(stringValue) directly (not a synthetic event).
 * Also calls onClear() when the X button is clicked.
 */
const SearchBar = ({
  value = "",
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  debounceMs = 250,
}) => {
  const [query, setQuery] = useState(value);
  const timeoutRef = useRef(null);

  // Keep controlled when parent resets value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (e) => {
    const next = e.target.value;
    setQuery(next);

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      onChange?.(next); // passing raw string
    }, debounceMs);
  };

  const handleClear = () => {
    setQuery("");
    window.clearTimeout(timeoutRef.current);
    onChange?.("");
    onClear?.();
  };

  return (
    <div
      className={`relative rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 ${className}`}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full bg-transparent pl-8 pr-10 text-sm text-slate-900 outline-none placeholder:text-slate-400"
        aria-label={placeholder}
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
