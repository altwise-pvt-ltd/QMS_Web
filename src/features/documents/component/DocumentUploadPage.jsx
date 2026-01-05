import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ArrowLeft, CheckCircle2 } from "lucide-react";
import DocumentUploadForm from "./DocumentUploadForm";

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Extract context from URL
  const context = {
    level: searchParams.get("level"),
    title: searchParams.get("title"),
    category: searchParams.get("category"),
    section: searchParams.get("section"),
  };

  const handleSubmit = async (data) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStage("Transmitting binary data...");

      // Simulate Processing Stages
      const stages = [
        { progress: 10, stage: "Transmitting binary data..." },
        { progress: 40, stage: "Verifying file integrity & virus scan..." },
        { progress: 70, stage: "Associating QMS metadata..." },
        { progress: 90, stage: "Finalizing version authority..." },
        { progress: 100, stage: "Document Published" },
      ];

      for (const step of stages) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setUploadProgress(step.progress);
        setUploadStage(step.stage);
      }

      setShowSuccess(true);
      setIsUploading(false);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate("/documents");
      }, 3000);
    } catch (err) {
      setIsUploading(false);
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.message || "Please try again"));
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
            onSubmit={handleSubmit}
            defaultTitle={context.title || ""}
            defaultLevel={context.level || ""}
            defaultSection={context.section || ""}
          />
        </div>
      </div>
    </div>
  );
}
