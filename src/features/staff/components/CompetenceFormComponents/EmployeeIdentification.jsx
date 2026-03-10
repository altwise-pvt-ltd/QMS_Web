import React from "react";

const EmployeeIdentification = ({ formData, handleInputChange }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
        1. Employee Identification
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee Name *
          </label>
          <input
            type="text"
            name="employeeName"
            required
            value={formData.employeeName}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee ID *
          </label>
          <input
            type="text"
            name="employeeId"
            required
            value={formData.employeeId}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            readOnly
            placeholder="No Department Assigned"
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title / Role
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-gray-600 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            readOnly
            placeholder="+91 98765 43210"
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  );
};

export default EmployeeIdentification;
