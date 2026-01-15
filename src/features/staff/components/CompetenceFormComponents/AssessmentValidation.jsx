import React from "react";

const AssessmentValidation = ({ formData, handleInputChange }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-red-500 pl-3">
        5. Assessment & Validation
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Overall Competence Status
          </label>
          <select
            name="overallStatus"
            value={formData.overallStatus}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border bg-white"
          >
            <option value="">Select Status</option>
            <option value="Fully Competent">Fully Competent</option>
            <option value="Competent with Supervision">
              Competent with Supervision
            </option>
            <option value="Training Required">
              Not Competent / Training Required
            </option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assessor Name
          </label>
          <input
            type="text"
            name="assessorName"
            readOnly
            value={formData.assessorName}
            className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 cursor-not-allowed p-2 border text-gray-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Gap Analysis & Recommendations
          </label>
          <textarea
            name="skillGaps"
            rows="3"
            placeholder="Identify specific gaps and recommended training actions (ISO 7.2c)"
            value={formData.skillGaps}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 p-2 border"
          />
        </div>
      </div>
    </section>
  );
};

export default AssessmentValidation;
