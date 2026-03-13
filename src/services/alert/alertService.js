// Global alert state management
let alertListeners = [];
let currentAlert = null;

/**
 * Alert Manager - Global service to show alerts from anywhere
 */
export const AlertManager = {
  /**
   * Subscribe to alert changes (used by AlertProvider)
   */
  subscribe(listener) {
    alertListeners.push(listener);
    return () => {
      alertListeners = alertListeners.filter((l) => l !== listener);
    };
  },

  /**
   * Show a success alert
   * @param {string} message - Alert message
   * @param {string} title - Optional title
   * @param {number} duration - Auto-dismiss duration (default: 3000ms)
   */
  success(message, title = "", duration = 3000) {
    this.show({
      type: "success",
      message,
      title,
      duration,
    });
  },

  /**
   * Show an error alert
   * @param {string} message - Alert message
   * @param {string} title - Optional title
   * @param {number} duration - Auto-dismiss duration (default: 5000ms)
   */
  error(message, title = "", duration = 5000) {
    this.show({
      type: "error",
      message,
      title,
      duration,
    });
  },

  /**
   * Show a warning alert
   * @param {string} message - Alert message
   * @param {string} title - Optional title
   * @param {number} duration - Auto-dismiss duration (default: 4000ms)
   */
  warning(message, title = "", duration = 4000) {
    this.show({
      type: "warning",
      message,
      title,
      duration,
    });
  },

  /**
   * Show an info alert
   * @param {string} message - Alert message
   * @param {string} title - Optional title
   * @param {number} duration - Auto-dismiss duration (default: 3000ms)
   */
  info(message, title = "", duration = 3000) {
    this.show({
      type: "info",
      message,
      title,
      duration,
    });
  },

  /**
   * Show a custom alert
   * @param {Object} config - Alert configuration
   */
  show(config) {
    currentAlert = {
      ...config,
      open: true,
      id: Date.now(),
    };
    this.notifyListeners();
  },

  /**
   * Close the current alert
   */
  close() {
    if (currentAlert) {
      currentAlert = { ...currentAlert, open: false };
      this.notifyListeners();
    }
  },

  /**
   * Get current alert state
   */
  getAlert() {
    return currentAlert;
  },

  /**
   * Notify all subscribers of alert changes
   */
  notifyListeners() {
    alertListeners.forEach((listener) => listener(currentAlert));
  },
};

/**
 * Document Expiration Alert Service
 */
export const AlertService = {
  /**
   * Scans for documents expiring within X days
   * @param {number} daysThreshold - How many days ahead to warn (default 30)
   */
  async checkExpirations(daysThreshold = 30) {
    // Note: Offline document storage via Dexie was removed. 
    // Expiration checks should now be handled via backend API integration.
    return [];
  },

  /**
   * Show expiration alerts using AlertManager
   */
  async showExpirationAlerts() {
    const expirations = await this.checkExpirations();

    if (expirations.length > 0) {
      const criticalCount = expirations.filter(
        (e) => e.type === "critical"
      ).length;
      const warningCount = expirations.filter(
        (e) => e.type === "warning"
      ).length;

      if (criticalCount > 0) {
        AlertManager.error(
          `${criticalCount} document(s) have expired!`,
          "Expired Documents",
          0 // Don't auto-dismiss
        );
      } else if (warningCount > 0) {
        AlertManager.warning(
          `${warningCount} document(s) expiring soon!`,
          "Expiration Warning"
        );
      }
    }

    return expirations;
  },
};

// Export both services
export default AlertManager;
