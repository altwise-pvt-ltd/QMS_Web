import api from "../../../auth/api";
import { uploadFile } from "../../../services/workerService";

/**
 * ncService — Non-Conformance API calls.
 *
 * Evidence Upload Flow:
 *   1. Evidence file → QMS Worker → R2
 *      Path: qmsdocs/ncr/{YYYY-MM-DD}/{ncrId}/{subType}__{uuid}.ext
 *   2. R2 fileUrl stored as EvidenceDocumentPath string in FormData
 *   3. FormData (no binary file) → POST /NonConformance/CreateNonConformance
 *
 * FormData fields sent to backend:
 *   NonConformanceId, NonConformanceIssueId, Supplier, Status,
 *   NonConformanceStatus, Date, NonConformanceIssueDate,
 *   DetailsOfNonConformance, DepartmentId, NonConformanceCategoryId,
 *   NonConformanceSubCategoryId, EvidenceDocumentPath ← R2 URL string
 *   Effectiveness, Observations, RootCause, CorrectiveActionTaken,
 *   PreventiveActionTaken, StaffIdinvolvedInIncident, Responsibility,
 *   ClosureVerification
 */
export const ncService = {

  // ── Create ────────────────────────────────────────────────────────────────

  /**
   * Creates a new NC entry.
   * Uploads evidence file to R2 via Worker first if provided.
   *
   * @param {FormData} formData      - NC form fields (no binary file)
   * @param {File|null} evidenceFile - Evidence image/doc to upload (optional)
   * @param {string} ncrId           - Client-generated UUID for this NCR (useRef)
   * @param {Function} onProgress    - Optional upload progress callback (0-100)
   */
  createNC: async (formData, evidenceFile = null, ncrId = null, onProgress = null) => {
    try {
      // Step 1 — Upload evidence to R2 if provided
      if (evidenceFile && ncrId) {
        const r2Result = await uploadFile(
          evidenceFile,
          {
            module:  "ncr",
            ncrId,
            subType: "evidence",   // → evidence__{uuid}.jpg
          },
          onProgress,
        );

        // Step 2 — Replace binary file with R2 URL string
        formData.append("EvidenceDocumentPath", r2Result.fileUrl);
        console.log("Evidence uploaded to R2:", r2Result.fileUrl);
      } else {
        // No evidence — send empty string so field is present
        formData.append("EvidenceDocumentPath", "");
      }

      // Step 3 — Send FormData (with URL string, no binary) to backend
      const response = await api.post(
        "/NonConformance/CreateNonConformance",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      console.error("Error creating NC:", error);
      throw error;
    }
  },

  // ── Read ──────────────────────────────────────────────────────────────────

  getNCs: async () => {
    try {
      const response = await api.get("/NonConformance/GetAllNonConformances");
      return response.data;
    } catch (error) {
      console.error("Error fetching NCs:", error);
      throw error;
    }
  },

  getNCById: async (id) => {
    try {
      const response = await api.get(`/NonConformance/GetNonConformanceById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NC with ID ${id}:`, error);
      throw error;
    }
  },

  getNCsByUserId: async (userId) => {
    try {
      const response = await api.get(`/NonConformance/GetNcByUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching NCs for user ID ${userId}:`, error);
      throw error;
    }
  },

  // ── Update ────────────────────────────────────────────────────────────────

  /**
   * Updates an existing NC entry.
   * Re-uploads evidence to R2 if a new file is provided.
   * If no new file — keeps the existing EvidenceDocumentPath from formData.
   *
   * @param {number|string} id       - NC ID to update
   * @param {FormData} formData      - Updated NC fields
   * @param {File|null} evidenceFile - New evidence file (optional)
   * @param {string} ncrId           - The NCR's stable UUID (useRef)
   * @param {Function} onProgress    - Optional progress callback
   */
  updateNC: async (id, formData, evidenceFile = null, ncrId = null, onProgress = null) => {
    try {
      // Re-upload new evidence if provided
      if (evidenceFile && ncrId) {
        const r2Result = await uploadFile(
          evidenceFile,
          {
            module:  "ncr",
            ncrId,
            subType: "evidence",
          },
          onProgress,
        );

        formData.append("EvidenceDocumentPath", r2Result.fileUrl);
        console.log("Updated evidence uploaded to R2:", r2Result.fileUrl);
      }
      // If no new file, EvidenceDocumentPath should already be in formData
      // from the existing record — caller is responsible for preserving it

      const response = await api.put(
        `/NonConformance/UpdateNonConformance/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating NC with ID ${id}:`, error);
      throw error;
    }
  },

  // ── Delete ────────────────────────────────────────────────────────────────

  deleteNC: async (id) => {
    try {
      const response = await api.delete(`/NonConformance/DeleteNonConformance/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting NC with ID ${id}:`, error);
      throw error;
    }
  },
};

export default ncService;