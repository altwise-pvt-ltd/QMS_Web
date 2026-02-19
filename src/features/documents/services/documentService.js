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
   * Upload a new document.
   * @param {FormData} formData - The document data and file.
   */
  uploadDocument: async (formData) => {
    try {
      const response = await api.post("/Document/UploadDocument", formData, {
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
