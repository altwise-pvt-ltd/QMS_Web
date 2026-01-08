import React from "react";
import { Plus, Save } from "lucide-react";

/**
 * NCActions Component
 *
 * Handles the "Add NC Entry" and "Save Form" buttons.
 *
 * @param {Object} props
 * @param {Function} props.onAddEntry - Callback to add a new NC record.
 * @param {Function} props.onSubmit - Callback to submit the entire form.
 */
const NCActions = ({ onAddEntry, onSubmit }) => {
  return (
    <div className="flex gap-3 mt-6">
      <button
        type="button"
        onClick={onAddEntry}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        title="Click to add a new Non-Conformance entry"
      >
        <Plus className="w-4 h-4" />
        Add NC Entry
      </button>
      <button
        type="button"
        onClick={onSubmit}
        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto shadow-sm hover:shadow-md transition-all"
        title="Save this form and forward the data to the document repository"
      >
        <Save className="w-4 h-4" />
        Save Form
      </button>
    </div>
  );
};

export default NCActions;
