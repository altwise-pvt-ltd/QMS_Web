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
 *
 * Subcategory Routing:
 *   Categories come from /QualityIndicator/GetAllQualityAndRiskCategories
 *   which returns both QI and RI categories with a categoryCode prefix.
 *   - "QICategory_*" → /QualityIndicator/GetSubCategoriesByCategory/{id}
 *   - "RICategory_*" → /RiskIndicator/GetSubCategoriesByCategory/{id}
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
      if (evidenceFile instanceof File && ncrId) {
        const r2Result = await uploadFile(
          evidenceFile,
          {
            module: "ncr",
            ncrId,
            subType: "evidence", // → evidence__{uuid}.jpg
          },
          onProgress,
        );

        // Step 2 — Replace binary file with R2 URL string
        formData.append("EvidenceDocumentPath", r2Result.fileUrl);
        // Backend requires both Path AND Name — use original filename
        formData.append("EvidenceDocumentName", evidenceFile.name);
        console.log("Evidence uploaded to R2:", r2Result.fileUrl);
      } else {
        // No evidence — send empty strings so fields are present
        formData.append("EvidenceDocumentPath", "");
        formData.append("EvidenceDocumentName", "");
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
      if (evidenceFile instanceof File && ncrId) {
        const r2Result = await uploadFile(
          evidenceFile,
          {
            module: "ncr",
            ncrId,
            subType: "evidence",
          },
          onProgress,
        );

        formData.append("EvidenceDocumentPath", r2Result.fileUrl);
        formData.append("EvidenceDocumentName", evidenceFile.name);
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

  // ── Categories ────────────────────────────────────────────────────────────

  /**
   * Fetch all Non-Conformance Categories (both QI and RI combined).
   */
  getAllCategories: async () => {
    try {
      const response = await api.get("/QualityIndicator/GetAllQualityAndRiskCategories");
      return response.data;
    } catch (error) {
      console.error("Error fetching NC categories:", error);
      throw error;
    }
  },

  /**
   * Fetch SubCategories by Category ID.
   * Routes to the correct endpoint based on categoryCode prefix:
   *   - "QICategory_*" → /QualityIndicator/GetSubCategoriesByCategory/{id}
   *   - "RICategory_*" → /RiskIndicator/GetSubCategoriesByCategory/{id}
   *
   * @param {string|number} categoryId   - The category ID to fetch subcategories for
   * @param {string}        categoryCode - The categoryCode (e.g. "QICategory_4", "RICategory_1")
   * @returns {Promise<any>} Subcategory data from the appropriate endpoint
   */
  getSubCategoriesByCategory: async (categoryId, categoryCode) => {
    try {
      let endpoint;

      if (categoryCode && categoryCode.startsWith("QICategory_")) {
        endpoint = `/QualityIndicator/GetSubCategoriesByCategory/${categoryId}`;
      } else if (categoryCode && categoryCode.startsWith("RICategory_")) {
        endpoint = `/RiskIndicator/GetSubCategoriesByCategory/${categoryId}`;
      } else {
        if (categoryCode) {
          console.warn(
            `Unknown categoryCode prefix: "${categoryCode}" for categoryId: ${categoryId}. ` +
            `Expected "QICategory_*" or "RICategory_*". Defaulting to QualityIndicator endpoint.`
          );
        }
        endpoint = `/QualityIndicator/GetSubCategoriesByCategory/${categoryId}`;
      }

      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId} (code: ${categoryCode}):`,
        error,
      );
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