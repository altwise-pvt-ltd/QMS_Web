import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import DocumentUploadForm from "./DocumentUploadForm";

export default function DocumentUploadPage() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (data) => {
    try {
      // TODO: Replace with real API call
      console.log("Upload payload:", data);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Show success message
      setShowSuccess(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate("/documents");
      }, 2000);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + (err.message || "Please try again"));
    }
  };

  return (
    <div className="min-h-screen bg-transparent  py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/documents")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
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

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Document uploaded successfully!
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                Redirecting to document library...
              </p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="">
          <DocumentUploadForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
