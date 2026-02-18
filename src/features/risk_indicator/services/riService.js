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
     * Create a new Risk Indicator.
     * @param {Object} riData - The risk indicator data.
     */
    createRiskIndicator: async (riData) => {
        try {
            const response = await api.post(
                "/RiskIndicator/CreateRiskIndicator",
                riData,
            );
            return response.data;
        } catch (error) {
            console.error("Error creating risk indicator:", error);
            throw error;
        }
    },

    /**
     * Create a new Quality Indicator.
     * @param {Object} qiData - { indicatorName, category, threshold, severity }
     */
    createQualityIndicator: async (qiData) => {
        try {
            const response = await api.post(
                "/QualityIndicator/CreateQualityIndicator",
                qiData,
            );
            return response.data;
        } catch (error) {
            console.error("Error creating quality indicator:", error);
            throw error;
        }
    },

    /**
     * Fetch all Risk Indicators.
     */
    getAllRiskIndicators: async () => {
        try {
            const response = await api.get("/RiskIndicator/GetAllRiskIndicators");
            return response.data;
        } catch (error) {
            console.error("Error fetching risk indicators:", error);
            throw error;
        }
    },

    /**
     * Update an existing Risk Indicator.
     * @param {number|string} id - The ID of the risk indicator to update.
     * @param {Object} riData - The updated risk indicator data.
     */
    updateRiskIndicator: async (id, riData) => {
        try {
            const response = await api.put(
                `/RiskIndicator/UpdateRiskIndicator/${id}`,
                riData,
            );
            return response.data;
        } catch (error) {
            console.error("Error updating risk indicator:", error);
            throw error;
        }
    },
};

export default riService;
