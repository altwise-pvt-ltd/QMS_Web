import Dexie from "dexie";

export const db = new Dexie("QMS_Web_DB");

db.version(1).stores({
  documents:
    "id, name, level, category, subCategory, status, department, author, version, createdDate",
});
