import api from "../../../auth/api";

// ─────────────────────────────────────────────────────────────
// trainingService.js
//
// Service layer for the Training / Compliance Events module.
// Base path: /Training/*
//
// Capabilities covered:
//   • Event‑type management      (GET  /Training/getEvent-types)
//   • Training CRUD              (GET|POST|PUT /Training/*)
//   • Attendance tracking        (GET|POST|PUT /Training/*Attendance*)
//   • Stats & reporting          (GET  /Training/GetStats)
//   • Training matrix            (GET  /Training/matrix)
//   • Yearly overview            (GET  /Training/yearly)
//   • Staff lookup               (GET  /Training/GetStaff)
//   • Search & pagination        (GET  /Training/search, /Training/page)
//   • Status filtering           (GET  /Training/status)
// ─────────────────────────────────────────────────────────────

// ──── Constants ────────────────────────────────────────────
const VALID_STATUSES = ["Pending", "Completed", "Overdue", "Cancelled"];

const VALID_RECURRENCES = [
  "Daily",
  "Weekly",
  "Monthly",
  "Quarterly",
  "Yearly",
  "One-Time",
];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// ──── Helpers ──────────────────────────────────────────────

/**
 * Wraps an API call with standardized error handling and an
 * optional AbortController signal for request cancellation.
 *
 * @param {Function} apiCall  – A function that receives an Axios config
 *                              object (with `signal`) and returns a promise.
 * @param {AbortSignal} [signal] – Optional AbortController signal.
 * @returns {Promise<any>} Resolved response data or a rejected error.
 */
const safeCall = async (apiCall, signal) => {
  try {
    const config = signal ? { signal } : {};
    const response = await apiCall(config);

    // PUT /updateTraining returns empty body — normalise to { success: true }
    if (response.status === 200 && !response.data) {
      return { success: true };
    }

    return response.data ?? response;
  } catch (error) {
    // Cancelled requests (component unmounted) – silently swallow
    if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
      return Promise.reject({ cancelled: true, message: "Request cancelled" });
    }

    // Token expired / unauthorized
    if (error?.response?.status === 401) {
      const serverMsg =
        error.response?.data?.message || "Unauthorized – token may be expired";
      return Promise.reject({
        status: 401,
        message: serverMsg,
        isAuthError: true,
      });
    }

    // 4xx client errors
    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      return Promise.reject({
        status: error.response.status,
        message:
          error.response?.data?.message ||
          `Client error (${error.response.status})`,
        data: error.response?.data,
      });
    }

    // 5xx / network errors
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

/**
 * Validates the shape of a training payload before it leaves the client.
 * Throws a descriptive error for any missing / invalid field.
 *
 * @param {Object} data – Training payload.
 * @param {boolean} [isUpdate=false] – When true, every field is optional.
 */
const validateTrainingPayload = (data, isUpdate = false) => {
  if (!data || typeof data !== "object") {
    throw new Error("Training payload must be a non-null object.");
  }

  if (!isUpdate) {
    // Required fields for creation
    const required = ["title", "eventTypeId", "dueDate"];
    const missing = required.filter(
      (key) => data[key] === undefined || data[key] === null || data[key] === ""
    );
    if (missing.length) {
      throw new Error(
        `Missing required training fields: ${missing.join(", ")}`
      );
    }
  }

  // Type checks (applied to whichever fields are present)
  if (data.title !== undefined && typeof data.title !== "string") {
    throw new Error("'title' must be a string.");
  }

  if (data.eventTypeId !== undefined) {
    const id = Number(data.eventTypeId);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("'eventTypeId' must be a positive integer.");
    }
  }

  if (data.dueDate !== undefined) {
    const d = new Date(data.dueDate);
    if (isNaN(d.getTime())) {
      throw new Error("'dueDate' must be a valid ISO‑8601 date string.");
    }
  }

  if (
    data.recurrence !== undefined &&
    !VALID_RECURRENCES.includes(data.recurrence)
  ) {
    throw new Error(
      `'recurrence' must be one of: ${VALID_RECURRENCES.join(", ")}`
    );
  }

  if (data.status !== undefined && !VALID_STATUSES.includes(data.status)) {
    throw new Error(`'status' must be one of: ${VALID_STATUSES.join(", ")}`);
  }
};

/**
 * Validates an attendance payload.
 *
 * @param {Object} data – Attendance payload.
 * @param {boolean} [isUpdate=false]
 */
const validateAttendancePayload = (data, isUpdate = false) => {
  if (!data || typeof data !== "object") {
    throw new Error("Attendance payload must be a non-null object.");
  }

  if (!isUpdate) {
    const required = ["eventId", "staffId", "status"];
    const missing = required.filter(
      (key) => data[key] === undefined || data[key] === null || data[key] === ""
    );
    if (missing.length) {
      throw new Error(
        `Missing required attendance fields: ${missing.join(", ")}`
      );
    }
  }

  if (data.score !== undefined) {
    const score = Number(data.score);
    if (isNaN(score) || score < 0 || score > 100) {
      throw new Error("'score' must be a number between 0 and 100.");
    }
  }

  if (data.completionDate !== undefined) {
    const d = new Date(data.completionDate);
    if (isNaN(d.getTime())) {
      throw new Error(
        "'completionDate' must be a valid ISO‑8601 date string."
      );
    }
  }
};

/**
 * Validates and clamps pagination parameters.
 *
 * @param {number} [page]
 * @param {number} [pageSize]
 * @returns {{ page: number, pageSize: number }}
 */
const sanitizePagination = (page, pageSize) => {
  const p = Number.isInteger(Number(page)) && Number(page) > 0
    ? Number(page)
    : DEFAULT_PAGE;
  let ps = Number.isInteger(Number(pageSize)) && Number(pageSize) > 0
    ? Number(pageSize)
    : DEFAULT_PAGE_SIZE;
  ps = Math.min(ps, MAX_PAGE_SIZE);
  return { page: p, pageSize: ps };
};

// ──── Service ──────────────────────────────────────────────

const trainingService = {
  // ── Event Types ────────────────────────────────────────

  /**
   * Fetch all compliance event types for the current organisation.
   *
   * Response shape (array):
   *   [{ id, name, category, defaultFrequency, organizationId }]
   *
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getEventTypes: (signal) =>
    safeCall((cfg) => api.get("/Training/getEvent-types", cfg), signal),

  // ── Training CRUD ──────────────────────────────────────

  /**
   * Fetch every training event for the current organisation.
   *
   * Response shape (array):
   *   [{ eventId, title, eventType, dueDate, status, assignedTo }]
   *
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getAllTrainings: (signal) =>
    safeCall((cfg) => api.get("/Training/getAllTrainings", cfg), signal),

  /**
   * Fetch a single training event by its ID.
   *
   * Response includes nested `eventType` and `attendance[]`.
   *
   * @param {number|string} id – complianceEventId
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>}
   */
  getTrainingById: (id, signal) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "Training ID is required." });
    }
    return safeCall(
      (cfg) => api.get(`/Training/GetTrainingById/${id}`, cfg),
      signal
    );
  },

  /**
   * Create a new training / compliance event.
   *
   * Required fields: title, eventTypeId, dueDate.
   * Optional: assignedTo, givenBy, recurrence, notes.
   *
   * @param {Object} data
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>} – { message, data: { complianceEventId, … } }
   */
  createTraining: (data, signal) => {
    validateTrainingPayload(data, false);
    return safeCall(
      (cfg) => api.post("/Training/CreateTraining", data, cfg),
      signal
    );
  },

  /**
   * Update an existing training event.
   *
   * NOTE: The API returns an empty response body on success (HTTP 200
   * with no content-type). `safeCall` normalises this to { success: true }.
   *
   * @param {number|string} id – complianceEventId
   * @param {Object} data      – Partial or full training fields
   * @param {AbortSignal} [signal]
   * @returns {Promise<{ success: true } | Object>}
   */
  updateTraining: (id, data, signal) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "Training ID is required." });
    }
    validateTrainingPayload(data, true);
    return safeCall(
      (cfg) => api.put(`/Training/updateTraining/${id}`, data, cfg),
      signal
    );
  },

  // ── Attendance ─────────────────────────────────────────

  /**
   * Fetch attendance records for a specific compliance event.
   *
   * Response shape (array):
   *   [{ trainingAttendanceId, staffId, eventId, eventName,
   *      status, completionDate, score }]
   *
   * @param {number|string} eventId
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getAttendanceByEventId: (eventId, signal) => {
    if (!eventId && eventId !== 0) {
      return Promise.reject({ message: "Event ID is required." });
    }
    return safeCall(
      (cfg) => api.get(`/Training/GetAttendanceByEventId/${eventId}`, cfg),
      signal
    );
  },

  /**
   * Record a new attendance entry.
   *
   * Required fields: eventId, staffId, status.
   * Optional: completionDate, score (0–100).
   *
   * @param {Object} data
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>} – { message, data: { trainingAttendanceId, … } }
   */
  createAttendance: (data, signal) => {
    validateAttendancePayload(data, false);
    return safeCall(
      (cfg) => api.post("/Training/CreateTrainingAttendance", data, cfg),
      signal
    );
  },

  /**
   * Update an existing attendance record.
   *
   * @param {number|string} id – trainingAttendanceId
   * @param {Object} data      – { status?, completionDate?, score? }
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>} – { message, data }
   */
  updateAttendance: (id, data, signal) => {
    if (!id && id !== 0) {
      return Promise.reject({ message: "Attendance ID is required." });
    }
    validateAttendancePayload(data, true);
    return safeCall(
      (cfg) => api.put(`/Training/UpdateAttendance/${id}`, data, cfg),
      signal
    );
  },

  // ── Filtering, Search & Pagination ─────────────────────

  /**
   * Filter training events by status.
   *
   * @param {string} status – One of: Pending, Completed, Overdue, Cancelled
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getTrainingsByStatus: (status, signal) => {
    if (!status || !VALID_STATUSES.includes(status)) {
      return Promise.reject({
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }
    return safeCall(
      (cfg) =>
        api.get("/Training/status", {
          ...cfg,
          params: { status },
        }),
      signal
    );
  },

  /**
   * Search training events by keyword.
   *
   * Uses Axios `params` for proper URL encoding (handles spaces,
   * ampersands, and other special characters safely).
   *
   * @param {string} keyword
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  searchTrainings: (keyword, signal) => {
    if (!keyword || typeof keyword !== "string" || !keyword.trim()) {
      return Promise.reject({ message: "Search keyword is required." });
    }
    return safeCall(
      (cfg) =>
        api.get("/Training/search", {
          ...cfg,
          params: { keyword: keyword.trim() },
        }),
      signal
    );
  },

  /**
   * Get a paginated list of training events.
   *
   * Defaults: page = 1, pageSize = 10 (max 100).
   *
   * Response shape:
   *   { totalRecords, page, pageSize, data: [...] }
   *
   * @param {number} [page=1]
   * @param {number} [pageSize=10]
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>}
   */
  getTrainingsPage: (page, pageSize, signal) => {
    const safe = sanitizePagination(page, pageSize);
    return safeCall(
      (cfg) =>
        api.get("/Training/page", {
          ...cfg,
          params: safe,
        }),
      signal
    );
  },

  // ── Stats & Reporting ──────────────────────────────────

  /**
   * Fetch aggregate training statistics.
   *
   * Response shape:
   *   { total, upcoming, completed, overdue }
   *
   * @param {AbortSignal} [signal]
   * @returns {Promise<Object>}
   */
  getStats: (signal) =>
    safeCall((cfg) => api.get("/Training/GetStats", cfg), signal),

  /**
   * Fetch the training competency matrix.
   *
   * Returns an array (may be empty if no matrix data exists yet).
   *
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getTrainingMatrix: (signal) =>
    safeCall((cfg) => api.get("/Training/matrix", cfg), signal),

  /**
   * Fetch yearly training overview.
   *
   * Response shape (array):
   *   [{ eventId, trainingTitle, eventType, dueDate, recurrence, assignedTo }]
   *
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getYearlyTrainings: (signal) =>
    safeCall((cfg) => api.get("/Training/yearly", cfg), signal),

  // ── Staff ──────────────────────────────────────────────

  /**
   * Fetch simplified staff list for dropdowns / assignment forms.
   *
   * Response shape (array):
   *   [{ staffId, firstName, lastName, jobTitle }]
   *
   * @param {AbortSignal} [signal]
   * @returns {Promise<Array>}
   */
  getStaff: (signal) =>
    safeCall((cfg) => api.get("/Training/GetStaff", cfg), signal),
};

// ──── React Hook Helper ────────────────────────────────────
/**
 * Creates an AbortController that auto-cancels on component unmount.
 * Use inside useEffect:
 *
 * ```jsx
 * useEffect(() => {
 *   const controller = trainingService.createAbortController();
 *   trainingService.getAllTrainings(controller.signal)
 *     .then(setTrainings)
 *     .catch((err) => {
 *       if (!err.cancelled) setError(err.message);
 *     });
 *   return () => controller.abort();
 * }, []);
 * ```
 */
trainingService.createAbortController = () => new AbortController();

export default trainingService;

// Re-export constants for use in forms, filters, etc.
export { VALID_STATUSES, VALID_RECURRENCES, DEFAULT_PAGE_SIZE };