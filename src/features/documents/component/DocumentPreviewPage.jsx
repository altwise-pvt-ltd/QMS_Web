import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Printer, Download, RefreshCcw } from "lucide-react";
import documentService from "../services/documentService";
import SavedDocumentsTable from "./SavedDocumentsTable";

export default function DocumentPreviewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL Params
  const categoryName = searchParams.get("category");
  const subCategoryName = searchParams.get("subCategory");

  // We need IDs for the API, but URL uses names.
  // Ideally, we should pass IDs in URL or look them up.
  // For now, assuming the previous page passed IDs or we can find them.
  // Wait, the previous page (DocumentLibrary) passed: category=Name, subCategory=Name
  // The API requires IDs: GetDocumentsByCategoryAndSubCategory/1/1
  // We might need to refactor navigation to pass IDs or look up IDs here.
  // Let's check if we can get IDs from location state or URL if we change it.
  // Changing URL strategy might be breaking, let's see if we can lookup or if we should change navigation first.

  // ACTUALLY, checking DocumentLibrary.jsx again...
  // handleViewClick uses: category: activeData.title, subCategory: docName
  // We DO NOT have IDs in the URL.
  // OPTION 1: Update DocumentLibrary to pass IDs in URL (Recommended)
  // OPTION 2: Fetch all categories/subcategories here to find IDs (Slow)

  // I will assume I need to update DocumentLibrary.jsx as well to pass IDs.
  // Let's assume URL will be updated to: ?categoryId=1&subCategoryId=2&categoryName=...

  const categoryId = searchParams.get("categoryId");
  const subCategoryId = searchParams.get("subCategoryId");

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    if (!categoryId || !subCategoryId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await documentService.getDocumentsByCategoryAndSubCategory(
        categoryId,
        subCategoryId,
      );
      // Transform data if necessary to match SavedDocumentsTable
      // Assuming API returns list of docs matching table props?
      // Table expects: id, name, description, subCategory, department, createdDate, author, status, version, fileUrl
      // Let's map it just in case, or pass raw if confident.
      // Better to map to be safe.
      const mappedDocs = data.map((doc) => ({
        id: doc.uploadCategoryDocumentId,
        name: doc.description || "Untitled Document",
        description: doc.description,
        subCategory: subCategoryName || doc.subCategoryName,
        department: doc.department || "General",
        createdDate: doc.createdDate
          ? new Date(doc.createdDate).toLocaleDateString()
          : "-",
        author: doc.author || "Unknown",
        status: doc.status ? "Approved" : "Pending",
        version: doc.version || "1.0",
        fileUrl: doc.documentFilePath
          ? doc.documentFilePath.replace(
              "https://qmsapi.altwise.in/https://qmsapi.altwise.in/",
              "https://qmsapi.altwise.in/",
            )
          : "",
        ...doc,
      }));
      setDocuments(mappedDocs);
    } catch (err) {
      console.error("Failed to load documents", err);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId && subCategoryId) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [categoryId, subCategoryId]);

  if (!categoryId || !subCategoryId) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p>Missing category or subcategory information.</p>
        <button
          onClick={() => navigate("/documents")}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Return to Library
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-medium">Loading Documents...</p>
        </div>
      </div>
    );
  }

  const handleDelete = async (doc) => {
    await documentService.deleteDocument(doc.id);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-slate-50 font-sans">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/documents")}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 uppercase">
                  {subCategoryName || "Documents"}
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {categoryName}
                </p>
              </div>
            </div>

            <button
              onClick={fetchDocuments}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
              title="Refresh"
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-all"
              onClick={() => window.print()}
            >
              <Printer size={14} />
              <span>Print List</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-6">
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-center">
              {error}
              <button
                onClick={fetchDocuments}
                className="block mx-auto mt-2 text-sm underline hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">
                No documents found in this folder.
              </p>
            </div>
          ) : (
            <SavedDocumentsTable
              documents={documents}
              onDocumentDeleted={(id) =>
                setDocuments((docs) => docs.filter((d) => d.id !== id))
              }
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
