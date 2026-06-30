import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  className = "",
}) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        className="absolute inset-0 z-0 bg-slate-950/40"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-4xl bg-white shadow-2xl ring-1 ring-slate-200 transition-all duration-300 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-semibold text-slate-900"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="mt-2 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
            aria-label="Close modal"
          >
            x
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">{children}</div>

        {(footer || onConfirm || onCancel) && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {cancelText}
              </button>
            )}

            {(footer || onConfirm) && (
              <button
                type="button"
                onClick={onConfirm}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {footer || confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
