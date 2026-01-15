import React from "react";

const BaselineQualifications = ({ formData, handleInputChange }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-indigo-500 pl-3">
        2. Baseline Qualifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Highest Education
          </label>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
          >
            <option value="">Select Level</option>
            <option value="High School">High School</option>
            <option value="Bachelor">Bachelor's Degree</option>
            <option value="Master">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prior Experience (Years)
          </label>
          <input
            type="number"
            name="workExperienceYears"
            value={formData.workExperienceYears}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Education Details
          </label>
          <textarea
            name="educationDetails"
            rows="2"
            placeholder="e.g., B.E. Computer Science, University of Pune (2020)"
            value={formData.educationDetails}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>
    </section>
  );
};

export default BaselineQualifications;
