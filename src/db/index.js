import Dexie from "dexie";

// QMS Web Database configuration using Dexie.js
export const db = new Dexie("QMS_Web_DB");

// UPDATE VERSION: Bump version to apply schema changes (e.g., 6 -> 7)
db.version(10).stores({
  // Persistent storage for documents metadata
  documents:
    "id, name, level, category, subCategory, status, department, author, version, createdDate, expiryDate",

  // Storage for CAPA forms
  capa_forms: "id, title, createdAt",
  capa_responses: "id, title, filledAt, filledBy",

  // NC Reports: ++id for auto-increment
  nc_reports:
    "++id, documentNo, documentName, status, submittedBy.name, lastModified",

  // Management Review Meeting tables
  mrm_meetings: "++id, title, date, status, createdAt",
  mrm_action_items: "++id, meetingId, task, dueDate, createdAt",
  mrm_minutes: "++id, meetingId, agendaItems, createdAt",
  mrm_attendance:
    "++id, meetingId, userId, username, role, department, status, createdAt",

  // Compliance Calendar tables
  compliance_event_types: "++id, name, category, color, icon, defaultFrequency",
  compliance_events:
    "++id, eventTypeId, title, dueDate, status, assignedTo, recurrence, createdAt",
  legal_documents:
    "++id, documentType, documentName, issueDate, expiryDate, status, fileData, createdAt",
  compliance_records:
    "++id, eventId, documentId, uploadDate, fileName, fileData, notes, uploadedBy",

  // Quality Indicators storage (Persistent QMS metrics)
  quality_indicators:
    "id, name, category, count, threshold, severity, minValue, maxValue",

  // Risk Indicators storage
  risk_indicators:
    "id, name, category, count, threshold, severity, minValue, maxValue",

  // Training & Competency tracking
  training_attendance: "++id, eventId, staffId, status, score, completionDate",

  // Staff/Personnel directory
  staff: "++id, name, role, dept, status, joinDate",

  // Risk Categories storage
  risk_categories: "++id, name",
});

/**
 * Robust initialization that handles Dexie UpgradeErrors (primary key changes).
 * Since primary keys cannot be changed in IndexedDB, we catch the error,
 * delete the outdated database, and re-open to create a fresh schema.
 */
export const initDatabase = async () => {
  try {
    await db.open();
    return db;
  } catch (err) {
    if (
      err.name === "UpgradeError" ||
      (err.inner && err.inner.name === "UpgradeError")
    ) {
      console.warn(
        "⚠️ Database schema mismatch (primary key change). Resetting database...",
      );
      await db.delete();
      await db.open();
      console.log("✅ Database reset and re-opened successfully.");
      return db;
    }
    throw err;
  }
};

/**
 * Manual reset utility for troubleshooting.
 */
export const resetDatabase = async () => {
  try {
    await db.delete();
    await db.open();
    console.log("✅ Database reset successfully.");
    window.location.reload();
  } catch (error) {
    console.error("❌ Failed to reset database:", error);
  }
};
