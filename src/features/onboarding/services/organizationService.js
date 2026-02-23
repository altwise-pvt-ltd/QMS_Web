import api from "../../../auth/api";

/**
 * Organization Service
 * Handles all API calls related to organization management.
 */
const organizationService = {
  /**
   * Fetches all organizations.
   * @returns {Promise<Object>} API response
   */
  getAllOrganizations: async () => {
    try {
      const response = await api.get("/Organization/GetAllOrganization");
      return response.data;
    } catch (error) {
      console.error("Error fetching all organizations:", error);
      throw error;
    }
  },

  /**
   * Fetches a specific organization by ID.
   * @param {string|number} id - The ID of the organization.
   * @returns {Promise<Object>} API response
   */
  getOrganizationById: async (id) => {
    try {
      const response = await api.get(`/Organization/GetOrganizationById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Creates or updates the organization profile.
   * @param {FormData} formData - The organization data (including logo).
   * @returns {Promise<Object>} API response
   */
  createOrganization: async (formData) => {
    try {
      const response = await api.post("/Organization/CreateOrganization", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },
};

export default organizationService;
