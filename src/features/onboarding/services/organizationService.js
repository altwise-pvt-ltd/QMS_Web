import api from "../../../auth/api";
import { uploadFile } from "./workerService"; // ← reusable Worker upload util

/**
 * Organization Service
 * Handles all API calls related to organization management.
 *
 * Logo Upload Flow:
 *   1. Logo file → QMS Worker → R2  (get back fileUrl)
 *   2. fileUrl as companyLogoPath + other fields → POST /Organization/CreateOrganization (JSON)
 *
 * Backend payload shape:
 * {
 *   legalCompanyName:  string,
 *   industrySector:    string,
 *   businessPhone:     string,
 *   corporateWebsite:  string,
 *   registeredAddress: string,
 *   companyLogoPath:   string   ← full R2 URL or empty string if no logo
 * }
 */
const organizationService = {

  // ── Read ──────────────────────────────────────────────────────────────────

  getAllOrganizations: async () => {
    try {
      const response = await api.get("/Organization/GetAllOrganization");
      return response.data;
    } catch (error) {
      console.error("Error fetching all organizations:", error);
      throw error;
    }
  },

  getOrganizationById: async (id) => {
    try {
      const response = await api.get(`/Organization/GetOrganizationById/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching organization with ID ${id}:`, error);
      throw error;
    }
  },

  // ── Create ────────────────────────────────────────────────────────────────

  /**
   * Creates an organization, uploading the logo to R2 first if provided.
   *
   * @param {Object} fields - Organization form fields
   * @param {string} fields.legalCompanyName
   * @param {string} fields.industrySector
   * @param {string} fields.businessPhone
   * @param {string} fields.corporateWebsite
   * @param {string} fields.registeredAddress
   * @param {File|null} [logoFile=null] - Logo file object (optional)
   * @param {Function} [onUploadProgress] - Optional progress callback (0-100)
   * @returns {Promise<Object>} API response
   */
  createOrganization: async (fields, logoFile = null, onUploadProgress = null) => {
    let companyLogoPath = "";

    // Step 1 — Upload logo to R2 via Worker (if provided)
    if (logoFile) {
      try {
        // Use a stable org ID placeholder — since org doesn't exist yet,
        // we use a UUID so the R2 path is unique per upload attempt
        const tempOrgId = crypto.randomUUID();

        const r2Result = await uploadFile(
          logoFile,
          {
            module: "organization",
            orgId: tempOrgId,
          },
          onUploadProgress,
        );

        companyLogoPath = r2Result.fileUrl;
        console.log("Logo uploaded to R2:", companyLogoPath);
      } catch (uploadError) {
        console.error("Logo upload to R2 failed:", uploadError);
        throw new Error(`Logo upload failed: ${uploadError.message}`);
      }
    }

    // Step 2 — Send JSON to backend with R2 URL as CompanyLogoPath
    try {
      const payload = {
        LegalCompanyName: fields.legalCompanyName,
        IndustrySector: fields.industrySector,
        BusinessPhone: fields.businessPhone,
        CorporateWebsite: fields.corporateWebsite,
        RegisteredAddress: fields.registeredAddress,
        CompanyLogoPath: companyLogoPath,   // ← full R2 URL
        Status: true,
      };

      const response = await api.post("/Organization/CreateOrganization", payload);
      return response.data;

    } catch (error) {
      console.error("Error creating organization:", error);
      throw error;
    }
  },

  // ── Update ────────────────────────────────────────────────────────────────

  /**
   * Updates an organization, re-uploading logo to R2 if a new file is provided.
   *
   * @param {string|number} id - Organization ID
   * @param {Object} fields - Updated organization fields
   * @param {File|null} [logoFile=null] - New logo file (optional — pass null to keep existing)
   * @param {Function} [onUploadProgress] - Optional progress callback
   * @returns {Promise<Object>} API response
   */
  updateOrganization: async (id, fields, logoFile = null, onUploadProgress = null) => {
    let companyLogoPath = fields.companyLogoPath || ""; // keep existing URL by default

    // Upload new logo to R2 only if a new file was provided
    if (logoFile) {
      try {
        const r2Result = await uploadFile(
          logoFile,
          {
            module: "organization",
            orgId: String(id), // use real org ID on update
          },
          onUploadProgress,
        );

        companyLogoPath = r2Result.fileUrl;
        console.log("New logo uploaded to R2:", companyLogoPath);
      } catch (uploadError) {
        console.error("Logo upload to R2 failed:", uploadError);
        console.warn("Proceeding without logo due to upload failure.");
      }
    }

    try {
      // Mapping to PascalCase as required by the backend.
      // We often don't include the ID in the body for PUT if it's in the URL,
      // but if the backend strictly requires it, we can put it back.
      // Trying WITHOUT it first as it's a common cause of 400s.
      const payload = {
        LegalCompanyName: fields.legalCompanyName,
        IndustrySector: fields.industrySector,
        BusinessPhone: fields.businessPhone,
        CorporateWebsite: fields.corporateWebsite,
        RegisteredAddress: fields.registeredAddress,
        // If CompanyLogoPath is required, ensure it's not empty string. 
        // We'll use the existing path or a placeholder if absolutely blank.
        CompanyLogoPath: companyLogoPath || fields.companyLogoPath || "Pending",
        Status: "Active", // Using string as attempted by user
      };

      console.log("Updating Organization with Payload:", payload);
      const response = await api.put(`/Organization/UpdateOrganization/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }

  },

  // ── Delete ────────────────────────────────────────────────────────────────

  deleteOrganization: async (id) => {
    try {
      const response = await api.delete(`/Organization/DeleteOrganization/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting organization with ID ${id}:`, error);
      throw error;
    }
  },
};

export default organizationService;