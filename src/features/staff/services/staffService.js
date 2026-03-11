import api from "../../../auth/api";
import placeholderImage from "../../../assets/defualt_image_placeholder.jpg";
import { uploadFile } from "../../../services/workerService";

/**
 * staffService.js
 *
 * Handles ALL staff-related API calls:
 *   - Staff CRUD  → /Staff/*
 *   - Document upload + submission → /StaffDocuments/StaffDetailsList
 *   - Document read → /StaffDocuments/GetAllDocuments/{staffId}
 *
 * Document Upload Flow (two-step):
 *   Step 1 — Every file → QMS Worker → R2
 *             Path: qmsdocs/staff/{firstname-lastname}_{staffId}/{subType}/{uuid}.ext
 *   Step 2 — FormData with R2 URL strings (no binaries) → POST /StaffDocuments/StaffDetailsList
 */

// ─── Internal R2 upload helpers ───────────────────────────────────────────────

/**
 * Uploads one file to R2. Returns URL string or "" if file is null.
 */
async function uploadStaffFile(file, staffId, staffName, subType) {
  if (!file) return "";
  // If 'file' is already a URL string (from existingDocuments), return it as-is
  if (typeof file === "string" && file.startsWith("http")) return file;
  if (!(file instanceof File)) return "";

  const r2Result = await uploadFile(file, {
    module: "staff",
    staffId: String(staffId),
    staffName: staffName || "staff",  // slugified by Worker: "John Doe" → "john-doe"
    subType,                          // "passport"|"resume"|"qualifications"|etc.
  });

  return r2Result.fileUrl;
}

/**
 * Uploads multiple files of the same subType in parallel.
 * Returns array of URL strings in the same order as input.
 */
async function uploadMany(files, staffId, staffName, subType) {
  return Promise.all(
    files.map((file) => uploadStaffFile(file, staffId, staffName, subType))
  );
}

// ─── Service ──────────────────────────────────────────────────────────────────

const staffService = {

  // ── Staff CRUD ────────────────────────────────────────────────────────────

  getAllStaff: () => api.get("/Staff/GetAllStaff"),

  getAllDepartments: () => api.get("/Department/GetAllDepartments"),

  getStaffById: (id) => api.get(`/Staff/GetStaffById/${id}`),

  createStaff: (staffData) => api.post("/Staff/CreateStaff", staffData),

  updateStaff: (staffData) => api.put("/Staff/UpdateStaff", staffData),

  deleteStaffById: (id) => api.delete(`/Staff/DeleteStaffById/${id}`),

  changePassword: (staffId, passwordData) =>
    api.put(`/Staff/ChangePassword/${staffId}`, passwordData, { skipAuth: true }),

  // ── Staff Documents — Read ────────────────────────────────────────────────

  getStaffDocuments: (staffId) =>
    api.get(`/StaffDocuments/GetAllDocuments/${staffId}`),

  // ── Staff Documents — Submit (Worker → R2 → Backend) ─────────────────────

  /**
   * Uploads all staff documents to R2 first, then POSTs URL strings to backend.
   *
   * @param {Object} data - Staff document data
   * @param {number|string} data.staffId        - Required. Staff DB id.
   * @param {string}        data.staffName      - Required. e.g. "John Doe" → R2 folder "john-doe_15"
   * @param {File|null}     data.passportPhoto  - Passport photo file
   * @param {File|null}     data.resume         - CV / Resume file
   * @param {Array}         data.qualifications - [{ file, documentTitle, collegeName, graduationYear }]
   * @param {Array}         data.appointments   - [{ file, documentTitle }]
   * @param {Array}         data.medicals       - [{ file, recordTitle, issueDate }]
   * @param {Array}         data.vaccinations   - [{ file, certificateName, doseDate }]
   * @param {Array}         data.trainings      - [{ trainingTitle, inductionFile, competencyFile }]
   * @param {Function|null} onProgress          - Progress callback (0–100)
   *
   * @returns {Promise<Object>} Backend API response
   */
  submitStaffDocuments: async (data, onProgress = null) => {
    const { staffId, staffName } = data;

    if (!staffId) throw new Error("staffId is required");
    if (!staffName) throw new Error("staffName is required");

    const report = (pct) => onProgress?.(pct);

    // ── Step 1: Upload all files to R2 in parallel per category ──────────────

    report(5);

    // Single files
    const [passportUrl, resumeUrl] = await Promise.all([
      uploadStaffFile(data.passportPhoto, staffId, staffName, "passport"),
      uploadStaffFile(data.resume, staffId, staffName, "resume"),
    ]);
    report(20);

    // Arrays
    const qualUrls = await uploadMany(
      (data.qualifications || []).map((q) => q.file), staffId, staffName, "qualifications"
    );
    report(35);

    const apptUrls = await uploadMany(
      (data.appointments || []).map((a) => a.file), staffId, staffName, "appointments"
    );
    report(50);

    const medUrls = await uploadMany(
      (data.medicals || []).map((m) => m.file), staffId, staffName, "medicals"
    );
    report(65);

    const vacUrls = await uploadMany(
      (data.vaccinations || []).map((v) => v.file), staffId, staffName, "vaccinations"
    );
    report(75);

    // Trainings have two files per record
    const [inductionUrls, competencyUrls] = await Promise.all([
      uploadMany((data.trainings || []).map((t) => t.inductionFile), staffId, staffName, "trainings"),
      uploadMany((data.trainings || []).map((t) => t.competencyFile), staffId, staffName, "trainings"),
    ]);
    report(90);

    // ── Step 2: Build FormData with URL strings — no binary files ─────────────

    const formData = new FormData();

    formData.append("StaffId", String(staffId));
    formData.append("PassportPhoto", passportUrl);  // R2 URL string
    formData.append("Resume", resumeUrl);    // R2 URL string

    (data.qualifications || []).forEach((q, i) => {
      formData.append(`Qualifications[${i}].File`, qualUrls[i] || "");
      formData.append(`Qualifications[${i}].DocumentTitle`, q.documentTitle || "");
      formData.append(`Qualifications[${i}].CollegeName`, q.collegeName || "");
      formData.append(`Qualifications[${i}].GraduationYear`, q.graduationYear || "");
    });

    (data.appointments || []).forEach((a, i) => {
      formData.append(`Appointments[${i}].File`, apptUrls[i] || "");
      formData.append(`Appointments[${i}].DocumentTitle`, a.documentTitle || "");
    });

    (data.medicals || []).forEach((m, i) => {
      formData.append(`Medicals[${i}].File`, medUrls[i] || "");
      formData.append(`Medicals[${i}].RecordTitle`, m.recordTitle || "");
      formData.append(`Medicals[${i}].IssueDate`, m.issueDate || "");
    });

    (data.vaccinations || []).forEach((v, i) => {
      formData.append(`Vaccinations[${i}].File`, vacUrls[i] || "");
      formData.append(`Vaccinations[${i}].CertificateName`, v.certificateName || "");
      formData.append(`Vaccinations[${i}].DoseDate`, v.doseDate || "");
    });

    (data.trainings || []).forEach((t, i) => {
      formData.append(`Trainings[${i}].TrainingTitle`, t.trainingTitle || "");
      formData.append(`Trainings[${i}].InductionFile`, inductionUrls[i] || "");
      formData.append(`Trainings[${i}].CompetencyFile`, competencyUrls[i] || "");
    });

    report(95);

    // ── Step 3: POST to backend ───────────────────────────────────────────────

    try {
      const response = await api.post(
        "/StaffDocuments/StaffDetailsList",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      report(100);
      return response.data;
    } catch (error) {
      console.error("Error submitting staff documents:", error);
      throw error;
    }
  },

  // ── Asset URL helper ──────────────────────────────────────────────────────

  /**
   * Returns the correct displayable URL for any staff asset.
   * R2 URLs are already full — old Plesk paths get the base URL prepended.
   *
   * @param {string} path - R2 URL or legacy relative path
   * @returns {string}
   */
  getAssetUrl: (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path; // R2 URL — use as-is
    // Legacy Plesk path fallback
    const clean = path.replace(/\\/g, "/").replace(/^\//, "");
    return `https://qmsapi.altwise.in/${clean}`;
  },

  getPlaceholderImage: () => placeholderImage,
};

export default staffService;