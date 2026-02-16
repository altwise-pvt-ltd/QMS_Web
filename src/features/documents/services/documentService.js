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
  }
};

export default documentService;
