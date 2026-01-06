import React, { useState, useEffect } from "react";
import { CustomAlert } from "./component/alert";
import { AlertManager } from "./alertService";

/**
 * AlertProvider - Global alert container
 * Add this to your App.jsx or MainLayout.jsx to enable global alerts
 */
export function AlertProvider() {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Subscribe to alert changes
    const unsubscribe = AlertManager.subscribe((newAlert) => {
      setAlert(newAlert);
    });

    return unsubscribe;
  }, []);

  if (!alert) return null;

  return (
    <CustomAlert
      open={alert.open}
      onClose={() => AlertManager.close()}
      type={alert.type}
      message={alert.message}
      title={alert.title}
      duration={alert.duration}
    />
  );
}

export default AlertProvider;
