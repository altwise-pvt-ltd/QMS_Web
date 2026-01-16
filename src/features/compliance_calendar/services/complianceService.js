import { db } from "../../../db/index";

// ==================== EVENT TYPES ====================

/**
 * Initialize default event types in the database
 */
export const initializeEventTypes = async () => {
  try {
    const existingTypes = await db.compliance_event_types.toArray();
    if (existingTypes.length > 0) {
      return; // Already initialized
    }

    const defaultTypes = [
      {
        name: "Calibration",
        category: "Equipment",
        color: "#3B82F6",
        icon: "Gauge",
        defaultFrequency: "yearly",
      },
      {
        name: "AMC",
        category: "Maintenance",
        color: "#10B981",
        icon: "Wrench",
        defaultFrequency: "yearly",
      },
      {
        name: "PT/EQA",
        category: "Quality Assurance",
        color: "#8B5CF6",
        icon: "TestTube",
        defaultFrequency: "quarterly",
      },
      {
        name: "Internal Audit",
        category: "Audit",
        color: "#F59E0B",
        icon: "ClipboardCheck",
        defaultFrequency: "quarterly",
      },
      {
        name: "External Audit",
        category: "Audit",
        color: "#EF4444",
        icon: "Shield",
        defaultFrequency: "yearly",
      },
      {
        name: "License Renewal",
        category: "Legal",
        color: "#EC4899",
        icon: "FileText",
        defaultFrequency: "yearly",
      },
      {
        name: "KPI Submission",
        category: "Reporting",
        color: "#06B6D4",
        icon: "BarChart",
        defaultFrequency: "monthly",
      },
      {
        name: "Training",
        category: "HR",
        color: "#84CC16",
        icon: "GraduationCap",
        defaultFrequency: "yearly",
      },
    ];

    await db.compliance_event_types.bulkAdd(defaultTypes);
    console.log("✅ Event types initialized");
  } catch (error) {
    console.error("Error initializing event types:", error);
  }
};

/**
 * Get all event types
 */
export const getAllEventTypes = async () => {
  try {
    return await db.compliance_event_types.toArray();
  } catch (error) {
    console.error("Error fetching event types:", error);
    return [];
  }
};

// ==================== COMPLIANCE EVENTS ====================

/**
 * Create a new compliance event
 */
export const createEvent = async (eventData) => {
  try {
    const id = await db.compliance_events.add({
      ...eventData,
      status: eventData.status || "pending",
      createdAt: new Date().toISOString(),
    });
    return { id, ...eventData };
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
    return await db.compliance_events.toArray();
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
    return await db.compliance_events.get(id);
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
    await db.compliance_events.update(id, updates);
    return await getEventById(id);
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
    await db.compliance_events.delete(id);
    // Also delete related records
    await db.compliance_records.where("eventId").equals(id).delete();
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

/**
 * Get events by status
 */
export const getEventsByStatus = async (status) => {
  try {
    return await db.compliance_events.where("status").equals(status).toArray();
  } catch (error) {
    console.error("Error fetching events by status:", error);
    return [];
  }
};

/**
 * Get upcoming events (next 30 days)
 */
export const getUpcomingEvents = async (days = 30) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const allEvents = await db.compliance_events.toArray();
    return allEvents.filter((event) => {
      const dueDate = new Date(event.dueDate);
      return dueDate >= today && dueDate <= futureDate;
    });
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
    const today = new Date().toISOString().split("T")[0];
    const allEvents = await db.compliance_events.toArray();
    return allEvents.filter(
      (event) => event.dueDate < today && event.status !== "completed"
    );
  } catch (error) {
    console.error("Error fetching overdue events:", error);
    return [];
  }
};

// ==================== LEGAL DOCUMENTS ====================

/**
 * Create a legal document
 */
export const createLegalDocument = async (documentData) => {
  try {
    const id = await db.legal_documents.add({
      ...documentData,
      status: documentData.status || "active",
      createdAt: new Date().toISOString(),
    });
    return { id, ...documentData };
  } catch (error) {
    console.error("Error creating legal document:", error);
    throw error;
  }
};

/**
 * Get all legal documents
 */
export const getAllLegalDocuments = async () => {
  try {
    return await db.legal_documents.toArray();
  } catch (error) {
    console.error("Error fetching legal documents:", error);
    return [];
  }
};

/**
 * Get expiring documents (within specified days)
 */
export const getExpiringDocuments = async (days = 30) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const allDocs = await db.legal_documents.toArray();
    return allDocs.filter((doc) => {
      if (!doc.expiryDate) return false;
      const expiryDate = new Date(doc.expiryDate);
      return expiryDate >= today && expiryDate <= futureDate;
    });
  } catch (error) {
    console.error("Error fetching expiring documents:", error);
    return [];
  }
};

/**
 * Update a legal document
 */
export const updateLegalDocument = async (id, updates) => {
  try {
    await db.legal_documents.update(id, updates);
    return await db.legal_documents.get(id);
  } catch (error) {
    console.error("Error updating legal document:", error);
    throw error;
  }
};

/**
 * Delete a legal document
 */
export const deleteLegalDocument = async (id) => {
  try {
    await db.legal_documents.delete(id);
  } catch (error) {
    console.error("Error deleting legal document:", error);
    throw error;
  }
};

// ==================== COMPLIANCE RECORDS ====================

/**
 * Create a compliance record (file upload)
 */
export const createComplianceRecord = async (recordData) => {
  try {
    const id = await db.compliance_records.add({
      ...recordData,
      uploadDate: new Date().toISOString(),
    });
    return { id, ...recordData };
  } catch (error) {
    console.error("Error creating compliance record:", error);
    throw error;
  }
};

/**
 * Get records for an event
 */
export const getRecordsByEventId = async (eventId) => {
  try {
    return await db.compliance_records
      .where("eventId")
      .equals(eventId)
      .toArray();
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
};

/**
 * Delete a compliance record
 */
export const deleteComplianceRecord = async (id) => {
  try {
    await db.compliance_records.delete(id);
  } catch (error) {
    console.error("Error deleting compliance record:", error);
    throw error;
  }
};
