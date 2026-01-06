import { db } from "../db";

const WORKER_BASE_URL = "https://qms-worker.altwisedigital.workers.dev";

/* ======================================
   Upload file to Cloudflare Worker
====================================== */
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  console.log("📤 Uploading file to Worker:", {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    workerUrl: `${WORKER_BASE_URL}/upload`,
  });

  const res = await fetch(`${WORKER_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  console.log("📥 Worker response:", {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("❌ Upload failed:", errText);
    throw new Error(`File upload failed: ${errText}`);
  }

  // Expected response: { fileUrl }
  const responseData = await res.json();
  console.log("✅ Upload successful:", responseData);

  // Validate the response
  if (!responseData.fileUrl) {
    throw new Error("Worker did not return a fileUrl");
  }

  return responseData;
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

  // 2️⃣ Store metadata locally (Dexie) - matching mock data structure
  const document = {
    id: crypto.randomUUID(), // Dexie Cloud safe
    level: metadata.level ? parseInt(metadata.level.replace("level-", "")) : 1, // Convert "level-2" to 2
    category: metadata.category || "",
    subCategory: metadata.subCategory || "",
    name: file.name,
    description: metadata.description || "",
    department: metadata.department || "",
    author: metadata.author || "Unknown",
    status: "Pending",
    version: metadata.version || "v1.0",
    createdDate: new Date().toLocaleDateString("en-GB"), // Format: DD/MM/YYYY like mock data
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
