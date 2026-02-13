import api from "../../../auth/api";
import placeholderImage from "../../../assets/defualt_image_placeholder.jpg";

const API_BASE_URL = "https://qmsapi.altwise.in/";

/**
 * Staff Service to handle all API calls related to staff management.
 */
const staffService = {
  /**
   * Fetches all staff members.
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllStaff: () => {
    return api.get("/Staff/GetAllStaff");
  },

  /**
   * Fetches all departments.
   * @returns {Promise<AxiosResponse<any>>}
   */
  getAllDepartments: () => {
    return api.get("/Department/GetAllDepartments");
  },

  /**
   * Fetches a single staff member by ID.
   * @param {number|string} id - The ID of the staff member.
   * @returns {Promise<AxiosResponse<any>>}
   */
  getStaffById: (id) => {
    return api.get(`/Staff/GetStaffById/${id}`);
  },

  /**
   * Creates a new staff member.
   * @param {Object} staffData - The staff data payload.
   * @returns {Promise<AxiosResponse<any>>}
   */
  createStaff: (staffData) => {
    return api.post("/Staff/CreateStaff", staffData);
  },

  /**
  * Updates an existing staff member.
  * @param {Object} staffData - The staff data payload.
  * @returns {Promise<AxiosResponse<any>>}
  */
  updateStaff: (staffData) => {
    return api.put("/Staff/UpdateStaff", staffData);
  },

  /**
   * Deletes a staff member by ID.
   * @param {number|string} id - The ID of the staff member.
   * @returns {Promise<AxiosResponse<any>>}
   */
  deleteStaffById: (id) => {
    return api.delete(`/Staff/DeleteStaffById/${id}`);
  },

  /**
   * Fetches documents for a specific staff member.
   * @param {number|string} staffId - The ID of the staff member.
   * @returns {Promise<AxiosResponse<any>>}
   */
  getStaffDocuments: (staffId) => {
    return api.get(`/StaffDocuments/GetAllDocuments/${staffId}`);
  },

  /**
   * Submits staff details and documents.
   * @param {FormData} formData - The staff details form data (multipart/form-data).
   * @returns {Promise<AxiosResponse<any>>}
   */
  submitStaffDetails: (formData) => {
    return api.post("/StaffDocuments/StaffDetailsList", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      skipAuth: true,
    });
  },

  /**
   * Constructs the full URL for an asset (image/pdf).
   * @param {string} path - The relative path of the asset.
   * @returns {string} The full URL or empty string if path is null/undefined.
   */
  getAssetUrl: (path) => {
    if (!path) return "";
    // If path is already a full URL, return it
    if (path.startsWith("http")) return path;

    // Ensure forward slashes and no leading slash to avoid double slashes
    const normalizedPath = path.replace(/\\/g, '/');
    const cleanPath = normalizedPath.startsWith("/") ? normalizedPath.slice(1) : normalizedPath;
    return `${API_BASE_URL}${cleanPath}`;
  },

  /**
   * Returns the fallback placeholder image.
   * @returns {string} Path to placeholder image
   */
  getPlaceholderImage: () => {
    return placeholderImage;
  }
};

export default staffService;