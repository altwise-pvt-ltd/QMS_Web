import React from "react";
import { FileText } from "lucide-react";

/**
 * NCHeader Component
 *
 * Handles the display and editing of document-level metadata for the Non-Conformance form.
 *
 * @param {Object} props
 * @param {Object} props.formData - The current state of the entire form.
 * @param {Function} props.onFieldChange - Callback to update top-level form fields.
 */
const NCHeader = ({ formData, onFieldChange }) => {
  return (
    <div className="border-b border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <div className="flex-1">
          <label
            className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1"
            title="The official title of this document"
          >
            Document Name
          </label>
          <input
            type="text"
            value={formData.documentName}
            onChange={(e) => onFieldChange("documentName", e.target.value)}
            className="w-full text-2xl font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-200 focus:border-blue-500 focus:outline-none transition-all"
            placeholder="Enter Document Name"
          />
        </div>
      </div>

      {/* Document Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-gray-500 uppercase"
            title="Unique identification number for the document"
          >
            Document No
          </label>
          <input
            type="text"
            value={formData.documentNo}
            onChange={(e) => onFieldChange("documentNo", e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-gray-500 uppercase"
            title="Current issue number of the document"
          >
            Issue No
          </label>
          <input
            type="text"
            value={formData.issueNo}
            onChange={(e) => onFieldChange("issueNo", e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-gray-500 uppercase"
            title="Current amendment number of the document"
          >
            Amendment No
          </label>
          <input
            type="text"
            value={formData.amendmentNo}
            onChange={(e) => onFieldChange("amendmentNo", e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-gray-500 uppercase"
            title="Date when this issue was released"
          >
            Issue Date
          </label>
          <input
            type="text"
            value={formData.issueDate}
            onChange={(e) => onFieldChange("issueDate", e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-gray-500 uppercase"
            title="Date of the last amendment"
          >
            Amendment Date
          </label>
          <input
            type="text"
            value={formData.amendmentDate}
            onChange={(e) => onFieldChange("amendmentDate", e.target.value)}
            className="w-full px-3 py-1.5 text-sm font-medium bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label
            className="text-xs font-medium text-gray-500 uppercase"
            title="Control status of the document"
          >
            Status
          </label>
          <div className="flex items-center h-[38px] px-3 bg-green-50 text-green-700 text-sm font-bold rounded-md border border-green-100">
            Controlled
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCHeader;
