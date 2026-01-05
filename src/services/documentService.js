import { db } from "../db";

const WORKER_BASE_URL = "https://qms-worker.altwisedigital.workers.dev";

/* ======================================
   Upload file to Cloudflare Worker
====================================== */
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${WORKER_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`File upload failed: ${errText}`);
  }

  // Expected response: { fileUrl }
  return res.json();
}

/* ======================================
   Create document (upload + metadata)
====================================== */
export async function createDocument({ file, metadata }) {
  if (!file) {
    throw new Error("File is required");
  }

  // 1️⃣ Upload file to Cloudflare R2 via Worker
  const { fileUrl } = await uploadFile(file);

  // 2️⃣ Store metadata locally (Dexie)
  const document = {
    id: crypto.randomUUID(), // Dexie Cloud safe
    name: file.name,
    category: metadata.category || "",
    subCategory: metadata.subCategory || "",
    description: metadata.description || "",
    department: metadata.department || "",
    author: metadata.author || "",
    level: metadata.level || "",
    version: metadata.version || "1.0",
    status: "Pending",
    createdDate: new Date().toISOString(),
    fileUrl, // 🔗 Cloudflare Worker URL
  };

  await db.documents.put(document);
  return document;
}

/* ======================================
   Read documents
====================================== */
export function getDocuments() {
  return db.documents.orderBy("createdDate").reverse().toArray();
}

/* ======================================
   Open / View document
====================================== */
export function openDocument(document) {
  if (!document?.fileUrl) {
    throw new Error("File URL not found");
  }

  // Opens file directly from Cloudflare Worker
  window.open(document.fileUrl, "_blank", "noopener,noreferrer");
}

/* ======================================
   Delete document (metadata only)
   NOTE: File stays in R2 unless
   you add delete support in Worker
====================================== */
export function deleteDocument(id) {
  return db.documents.delete(id);
}
