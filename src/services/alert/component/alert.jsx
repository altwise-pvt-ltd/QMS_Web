import React, { useEffect } from "react";
import { Alert } from "@material-tailwind/react";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

/**
 * Reusable Alert Component for notifications
 *
 * @param {Object} props
 * @param {boolean} props.open - Controls alert visibility
 * @param {function} props.onClose - Callback when alert is closed
 * @param {string} props.type - Alert type: 'success' | 'error' | 'warning' | 'info'
 * @param {string} props.message - Message to display
 * @param {number} props.duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
 * @param {string} props.title - Optional title for the alert
 */
export function CustomAlert({
  open = false,
  onClose,
  type = "info",
  message = "",
  duration = 3000,
  title = "",
}) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  // Alert type configurations
  const alertConfig = {
    success: {
      color: "green",
      icon: CheckCircle,
      defaultTitle: "Success",
      bgClass: "bg-green-50 border-green-500",
      textClass: "text-green-900",
      iconClass: "text-green-600",
    },
    error: {
      color: "red",
      icon: XCircle,
      defaultTitle: "Error",
      bgClass: "bg-red-50 border-red-500",
      textClass: "text-red-900",
      iconClass: "text-red-600",
    },
    warning: {
      color: "amber",
      icon: AlertTriangle,
      defaultTitle: "Warning",
      bgClass: "bg-amber-50 border-amber-500",
      textClass: "text-amber-900",
      iconClass: "text-amber-600",
    },
    info: {
      color: "blue",
      icon: Info,
      defaultTitle: "Information",
      bgClass: "bg-blue-50 border-blue-500",
      textClass: "text-blue-900",
      iconClass: "text-blue-600",
    },
  };

  const config = alertConfig[type] || alertConfig.info;
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  if (!open) return null;

  return (
    <Alert
      open={open}
      onClose={onClose}
      className={`fixed top-4 right-4 z-50 max-w-md shadow-lg border-l-4 ${config.bgClass}`}
      animate={{
        mount: { opacity: 1, y: 0 },
        unmount: { opacity: 0, y: -20 },
      }}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.iconClass}`} />
        <div className="flex-1">
          {displayTitle && (
            <h5 className={`font-semibold text-sm mb-1 ${config.textClass}`}>
              {displayTitle}
            </h5>
          )}
          <p className={`text-sm ${config.textClass}`}>{message}</p>
        </div>
      </div>
    </Alert>
  );
}

// Export default for backward compatibility
export default CustomAlert;
