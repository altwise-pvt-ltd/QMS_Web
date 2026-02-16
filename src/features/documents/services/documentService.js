import api from "../../../auth/api";

const CACHE = {
  categories: null,
  subCategories: {}, // { [categoryId]: [subCategories] }
};

const documentService = {
  /**
   * Fetches all document categories.
   * Uses in-memory caching to prevent redundant network requests.
   * @returns {Promise<Array>} List of categories
   */
  getCategories: async () => {
    if (CACHE.categories) {
      return CACHE.categories;
    }

    try {
      const response = await api.get("/DocumentLibrary/GetCategories");
      if (response.data) {
        CACHE.categories = response.data;
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Fetches subcategories for a specific category.
   * Uses in-memory caching keyed by categoryId.
   * @param {string|number} categoryId
   * @returns {Promise<Array>} List of subcategories
   */
  getSubCategories: async (categoryId) => {
    if (CACHE.subCategories[categoryId]) {
      return CACHE.subCategories[categoryId];
    }

    try {
      const response = await api.get(
        `/DocumentLibrary/GetSubCategories/${categoryId}`
      );
      if (response.data) {
        CACHE.subCategories[categoryId] = response.data;
        return response.data;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching subcategories for ${categoryId}:`, error);
      throw error;
    }
  },

  /**
   * Creates a new subcategory.
   * @param {Object} payload - { documentCategoryId, documentSubCategoryName, createdBy }
   * @returns {Promise<Object>} Created subcategory data
   */
  createSubCategory: async (payload) => {
    try {
      const response = await api.post(
        "/DocumentLibrary/CreateSubCategory",
        payload
      );
      
      // Invalidate cache for this category so next fetch gets fresh data
      // Or we could manually append to cache if we wanted to be optimistic/faster
      if (CACHE.subCategories[payload.documentCategoryId]) {
        delete CACHE.subCategories[payload.documentCategoryId];
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  /**
   * Updates an existing subcategory.
   * @param {Object} payload - { documentCategoryId, documentSubCategoryId, documentSubCategoryName, createdBy, updatedBy }
   * @returns {Promise<Object>} Updated subcategory data
   */
  updateSubCategory: async (payload) => {
    try {
      const response = await api.put(
        "/DocumentLibrary/UpdateSubCategory",
        payload
      );

      // Invalidate cache for this category
      if (CACHE.subCategories[payload.documentCategoryId]) {
        delete CACHE.subCategories[payload.documentCategoryId];
      }

      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
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
};

export default documentService;
