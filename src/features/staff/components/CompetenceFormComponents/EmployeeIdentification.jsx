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
            Hire Date
          </label>
          <input
            type="date"
            name="hireDate"
            value={formData.hireDate}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
          >
            <option value="">Select Department</option>
            <option value="IT">IT / Engineering</option>
            <option value="HR">Human Resources</option>
            <option value="QA">Quality Assurance</option>
            <option value="OPS">Operations</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Title / Role
          </label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleInputChange}
            placeholder="+91 98765 43210"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>
    </section>
  );
};

export default EmployeeIdentification;
