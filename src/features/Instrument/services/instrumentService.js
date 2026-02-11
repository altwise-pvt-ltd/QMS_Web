import api from "../../../auth/api";

/**
 * Service for handling Instrument-related API calls.
 */
export const instrumentService = {
    /**
     * Fetch all instruments (Calibrations).
     */
    getInstruments: async () => {
        try {
            const response = await api.get(
                "/InstrumentCalibration/GetAllInstrumentCalibrations",
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching instruments:", error);
            throw error;
        }
    },

    /**
     * Create a new instrument calibration record.
     * @param {Object} instrumentData - The instrument data.
     */
    createInstrument: async (instrumentData) => {
        try {
            const response = await api.post(
                "/InstrumentCalibration/CreateInstrumentCalibration",
                instrumentData,
            );
            return response.data;
        } catch (error) {
            console.error("Error creating instrument:", error);
            throw error;
        }
    },

    /**
     * Add or update an instrument (Generic).
     * @param {Object} instrumentData - The instrument data.
     */
    saveInstrument: async (instrumentData) => {
        try {
            const response = await api.post(
                "/Instrument/SaveInstrument",
                instrumentData,
            );
            return response.data;
        } catch (error) {
            console.error("Error saving instrument:", error);
            throw error;
        }
    },
};

export default instrumentService;
