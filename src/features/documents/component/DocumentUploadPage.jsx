import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import DocumentUploadForm from "./DocumentUploadForm";
import { createDocument } from "../../../services/documentService";

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Extract context from URL
  const context = {
    level: searchParams.get("level"),
    category: searchParams.get("category"),
    subCategory: searchParams.get("subCategory"),
    section: searchParams.get("section"),
  };

  const handleUpload = async (formData) => {
    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);

      // Stage 1: Preparing upload
      setUploadStage("Preparing document upload...");
      setUploadProgress(10);
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Stage 2: Uploading file
      setUploadStage("Transmitting binary data...");
      setUploadProgress(30);

      // Call the actual service
      await createDocument({
        file: formData.file,
        metadata: {
          level: context.level || "level-1", // Use level from URL context
          category: context.category || "",
          subCategory: context.subCategory || "",
          description: formData.description || "",
          department: formData.department,
          author: formData.author || "Unknown",
          version: formData.version,
          effectiveDate: formData.effectiveDate,
          expiryDate: formData.expiryDate,
        },
      });

      // Stage 3: Processing metadata
      setUploadStage("Associating QMS metadata...");
      setUploadProgress(70);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Stage 4: Finalizing
      setUploadStage("Finalizing version authority...");
      setUploadProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Stage 5: Complete
      setUploadStage("Document Published");
      setUploadProgress(100);
      setShowSuccess(true);
      setIsUploading(false);

      // Auto-redirect after 2.5 seconds
      setTimeout(() => {
        navigate("/documents");
      }, 2500);
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      console.error("Upload failed:", err);

      // User-friendly error messages
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (err.message.includes("File upload failed")) {
        errorMessage =
          "Failed to upload file to server. Please check your connection and try again.";
      } else if (err.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  return (
    // Main container is transparent
    <div className="min-h-screen bg-transparent py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/documents")}
            // REMOVED: hover:bg-slate-100 (white)
            // ADDED: hover:bg-slate-500/10 (transparent dark hover)
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

        {/* Progress Feedback */}
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
                className={`h-full transition-all duration-500 ease-out ${
                  showSuccess ? "bg-emerald-500" : "bg-indigo-600"
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

        <div className="">
          {/* Note: Ensure DocumentUploadForm inside this file also has 'bg-transparent' or 'bg-white' removed */}
          <DocumentUploadForm
            onSubmit={handleUpload}
            defaultTitle={context.title || ""}
            defaultLevel={context.level || ""}
            defaultCategory={context.category || ""}
            defaultSubCategory={context.subCategory || ""}
            defaultSection={context.section || ""}
          />
        </div>
      </div>
    </div>
  );
}
