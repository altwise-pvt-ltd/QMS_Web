import api from "../../../auth/api";

/**
 * Service for handling Risk Indicator-related API calls.
 */
export const riService = {
    /**
     * Create a new Risk Indicator Category.
     * @param {Object} categoryData - The category data { categoryName: string }.
     */
    createCategory: async (categoryData) => {
        try {
            const response = await api.post(
                "/RiskIndicator/CreateCategory",
                categoryData,
            );
            return response.data;
        } catch (error) {
            console.error("Error creating risk category:", error);
            throw error;
        }
    },

    /**
     * Fetch all Risk Indicator Categories.
     */
    getAllCategories: async () => {
        try {
            const response = await api.get("/RiskIndicator/GetAllCategories");
            return response.data;
        } catch (error) {
            console.error("Error fetching risk categories:", error);
            throw error;
        }
    },

    /**
     * Create a new Risk Indicator Subcategory.
     * @param {Object} riData - The risk indicator data.
     */
    createRiskSubCategory: async (riData) => {
        try {
            const response = await api.post(
                "/RiskIndicator/CreateSubCategory",
                riData,
            );
            return response.data;
        } catch (error) {
            console.error("Error creating risk subcategory:", error);
            throw error;
        }
    },

    /**
     * Fetch all Risk_Indicator Subcategories.
     */
    getAllRiskSubCategories: async () => {
        try {
            const response = await api.get("/RiskIndicator/GetAllRiskSubCategories");
            return response.data;
        } catch (error) {
            console.error("Error fetching risk subcategories:", error);
            throw error;
        }
    },

    /**
     * Update an existing Risk Indicator Subcategory.
     * @param {number|string} id - The ID of the risk indicator to update.
     * @param {Object} riData - The updated risk indicator data.
     */
    updateRiskSubCategory: async (id, riData) => {
        try {
            const response = await api.put(
                `/RiskIndicator/UpdateSubCategory/${id}`,
                riData,
            );
            return response.data;
        } catch (error) {
            console.error("Error updating risk subcategory:", error);
            throw error;
        }
    },
};

export default riService;
