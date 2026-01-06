import { db } from "../../db/index.js";

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
   * Scans DB for documents expiring within X days
   * @param {number} daysThreshold - How many days ahead to warn (default 30)
   */
  async checkExpirations(daysThreshold = 30) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysThreshold);

    // 1. Get all active documents
    const allDocs = await db.documents.toArray();

    const alerts = allDocs
      .filter((doc) => {
        if (!doc.expiryDate) return false;
        const exp = new Date(doc.expiryDate);
        return exp >= today && exp <= futureDate;
      })
      .map((doc) => {
        const exp = new Date(doc.expiryDate);
        const diffTime = Math.abs(exp - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return {
          id: doc.id || doc.name,
          title: `Document Expiring: ${doc.name}`,
          message: `Expires in ${diffDays} days (${doc.expiryDate})`,
          type: "warning",
          docId: doc.id,
        };
      });

    // 2. Check for already expired documents
    const expired = allDocs
      .filter((doc) => doc.expiryDate && new Date(doc.expiryDate) < today)
      .map((doc) => ({
        id: doc.id,
        title: `EXPIRED: ${doc.name}`,
        message: `Expired on ${doc.expiryDate}`,
        type: "critical",
        docId: doc.id,
      }));

    return [...expired, ...alerts];
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
