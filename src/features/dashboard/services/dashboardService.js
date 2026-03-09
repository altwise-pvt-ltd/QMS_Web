import api from "../../../auth/api";

/**
 * Get overall system health metrics
 * @returns {Promise<Object>} healthScore, status, summaries {riskLevel, documentCompliance, openCapaCount}
 */
export const getOverallHealth = async () => {
  try {
    const response = await api.get("/Dashboard/overall-health");
    return response.data;
  } catch (error) {
    console.error("Error fetching overall health:", error);
    return {
      healthScore: 0,
      status: "Loading...",
      summaries: { riskLevel: "N/A", documentCompliance: 0, openCapaCount: 0 },
    };
  }
};

/**
 * Get document status breakdown
 * @returns {Promise<Object>} counts {total, inReview, expired}, criticalDocuments []
 */
export const getDocumentStatus = async () => {
  try {
    const response = await api.get("/Dashboard/document-status");
    return response.data;
  } catch (error) {
    console.error("Error fetching document status:", error);
    return {
      counts: { total: 0, inReview: 0, expired: 0 },
      criticalDocuments: [],
    };
  }
};

/**
 * Get incident trends for the week
 * @returns {Promise<Object>} totalThisWeek, averagePerDay, isImproving, data [{day, count}]
 */
export const getIncidentTrends = async () => {
  try {
    const response = await api.get("/Dashboard/incident-trends");
    return response.data;
  } catch (error) {
    console.error("Error fetching incident trends:", error);
    return {
      totalThisWeek: 0,
      averagePerDay: 0,
      isImproving: false,
      data: [],
    };
  }
};

/**
 * Get supplier quality overview
 * @returns {Promise<Object>} qualityPercentage, status, alertMessage, totalVendors, vendorsRequiringReview
 */
export const getSupplierQuality = async () => {
  try {
    const response = await api.get("/Dashboard/supplier-quality");
    return response.data;
  } catch (error) {
    console.error("Error fetching supplier quality:", error);
    return {
      qualityPercentage: 0,
      status: "N/A",
      alertMessage: "Error loading data",
      totalVendors: 0,
      vendorsRequiringReview: 0,
    };
  }
};
