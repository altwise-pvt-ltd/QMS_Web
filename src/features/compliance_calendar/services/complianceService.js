import trainingService from "../../training/services/trainingService";
import { EVENT_TYPES } from "../config/eventTypes";
import { daysUntilDue } from "../utils/reminderUtils";

// ─────────────────────────────────────────────────────────────
// complianceService.js
//
// Adapter layer: maps Training API responses → compliance UI shape.
//
// The backend team removed the /ComplianceManagement/* endpoints.
// All data now flows through /Training/* via trainingService.
//
// UI shape (what components expect):
//   { id, eventTypeId, title, dueDate, recurrence, assignedTo,
//     status, reminderDays, notes, isOverdue, daysRemaining }
// ─────────────────────────────────────────────────────────────

// ──── Field Mapping ────────────────────────────────────────

/**
 * Normalizes any ISO datetime string to yyyy-MM-dd for UI date inputs.
 * "2026-03-12T06:14:45.287" → "2026-03-12"
 * "2026-10-01T00:00:00"     → "2026-10-01"
 * "2026-10-01"              → "2026-10-01" (already correct)
 *
 * @param {string} dateStr
 * @returns {string}
 */
const normalizeDateForUi = (dateStr) => {
  if (!dateStr) return "";
  if (dateStr.includes("T")) {
    return dateStr.split("T")[0];
  }
  return dateStr;
};

/**
 * Maps a Training API response item to the compliance UI shape.
 *
 * Handles ALL endpoint variations defensively:
 *   - GetAllTrainings:  { eventId, title, eventType (string), dueDate, status, ... }
 *   - GetTrainingById:  { complianceEventId, title, dueDate, eventType: { name, ... }, ... }
 *   - CreateTraining:   { complianceEventId, eventTypeId, eventType: { name, ... }, ... }
 *   - UpdateTraining:   { complianceEventId, eventTypeId, eventTypeName, title, ... }
 *   - Yearly:           { eventId, trainingTitle, eventType (string), dueDate, ... }
 */
const mapTrainingToUi = (item) => {
  if (!item) return null;

  // ── ID: pick whichever field exists
  const id = item.eventId || item.complianceEventId || null;

  // ── Event type name: could be a string, nested object, or top-level field
  let eventTypeName = "";
  if (typeof item.eventType === "string") {
    eventTypeName = item.eventType;
  } else if (item.eventType?.name) {
    eventTypeName = item.eventType.name;
  } else if (item.eventTypeName) {
    eventTypeName = item.eventTypeName;
  }

  // ── Title: yearly endpoint uses `trainingTitle`
  const title = item.title || item.trainingTitle || "";

  // ── Due date: normalize for UI date inputs (yyyy-MM-dd)
  const dueDate = normalizeDateForUi(item.dueDate);

  // ── Computed fields (not returned by Training API)
  const days = dueDate ? daysUntilDue(dueDate) : null;
  const status = item.status || "Pending";
  const isOverdue =
    status.toLowerCase() !== "completed" &&
    status.toLowerCase() !== "cancelled" &&
    days !== null &&
    days < 0;

  return {
    id,
    eventTypeId: eventTypeName, // Components match by string name (e.g. "Calibration")
    title,
    dueDate,
    recurrence: item.recurrence || "one-time",
    assignedTo: item.assignedTo || "",
    status,
    reminderDays: item.reminderDays || 7, // Default — Training API doesn't store this
    notes: item.notes || "",
    givenBy: item.givenBy || "",
    isOverdue,
    daysRemaining: days,
  };
};

/**
 * Maps compliance UI form data → Training API create/update payload.
 */
const mapUiToTraining = (uiEvent) => ({
  title: uiEvent.title || "",
  eventTypeId: resolveEventTypeId(uiEvent.eventTypeId),
  dueDate: uiEvent.dueDate || "",
  assignedTo: uiEvent.assignedTo || "",
  givenBy: uiEvent.givenBy || "",
  recurrence: mapRecurrence(uiEvent.recurrence),
  notes: uiEvent.notes || "",
  status: capitalizeStatus(uiEvent.status),
});

/**
 * The Training API expects a numeric eventTypeId (e.g. 7),
 * but the compliance UI stores the string name (e.g. "Calibration").
 *
 * We resolve string names to numeric IDs using a cached lookup
 * from the event types endpoint. If the value is already numeric,
 * we pass it through.
 */
let _eventTypesCache = null;

const resolveEventTypeId = (idOrName) => {
  // Already numeric
  const num = Number(idOrName);
  if (!isNaN(num) && num > 0) return num;

  // Try to resolve from cache
  if (_eventTypesCache) {
    const match = _eventTypesCache.find(
      (t) => t.name.toLowerCase() === String(idOrName).toLowerCase()
    );
    if (match) return match.id;
  }

  // Fallback: return as-is and let the API validate
  return idOrName;
};

/**
 * Fetches and caches event types for ID resolution.
 * Called once on first create/update, or can be called manually.
 */
const ensureEventTypesCache = async () => {
  if (!_eventTypesCache) {
    try {
      _eventTypesCache = await trainingService.getEventTypes();
    } catch {
      _eventTypesCache = [];
    }
  }
  return _eventTypesCache;
};

/**
 * Map compliance recurrence values to what the Training API expects.
 * Compliance UI uses lowercase ("one-time", "yearly"),
 * Training API uses capitalized ("One-Time", "Yearly").
 */
const mapRecurrence = (recurrence) => {
  if (!recurrence) return "One-Time";

  const mapping = {
    "one-time": "One-Time",
    weekly: "Weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    "half-yearly": "Quarterly", // Closest match — Training API has no half-yearly
    yearly: "Yearly",
    daily: "Daily",
  };

  return mapping[recurrence.toLowerCase()] || recurrence;
};

/**
 * Capitalize status to match Training API expectations.
 * Compliance UI uses "pending", Training API uses "Pending".
 */
const capitalizeStatus = (status) => {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

// ==================== EVENT TYPES ====================

/**
 * Get all event types — merges API event types with local config colors/icons.
 *
 * Returns the shape compliance components expect:
 *   [{ id (string name), name, color, icon }]
 */
export const getAllEventTypes = async () => {
  try {
    const apiTypes = await trainingService.getEventTypes();
    _eventTypesCache = apiTypes; // Cache for resolveEventTypeId

    return apiTypes.map((apiType) => {
      // Find matching local config for color/icon
      const localMatch = Object.values(EVENT_TYPES).find(
        (t) => t.name.toLowerCase() === apiType.name.toLowerCase()
      );

      return {
        id: apiType.name, // String name — compliance components match by name
        name: apiType.name,
        color: localMatch?.color || "#3B82F6",
        icon: localMatch?.icon || "Calendar",
        category: apiType.category,
        numericId: apiType.id, // Keep numeric ID for create/update calls
      };
    });
  } catch (error) {
    console.error("Error fetching event types:", error);
    // Fallback to local config if API fails
    return Object.values(EVENT_TYPES).map((type) => ({
      id: type.name,
      name: type.name,
      color: type.color,
      icon: type.icon,
    }));
  }
};

// ==================== COMPLIANCE EVENTS ====================

/**
 * Create a new compliance event via Training API.
 */
export const createEvent = async (eventData) => {
  try {
    await ensureEventTypesCache();
    const apiData = mapUiToTraining(eventData);
    const response = await trainingService.createTraining(apiData);
    return mapTrainingToUi(response.data || response);
  } catch (error) {
    console.error("Error creating event:", error);
    const msg = error.data?.message || error.message || "Failed to create event";
    throw new Error(msg);
  }
};

/**
 * Get all compliance events.
 */
export const getAllEvents = async () => {
  try {
    const trainings = await trainingService.getAllTrainings();
    return (trainings || []).map(mapTrainingToUi).filter(Boolean);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Get event by ID — uses detailed endpoint (includes notes, recurrence, attendance).
 */
export const getEventById = async (id) => {
  try {
    const training = await trainingService.getTrainingById(id);
    return mapTrainingToUi(training);
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

/**
 * Update an event.
 *
 * The Training API requires ALL fields on update (returns 400 for partial payloads).
 * Pattern: 1) GET the full record  2) Merge updates into it  3) PUT the complete object.
 */
export const updateEvent = async (id, updates) => {
  try {
    await ensureEventTypesCache();

    // 1. Fetch the full existing record from the API (raw shape)
    const existing = await trainingService.getTrainingById(id);
    if (!existing) throw new Error("Event not found");

    // 2. Build the base payload from the existing record
    //    This ensures all required fields are always present
    const basePayload = {
      title: existing.title || "",
      dueDate: existing.dueDate || "",
      assignedTo: existing.assignedTo || "",
      givenBy: existing.givenBy || "",
      recurrence: existing.recurrence || "One-Time",
      notes: existing.notes || "",
      status: existing.status || "Pending",
    };

    // 3. Merge UI updates into the base payload
    //    Only overwrite fields that were explicitly provided
    if (updates.title !== undefined) {
      basePayload.title = updates.title;
    }
    if (updates.dueDate !== undefined) {
      basePayload.dueDate = updates.dueDate;
    }
    if (updates.assignedTo !== undefined) {
      basePayload.assignedTo = updates.assignedTo;
    }
    if (updates.givenBy !== undefined) {
      basePayload.givenBy = updates.givenBy;
    }
    if (updates.notes !== undefined) {
      basePayload.notes = updates.notes;
    }
    if (updates.recurrence !== undefined) {
      basePayload.recurrence = mapRecurrence(updates.recurrence);
    }
    if (updates.status !== undefined) {
      basePayload.status = capitalizeStatus(updates.status);
    }
    if (updates.eventTypeId !== undefined) {
      basePayload.eventTypeId = resolveEventTypeId(updates.eventTypeId);
    }

    // 4. Send the complete payload to the API
    const response = await trainingService.updateTraining(id, basePayload);
    return mapTrainingToUi(response);
  } catch (error) {
    console.error("Error updating event:", error);
    const msg = error.data?.message || error.message || "Failed to update event";
    throw new Error(msg);
  }
};

/**
 * Delete an event.
 */
export const deleteEvent = async (id) => {
  try {
    const response = await trainingService.deleteTraining(id);
    return response;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// ==================== DERIVED QUERIES (Client-side filtering) ====================

/**
 * Get upcoming events (next X days).
 *
 * No dedicated endpoint exists on Training API, so we filter
 * getAllTrainings client-side.
 */
export const getUpcomingEvents = async (days = 30) => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => {
      if (!event.dueDate) return false;
      const status = event.status.toLowerCase();
      if (status === "completed" || status === "cancelled") return false;
      const remaining = daysUntilDue(event.dueDate);
      return remaining >= 0 && remaining <= days;
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
};

/**
 * Get overdue events.
 *
 * Filters from getAllTrainings — events past due that aren't completed/cancelled.
 */
export const getOverdueEvents = async () => {
  try {
    const allEvents = await getAllEvents();
    return allEvents.filter((event) => event.isOverdue);
  } catch (error) {
    console.error("Error fetching overdue events:", error);
    return [];
  }
};

// ==================== COMPLIANCE RECORDS ====================


export const createComplianceRecord = async (recordData) => {
  console.warn("createComplianceRecord API not implemented");
  return null;
};

export const getRecordsByEventId = async (eventId) => {
  return [];
};

export const deleteComplianceRecord = async (id) => {
  return true;
};