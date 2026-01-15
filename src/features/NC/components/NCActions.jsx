import React from "react";
import { Save } from "lucide-react";

/**
 * NCActions Component
 *
 * Handles the "Save Form" action.
 * Updated: Removed "Add NC Entry" functionality.
 *
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback to submit the entire form.
 */
const NCActions = ({ onSubmit, isSubmitting }) => {
  return (
    // Changed to justify-end to align the single button to the right
    <div className="flex mt-6 justify-end">
      {/* REMOVED: Add NC Entry Button */}

      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className={`flex items-center gap-2 px-6 py-2 rounded-md shadow-sm hover:shadow-md transition-all ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed text-slate-800 "
            : "bg-blue-600 text-slate-800  hover:bg-blue-700 font-medium"
        }`}
        title="Save this form and forward the data to the document repository"
      >
        <Save className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
        {isSubmitting ? "Saving..." : "Save Form"}
      </button>
    </div>
  );
};

export default NCActions;
