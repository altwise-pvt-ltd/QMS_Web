import React, { useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import Slide from "@mui/material/Slide";

/**
 * Reusable Alert Component for notifications using Material UI
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

  if (!open) return null;

  // Map types to severity for MUI Alert
  const severityMap = {
    success: "success",
    error: "error",
    critical: "error", // Handle critical as error
    warning: "warning",
    info: "info",
  };

  const severity = severityMap[type] || "info";
  const displayTitle = title || (severity.charAt(0).toUpperCase() + severity.slice(1));

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      minWidth: '320px',
      maxWidth: '450px'
    }}>
      <Slide direction="left" in={open} mountOnEnter unmountOnExit>
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert
            severity={severity}
            onClose={onClose}
            sx={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '12px'
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>{displayTitle}</AlertTitle>
            {message}
          </Alert>
        </Stack>
      </Slide>
    </div>
  );
}

export default CustomAlert;
