/**
 * workerService.js
 * Universal file upload utility for the QMS Worker.
 * Used by ALL modules that need to upload files to R2.
 *
 * Supported modules and required params:
 *
 * documents    → { module: "documents", category, subCategory, docId }
 * ncr          → { module: "ncr", ncrId }
 * organization → { module: "organization", orgId }
 *
 * Usage:
 *   import { uploadFile, deleteFile } from "./workerService";
 *
 *   const result = await uploadFile(file, { module: "organization", orgId: "abc" });
 *   console.log(result.fileUrl); // https://pub-xxx.r2.dev/qmsdocs/organizations/abc/logo/uuid.png
 */

const WORKER_URL   = import.meta.env.VITE_WORKER_URL;
const WORKER_TOKEN = import.meta.env.VITE_WORKER_TOKEN;

/**
 * Uploads a file to R2 via the QMS Worker.
 *
 * @param {File} file - The file to upload
 * @param {Object} params - Module-specific params (must include `module`)
 * @param {Function|null} onProgress - Optional progress callback (0-100)
 * @returns {Promise<{success, filePath, fileUrl, originalName, mimeType, size, module, uploadedAt}>}
 */
export function uploadFile(file, params, onProgress = null) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    // Append all params as form fields
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${WORKER_URL}/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${WORKER_TOKEN}`);
    // Do NOT set Content-Type — let the browser set multipart boundary automatically

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            resolve(data);
          } else {
            reject(new Error(data.error || "Worker upload failed"));
          }
        } catch {
          reject(new Error("Invalid response from Worker"));
        }
      } else {
        let errorMsg = `Upload failed with status ${xhr.status}`;
        try {
          const errData = JSON.parse(xhr.responseText);
          errorMsg = errData.error || errorMsg;
        } catch {}
        reject(new Error(errorMsg));
      }
    };

    xhr.onerror  = () => reject(new Error("Network error during upload"));
    xhr.onabort  = () => reject(new Error("Upload was aborted"));
    xhr.ontimeout = () => reject(new Error("Upload timed out"));

    xhr.send(formData);
  });
}

/**
 * Deletes a file from R2 via the QMS Worker.
 *
 * @param {string} filePath - The R2 key (filePath from upload response)
 * @returns {Promise<{success, deleted}>}
 */
export async function deleteFile(filePath) {
  const response = await fetch(
    `${WORKER_URL}/files/${encodeURIComponent(filePath)}`,
    {
      method:  "DELETE",
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` },
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Delete failed with status ${response.status}`);
  }

  return response.json();
}