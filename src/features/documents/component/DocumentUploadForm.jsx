import React, { useState } from "react";
import { Upload, FileText, X, Eye } from "lucide-react";
import { useEffect } from "react";
import UploadPreviewModal from "./UploadPreviewModal";
import { getDepartments } from "../../department/services/departmentService";

export default function DocumentUploadForm({
  onSubmit,
  initialData = {},
  defaultDepartment = "",
  defaultTitle = "",
  defaultCategory = "",
  defaultSubCategory = "",
}) {
  // 1. Initialize State
  const [formData, setFormData] = useState({
    departmentId: "",
    departmentName: defaultDepartment,
    author: initialData.author || "",
    version: initialData.version || "1.0",
    description: initialData.description || "",
    effectiveDate:
      initialData.effectiveDate || new Date().toISOString().split("T")[0],
    expiryDate: initialData.expiryDate || "",
    file: null,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await getDepartments();
        setDepartments(depts);

        // If default department is provided by name, find its ID
        if (defaultDepartment) {
          const dept = depts.find(
            (d) => (d.departmentName || d.name) === defaultDepartment,
          );
          if (dept) {
            setFormData((prev) => ({
              ...prev,
              departmentId: dept.id || dept.departmentId,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, [defaultDepartment]);

  // 3. Handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file || !formData.departmentId || !formData.author) return;

    // Call the parent function passed via props
    if (onSubmit) {
      onSubmit({
        ...formData,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200"
    >
      {/* --- File Upload Section (Enhanced UI) --- */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Document File *
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${formData.file
              ? "border-emerald-500 bg-emerald-50"
              : "border-slate-300 hover:bg-slate-50"
            }`}
        >
          {!formData.file ? (
            <label className="cursor-pointer flex flex-col items-center w-full">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm text-slate-600 font-medium">
                Click to upload document
              </span>
              <span className="text-xs text-slate-400 mt-1">
                PDF, DOCX, JPG (Max 10MB)
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.png,.docx"
                required
              />
            </label>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <FileText className="w-8 h-8 text-emerald-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {formData.file.name}
                </p>
                <p className="text-xs text-emerald-600">Ready to upload</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  <Eye size={14} />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, file: null }))
                  }
                  className="p-1.5 hover:bg-emerald-200 rounded-full text-emerald-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========== SECTION 1: CLASSIFICATION ========== */}
      {(defaultCategory || defaultSubCategory) && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-2">
            Classification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultCategory && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Category
                </label>
                <input
                  type="text"
                  readOnly
                  className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 shadow-sm sm:text-sm p-2 border text-slate-600 cursor-not-allowed"
                  value={defaultCategory}
                />
              </div>
            )}

            {defaultSubCategory && (
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Sub-Category
                </label>
                <input
                  type="text"
                  readOnly
                  className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 shadow-sm sm:text-sm p-2 border text-slate-600 cursor-not-allowed"
                  value={defaultSubCategory}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== SECTION 2: DOCUMENT INFORMATION ========== */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-2">
          Document Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Department *
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-white"
              value={formData.departmentId}
              onChange={(e) => {
                const deptId = e.target.value;
                const deptName = e.target.options[e.target.selectedIndex].text;
                setFormData((prev) => ({
                  ...prev,
                  departmentId: deptId,
                  departmentName: deptName,
                }));
              }}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option
                  key={dept.id || dept.departmentId}
                  value={dept.id || dept.departmentId}
                >
                  {dept.departmentName || dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Author *
            </label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={formData.author}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, author: e.target.value }))
              }
              placeholder="e.g. John Doe"
            />
          </div>

          {/* Version */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Version
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={formData.version}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, version: e.target.value }))
              }
              placeholder="e.g. v1.0"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={3}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Provide a brief description of the document..."
            />
          </div>
        </div>
      </div>

      {/* ========== SECTION 4: DATES ========== */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide border-b border-slate-200 pb-2">
          Dates
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Effective Date *
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={formData.effectiveDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  effectiveDate: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Expiry Date
            </label>
            <input
              type="date"
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expiryDate: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          className="
    inline-flex items-center gap-2 px-4 py-2
    border border-indigo-400
    rounded-md text-sm font-medium
    bg-indigo-600 
    shadow-sm shadow-indigo-900/40
    hover:bg-indigo-700 hover:border-indigo-300
    focus:outline-none
    focus:ring-2 focus:ring-indigo-400
    focus:ring-offset-0
    disabled:bg-indigo-900
    disabled:text-indigo-400
    disabled:border-indigo-800
    disabled:shadow-none
    disabled:cursor-not-allowed
    transition-colors
  "
        >
          <Upload className="h-4 w-4 text-indigo-400" />
          Upload Document
        </button>
      </div>

      {/* Local Preview Modal */}
      <UploadPreviewModal
        file={formData.file}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </form>
  );
}
