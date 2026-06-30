import React from "react";
import Modal from "./Modal.jsx";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm action",
  description = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      onConfirm={onConfirm}
      onCancel={onClose}
      confirmText={confirmText}
      cancelText={cancelText}
    >
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        {description}
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
