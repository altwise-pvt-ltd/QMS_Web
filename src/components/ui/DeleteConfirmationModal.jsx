import React, { useEffect } from "react";
import { AlertCircle, X, Loader2 } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Document",
  message = "Are you sure you want to delete this document? This action cannot be undone.",
  confirmText = "Delete",
  isDeleting = false,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3
            id="modal-title"
            className="text-base font-semibold text-gray-900"
          >
            {title}
          </h3>

          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5">
          <div className="flex items-start gap-3.5">
            <div className="p-2 bg-red-50 text-red-600 rounded-xl border border-red-100 shrink-0">
              <AlertCircle size={22} />
            </div>

            <p className="text-sm text-gray-600 leading-relaxed pt-0.5">
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2.5 rounded-b-xl">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="
              px-4 py-2
              text-sm font-medium
              text-gray-800
              bg-gray-50
              border border-gray-300
              rounded-lg
              hover:bg-gray-100 hover:border-gray-400
              transition
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>

          {/* Delete Button */}
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`
              px-4 py-2
              rounded-lg
              text-sm font-medium
              inline-flex items-center gap-2
              border
              ${
                isDeleting
                  ? "bg-red-400 border-red-400 text-white cursor-not-allowed"
                  : "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 active:scale-[0.98]"
              }
            `}
          >
            {isDeleting && <Loader2 size={15} className="animate-spin" />}

            {isDeleting ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
