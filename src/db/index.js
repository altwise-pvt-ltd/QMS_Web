import Dexie from "dexie";

// QMS Web Database configuration using Dexie.js
export const db = new Dexie("QMS_Web_DB");

// Define schema version and stores
db.version(2).stores({
  // Persistent storage for documents metadata
  documents:
    "id, name, level, category, subCategory, status, department, author, version, createdDate, expiryDate",
  // Storage for CAPA (Corrective and Preventive Action) forms and responses
  capa_forms: "id, title, createdAt",
  capa_responses: "id, title, filledAt, filledBy",
  // NEW: Storage for Non-Conformance (NC) reports
  nc_reports:
    "id, documentNo, documentName, status, submittedBy.name, lastModified",
});
