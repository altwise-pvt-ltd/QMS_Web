import React from "react";
import { Save, X } from "lucide-react";
import { Spinner } from "../../../../components/ui/Spinner"; // Assuming Spinner exists here or adjust path

const DocumentFormActions = ({ onSubmit, onCancel, loading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky bottom-0 z-10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          All required fields must be completed before submission
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner size={18} className="text-gray-600" /> : <Save size={18} />}
            {loading ? "Saving..." : "Save Documents"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentFormActions;

