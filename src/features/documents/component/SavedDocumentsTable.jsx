import React, { useState } from "react";
import {
  FileText,
  Calendar,
  User,
  Eye,
  Download,
  Trash2,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  File,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Pagination from "@mui/material/Pagination";
import {
  openDocument,
  deleteDocument as deleteDocumentLegacy,
} from "../../../services/documentService";

const ITEMS_PER_PAGE = 10;

const SavedDocumentsTable = ({
  documents = [],
  onDocumentDeleted,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const handleViewDocument = (doc) => {
    try {
      // Check if this is a real uploaded document (has fileUrl from Cloudflare)
      if (!doc?.fileUrl) {
        alert(
          `This is a template document. No file URL is available.\n\nDocument: ${doc.name}\n\nTo view actual documents, please upload them first.`,
        );
        return;
      }

      // Check if it's a mock data URL (fake URL)
      if (
        doc.fileUrl.includes("mockaroo") ||
        doc.fileUrl.includes("example") ||
        !doc.fileUrl.startsWith("http")
      ) {
        alert(
          `This is a template/mock document with a placeholder URL.\n\nDocument: ${doc.name}\n\nPlease upload real documents to view them.`,
        );
        return;
      }

      // Open the real document
      openDocument(doc);
    } catch (error) {
      console.error("Failed to open document:", error);
      alert(`Failed to open document: ${error.message}`);
    }
  };

  const handleDownloadDocument = (doc) => {
    try {
      if (!doc?.fileUrl) {
        alert(
          `Download URL not available for this document.\n\nDocument: ${doc.name}\n\nThis may be a template document.`,
        );
        return;
      }

      // Check if it's a mock data URL
      if (
        doc.fileUrl.includes("mockaroo") ||
        doc.fileUrl.includes("example") ||
        !doc.fileUrl.startsWith("http")
      ) {
        alert(
          `This is a template document with no real file.\n\nDocument: ${doc.name}\n\nPlease upload actual documents to download them.`,
        );
        return;
      }

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = doc.fileUrl;
      link.download = doc.name || "document";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download document:", error);
      alert(`Failed to download document: ${error.message}`);
    }
  };

  const handleDeleteDocument = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      return;
    }

    try {
      if (onDelete) {
        await onDelete(doc);
      } else {
        await deleteDocumentLegacy(doc.id);
      }

      alert("Document deleted successfully!");
      // Notify parent component to refresh the list
      if (onDocumentDeleted) {
        onDocumentDeleted(doc.id);
      }
    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document. Please try again.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 size={14} className="mr-1.5" />;
      case "In Progress":
        return <Clock size={14} className="mr-1.5" />;
      case "Pending":
        return <AlertCircle size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-slate-400" />
          <h2 className="font-semibold text-slate-700 text-sm">
            Documents ({documents.length})
          </h2>
        </div>
      </div>

      {/* ✅ ONLY horizontal scroll lives here */}
      <div className="overflow-x-auto overflow-y-hidden flex-1 min-w-0">
        <table className="min-w-275 w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs font-semibold uppercase text-slate-500">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Sub-Category</th>
              <th className="p-4">Department</th>
              <th className="p-4">Created</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4">Version</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {currentDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-indigo-600 text-sm">
                  {doc.id}
                </td>

                <td className="p-4 max-w-xs">
                  <div className="font-medium text-slate-800 truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {doc.description}
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100 whitespace-nowrap">
                    {doc.subCategory}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin size={12} className="mr-1 text-slate-400" />
                    {doc.department}
                  </div>
                </td>

                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                  <Calendar size={12} className="inline mr-1 text-slate-400" />
                  {doc.createdDate}
                </td>

                <td className="p-4 text-sm text-slate-600">
                  <User size={12} className="inline mr-1 text-slate-400" />
                  {doc.author}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(
                      doc.status,
                    )}`}
                  >
                    {getStatusIcon(doc.status)}
                    {doc.status}
                  </span>
                </td>

                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                    <File size={12} className="mr-1" />
                    {doc.version}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* View Button */}
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors group relative"
                      title="View Document"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="p-2 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors group relative"
                      title="Download Document"
                    >
                      <Download size={16} />
                    </button>

                    {/* Delete Button - Only show for Dexie documents (those with fileUrl) */}
                    {doc.fileUrl && (
                      <button
                        onClick={() => handleDeleteDocument(doc)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors group relative"
                        title="Delete Document"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with Pagination */}
      <div className="px-4 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
        <span className="text-sm text-slate-500">
          Showing {startIndex + 1}-{Math.min(endIndex, documents.length)} of{" "}
          {documents.length} documents
        </span>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
          size="medium"
        />
      </div>
    </div>
  );
};

export default SavedDocumentsTable;
