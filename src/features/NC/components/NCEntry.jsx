import React from "react";
import { Trash2 } from "lucide-react";

/**
 * NCEntry Component
 *
 * Handles a single non-conformance entry fieldset.
 *
 * @param {Object} props
 * @param {Object} props.entry - The data for this specific entry.
 * @param {number} props.index - The 0-based index of the entry.
 * @param {boolean} props.isRemoveable - Whether this entry can be deleted.
 * @param {Function} props.onUpdate - Callback to update a field in this entry.
 * @param {Function} props.onRemove - Callback to remove this entry.
 */
const NCEntry = ({ entry, index, isRemoveable, onUpdate, onRemove }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 relative">
      {/* Entry Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          NC Entry #{index + 1}
        </h3>
        {isRemoveable && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="text-red-600 hover:text-red-700 p-1 transition-colors"
            title="Remove this entry"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Entry Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Date when the non-conformance was observed"
          >
            Date
          </label>
          <input
            type="date"
            value={entry.date}
            onChange={(e) => onUpdate(entry.id, "date", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Department where the non-conformance occurred"
          >
            Department
          </label>
          <input
            type="text"
            value={entry.department}
            onChange={(e) => onUpdate(entry.id, "department", e.target.value)}
            placeholder="e.g., Pathology"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Detailed description of the daily non-conformance observed"
          >
            Details of Daily N.C.
          </label>
          <textarea
            value={entry.ncDetails}
            onChange={(e) => onUpdate(entry.id, "ncDetails", e.target.value)}
            rows="3"
            placeholder="Describe the non-conformance..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Analysis and identification of the fundamental cause of the NC"
          >
            Root Cause
          </label>
          <textarea
            value={entry.rootCause}
            onChange={(e) => onUpdate(entry.id, "rootCause", e.target.value)}
            rows="2"
            placeholder="Identify the root cause..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Actions taken to correct the NC and prevent its recurrence"
          >
            Corrective / Preventive Action Taken
          </label>
          <textarea
            value={entry.correctiveAction}
            onChange={(e) =>
              onUpdate(entry.id, "correctiveAction", e.target.value)
            }
            rows="2"
            placeholder="Describe actions taken..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Person or department responsible for implementing the actions"
          >
            Responsibility
          </label>
          <input
            type="text"
            value={entry.responsibility}
            onChange={(e) =>
              onUpdate(entry.id, "responsibility", e.target.value)
            }
            placeholder="Person responsible"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Target date for completion of the corrective/preventive actions"
          >
            Target Date
          </label>
          <input
            type="date"
            value={entry.targetDate}
            onChange={(e) => onUpdate(entry.id, "targetDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            title="Details of the verification process to ensure NC closure"
          >
            Closure Verification
          </label>
          <textarea
            value={entry.closureVerification}
            onChange={(e) =>
              onUpdate(entry.id, "closureVerification", e.target.value)
            }
            rows="2"
            placeholder="Verification details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default NCEntry;
