import api from "../../../auth/api";

/**
 * Service for handling CAPA-related API calls.
 */
export const capaService = {
    /**
     * Submit a new CAPA entry.
     * @param {Object} capaData - The CAPA data to save.
     */
    createCAPA: async (capaData) => {
        try {
            const response = await api.post("/CAPA/CreateCAPA", capaData);
            return response.data;
        } catch (error) {
            console.error("Error creating CAPA:", error);
            throw error;
        }
    },

    /**
     * Fetch all CAPA entries.
     */
    getCAPAs: async () => {
        try {
            const response = await api.get("/CAPA/GetAllCAPAs");
            return response.data;
        } catch (error) {
            console.error("Error fetching CAPAs:", error);
            throw error;
        }
    }
};

export default capaService;
