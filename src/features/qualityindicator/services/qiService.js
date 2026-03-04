import api from "../../../auth/api";

/**
 * Service for handling Quality Indicator-related API calls.
 */
export const qiService = {
  /**
   * Fetch all Quality Indicator Categories.
   */
  getAllCategories: async () => {
    try {
      const response = await api.get("/QualityIndicator/GetAllCategories");
      return response.data;
    } catch (error) {
      console.error("Error fetching quality categories:", error);
      throw error;
    }
  },

  /**
   * Fetch all Quality Indicators.
   */
  getAllQualityIndicators: async () => {
    try {
      const response = await api.get("/QualityIndicator/GetAllQualityIndicators");
      return response.data;
    } catch (error) {
      console.error("Error fetching quality indicators:", error);
      throw error;
    }
  },

  /**
   * Create a new Quality Indicator.
   * @param {Object} qiData - The quality indicator data.
   */
  createQualityIndicator: async (qiData) => {
    try {
      const response = await api.post(
        "/QualityIndicator/CreateQualityIndicator",
        qiData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating quality indicator:", error);
      throw error;
    }
  },

  /**
   * Update an existing Quality Indicator.
   * @param {number|string} id - The ID of the quality indicator to update.
   * @param {Object} qiData - The updated quality indicator data.
   */
  updateQualityIndicator: async (id, qiData) => {
    try {
      const response = await api.put(
        `/QualityIndicator/UpdateQualityIndicator/${id}`,
        qiData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating quality indicator:", error);
      throw error;
    }
  },

  /**
   * Delete a Quality Indicator.
   * @param {number|string} id - The ID of the quality indicator to delete.
   */
  deleteQualityIndicator: async (id) => {
    try {
      await api.delete(`/QualityIndicator/DeleteQualityIndicator/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting quality indicator:", error);
      throw error;
    }
  },
};

export default qiService;