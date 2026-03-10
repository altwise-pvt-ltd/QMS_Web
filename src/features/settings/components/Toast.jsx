import React, { useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";

const Toast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      style: "bg-emerald-50 border-emerald-200 text-emerald-700",
      icon: <CheckCircle2 size={18} />,
    },
    error: {
      style: "bg-red-50 border-red-200 text-red-700",
      icon: <AlertCircle size={18} />,
    },
  };

  const { style, icon } = config[type] || config.success;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5
        rounded-2xl border shadow-lg font-semibold text-sm
        animate-in slide-in-from-top-4 fade-in duration-300
        ${style}
      `}
    >
      {icon}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
