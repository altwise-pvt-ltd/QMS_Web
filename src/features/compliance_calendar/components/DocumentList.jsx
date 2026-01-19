import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  AlertTriangle,
  Download,
  Trash2,
  Eye,
} from "lucide-react";
import { db } from "../../../db/index";
import { useNavigate } from "react-router-dom";
import DocumentViewModal from "./DocumentViewModal";
import AlertManager from "../../../services/alert/alertService";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Get all documents from Dexie
      const docs = await db.documents.toArray();
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await db.documents.delete(id);
        AlertManager.success("Document deleted successfully", "Deleted");
        await loadDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
        AlertManager.error("Failed to delete document", "Error");
      }
    }
  };

  const handleView = (doc) => {
    // Show document in modal viewer
    setSelectedDocument(doc);
  };

  const getDocumentStatus = (doc) => {
    // Check if document has expiry date
    if (doc.expiryDate) {
      const expiryDate = new Date(doc.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil(
        (expiryDate - today) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0) {
        return { label: "Expired", color: "red" };
      }
      if (daysUntilExpiry <= 30) {
        return { label: "Expiring Soon", color: "orange" };
      }
    }
    return { label: "Active", color: "green" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Document Library</h2>
        <button
          onClick={() => navigate("/documents/upload")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={20} />
          Add Document
        </button>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No documents found</p>
          <button
            onClick={() => navigate("/documents/upload")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Upload your first document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const status = getDocumentStatus(doc);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-lg border border-slate-200 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-indigo-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg transition-colors group-hover:bg-indigo-100">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-gray-500 flex flex-col">
                        <span>{doc.category}</span>
                        <span>{doc.subCategory}</span>
                      </p>
                    </div>
                  </div>
                  {doc.expiryDate && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-${status.color}-100 text-${status.color}-700`}
                    >
                      {status.label}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {doc.level && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium">{doc.level}</span>
                    </div>
                  )}
                  {doc.version && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium">{doc.version}</span>
                    </div>
                  )}
                  {doc.createdDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-xs">
                        {doc.createdDate}
                      </span>
                    </div>
                  )}
                  {doc.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires:</span>
                      <span className="font-medium text-xs">
                        {doc.expiryDate}
                      </span>
                    </div>
                  )}
                </div>

                {doc.expiryDate && status.label === "Expiring Soon" && (
                  <div className="mt-4 p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="text-xs text-orange-700">
                      Expires in{" "}
                      {Math.ceil(
                        (new Date(doc.expiryDate) - new Date()) /
                        (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleView(doc)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
                    title="Delete Document"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Document View Modal */}
      {selectedDocument && (
        <DocumentViewModal
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};

export default DocumentList;
