import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { ArrowLeft, CheckCircle2, X, AlertCircle } from "lucide-react";
import DocumentUploadForm from "./DocumentUploadForm";
import { documentService } from "../services/documentService";

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // ── FIXED: docId generated ONCE for the lifetime of this page visit ──────────
  // Using useRef so it never changes across re-renders or retries.
  // If the user navigates away and comes back, a new page mount = new docId. ✓
  const docId = useRef(crypto.randomUUID());

  // Extract context from URL params
  const context = {
    level: searchParams.get("level"),
    category: searchParams.get("category"),
    categoryId: searchParams.get("categoryId"),
    subCategoryId: searchParams.get("subCategoryId"),
    subCategory: searchParams.get("subCategory"),
    section: searchParams.get("section"),
  };

  const handleUpload = async (formData) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(5);
      setUploadStage("Preparing document upload...");

      await documentService.uploadDocument(
        {
          file: formData.file,
          categoryId: Number(context.categoryId) || 1,
          categoryName: context.category || "General",
          subCategoryId: Number(context.subCategoryId) || 1,
          subCategoryName: context.subCategory || "General",
          docId: docId.current, // ← stable, never changes on retry
          departmentId: Number(formData.departmentId) || 1,
          description: formData.description || "",
          author: formData.author || user?.name || "Anonymous",
          version: formData.version || "1.0",
          effectiveDate: formData.effectiveDate,
          expiryDate: formData.expiryDate,
          createdBy: user?.name || "Anonymous",
          updatedBy: user?.name || "Anonymous",
        },
        (progress) => {
          // Worker XHR progress maps to 10–85% of the UI bar
          // The remaining 15% is backend metadata save
          const mapped = 10 + Math.round((progress * 75) / 100);
          setUploadProgress(mapped);
          setUploadStage(
            progress < 100
              ? "Transmitting securely to object storage..."
              : "Storing metadata & finalizing...",
          );
        },
      );

      // Backend save complete
      setUploadStage("Document Published");
      setUploadProgress(100);
      setShowSuccess(true);
      setIsUploading(false);

      setTimeout(() => navigate("/documents"), 2500);
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStage("");
      console.error("Upload failed:", err);

      // Map known error patterns to user-friendly messages
      const msg = err.message || "";
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (msg.includes("File upload failed") || msg.includes("Worker")) {
        errorMessage =
          "Failed to upload file to storage. Please check your connection and try again.";
      } else if (msg.toLowerCase().includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (msg.includes("File type")) {
        errorMessage =
          "This file type is not supported. Please upload a PDF, Word, Excel, or image file.";
      } else if (msg.includes("50MB") || msg.includes("exceeds")) {
        errorMessage = "File is too large. Maximum allowed size is 50MB.";
      } else if (msg.includes("Document save failed")) {
        errorMessage =
          "File uploaded but failed to save document record. Please try again — your file upload will be reused.";
        // docId.current is still the same so retry will reuse the same R2 path
      } else if (msg) {
        errorMessage = msg;
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/documents")}
            className="p-2 hover:bg-slate-500/10 rounded-lg transition-colors"
            aria-label="Back to documents"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <div className="text-sm text-slate-500 font-medium">Documents</div>
            <h1 className="text-2xl font-bold text-slate-900">
              Upload Document
            </h1>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-900 mb-1">
                  Upload Failed
                </h3>
                <p className="text-sm text-red-700">{error}</p>
                {/* Tell the user a retry is safe */}
                <p className="text-xs text-red-500 mt-1">
                  You can safely retry — your previous upload attempt will be
                  replaced.
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {(isUploading || showSuccess) && (
          <div className="mb-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                {!showSuccess ? (
                  <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                <span className="text-sm font-semibold text-slate-700">
                  {uploadStage}
                </span>
              </div>
              <span className="text-sm font-bold text-indigo-600">
                {uploadProgress}%
              </span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${showSuccess ? "bg-emerald-500" : "bg-indigo-600"
                  }`}
                style={{ width: `${uploadProgress}%` }}
              />
            </div>

            {showSuccess && (
              <p className="text-xs text-emerald-600 mt-3 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Redirecting to document library...
              </p>
            )}
          </div>
        )}

        {/* Upload Form */}
        <DocumentUploadForm
          onSubmit={handleUpload}
          initialData={{ author: user?.name || "" }}
          defaultTitle={context.title || ""}
          defaultLevel={context.level || ""}
          defaultCategory={context.category || ""}
          defaultSubCategory={context.subCategory || ""}
          defaultSection={context.section || ""}
          isUploading={isUploading}
        />
      </div>
    </div>
  );
}
