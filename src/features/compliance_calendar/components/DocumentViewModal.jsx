import React from "react";
import { X, Download, FileText } from "lucide-react";

const DocumentViewModal = ({ document, onClose }) => {
  if (!document) return null;

  const handleDownload = () => {
    if (document.fileUrl) {
      const link = document.createElement("a");
      link.href = document.fileUrl;
      link.download = document.name || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-auto h-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {document.name}
              </h2>
              <p className="text-sm text-gray-500 flex flex-col">
                <span>{document.category}</span>
                <span>{document.subCategory}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {document.fileUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-gray-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download size={18} />
                Download
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Document Info */}
        <div className="px-6 py-4 bg-gray-50 border-b h-auto border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-auto text-sm">
            {document.level && (
              <div>
                <span className="text-gray-600">Level:</span>
                <span className="ml-2 font-medium">{document.level}</span>
              </div>
            )}
            {document.version && (
              <div>
                <span className="text-gray-600">Version:</span>
                <span className="ml-2 font-medium">{document.version}</span>
              </div>
            )}
            {document.status && (
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium">{document.status}</span>
              </div>
            )}
            {document.department && (
              <div>
                <span className="text-gray-600">Department:</span>
                <span className="ml-2 font-medium">{document.department}</span>
              </div>
            )}
            {document.author && (
              <div>
                <span className="text-gray-600">Author:</span>
                <span className="ml-2 font-medium">{document.author}</span>
              </div>
            )}
            {document.createdDate && (
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 font-medium">{document.createdDate}</span>
              </div>
            )}
            {document.expiryDate && (
              <div>
                <span className="text-gray-600">Expires:</span>
                <span className="ml-2 font-medium">{document.expiryDate}</span>
              </div>
            )}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto p-6">
          {document.fileUrl ? (
            <iframe
              src={document.fileUrl}
              className="w-full h-full border border-gray-300 rounded-lg"
              title={document.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText className="w-16 h-16 mb-4" />
              <p className="text-lg font-medium">No preview available</p>
              <p className="text-sm">
                This document doesn't have a file attached
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewModal;
