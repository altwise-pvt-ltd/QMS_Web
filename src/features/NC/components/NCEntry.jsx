import React, { useState, useEffect } from "react";
import { NC_OPTIONS } from "../data/NcCategories";
import { Image as ImageIcon, UploadCloud, Eye, Trash2 } from "lucide-react";
import UploadPreviewModal from "../../documents/component/UploadPreviewModal";

const NCEntry = ({ entry, onUpdate }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  useEffect(() => {
    if (!entry.category) {
      setAvailableSubcategories([]);
      return;
    }
    const found = NC_OPTIONS.find((opt) => opt.category === entry.category);
    setAvailableSubcategories(found ? found.subcategories : []);
  }, [entry.category]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onUpdate(entry.id, "evidenceImage", file);
  };

  const handleRemoveFile = () => {
    onUpdate(entry.id, "evidenceImage", null);
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={entry.date}
              onChange={(e) => onUpdate(entry.id, "date", e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              value={entry.department}
              onChange={(e) => onUpdate(entry.id, "department", e.target.value)}
              placeholder="e.g., Pathology"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* NC Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NC Category
            </label>
            <select
              value={entry.category || ""}
              onChange={(e) => {
                onUpdate(entry.id, "category", e.target.value);
                onUpdate(entry.id, "ncDetails", "");
              }}
              className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {NC_OPTIONS.map((opt) => (
                <option key={opt.category} value={opt.category}>
                  {opt.category}
                </option>
              ))}
            </select>
          </div>

          {/* NC Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nature of N.C.
            </label>
            <select
              value={entry.ncDetails || ""}
              onChange={(e) => onUpdate(entry.id, "ncDetails", e.target.value)}
              disabled={!entry.category}
              className="w-full px-3 py-2 border rounded-md bg-white disabled:bg-gray-100"
            >
              <option value="">
                {entry.category ? "Select Details" : "Select Category first"}
              </option>
              {availableSubcategories.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Evidence Image */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Image (Optional)
            </label>

            {!entry.evidenceImage ? (
              <div className="flex justify-center px-6 py-6 border-2 border-dashed rounded-md">
                <label className="cursor-pointer text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="text-sm text-blue-600 font-medium">
                    Upload an image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 bg-blue-50 border rounded-md">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-2 bg-blue-100 rounded">
                    <ImageIcon size={20} />
                  </div>
                  <span className="text-sm truncate">
                    {entry.evidenceImage.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setIsPreviewOpen(true)}>
                    <Eye size={18} />
                  </button>
                  <button type="button" onClick={handleRemoveFile}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Daily NC Details */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details of Daily NC
            </label>
            <textarea
              value={entry.dailyNcDetails}
              onChange={(e) =>
                onUpdate(entry.id, "dailyNcDetails", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Root Cause */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Root Cause
            </label>
            <textarea
              value={entry.rootCause}
              onChange={(e) => onUpdate(entry.id, "rootCause", e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Preventive Action */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preventive Action Taken
            </label>
            <textarea
              value={entry.preventiveAction}
              onChange={(e) =>
                onUpdate(entry.id, "preventiveAction", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Corrective Action */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Corrective Action Taken
            </label>
            <textarea
              value={entry.correctiveAction}
              onChange={(e) =>
                onUpdate(entry.id, "correctiveAction", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Responsibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsibility
            </label>
            <input
              type="text"
              value={entry.responsibility}
              onChange={(e) =>
                onUpdate(entry.id, "responsibility", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Closure Verification */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closure Verification
            </label>
            <textarea
              value={entry.closureVerification}
              onChange={(e) =>
                onUpdate(entry.id, "closureVerification", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <UploadPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={entry.evidenceImage}
      />
    </>
  );
};

export default NCEntry;
