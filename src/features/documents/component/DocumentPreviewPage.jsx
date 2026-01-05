import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { MockData } from "../../../data/jsonData/MOCK_DATA";
import { ArrowLeft, Printer, Download } from "lucide-react";

import SavedDocumentsTable from "./SavedDocumentsTable";

const mockDocuments = MockData;

export default function DocumentPreviewPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [documents, setDocuments] = useState([]);
  const [viewMeta, setViewMeta] = useState({
    title: "",
    department: "",
  });

  const isAuthorized = true;
  const subCategory = searchParams.get("subCategory");

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setViewMeta({
        title: subCategory
          ? subCategory.replace(/_/g, " ").toUpperCase()
          : "DOCUMENTS",
        department: "Quality Assurance",
      });

      setDocuments(
        mockDocuments.filter(
          (d) => d.category === category && d.subCategory === subCategory
        )
      );

      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [category, subCategory]);

  if (!subCategory) {
    return (
      <div className="p-3 sm:p-6 text-slate-500">
        Invalid document selection
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium text-xs sm:text-sm">
            Verifying Authority...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-slate-50 font-sans">
      {/* Main Viewer Section */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Compact Header */}
        <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <button
              onClick={() => navigate("/documents")}
              className="p-1 sm:p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            </button>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 truncate uppercase">
              {viewMeta.title}
            </h1>
          </div>

          {/* Compact Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-all"
              onClick={() => window.print()}
            >
              <Printer size={14} />
              <span>Print Document</span>
            </button>
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all border ${
                isAuthorized
                  ? "bg-indigo-600 hover:bg-indigo-700 text-black border-indigo-600"
                  : "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed"
              }`}
              disabled={!isAuthorized}
            >
              <Download size={14} />
              <span>Controlled Download</span>
            </button>
          </div>
        </div>

        {/* Documents Section - Scrollable */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="p-3 sm:p-6">
            {documents.length === 0 ? (
              <div className="text-xs sm:text-sm text-slate-500 text-center py-8 bg-white rounded-lg border border-slate-200">
                No documents found for this section
              </div>
            ) : (
              <SavedDocumentsTable documents={documents} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
