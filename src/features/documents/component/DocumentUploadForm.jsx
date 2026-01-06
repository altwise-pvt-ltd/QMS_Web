import React, { useState, useMemo } from "react";
import { Upload, FileText, X, Eye } from "lucide-react";
import { DOC_LEVELS } from "../data.js";
import UploadPreviewModal from "./UploadPreviewModal";

// Helper to determine if a doc type needs an expiry date
const checkExpiryNeed = (docType) => {
  const expiryRequiredTypes = [
    "competency-assessments",
    "calibration-certificates",
    "training-logs",
    "license-renewal",
  ];
  return expiryRequiredTypes.some((term) => docType.includes(term));
};

export default function DocumentUploadForm({
  onSubmit,
  initialData = {},
  defaultDepartment = "",
  defaultTitle = "",
  defaultLevel = "",
  defaultCategory = "",
  defaultSubCategory = "",
  defaultSection = "",
}) {
  // Derive initial document type if context is provided
  const initialDocType = useMemo(() => {
    if (initialData.documentType) return initialData.documentType;
    if (!defaultLevel || !defaultTitle) return "";

    const itemSlug = defaultTitle.toLowerCase().replace(/\s+/g, "-");
    if (defaultSection) {
      // Format matches Level 3/4 layout in groupedDocTypes
      return `${defaultLevel}-${defaultSection.toLowerCase()}-${itemSlug}`;
    }
    // Format matches Level 1/2 layout in groupedDocTypes
    return `${defaultLevel}-${itemSlug}`;
  }, [initialData.documentType, defaultLevel, defaultTitle, defaultSection]);

  // 1. Initialize State
  const [formData, setFormData] = useState({
    title: initialData.title || defaultTitle || "",
    documentType: initialData.documentType || initialDocType || "",
    category: initialData.category || defaultCategory || "",
    subCategory: initialData.subCategory || defaultSubCategory || "",
    associatedProcedure: initialData.associatedProcedure || "",
    department: defaultDepartment,
    effectiveDate:
      initialData.effectiveDate || new Date().toISOString().split("T")[0],
    expiryDate: initialData.expiryDate || "",
    version: initialData.version || "1.0",
    comments: initialData.comments || "",
    file: null,
  });

  const [showPreview, setShowPreview] = useState(false);

  // Derived state for conditional logic
  const selectedLevel = formData.documentType.split("-")[0]; // e.g., "level-2"
  const needsExpiry = checkExpiryNeed(formData.documentType);

  // 2. MEMOIZED OPTIONS (Performance Fix)
  const groupedDocTypes = useMemo(() => {
    return DOC_LEVELS.map((level) => {
      let items = [];

      if ("items" in level) {
        items = level.items.map((item) => ({
          value: `${level.id}-${item.name.toLowerCase().replace(/\s+/g, "-")}`,
          label: item.name,
        }));
      } else if ("sections" in level) {
        // Flatten sections for Level 4 into a single group list
        items = level.sections.flatMap((section) =>
          section.items.map((item) => ({
            value: `${level.id}-${section.title.toLowerCase()}-${item
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            label: `${section.title} - ${item}`,
          }))
        );
      }

      return {
        label: level.title, // e.g., "Level 2: Procedures"
        options: items,
      };
    });
  }, []);

  const procedureOptions = useMemo(() => {
    const l2 = DOC_LEVELS.find((l) => l.id === "level-2");
    if (!l2 || !("items" in l2)) return [];
    return l2.items.map((item) => item.name);
  }, []);

  // 3. Handlers
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file,
        // Only auto-fill title if it's currently empty
        title: prev.title ? prev.title : file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.file || !formData.documentType || !formData.title) return;

    // Call the parent function passed via props
    if (onSubmit) {
      onSubmit({
        ...formData,
        uploadedBy: "current-user-id", // Replace with Auth Context later
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
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors ${
            formData.file
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

      {/* --- Core Metadata --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Document Title *
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g. QMS Manual 2024"
          />
        </div>

        {/* Category and Sub-Category (Read-only when pre-filled) */}
        {formData.category && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <input
              type="text"
              readOnly
              className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 shadow-sm sm:text-sm p-2 border text-slate-600 cursor-not-allowed"
              value={formData.category}
            />
          </div>
        )}

        {formData.subCategory && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Sub-Category
            </label>
            <input
              type="text"
              readOnly
              className="mt-1 block w-full rounded-md border-slate-300 bg-slate-50 shadow-sm sm:text-sm p-2 border text-slate-600 cursor-not-allowed"
              value={formData.subCategory}
            />
          </div>
        )}

        {/* Improved Dropdown with OptGroups */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Document Type *
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.documentType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, documentType: e.target.value }))
            }
          >
            <option value="">Select Document Type...</option>
            {groupedDocTypes.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Department *
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
          />
        </div>

        <div>
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
          />
        </div>
      </div>

      {/* --- Conditional Logic Section --- */}
      {selectedLevel !== "level-1" && selectedLevel !== "level-2" && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Associated Procedure (Level 2)
          </label>
          <select
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            value={formData.associatedProcedure}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                associatedProcedure: e.target.value,
              }))
            }
          >
            <option value="">None / Not Applicable</option>
            {procedureOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Link this document to a governing procedure.
          </p>
        </div>
      )}

      {/* --- Dates --- */}
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

        {needsExpiry && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="flex text-sm font-medium text-amber-700 items-center gap-1">
              Expiry Date{" "}
              <span className="text-xs font-normal">(Required)</span>
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full rounded-md border-amber-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm p-2 border bg-amber-50"
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
              }
            />
          </div>
        )}
      </div>

      {/* --- Footer --- */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Comments
        </label>
        <textarea
          rows={3}
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          value={formData.comments}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, comments: e.target.value }))
          }
          placeholder="Describe changes or reasons for upload..."
        />
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
