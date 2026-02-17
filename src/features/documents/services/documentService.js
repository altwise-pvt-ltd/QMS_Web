import api from "../../../auth/api";

/**
 * Service for handling Document-related API calls.
 */
export const documentService = {
  /**
   * Fetch all documents.
   */
  getDocuments: async () => {
    try {
      const response = await api.get("/Document/GetAllDocuments");
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  /**
   * Fetch all categories.
   */
  getCategories: async () => {
    try {
      const response = await api.get("/DocumentLibrary/GetCategories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Fetch subcategories for a specific category.
   * @param {number|string} categoryId
   */
  getSubCategories: async (categoryId) => {
    try {
      const response = await api.get(`/DocumentLibrary/GetSubCategories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  },

  /**
   * Create a new subcategory.
   */
  createSubCategory: async (payload) => {
    try {
      const response = await api.post("/DocumentLibrary/CreateSubCategory", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  /**
   * Update an existing subcategory.
   */
  updateSubCategory: async (payload) => {
    try {
      const response = await api.post("/DocumentLibrary/UpdateSubCategory", payload);
      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  },

  /**
   * Delete a subcategory.
   */
  deleteSubCategory: async (subCategoryId, categoryId) => {
    try {
      const response = await api.delete(
        `/DocumentLibrary/DeleteSubCategory?subCategoryId=${subCategoryId}&categoryId=${categoryId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },

  /**
   * Upload a new document.
   * @param {Object} data - The document data and file.
   */
  uploadDocument: async (data) => {
    try {
      const formData = new FormData();
      formData.append("DocumentCategoryId", data.categoryId);
      formData.append("DocumentSubCategoryId", data.subCategoryId);
      formData.append("DepartmentId", data.departmentId);
      formData.append("Author", data.author);
      formData.append("Version", data.version);
      formData.append("Description", data.description);
      formData.append("CreatedBy", data.createdBy);
      formData.append("UpdatedBy", data.updatedBy);
      formData.append("EffectiveDate", data.effectiveDate);
      formData.append("ExpiryDate", data.expiryDate);
      formData.append("DocumentFile", data.file);

      const response = await api.post("/DocumentLibrary/UploadDocument", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }
};

export default documentService;
