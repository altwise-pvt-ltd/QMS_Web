import api from "../../../auth/api";

// ─────────────────────────────────────────────────────────────
// capaService.js
//
// Service layer for the CAPA (Corrective & Preventive Action) module.
// Base path: /Capa/*
//
// Capabilities covered:
//   • CAPA CRUD                     (GET|POST|PUT|DELETE /Capa/*)
//   • Question bank management      (GET|POST /Capa/*Question*)
//   • Suggestion management         (GET|POST /Capa/*Suggestion*)
//   • Risk & Quality questionnaire  (GET /Capa/RiskAndQuality*)
//
// IMPORTANT: CreateCapa and UpdateCapa use multipart/form-data
// (not JSON) because they support file uploads.
// ─────────────────────────────────────────────────────────────

// ──── Helpers ──────────────────────────────────────────────

/**
 * Standardized error handler — same pattern as trainingService.
 */
const safeCall = async (apiCall) => {
  try {
    const response = await apiCall();

    // DELETE returns empty body
    if (response.status === 200 && !response.data) {
      return { success: true };
    }

    return response.data ?? response;
  } catch (error) {
    if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
      return Promise.reject({ cancelled: true, message: "Request cancelled" });
    }

    if (error?.response?.status === 401) {
      return Promise.reject({
        status: 401,
        message: error.response?.data?.message || "Unauthorized – token may be expired",
        isAuthError: true,
      });
    }

    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      return Promise.reject({
        status: error.response.status,
        message: error.response?.data?.message || error.response?.data?.title || `Client error (${error.response.status})`,
        data: error.response?.data,
      });
    }

    return Promise.reject({
      status: error?.response?.status || 0,
      message: error?.response?.data?.message || error?.message || "An unexpected error occurred",
      isNetworkError: !error?.response,
    });
  }
};

/**
 * Normalizes ISO datetime to yyyy-MM-dd for UI date inputs.
 */
const normalizeDateForUi = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("T")) return dateStr.split("T")[0];
  return dateStr;
};

// ──── Field Mapping ────────────────────────────────────────

/**
 * Maps an API CAPA record → UI-friendly shape.
 *
 * API shape (from GetCapaById / CreateCapa response):
 *   { capaId, capaIssueId, nonConformanceId, nonConformanceIssueId,
 *     supplier, status, capaStatus, date, capaIssueDate,
 *     detailsOfCapa, departmentId, capaCategoryId, capaSubCategoryId,
 *     linkedEvidenceDocumentPath/Name (x3),
 *     effectiveness, observations, staffIdInvolvedInIncident,
 *     responsibility, closureVerification,
 *     capaAuditQuestions: [{ question, isYesSelected, rootCause, correctiveAction, preventiveAction }] }
 */
const mapApiToUi = (item) => {
  if (!item) return null;

  // Map audit questions to the shape components expect
  const questions = (item.capaAuditQuestions || []).map((q) => q.question);
  const questionAnswers = {};
  (item.capaAuditQuestions || []).forEach((q, idx) => {
    questionAnswers[idx] = q.isYesSelected ? "yes" : "no";
  });

  // Build uploaded files array from the 3 evidence slots
  const uploadedFiles = [];
  if (item.linkedEvidenceDocumentPath) {
    uploadedFiles.push({
      fileName: item.linkedEvidenceDocumentName || "Evidence 1",
      fileUrl: item.linkedEvidenceDocumentPath,
    });
  }
  if (item.evidenceDocumentPathTwo) {
    uploadedFiles.push({
      fileName: item.evidenceDocumentNameTwo || "Evidence 2",
      fileUrl: item.evidenceDocumentPathTwo,
    });
  }
  if (item.evidenceDocumentPathThree) {
    uploadedFiles.push({
      fileName: item.evidenceDocumentNameThree || "Evidence 3",
      fileUrl: item.evidenceDocumentPathThree,
    });
  }

  return {
    // IDs
    id: item.capaId,
    capaId: item.capaId,
    capaIssueId: item.capaIssueId,
    issueNo: item.nonConformanceIssueId || item.capaIssueId || "N/A",

    // NC linkage
    nonConformanceId: item.nonConformanceId,
    nonConformanceIssueId: item.nonConformanceIssueId,

    // Core fields
    supplier: item.supplier || "",
    status: item.status || "Submitted",
    capaStatus: item.capaStatus || "Open",
    date: normalizeDateForUi(item.date),
    capaIssueDate: normalizeDateForUi(item.capaIssueDate),
    details: item.detailsOfCapa || "",
    detailsOfCapa: item.detailsOfCapa || "",

    // Category
    departmentId: item.departmentId,
    department: "Dept #" + (item.departmentId || "1"),
    capaCategoryId: item.capaCategoryId,
    capaSubCategoryId: item.capaSubCategoryId,

    // CAPA content — the API stores these in audit questions,
    // but also has top-level observations/effectiveness
    effectiveness: item.effectiveness || "",
    observations: item.observations || "",
    responsibility: item.responsibility || "",
    closureVerification: item.closureVerification || "",

    // Audit questions (mapped for UI)
    questions,
    questionAnswers,
    capaAuditQuestions: item.capaAuditQuestions || [],

    // Evidence files
    uploadedFiles,

    // Staff
    staffIdInvolvedInIncident: item.staffIdInvolvedInIncident,

    // Metadata for FormPreview list display
    name: item.nonConformanceSubCategoryName || item.detailsOfCapa || "CAPA Record",
    filedBy: item.responsibility || "Staff",
    filedDate: normalizeDateForUi(item.date || item.createdDate),

    // Timestamps
    createdDate: item.createdDate,
    createdBy: item.createdBy,
    organizationId: item.organizationId,
  };
};

/**
 * Builds a FormData object from the UI form shape for create/update.
 *
 * The API expects multipart/form-data with:
 *   - Flat fields (CapaIssueId, NonConformanceId, etc.)
 *   - Indexed audit questions (CapaAuditQuestions[0].Question, etc.)
 *   - File fields (LinkedEvidenceDocument, etc.) — if File objects are provided
 *
 * @param {Object} uiData - Form data from CapaForm component
 * @param {Object} [options] - { capaId, ncData }
 * @returns {FormData}
 */
const buildFormData = (uiData, options = {}) => {
  const fd = new FormData();

  // If updating, include the CAPA ID
  if (options.capaId) {
    fd.append("CapaId", String(options.capaId));
  }

  // NC linkage
  if (uiData.nonConformanceId) {
    fd.append("NonConformanceId", String(uiData.nonConformanceId));
  }
  if (uiData.nonConformanceIssueId) {
    fd.append("NonConformanceIssueId", uiData.nonConformanceIssueId);
  }

  // Core fields
  fd.append("Supplier", uiData.supplier || "");
  fd.append("Status", uiData.status || "Submitted");
  fd.append("CapaStatus", uiData.capaStatus || "Open");
  fd.append("Date", uiData.date || new Date().toISOString().split("T")[0]);
  fd.append("CapaIssueDate", uiData.capaIssueDate || uiData.date || new Date().toISOString().split("T")[0]);
  fd.append("DetailsOfCapa", uiData.details || uiData.detailsOfCapa || "");
  fd.append("DepartmentId", String(uiData.departmentId || uiData.department || "1"));
  fd.append("CapaCategoryId", String(uiData.capaCategoryId || uiData.category || "1"));
  fd.append("CapaSubCategoryId", String(uiData.capaSubCategoryId || uiData.subCategory || "1"));
  fd.append("Effectiveness", uiData.effectiveness || "Pending");
  fd.append("Observations", uiData.observations || uiData.details || "");
  fd.append("StaffIdInvolvedInIncident", String(uiData.staffIdInvolvedInIncident || uiData.taggedStaff?.[0]?.id || "0"));
  fd.append("Responsibility", uiData.responsibility || "");
  fd.append("ClosureVerification", uiData.closureVerification || "Not Verified");

  // Audit questions — indexed format
  const auditQuestions = uiData.capaAuditQuestions || [];
  if (auditQuestions.length > 0) {
    auditQuestions.forEach((q, idx) => {
      fd.append(`CapaAuditQuestions[${idx}].Question`, q.question || q.Question || "");
      fd.append(`CapaAuditQuestions[${idx}].IsYesSelected`, String(q.isYesSelected ?? q.IsYesSelected ?? false));
      fd.append(`CapaAuditQuestions[${idx}].RootCause`, q.rootCause || q.RootCause || "");
      fd.append(`CapaAuditQuestions[${idx}].CorrectiveAction`, q.correctiveAction || q.CorrectiveAction || "");
      fd.append(`CapaAuditQuestions[${idx}].PreventiveAction`, q.preventiveAction || q.PreventiveAction || "");
    });
  } else if (uiData.questions && uiData.questionAnswers) {
    // Build from the UI's questions[] + questionAnswers{} shape
    uiData.questions.forEach((qText, idx) => {
      const answer = uiData.questionAnswers[idx];
      fd.append(`CapaAuditQuestions[${idx}].Question`, typeof qText === "string" ? qText : qText.question || "");
      fd.append(`CapaAuditQuestions[${idx}].IsYesSelected`, String(answer === "yes"));
      fd.append(`CapaAuditQuestions[${idx}].RootCause`, uiData.rootCause || "");
      fd.append(`CapaAuditQuestions[${idx}].CorrectiveAction`, uiData.correctiveAction || "");
      fd.append(`CapaAuditQuestions[${idx}].PreventiveAction`, uiData.preventiveAction || "");
    });
  }

  // File uploads — up to 3 evidence document slots
  // If uiData.uploadedFiles contains File objects, attach them
  // If they contain URLs (existing files), pass the paths as strings
  const files = uiData.uploadedFiles || [];
  const fileSlots = [
    { pathKey: "LinkedEvidenceDocumentPath", nameKey: "LinkedEvidenceDocumentName", fileKey: "LinkedEvidenceDocument" },
    { pathKey: "EvidenceDocumentPathTwo", nameKey: "EvidenceDocumentNameTwo", fileKey: "EvidenceDocumentTwo" },
    { pathKey: "EvidenceDocumentPathThree", nameKey: "EvidenceDocumentNameThree", fileKey: "EvidenceDocumentThree" },
  ];

  files.forEach((file, idx) => {
    if (idx >= 3) return; // Max 3 slots
    const slot = fileSlots[idx];

    if (file instanceof File) {
      // New file upload
      fd.append(slot.fileKey, file);
      fd.append(slot.nameKey, file.name);
    } else if (file.fileUrl) {
      // Existing file URL (from API response)
      fd.append(slot.pathKey, file.fileUrl);
      fd.append(slot.nameKey, file.fileName || `Evidence ${idx + 1}`);
    }
  });

  return fd;
};

// ──── Service ──────────────────────────────────────────────

export const capaService = {
  // ── CAPA CRUD ──────────────────────────────────────────

  /**
   * Fetch all CAPA entries.
   *
   * @returns {Promise<Array>} – Array of CAPA records (UI shape)
   */
  getCAPAs: async () => {
    const data = await safeCall(() => api.get("/Capa/GetAllCapas"));
    const records = Array.isArray(data) ? data : (data?.value || []);
    return records.map(mapApiToUi).filter(Boolean);
  },

  /**
   * Fetch a single CAPA by ID.
   *
   * @param {number|string} id – capaId
   * @returns {Promise<Object>} – CAPA record (UI shape)
   */
  getCapaById: async (id) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "CAPA ID is required." });
    }
    const data = await safeCall(() => api.get(`/Capa/GetCapaById/${id}`));
    return mapApiToUi(data);
  },

  /**
   * Create a new CAPA entry.
   *
   * Uses multipart/form-data because the API supports file uploads.
   *
   * @param {Object} capaData – UI form data
   * @returns {Promise<Object>} – { success, message, data: { capaId, ... } }
   */
  createCAPA: async (capaData) => {
    const formData = buildFormData(capaData);
    const response = await safeCall(() =>
      api.post("/Capa/CreateCapa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );

    // Response shape: { success, message, data: { capaId, ... } }
    if (response?.data) {
      return {
        ...response,
        data: mapApiToUi(response.data),
      };
    }
    return response;
  },

  /**
   * Update an existing CAPA.
   *
   * NOTE: This endpoint currently returns 404 (backend not deployed).
   * Wired up and ready for when backend team fixes it.
   * Uses multipart/form-data — same as create.
   *
   * @param {number|string} id – capaId
   * @param {Object} capaData – Full or partial CAPA data
   * @returns {Promise<Object>}
   */
  updateCAPA: async (id, capaData) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "CAPA ID is required." });
    }
    const formData = buildFormData(capaData, { capaId: id });
    return safeCall(() =>
      api.put("/Capa/UpdateCapa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
  },

  /**
   * Delete a CAPA by ID.
   *
   * Returns empty 200 on success.
   *
   * @param {number|string} id – capaId
   * @returns {Promise<Object>} – { success: true }
   */
  deleteCAPA: async (id) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "CAPA ID is required." });
    }
    return safeCall(() => api.delete(`/Capa/DeleteCapa/${id}`));
  },

  // ── Question Bank ──────────────────────────────────────

  /**
   * Fetch all CAPA questions in the question bank.
   *
   * Response: { success, data: [{ capaQuestionListId, qiSubCategory, capaQuestion, ... }] }
   *
   * @returns {Promise<Array>}
   */
  getAllQuestions: async () => {
    const response = await safeCall(() => api.get("/Capa/GetAllQuestions"));
    return response?.data || [];
  },

  /**
   * Create a new question in the question bank.
   *
   * @param {Object} questionData – { qiSubCategory, capaQuestion }
   * @returns {Promise<Object>} – { success, message, data: { capaQuestionListId, ... } }
   */
  createQuestion: async (questionData) => {
    if (!questionData?.capaQuestion) {
      return Promise.reject({ message: "Question text is required." });
    }
    return safeCall(() =>
      api.post("/Capa/CreateCapaQuestion", questionData)
    );
  },

  // ── Suggestions ────────────────────────────────────────

  /**
   * Create a suggestion for a specific category.
   *
   * The categoryId in the URL is the QI category ID (e.g., 1002 for Pre-Analytical).
   *
   * @param {number|string} categoryId – Quality indicator category ID
   * @param {Object} suggestionData – { capaQuestionListId, rootCause, correctiveAction, preventiveAction }
   * @returns {Promise<Object>}
   */
  createSuggestion: async (categoryId, suggestionData) => {
    if (!categoryId) {
      return Promise.reject({ message: "Category ID is required." });
    }
    return safeCall(() =>
      api.post(`/Capa/CreateSuggestion/${categoryId}`, suggestionData)
    );
  },

  /**
   * Fetch questions for a specific QI sub-category.
   *
   * @param {string} subCategory – e.g., "QISubCategory_6"
   * @returns {Promise<Array>} – [{ capaQuestionListId, capaQuestion, ... }]
   */
  getQuestionsBySubCategory: async (subCategory) => {
    if (!subCategory) {
      return Promise.reject({ message: "Sub-category is required." });
    }
    const response = await safeCall(() =>
      api.get(`/Capa/RiskAndQualityQuestionare/${subCategory}`)
    );
    return response?.data || [];
  },

  /**
   * Fetch suggestions for a specific question.
   *
   * @param {number|string} questionId – capaQuestionListId
   * @param {boolean} [isSelected] - Filter by isSelectedQuestion (e.g. true for "Yes", false for "No")
   * @returns {Promise<Array>} – [{ capaQuestionSuggestionId, rootCause, correctiveAction, preventiveAction, ... }]
   */
  getSuggestionsByQuestion: async (questionId, isSelected = null) => {
    if (!questionId) {
      return Promise.reject({ message: "Question ID is required." });
    }
    
    let url = `/Capa/RiskAndQualitySuggestions/${questionId}`;
    if (isSelected !== null) {
      url += `?isselected=${isSelected}`;
    }

    const response = await safeCall(() => api.get(url));
    return response?.data || [];
  },

  /**
   * Fetch all suggestions filtered by status.
   *
   * @param {number|string} statusId
   * @returns {Promise<Array>}
   */
  getSuggestionsByStatus: async (statusId) => {
    if (!statusId && statusId !== 0) {
      return Promise.reject({ message: "Status ID is required." });
    }
    const response = await safeCall(() =>
      api.get(`/Capa/GetAllSuggestionsByStatus/${statusId}`)
    );
    return response?.data || [];
  },
};

// ──── Utility Exports ──────────────────────────────────────

export { mapApiToUi, buildFormData, normalizeDateForUi };

export default capaService;