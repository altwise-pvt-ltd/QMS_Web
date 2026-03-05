const WORKER_URL   = import.meta.env.VITE_WORKER_URL;
const WORKER_TOKEN = import.meta.env.VITE_WORKER_TOKEN;

/**
 * Universal file upload to R2 via QMS Worker.
 *
 * Module params:
 *   documents    → { module: "documents", category, subCategory, docId }
 *   ncr          → { module: "ncr", ncrId, subType: "evidence"|"attachment" }
 *   organization → { module: "organization", orgId }
 */
export function uploadFile(file, params, onProgress = null) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${WORKER_URL}/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${WORKER_TOKEN}`);

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
          if (data.success) resolve(data);
          else reject(new Error(data.error || "Worker upload failed"));
        } catch {
          reject(new Error("Invalid response from Worker"));
        }
      } else {
        let msg = `Upload failed with status ${xhr.status}`;
        try { msg = JSON.parse(xhr.responseText).error || msg; } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror   = () => reject(new Error("Network error during upload"));
    xhr.onabort   = () => reject(new Error("Upload aborted"));
    xhr.ontimeout = () => reject(new Error("Upload timed out"));

    xhr.send(formData);
  });
}

export async function deleteFile(filePath) {
  const response = await fetch(
    `${WORKER_URL}/files/${encodeURIComponent(filePath)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${WORKER_TOKEN}` } }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `Delete failed: ${response.status}`);
  }
  return response.json();
}