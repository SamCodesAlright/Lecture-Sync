import React, { useRef } from "react";

const ImageUpload = ({
  label = "Upload image",
  value,
  onChange,
  accept = "image/*",
  helperText,
  error,
  className = "",
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    onChange?.(file);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-semibold text-slate-900">{label}</label>
        {helperText && (
          <span className="text-xs text-slate-500">{helperText}</span>
        )}
      </div>

      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
        {value ? (
          <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
            <img
              src={
                typeof value === "string" ? value : URL.createObjectURL(value)
              }
              alt="Preview"
              className="h-48 w-full rounded-3xl object-cover shadow-sm"
            />
            <button
              type="button"
              onClick={() => {
                onChange?.(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-slate-600">
            <p className="text-sm font-medium text-slate-900">
              Drag & drop or click to upload
            </p>
            <p className="text-sm">PNG, JPG, GIF up to 10MB.</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Select image
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;
