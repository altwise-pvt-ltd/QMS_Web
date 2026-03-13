import api from "../../../auth/api";

const WORKER_URL   = import.meta.env.VITE_WORKER_URL;
const WORKER_TOKEN = import.meta.env.VITE_WORKER_TOKEN;

// ─── Upload to R2 via Worker ──────────────────────────────────────────────────
async function uploadToWorker(file, { category, subCategory, docId }, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file",        file);
    formData.append("category",    category);
    formData.append("subCategory", subCategory);
    formData.append("docId",       docId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${WORKER_URL}/upload`);
    xhr.setRequestHeader("Authorization", `Bearer ${WORKER_TOKEN}`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result = JSON.parse(xhr.responseText);
          console.log("Cloudflare Worker Upload Response:", result);
          if (!result.filePath) {
            reject(new Error("Worker response missing filePath"));
          } else {
            resolve(result);
          }
        } catch {
          reject(new Error("Invalid JSON from Worker"));
        }
      } else {
        let msg = `Worker upload failed: ${xhr.status}`;
        try { msg = JSON.parse(xhr.responseText).error || msg; } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

// ─── Delete from R2 via Worker ────────────────────────────────────────────────
async function deleteFromWorker(filePath) {
  const res = await fetch(
    `${WORKER_URL}/files/${encodeURIComponent(filePath)}`,
    {
      method:  "DELETE",
      headers: { Authorization: `Bearer ${WORKER_TOKEN}` },
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Worker delete failed: ${res.status}`);
  }
  return res.json();
}

// ─── Document Service ─────────────────────────────────────────────────────────
export const documentService = {

  // ── Categories ───────────────────────────────────────────────────────────────
  getCategories: async () => {
    try {
      const response = await api.get("/DocumentLibrary/GetCategories");
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getSubCategories: async (categoryId) => {
    try {
      const response = await api.get(`/DocumentLibrary/GetSubCategories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      throw error;
    }
  },

  createSubCategory: async (payload) => {
    try {
      const response = await api.post("/DocumentLibrary/CreateSubCategory", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  /**
   * Update an existing subcategory.
   * API: PUT /DocumentLibrary/UpdateSubCategory
   */
  updateSubCategory: async (payload) => {
    try {
      const response = await api.put("/DocumentLibrary/UpdateSubCategory", {
        documentCategoryId:      payload.documentCategoryId,
        documentSubCategoryName: payload.documentSubCategoryName,
        createdBy:               payload.createdBy,
        documentSubCategoryId:   payload.documentSubCategoryId,
        updatedBy:               payload.updatedBy,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  },

  /**
   * Delete a subcategory.
   * API: DELETE /DocumentLibrary/DeleteSubCategory/{subCategoryId}
   */
  deleteSubCategory: async (subCategoryId) => {
    try {
      const response = await api.delete(
        `/DocumentLibrary/DeleteSubCategory/${subCategoryId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },

  // ── Documents ────────────────────────────────────────────────────────────────
  getDocuments: async () => {
    try {
      const response = await api.get("/Document/GetAllDocuments");
      return response.data;
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  getDocumentsByCategoryAndSubCategory: async (categoryId, subCategoryId) => {
    try {
      const response = await api.get(
        `/DocumentLibrary/GetDocumentsByCategoryAndSubCategory/${categoryId}/${subCategoryId}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw error;
    }
  },

  /**
   * Upload document:
   * 1. File → Worker → R2  (get filePath back)
   * 2. filePath + metadata → Backend as JSON
   */
  uploadDocument: async (data, onProgress) => {
    let r2Result;
    try {
      r2Result = await uploadToWorker(
        data.file,
        {
          category:    data.categoryName,
          subCategory: data.subCategoryName,
          docId:       data.docId,
        },
        onProgress
      );
    } catch (error) {
      console.error("Worker upload failed:", error);
      throw new Error(`File upload failed: ${error.message}`);
    }

    try {
      const payload = new FormData();
      payload.append("DocumentCategoryId", data.categoryId);
      payload.append("DocumentSubCategoryId", data.subCategoryId);
      payload.append("DepartmentId", data.departmentId);
      payload.append("Author", data.author);
      if (data.version) payload.append("Version", data.version);
      if (data.description) payload.append("Description", data.description);
      if (data.createdBy) payload.append("CreatedBy", data.createdBy);
      if (data.updatedBy) payload.append("UpdatedBy", data.updatedBy);
      if (data.effectiveDate) payload.append("EffectiveDate", data.effectiveDate);
      if (data.expiryDate) payload.append("ExpiryDate", data.expiryDate);
      payload.append("DocumentFilePath", r2Result.fileUrl);

      const response = await api.post("/DocumentLibrary/UploadDocument", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;

    } catch (error) {
      console.error("Backend save failed, rolling back R2:", error);
      await deleteFromWorker(r2Result.filePath).catch((e) =>
        console.warn("R2 rollback failed:", r2Result.filePath, e)
      );
      throw new Error(`Document save failed: ${error.message}`);
    }
  },

  deleteDocument: async (documentId) => {
    try {
      const response = await api.delete(`/DocumentLibrary/DeleteDocument/${documentId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },

  hardDeleteDocument: async (documentId, filePath) => {
    try {
      const response = await api.delete(
        `/DocumentLibrary/HardDeleteDocument/${documentId}`
      );
      if (filePath) {
        await deleteFromWorker(filePath).catch((e) =>
          console.warn("R2 cleanup failed:", filePath, e)
        );
      }
      return response.data;
    } catch (error) {
      console.error("Error hard deleting document:", error);
      throw error;
    }
  },
};

export default documentService;