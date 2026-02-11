import React, { useState, useEffect } from "react";
import { UserPlus, X, Save } from "lucide-react";
import { Spinner } from "../../../components/ui/Spinner";
// import api from "../../../auth/api";
import staffService from "../services/staffService";

const CreateStaffForm = ({ onCancel, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    departmentId: "",
    jobTitle: "",
    joinDate: new Date().toISOString().split("T")[0],
  });
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments for the dropdown
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await staffService.getAllDepartments();
        if (response.data) {
          setDepartments(response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepts();
  }, []);

  // Populate form when editing existing staff
  useEffect(() => {
    if (initialData) {
      // Better name splitting - handles multi-part names
      const nameParts = (initialData.name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      setFormData({
        firstName,
        lastName,
        email: initialData.email || initialData.workEmail || "",
        mobileNumber: initialData.mobileNumber || "",
        departmentId: initialData.departmentId || initialData.deptId || "",
        jobTitle: initialData.role || initialData.jobTitle || "",
        joinDate:
          initialData.joinDate || new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Map frontend data to API payload
      const payload = {
        staffId: initialData?.id || initialData?.staffId || 0,
        firstName: formData.firstName,
        lastName: formData.lastName,
        workEmail: formData.email,
        mobileNumber: formData.mobileNumber,
        departmentId: parseInt(formData.departmentId),
        jobTitle: formData.jobTitle
      };

      console.log("Submitting staff payload:", payload);

      const response = await staffService.createStaff(payload);

      if (response.data) {
        alert(initialData ? "Staff updated successfully" : "Staff created successfully");
        onSubmit(response.data); // Pass back the new/updated staff object
      }
    } catch (error) {
      console.error("Error saving staff:", error);
      alert(error.response?.data?.message || "Failed to save staff information. Please check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <UserPlus className="text-blue-600" size={24} />
            {initialData ? "Edit Staff Information" : "Add New Staff"}
          </h2>
          <p className="text-sm text-gray-500">
            {initialData
              ? `Update basic information for ${initialData.name}`
              : "Enter basic employment details"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="
    p-2
    rounded-full
    text-gray-500
    hover:bg-red-100 hover:text-red-600
    focus:outline-none focus:ring-2 focus:ring-red-300
    transition-colors duration-150
  "
        >
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="john.doe@company.com"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobileNumber"
              required
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="+91 98765 43210"
              pattern="[+]?[0-9\s\-()]+"
              title="Please enter a valid phone number"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              name="departmentId"
              required
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Senior QA Engineer"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="
      px-5 py-2.5
      text-sm font-medium
      text-gray-700
      bg-white
      border border-gray-300
      rounded-lg
      transition-colors duration-200
      hover:bg-red-50 hover:text-red-600 hover:border-red-300
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`
      px-5 py-2.5
      text-sm font-medium
      rounded-lg
      flex items-center gap-2
      transition-colors  duration-200
      ${isSubmitting
                ? "bg-blue-400 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-gray-600 hover:bg-blue-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              }
    `}
          >
            {isSubmitting ? (
              <Spinner size={18} className="text-gray-600" />
            ) : (
              <Save size={18} />
            )}
            {isSubmitting
              ? "Saving..."
              : initialData
                ? "Update Employee"
                : "Create Employee"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CreateStaffForm;
