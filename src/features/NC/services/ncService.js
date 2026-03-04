import api from "../../../auth/api";

/**
 * Service for handling Non-Conformance (NC) related API calls.
 */
export const ncService = {
    /**
     * Submit a new NC entry using FormData.
     * @param {FormData} formData - The NC data and files to save.
     */
    createNC: async (formData) => {
        try {
            const response = await api.post("/NonConformance/CreateNonConformance", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
    },

    /**
     * Update an existing NC entry.
     * @param {number|string} id - The ID of the NC to update.
     * @param {FormData} formData - The updated NC data.
     */
    updateNC: async (id, formData) => {
        try {
            const response = await api.put(`/NonConformance/UpdateNonConformance/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating NC with ID ${id}:`, error);
            throw error;
        }
    },
};

export default ncService;
