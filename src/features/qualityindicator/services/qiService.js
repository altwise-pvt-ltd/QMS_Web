import api from "../../../auth/api";

/**
 * Service for handling Quality Indicator (SubCategory) related API calls.
 */
export const qiService = {
  /**
   * Fetch all Quality Indicator Categories.
   * Returns an array of category objects.
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
   * Fetch all Quality SubCategories.
   * Fixed naming to reflect Postman logs.
   */
  getAllQualitySubCategories: async () => {
    try {
      const response = await api.get("/QualityIndicator/GetAllQualitySubCategories");
      return response.data;
    } catch (error) {
      console.error("Error fetching all quality subcategories:", error);
      throw error;
    }
  },

  /**
   * Fetch SubCategories by Category ID.
   */
  getSubCategoriesByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/QualityIndicator/GetSubCategoriesByCategory/${categoryId}`);
      // Based on logs, this returns { success: true, message: "...", data: [...] }
      return response.data;
    } catch (error) {
      console.error(`Error fetching subcategories for category ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Create a new Quality SubCategory.
   */
  createSubCategory: async (subCategoryData) => {
    try {
      const response = await api.post(
        "/QualityIndicator/CreateSubCategory",
        subCategoryData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  /**
   * Update an existing Quality SubCategory.
   */
  updateSubCategory: async (id, subCategoryData) => {
    try {
      const response = await api.put(
        `/QualityIndicator/UpdateSubCategory/${id}`,
        subCategoryData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  },

  /**
   * Delete a Quality SubCategory.
   * Note: Postman log didn't show DeleteSubCategory, but following naming convention.
   */
  deleteQualityIndicator: async (id) => {
    try {
      await api.delete(`/QualityIndicator/DeleteSubCategory/${id}`);
      return true;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },
};

export default qiService;