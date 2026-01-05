import Dexie from "dexie";
import { mockDocuments } from "./mockData";

export const db = new Dexie("QMS_Demo_DB");

db.version(1).stores({
  documents: "id, category, subCategory, department, status, createdAt",
});

db.on("populate", () => {
  db.documents.bulkAdd(
    mockDocuments.map((doc) => ({
      ...doc,
      id: crypto.randomUUID(),
      createdAt: new Date(doc.createdDate).toISOString(),
    }))
  );
});
