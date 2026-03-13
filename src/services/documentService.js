const WORKER_BASE_URL = "https://qms-worker.altwisedigital.workers.dev";

// In-memory fallback for document metadata since Dexie is removed
let documentsCache = [];

/* ======================================
   Upload file to Cloudflare Worker
====================================== */
export async function uploadFile(file) {
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

  const responseData = await res.json();
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

  const { fileUrl } = await uploadFile(file);

  const document = {
    id: crypto.randomUUID(),
    level: metadata.level ? parseInt(metadata.level.replace("level-", "")) : 1,
    category: metadata.category || "",
    subCategory: metadata.subCategory || "",
    name: file.name,
    description: metadata.description || "",
    department: metadata.department || "",
    author: metadata.author || "Unknown",
    status: "Pending",
    version: metadata.version || "v1.0",
    createdDate: new Date().toISOString().split("T")[0],
    effectiveDate: metadata.effectiveDate || new Date().toISOString().split("T")[0],
    expiryDate: metadata.expiryDate || "",
    fileUrl,
  };

  documentsCache.unshift(document);
  return document;
}

/* ======================================
   Read documents
====================================== */
export function getDocuments() {
  return Promise.resolve([...documentsCache]);
}

/* ======================================
   Open / View document
====================================== */
export function openDocument(document) {
  if (!document?.fileUrl) {
    throw new Error("File URL not found");
  }
  window.open(document.fileUrl, "_blank", "noopener,noreferrer");
}

/* ======================================
   Delete document
====================================== */
export function deleteDocument(id) {
  documentsCache = documentsCache.filter(doc => doc.id !== id);
  return Promise.resolve(true);
}
