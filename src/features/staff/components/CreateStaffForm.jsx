import React, { useState, useEffect } from "react";
import { UserPlus, X, Save, AlertCircle } from "lucide-react";
import { Spinner } from "../../../components/ui/Spinner";
import staffService from "../services/staffService";

const CreateStaffForm = ({ onCancel, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    departmentId: "",
    jobTitle: "",
  });

  const [errors, setErrors] = useState({}); // Track validation errors
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Validation Logic
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) error = "This field is required";
        else if (value.length < 2) error = "Must be at least 2 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) error = "Email is required";
        else if (!emailRegex.test(value)) error = "Invalid email";
        break;
      case "mobileNumber": {
        const cleaned = value.replace(/\D/g, "");
        if (!cleaned) error = "Mobile number is required";
        else if (cleaned.length !== 10) error = "Must be 10 digits";
        break;
      }

      case "departmentId":
        if (!value) error = "Please select a department";
        break;
      case "jobTitle":
        if (!value.trim()) error = "Job title is required";
        else if (value.length < 3) error = "Job title is too short";
        break;
      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const response = await staffService.getAllDepartments();
        if (response.data) setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepts();
  }, []);

  useEffect(() => {
    if (initialData) {
      const nameParts = (initialData.name || "").trim().split(" ");
      setFormData({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: initialData.email || initialData.workEmail || "",
        mobileNumber: initialData.mobileNumber || "",
        departmentId: initialData.departmentId || initialData.deptId || "",
        jobTitle: initialData.role || initialData.jobTitle || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    setIsSubmitting(true);
    try {
      const payload = {
        staffId: initialData?.id || initialData?.staffId || 0,
        firstName: formData.firstName,
        lastName: formData.lastName,
        workEmail: formData.email,
        mobileNumber: formData.mobileNumber.replace(/\D/g, ""),
        departmentId: parseInt(formData.departmentId),
        jobTitle: formData.jobTitle,
      };

      console.log("Submitting staff payload:", payload);

      const response = await staffService.createStaff(payload);

      if (response.data) {
        alert(
          initialData
            ? "Staff updated successfully"
            : "Staff created successfully",
        );
        onSubmit(response.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for error messages
  const ErrorMsg = ({ name }) =>
    errors[name] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[name]}
      </p>
    ) : null;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <UserPlus className="text-blue-600" size={24} />
          {initialData ? "Edit Staff" : "Add Staff"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

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
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 outline-none transition-all ${errors.firstName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"}`}
            />
            <ErrorMsg name="firstName" />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 outline-none transition-all ${errors.lastName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"}`}
            />
            <ErrorMsg name="lastName" />
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
              className={`w-full border rounded-lg p-2.5 outline-none transition-all ${errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"}`}
            />
            <ErrorMsg name="email" />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="+91 98765 43210"
              pattern="[+]?[0-9\s-()]+"
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
              value={formData.departmentId}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 outline-none bg-white ${errors.departmentId ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.departmentId} value={dept.departmentId}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
            <ErrorMsg name="departmentId" />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={`w-full border rounded-lg p-2.5 outline-none transition-all ${errors.jobTitle ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-500"}`}
            />
            <ErrorMsg name="jobTitle" />
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
