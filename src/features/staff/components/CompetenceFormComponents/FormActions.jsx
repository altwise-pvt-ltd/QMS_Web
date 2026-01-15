import React from "react";
import { Save } from "lucide-react";

const FormActions = ({ assessmentDate }) => {
  return (
    <div className="flex justify-between items-center pt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky bottom-4">
      <div className="text-sm text-gray-500">
        <span className="font-medium text-gray-700">Assessment Date:</span>{" "}
        {assessmentDate}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-black bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 shadow-md"
        >
          <Save size={18} /> Save Record
        </button>
      </div>
    </div>
  );
};

export default FormActions;
