import api from "../../../auth/api";
import { uploadFile } from "../../../services/workerService";

// ─────────────────────────────────────────────────────────────
// capaService.js
//
// Service layer for the CAPA (Corrective & Preventive Action) module.
// Base path: /Capa/*
//
// CAPA Questionnaire Pipeline:
//   1. Category  → GET /QualityIndicator/GetAllQualityAndRiskCategories
//   2. SubCategory → fetched by categoryId (via ncService)
//   3. Questions → GET /Capa/RiskAndQualityQuestionare/{subCategoryCode}
//   4. User answers Yes/No per question
//   5. Suggestions → GET /Capa/RiskAndQualitySuggestions/{questionId}?isselected=true|false
//      → returns { rootCause, correctiveAction, preventiveAction }
//   6. User selects which suggestions to apply → merged into form fields
//   7. Submit → POST /Capa/CreateCapa (multipart/form-data)
//
// CLOUDFLARE INTEGRATION:
// Before hitting Create/Update, all binary files in `uploadedFiles` are 
// uploaded to R2 via the Cloudflare Worker. The resulting URLs are then
// passed to the backend API instead of the raw files.
// ─────────────────────────────────────────────────────────────

// ──── Helpers ──────────────────────────────────────────────

const safeCall = async (apiCall) => {
  try {
    const response = await apiCall();

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
        message:
          error.response?.data?.message ||
          "Unauthorized – token may be expired",
        isAuthError: true,
      });
    }

    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      console.error(`API Client Error [${error.response.status}]:`, error.response.data);
      return Promise.reject({
        status: error.response.status,
        message:
          error.response?.data?.message ||
          error.response?.data?.title ||
          `Client error (${error.response.status})`,
        data: error.response?.data,
      });
    }

    return Promise.reject({
      status: error?.response?.status || 0,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred",
      isNetworkError: !error?.response,
    });
  }
};

const normalizeDateForUi = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("T")) return dateStr.split("T")[0];
  return dateStr;
};

// ──── Field Mapping ────────────────────────────────────────

/**
 * Maps an API CAPA record → UI-friendly shape.
 *
 * KEY INSIGHT: The API does NOT store rootCause, correctiveAction,
 * and preventiveAction as top-level fields. They are stored INSIDE
 * each capaAuditQuestion. We aggregate them here for CAPAFormView.
 */
const mapApiToUi = (item) => {
  if (!item) return null;

  const auditQuestions = item.capaAuditQuestions || [];

  // Map audit questions to the shape components expect
  const questions = auditQuestions.map((q) => q.question);
  const questionAnswers = {};
  auditQuestions.forEach((q, idx) => {
    questionAnswers[idx] = q.isYesSelected ? "yes" : "no";
  });

  // Aggregate rootCause / correctiveAction / preventiveAction from all audit questions
  const rootCauseParts = [];
  const correctiveActionParts = [];
  const preventiveActionParts = [];

  auditQuestions.forEach((q) => {
    if (q.rootCause) rootCauseParts.push(q.rootCause);
    if (q.correctiveAction) correctiveActionParts.push(q.correctiveAction);
    if (q.preventiveAction) preventiveActionParts.push(q.preventiveAction);
  });

  const rootCause = [...new Set(rootCauseParts)].filter(Boolean).join("\n");
  const correctiveAction = [...new Set(correctiveActionParts)]
    .filter(Boolean)
    .join("\n");
  const preventiveAction = [...new Set(preventiveActionParts)]
    .filter(Boolean)
    .join("\n");

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
    id: item.capaId,
    capaId: 1,
    capaIssueId: item.capaIssueId,
    issueNo: item.nonConformanceIssueId || item.capaIssueId || "N/A",
    nonConformanceId: item.nonConformanceId,
    nonConformanceIssueId: item.nonConformanceIssueId,
    supplier: item.supplier || "",
    status: item.status || "Submitted",
    capaStatus: item.capaStatus || "Open",
    date: normalizeDateForUi(item.date),
    capaIssueDate: normalizeDateForUi(item.capaIssueDate),
    details: item.detailsOfCapa || "",
    detailsOfCapa: item.detailsOfCapa || "",
    departmentId: item.departmentId,
    department: "Dept #" + (item.departmentId || "1"),
    capaCategoryId: item.capaCategoryId || "",
    capaSubCategoryId: item.capaSubCategoryId || "",
    category: item.capaCategoryId || "",
    subCategory: item.capaSubCategoryId || "",
    rootCause,
    correctiveAction,
    preventiveAction,
    effectiveness: item.effectiveness || "",
    observations: item.observations || "",
    responsibility: item.responsibility || "",
    closureVerification: item.closureVerification || "",
    questions,
    questionAnswers,
    capaAuditQuestions: auditQuestions,
    uploadedFiles,
    staffIdInvolvedInIncident: item.staffIdInvolvedInIncident,
    taggedStaff: item.staffIdInvolvedInIncident
      ? [
          {
            id: item.staffIdInvolvedInIncident,
            name: "Staff #" + item.staffIdInvolvedInIncident,
            role: "Staff",
          },
        ]
      : [],
    name:
      item.nonConformanceSubCategoryName ||
      item.detailsOfCapa ||
      "CAPA Record",
    filedBy: item.responsibility || "Staff",
    filedDate: normalizeDateForUi(item.date || item.createdDate),
    targetDate: "",

    documentMeta: {},
    createdDate: item.createdDate,
    createdBy: item.createdBy,
    organizationId: item.organizationId,
  };
};

/**
 * Builds a FormData object from the UI form shape for create/update.
 */
const buildFormData = (uiData, options = {}) => {
  const fd = new FormData();

  if (options.capaId) {
    fd.append("CapaId", String(options.capaId));
  }

  if (uiData.nonConformanceId) {
    fd.append("NonConformanceId", String(uiData.nonConformanceId));
  }
  if (uiData.nonConformanceIssueId) {
    fd.append("NonConformanceIssueId", uiData.nonConformanceIssueId);
  }
  if (uiData.capaIssueId) {
    fd.append("CapaIssueId", String(uiData.capaIssueId));
  }

  fd.append("Supplier", uiData.supplier || "");
  fd.append("Status", uiData.status || "Submitted");
  fd.append("CapaStatus", uiData.capaStatus || "Open");
  fd.append("Date", uiData.date || new Date().toISOString().split("T")[0]);
  fd.append(
    "CapaIssueDate",
    uiData.capaIssueDate ||
      uiData.date ||
      new Date().toISOString().split("T")[0],
  );
  fd.append("DetailsOfCapa", uiData.details || uiData.detailsOfCapa || "");

  // Ensure IDs are integers or safe defaults
  const dId = parseInt(uiData.departmentId || "0", 10) || 1;
  const cId = parseInt(uiData.capaCategoryId || "0", 10) || 1;
  const sId = parseInt(uiData.capaSubCategoryId || "0", 10) || 1;

  fd.append("DepartmentId", String(dId));
  fd.append("CapaCategoryId", String(cId));
  fd.append("CapaSubCategoryId", String(sId));
  fd.append("Effectiveness", uiData.effectiveness || "Pending");
  fd.append("Observations", uiData.observations || uiData.details || "");
  fd.append(
    "StaffIdInvolvedInIncident",
    String(
      parseInt(uiData.staffIdInvolvedInIncident || uiData.taggedStaff?.[0]?.id || "0", 10)
    ),
  );
  fd.append("Responsibility", uiData.responsibility || "");
  fd.append(
    "ClosureVerification",
    uiData.closureVerification || "Not Verified",
  );

  // Audit questions
  const auditQuestions = uiData.capaAuditQuestions || [];

  if (auditQuestions.length > 0) {
    auditQuestions.forEach((q, idx) => {
      fd.append(
        `CapaAuditQuestions[${idx}].Question`,
        q.question || q.Question || "",
      );
      fd.append(
        `CapaAuditQuestions[${idx}].IsYesSelected`,
        String(q.isYesSelected ?? q.IsYesSelected ?? false),
      );
      fd.append(
        `CapaAuditQuestions[${idx}].RootCause`,
        q.rootCause || q.RootCause || "",
      );
      fd.append(
        `CapaAuditQuestions[${idx}].CorrectiveAction`,
        q.correctiveAction || q.CorrectiveAction || "",
      );
      fd.append(
        `CapaAuditQuestions[${idx}].PreventiveAction`,
        q.preventiveAction || q.PreventiveAction || "",
      );
    });
  } else if (uiData.questions && uiData.questionAnswers) {
    uiData.questions.forEach((qText, idx) => {
      const answer = uiData.questionAnswers[idx];
      if (!answer) return;

      fd.append(
        `CapaAuditQuestions[${idx}].Question`,
        typeof qText === "string"
          ? qText
          : qText.question || qText.capaQuestion || "",
      );
      fd.append(
        `CapaAuditQuestions[${idx}].IsYesSelected`,
        String(answer === "yes"),
      );
      fd.append(
        `CapaAuditQuestions[${idx}].RootCause`,
        idx === 0 ? uiData.rootCause || "" : "",
      );
      fd.append(
        `CapaAuditQuestions[${idx}].CorrectiveAction`,
        idx === 0 ? uiData.correctiveAction || "" : "",
      );
      fd.append(
        `CapaAuditQuestions[${idx}].PreventiveAction`,
        idx === 0 ? uiData.preventiveAction || "" : "",
      );
    });
  }

  // File uploads — up to 3 evidence document slots
  const files = uiData.uploadedFiles || [];
  const fileSlots = [
    {
      pathKey: "LinkedEvidenceDocumentPath",
      nameKey: "LinkedEvidenceDocumentName",
      fileKey: "LinkedEvidenceDocument",
    },
    {
      pathKey: "EvidenceDocumentPathTwo",
      nameKey: "EvidenceDocumentNameTwo",
      fileKey: "EvidenceDocumentTwo",
    },
    {
      pathKey: "EvidenceDocumentPathThree",
      nameKey: "EvidenceDocumentNameThree",
      fileKey: "EvidenceDocumentThree",
    },
  ];

  files.forEach((file, idx) => {
    if (idx >= 3) return;
    const slot = fileSlots[idx];

    if (file instanceof File) {
      // NOTE: In the new flow, binary Files are uploaded to R2 BEFORE buildFormData is called.
      // So if a File object somehow reaches here, we still use its name but expect a path elsewhere.
      // In practice, createCAPA/updateCAPA will have replaced Files with URL objects.
      fd.append(slot.fileKey, file);
      fd.append(slot.nameKey, file.name);
    } else if (file.fileUrl || typeof file === "string") {
      const url = typeof file === "string" ? file : file.fileUrl;
      fd.append(slot.pathKey, url);
      fd.append(slot.nameKey, file.fileName || file.name || `Evidence ${idx + 1}`);
    }
  });

  return fd;
};

// ──── Service ──────────────────────────────────────────────

export const capaService = {
  // ── CAPA CRUD ──────────────────────────────────────────

  getCAPAs: async () => {
    const data = await safeCall(() => api.get("/Capa/GetAllCapas"));
    const records = Array.isArray(data) ? data : data?.value || [];
    return records.map(mapApiToUi).filter(Boolean);
  },

  getCapaById: async (id) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "CAPA ID is required." });
    }
    const data = await safeCall(() => api.get(`/Capa/GetCapaById/${id}`));
    return mapApiToUi(data);
  },

  createCAPA: async (capaData, onProgress = null) => {
    // Stage 1: Upload files to Cloudflare R2 if they are binary Files
    const files = capaData.uploadedFiles || [];
    const processedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file instanceof File) {
        try {
          // Provide sub-progress if needed, or just let it run
          const r2Result = await uploadFile(file, {
            module: "capa",
            capaId: capaData.capaId,
            subType: "evidence",
          });
          processedFiles.push({
            fileName: file.name,
            fileUrl: r2Result.fileUrl,
          });
          console.log(`File ${i + 1} uploaded to R2:`, r2Result.fileUrl);
        } catch (err) {
          console.error(`Failed to upload file ${file.name} to Cloudflare:`, err);
          throw new Error(`Upload failed for ${file.name}: ${err.message}`);
        }
      } else {
        // Keep existing URL objects
        processedFiles.push(file);
      }
      
      if (onProgress) {
        onProgress(Math.round(((i + 1) / files.length) * 50)); // First 50% for uploads
      }
    }

    // Stage 2: Create Record with R2 URLs
    const payload = { ...capaData, uploadedFiles: processedFiles };
    const formData = buildFormData(payload);
    
    const response = await safeCall(() =>
      api.post("/Capa/CreateCapa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );

    if (onProgress) onProgress(100);

    if (response?.data) {
      return { ...response, data: mapApiToUi(response.data) };
    }
    return response;
  },

  updateCAPA: async (id, capaData, onProgress = null) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "CAPA ID is required." });
    }

    // Stage 1: Upload new binary files to Cloudflare R2
    const files = capaData.uploadedFiles || [];
    const processedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file instanceof File) {
        try {
          const r2Result = await uploadFile(file, {
            module: "capa",
            capaId: id || capaData.capaId,
            subType: "evidence",
          });
          processedFiles.push({
            fileName: file.name,
            fileUrl: r2Result.fileUrl,
          });
          console.log(`New file ${i + 1} uploaded to R2:`, r2Result.fileUrl);
        } catch (err) {
          console.error(`Failed to upload file ${file.name} to Cloudflare:`, err);
          throw new Error(`Upload failed for ${file.name}: ${err.message}`);
        }
      } else {
        // Carry forward existing URLs
        processedFiles.push(file);
      }
    }

    // Stage 2: Update Record
    const payload = { ...capaData, uploadedFiles: processedFiles };
    const formData = buildFormData(payload, { capaId: id });
    
    return safeCall(() =>
      api.put("/Capa/UpdateCapa", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  },

  deleteCAPA: async (id) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "CAPA ID is required." });
    }
    return safeCall(() => api.delete(`/Capa/DeleteCapa/${id}`));
  },

  // ── Question Bank ──────────────────────────────────────

  getAllQuestions: async () => {
    const response = await safeCall(() => api.get("/Capa/GetAllQuestions"));
    return response?.data || [];
  },

  createQuestion: async (questionData) => {
    if (!questionData?.capaQuestion) {
      return Promise.reject({ message: "Question text is required." });
    }
    return safeCall(() => api.post("/Capa/CreateCapaQuestion", questionData));
  },

  // ── Questionnaire Pipeline ─────────────────────────────

  getQuestionsBySubCategory: async (subCategoryCode) => {
    if (!subCategoryCode) {
      return Promise.reject({ message: "Sub-category code is required." });
    }
    const response = await safeCall(() =>
      api.get(`/Capa/RiskAndQualityQuestionare/${subCategoryCode}`),
    );
    return response?.data || [];
  },

  /**
   * Fetch suggestions for a specific question.
   *
   * @param {number|string} questionId – capaQuestionListId
   * @param {boolean} [isSelected=true] – true for Yes answer, false for No
   * @returns {Promise<Array>}
   */
  getSuggestionsByQuestion: async (questionId, isSelected = true) => {
    if (!questionId) {
      return Promise.reject({ message: "Question ID is required." });
    }
    const response = await safeCall(() =>
      api.get(`/Capa/RiskAndQualitySuggestions/${questionId}`, {
        params: { isselected: isSelected },
      }),
    );
    return response?.data || [];
  },

  // ── Suggestion Management ──────────────────────────────

  createSuggestion: async (categoryId, suggestionData) => {
    if (!categoryId) {
      return Promise.reject({ message: "Category ID is required." });
    }
    return safeCall(() =>
      api.post(`/Capa/CreateSuggestion/${categoryId}`, suggestionData),
    );
  },

  getSuggestionsByStatus: async (statusId) => {
    if (!statusId && statusId !== 0) {
      return Promise.reject({ message: "Status ID is required." });
    }
    const response = await safeCall(() =>
      api.get(`/Capa/GetAllSuggestionsByStatus/${statusId}`),
    );
    return response?.data || [];
  },
};

export { mapApiToUi, buildFormData, normalizeDateForUi };

export default capaService;