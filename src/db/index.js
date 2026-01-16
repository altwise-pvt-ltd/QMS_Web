import Dexie from "dexie";

// QMS Web Database configuration using Dexie.js
export const db = new Dexie("QMS_Web_DB");

// UPDATE VERSION: Bump version to apply schema changes (e.g., 4 -> 5)
db.version(5).stores({
  // Persistent storage for documents metadata
  documents:
    "id, name, level, category, subCategory, status, department, author, version, createdDate, expiryDate",

  // Storage for CAPA forms
  capa_forms: "id, title, createdAt",
  capa_responses: "id, title, filledAt, filledBy",

  // UPDATED: Added "++" before id for Auto-Increment (1, 2, 3...)
  nc_reports:
    "++id, documentNo, documentName, status, submittedBy.name, lastModified",

  // Management Review Meeting tables
  mrm_meetings: "++id, title, date, status, createdAt",
  mrm_action_items: "++id, meetingId, task, dueDate, createdAt",
  mrm_minutes: "++id, meetingId, agendaItems, createdAt",

  // Compliance Calendar tables
  compliance_event_types: "++id, name, category, color, icon, defaultFrequency",
  compliance_events:
    "++id, eventTypeId, title, dueDate, status, assignedTo, recurrence, createdAt",
  legal_documents:
    "++id, documentType, documentName, issueDate, expiryDate, status, fileData, createdAt",
  compliance_records:
    "++id, eventId, documentId, uploadDate, fileName, fileData, notes, uploadedBy",
});
