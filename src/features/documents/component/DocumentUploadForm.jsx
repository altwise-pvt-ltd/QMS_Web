import React, { useState, useMemo } from "react";
import { Upload, FileText, X } from "lucide-react";
import { DOC_LEVELS } from "../data.js";

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
}) {
  // 1. Initialize State
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    documentType: initialData.documentType || "",
    associatedProcedure: initialData.associatedProcedure || "",
    department: defaultDepartment,
    effectiveDate:
      initialData.effectiveDate || new Date().toISOString().split("T")[0],
    expiryDate: initialData.expiryDate || "",
    version: initialData.version || "1.0",
    comments: initialData.comments || "",
    file: null,
  });

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
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, file: null }))}
                className="p-1 hover:bg-emerald-200 rounded-full text-emerald-700 transition-colors"
              >
                <X size={16} />
              </button>
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
            <label className="block text-sm font-medium text-amber-700 flex items-center gap-1">
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
          type="submit"
          disabled={!formData.file || !formData.title || !formData.documentType}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Upload className="mr-2 -ml-1 h-4 w-4" />
          Upload Document
        </button>
      </div>
    </form>
  );
}
