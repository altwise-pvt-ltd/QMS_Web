import api from "../../../auth/api";
import { EVENT_TYPES } from "../config/eventTypes";

/**
 * Field Mappings: UI (Old Dexie) <-> API (New Backend)
 */
const mapApiToUi = (apiEvent) => ({
  id: apiEvent.complianceEventId,
  eventTypeId: apiEvent.complianceEventType, // String name (e.g., "Calibration")
  title: apiEvent.complianceEventTitle,
  dueDate: apiEvent.complianceDueDate,
  recurrence: apiEvent.complianceRecurrence,
  assignedTo: apiEvent.complianceAssignedTo,
  status: apiEvent.complianceStatus,
  reminderDays: apiEvent.complianceReminderDays,
  notes: apiEvent.complianceNotes,
  cmpId: apiEvent.cmpId,
  isOverdue: apiEvent.complianceIsOverdue,
  daysRemaining: apiEvent.complianceDaysRemaining,
});

const mapUiToApi = (uiEvent) => ({
  complianceEventId: uiEvent.id || 0,
  complianceEventType: uiEvent.eventTypeId || "", // Required
  complianceEventTitle: uiEvent.title || "", // Required
  complianceDueDate: uiEvent.dueDate || "",
  complianceRecurrence: uiEvent.recurrence || "one-time", // Required
  complianceAssignedTo: uiEvent.assignedTo || "", // Required
  complianceStatus: uiEvent.status || "Pending",
  complianceReminderDays: parseInt(uiEvent.reminderDays) || 0,
  complianceNotes: uiEvent.notes || "", // Required
});

// ==================== EVENT TYPES ====================

/**
 * Get all event types from config
 */
export const getAllEventTypes = async () => {
  // Map normalized EVENT_TYPES config to array for UI compatibility
  return Object.values(EVENT_TYPES).map(type => ({
    id: type.name, // Use name as ID for string matching with API
    name: type.name,
    color: type.color,
    icon: type.icon
  }));
};

// ==================== COMPLIANCE EVENTS ====================

/**
 * Create a new compliance event
 */
export const createEvent = async (eventData) => {
  try {
    const apiData = mapUiToApi(eventData);
    const response = await api.post("/ComplianceManagement/CreateComplianceEvent", apiData);
    return mapApiToUi(response.data.complianceEvent || response.data);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

/**
 * Get all compliance events
 */
export const getAllEvents = async () => {
  try {
    const response = await api.get("/ComplianceManagement/GetAllComplianceEvents");
    return (response.data || []).map(mapApiToUi);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

/**
 * Get event by ID
 */
export const getEventById = async (id) => {
  try {
    const response = await api.get(`/ComplianceManagement/GetComplianceEventById/${id}`);
    return mapApiToUi(response.data);
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
};

/**
 * Update an event
 */
export const updateEvent = async (id, updates) => {
  try {
    // 1. Fetch RAW data from API to preserve all fields (organizationId, createdBy, cmpId, etc.)
    const responseGet = await api.get(`/ComplianceManagement/GetComplianceEventById/${id}`);
    const rawEvent = responseGet.data;
    if (!rawEvent) throw new Error("Event not found");

    // 2. Map UI updates to API keys
    const apiUpdates = {
      complianceEventTitle: updates.title,
      complianceEventType: updates.eventTypeId,
      complianceDueDate: updates.dueDate,
      complianceRecurrence: updates.recurrence,
      complianceAssignedTo: updates.assignedTo,
      complianceStatus: updates.status,
      complianceNotes: updates.notes,
    };

    if (updates.reminderDays !== undefined) {
      apiUpdates.complianceReminderDays = parseInt(updates.reminderDays) || 0;
    }

    // 3. Merge updates into the original raw record to ensure strict requirements are met
    // and hidden fields (like organizationId) are preserved.
    const mergedApiData = { ...rawEvent };
    
    Object.keys(apiUpdates).forEach(key => {
      if (apiUpdates[key] !== undefined) {
        mergedApiData[key] = apiUpdates[key];
      }
    });

    const responsePut = await api.put("/ComplianceManagement/UpdateComplianceEvent", mergedApiData);
    
    if (responsePut.data.success || responsePut.status === 200) {
      return await getEventById(id);
    }
    return mapApiToUi(responsePut.data.complianceEvent || responsePut.data);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

/**
 * Delete an event
 */
export const deleteEvent = async (id) => {
  try {
    const response = await api.delete(`/ComplianceManagement/DeleteComplianceEventById/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Get upcoming events (next X days)
 */
export const getUpcomingEvents = async (days = 30) => {
  try {
    const response = await api.get(`/ComplianceManagement/GetUpcomingComplianceEvents?days=${days}`);
    return (response.data || []).map(mapApiToUi);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
};

/**
 * Get overdue events
 */
export const getOverdueEvents = async () => {
  try {
    const response = await api.get("/ComplianceManagement/GetOverdueComplianceEvents");
    return (response.data || []).map(mapApiToUi);
  } catch (error) {
    console.error("Error fetching overdue events:", error);
    return [];
  }
};

// ==================== LEGAL DOCUMENTS ====================

/**
 * Create a legal document (TODO: Needs Backend Endpoint)
 */
export const createLegalDocument = async (documentData) => {
  // Placeholder - Needs API
  console.warn("createLegalDocument API not implemented");
  return null;
};

/**
 * Get all legal documents (TODO: Needs Backend Endpoint)
 */
export const getAllLegalDocuments = async () => {
  // Placeholder - Needs API
  return [];
};

/**
 * Get expiring documents (TODO: Needs Backend Endpoint)
 */
export const getExpiringDocuments = async (days = 30) => {
  // Placeholder - Needs API
  return [];
};

/**
 * Update a legal document (TODO: Needs Backend Endpoint)
 */
export const updateLegalDocument = async (id, updates) => {
  // Placeholder - Needs API
  return { ...updates, id };
};

/**
 * Delete a legal document (TODO: Needs Backend Endpoint)
 */
export const deleteLegalDocument = async (id) => {
  // Placeholder - Needs API
  return true;
};

// ==================== COMPLIANCE RECORDS ====================
// These are usually handled via file upload services or specific record endpoints

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
