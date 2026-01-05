import Dexie from "dexie";
import dexieCloud from "dexie-cloud-addon";

export const db = new Dexie("QMS_Web_DB", {
  addons: [dexieCloud],
});

db.version(1).stores({
  documents: "@id, name, category, status, department, createdDate",
});

db.cloud.configure({
  databaseUrl: "https://zjmu8ew7e.dexie.cloud",
  requireAuth: false,
});
