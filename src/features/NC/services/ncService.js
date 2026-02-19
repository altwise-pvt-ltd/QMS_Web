import api from "../../../auth/api";

/**
 * Service for handling Non-Conformance (NC) related API calls.
 */
export const ncService = {
    /**
     * Submit a new NC entry.
     * @param {Object} ncData - The NC data to save.
     */
    createNC: async (ncData) => {
        try {
            const response = await api.post("/NonConformance/CreateNonConformance", ncData);
            return response.data;
        } catch (error) {
            console.error("Error creating NC:", error);
            throw error;
        }
    },

    /**
     * Fetch all NC entries.
     */
    getNCs: async () => {
        try {
            const response = await api.get("/NonConformance/GetAllNonConformances");
            return response.data;
        } catch (error) {
            console.error("Error fetching NCs:", error);
            throw error;
        }
    }
};

export default ncService;
