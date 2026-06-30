import React from "react";
import { Trash2 } from "lucide-react";
import Modal from "./Modal.jsx";

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete item",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
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
      <div className="flex items-center gap-4 rounded-3xl border border-rose-100 bg-rose-50 p-5 text-rose-700">
        <Trash2 className="h-6 w-6" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">
            This will remove the selected item.
          </p>
          <p className="text-sm text-slate-600">Please confirm to continue.</p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
