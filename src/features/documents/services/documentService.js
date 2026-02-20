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
  },

  /**
   * Deletes a subcategory.
   * @param {number|string} subCategoryId
   * @param {number|string} categoryId - Needed for cache invalidation
   * @returns {Promise<Object>} Response data
   */
  deleteSubCategory: async (subCategoryId, categoryId) => {
    try {
      const response = await api.delete(
        `/DocumentLibrary/DeleteSubCategory/${subCategoryId}`
      );

      // Invalidate cache for this category
      if (CACHE.subCategories[categoryId]) {
        delete CACHE.subCategories[categoryId];
      }

      return response.data;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },

  /**
   * Clears the cache. Useful for force refresh.
   */
  clearCache: () => {
    CACHE.categories = null;
    CACHE.subCategories = {};
  },

  /**
   * Fetches documents for a specific category and subcategory.
   * @param {number|string} categoryId
   * @param {number|string} subCategoryId
   * @returns {Promise<Array>} List of documents
   */
  getDocumentsByCategoryAndSubCategory: async (categoryId, subCategoryId) => {
    try {
      const response = await api.get(
        `/DocumentLibrary/GetDocumentsByCategoryAndSubCategory/${categoryId}/${subCategoryId}`
      );
      return response.data || [];
    } catch (error) {
      console.error(
        `Error fetching documents for cat: ${categoryId}, sub: ${subCategoryId}`,
        error
      );
      throw error;
    }
  },

  /**
   * Deletes a document.
   * @param {number|string} documentId
   * @returns {Promise<Object>} Response data
   */
  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(
        `/DocumentLibrary/DeleteDocument/${documentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },
};

export default documentService;
