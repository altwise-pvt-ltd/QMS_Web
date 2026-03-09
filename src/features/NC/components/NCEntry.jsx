import React, { useState, useEffect } from "react";
import { ncService } from "../services/ncService";
import {
  FileText as FileIcon,
  UploadCloud,
  Eye,
  Trash2,
  Users,
  UserPlus,
  X,
} from "lucide-react";
import { db } from "../../../db";
import staffService from "../../staff/services/staffService";
import UploadPreviewModal from "../../documents/component/UploadPreviewModal";

const NCEntry = ({ entry, onUpdate, departments = [], categories = [] }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [staffSearch, setStaffSearch] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getAllStaff();
        const data = response.data || [];
        const mappedStaff = data.map((s) => ({
          id: s.staffId || s.id,
          name:
            `${s.firstName || ""} ${s.lastName || ""}`.trim() ||
            s.name ||
            s.staffName ||
            "Unnamed Staff",
          role: s.jobTitle || "Staff",
          dept:
            departments.find((d) => (d.id || d.departmentId) === s.departmentId)
              ?.name ||
            departments.find((d) => (d.id || d.departmentId) === s.departmentId)
              ?.departmentName ||
            "General",
        }));
        setStaffList(mappedStaff);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };
    fetchStaff();
  }, [departments]);

  // ── Fetch subcategories when category changes ─────────────────────────────
  // Routes to QI or RI endpoint based on categoryCode prefix
  useEffect(() => {
    const fetchSubCats = async () => {
      if (!entry.categoryId || !entry.categoryCode) {
        setAvailableSubcategories([]);
        return;
      }
      try {
        const response = await ncService.getSubCategoriesByCategory(
          entry.categoryId,
          entry.categoryCode,
        );
        // API returns { success, message, data: [...] }
        const raw =
          response?.data ||
          response?.value ||
          (Array.isArray(response) ? response : []);

        // Normalize QI/RI field names into a common shape for the dropdown
        const isQI = entry.categoryCode?.startsWith("QICategory_");
        const normalized = raw.map((sub) => ({
          subCategoryId: isQI
            ? sub.qualityIndicatorSubCategoryId
            : (sub.riskIndicatorSubCategoryId ?? sub.id),
          subCategoryName: isQI
            ? sub.qualitySubCategoryName
            : (sub.riskSubCategoryName ?? sub.name),
          ...sub, // preserve original fields if needed
        }));

        setAvailableSubcategories(normalized);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setAvailableSubcategories([]);
      }
    };
    fetchSubCats();
  }, [entry.categoryId, entry.categoryCode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(
        `File type '${file.type}' is not permitted. Please upload an image or PDF.`,
      );
      e.target.value = ""; // Reset input
      return;
    }

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
            <select
              value={entry.department}
              onChange={(e) => onUpdate(entry.id, "department", e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option
                  key={dept.id || dept.departmentId}
                  value={dept.departmentName || dept.name}
                >
                  {dept.departmentName || dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* NC Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              NC Category
            </label>
            <select
              value={entry.categoryId || ""}
              onChange={(e) => {
                const catId = e.target.value;
                const selectedCat = categories.find(
                  (c) =>
                    String(
                      c.nonConformanceCategoryId || c.categoryId || c.id,
                    ) === String(catId),
                );
                const catName =
                  selectedCat?.categoryName || selectedCat?.name || "";
                const catCode = selectedCat?.categoryCode || "";

                onUpdate(entry.id, "categoryId", catId);
                onUpdate(entry.id, "category", catName);
                onUpdate(entry.id, "categoryCode", catCode);
                onUpdate(entry.id, "subCategoryId", "");
                onUpdate(entry.id, "ncDetails", "");
              }}
              className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option
                  key={cat.nonConformanceCategoryId || cat.categoryId || cat.id}
                  value={
                    cat.nonConformanceCategoryId || cat.categoryId || cat.id
                  }
                >
                  {cat.categoryName || cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* NC Details (Nature of NC) — Subcategory */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nature of N.C.
            </label>
            <select
              value={entry.subCategoryId || ""}
              onChange={(e) => {
                const subId = e.target.value;
                const selectedSub = availableSubcategories.find(
                  (s) => String(s.subCategoryId) === String(subId),
                );
                onUpdate(entry.id, "subCategoryId", subId);
                onUpdate(
                  entry.id,
                  "ncDetails",
                  selectedSub?.subCategoryName || "",
                );
              }}
              disabled={!entry.categoryId}
              className="w-full px-3 py-2 border rounded-md bg-white disabled:bg-gray-100"
            >
              <option value="">
                {entry.categoryId ? "Select Details" : "Select Category first"}
              </option>
              {availableSubcategories.map((sub) => (
                <option key={sub.subCategoryId} value={sub.subCategoryId}>
                  {sub.subCategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Evidence Document */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Document (Optional)
            </label>

            {!entry.evidenceImage ? (
              <div className="flex justify-center px-6 py-6 border-2 border-dashed rounded-md">
                <label className="cursor-pointer text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="text-sm text-blue-600 font-medium">
                    Upload a file (PDF, Image, etc)
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="flex justify-between items-center p-3 bg-blue-50 border rounded-md">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-2 bg-blue-100 rounded">
                    <FileIcon size={20} />
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

          {/* Observations */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observations
            </label>
            <textarea
              value={entry.observations}
              onChange={(e) =>
                onUpdate(entry.id, "observations", e.target.value)
              }
              rows="2"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Effectiveness */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effectiveness
            </label>
            <textarea
              value={entry.effectiveness}
              onChange={(e) =>
                onUpdate(entry.id, "effectiveness", e.target.value)
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

          {/* Tag Staff */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4" /> Tag Staff involved in incident
            </label>
            <div className="relative">
              <div className="min-h-10.5 w-full px-3 py-1.5 border rounded-md focus-within:ring-2 focus-within:ring-blue-500 bg-white flex flex-wrap gap-2 items-center">
                {(entry.taggedStaff || []).map((staff) => (
                  <span
                    key={staff.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-100"
                  >
                    {staff.name}
                    <button
                      onClick={() =>
                        onUpdate(
                          entry.id,
                          "taggedStaff",
                          entry.taggedStaff.filter((s) => s.id !== staff.id),
                        )
                      }
                      className="hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={
                    (entry.taggedStaff || []).length === 0
                      ? "Search staff to tag..."
                      : ""
                  }
                  className="flex-1 min-w-30 outline-none text-sm bg-transparent"
                  value={staffSearch}
                  onChange={(e) => {
                    setStaffSearch(e.target.value);
                    setShowStaffDropdown(true);
                  }}
                  onFocus={() => setShowStaffDropdown(true)}
                />
              </div>

              {showStaffDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowStaffDropdown(false)}
                  ></div>
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-20 max-h-48 overflow-y-auto">
                    {staffList
                      .filter(
                        (s) =>
                          s.name
                            .toLowerCase()
                            .includes(staffSearch.toLowerCase()) &&
                          !(entry.taggedStaff || []).some(
                            (ts) => ts.id === s.id,
                          ),
                      )
                      .map((staff) => (
                        <button
                          key={staff.id}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center justify-between group transition-colors"
                          onClick={() => {
                            onUpdate(entry.id, "taggedStaff", [
                              ...(entry.taggedStaff || []),
                              staff,
                            ]);
                            setStaffSearch("");
                            setShowStaffDropdown(false);
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800">
                              {staff.name}
                            </span>
                            <span className="text-[10px] text-gray-500 uppercase">
                              {staff.role} • {staff.dept}
                            </span>
                          </div>
                          <UserPlus className="w-4 h-4 text-gray-300 group-hover:text-blue-600 transition-colors" />
                        </button>
                      ))}
                    {staffList.filter(
                      (s) =>
                        s.name
                          .toLowerCase()
                          .includes(staffSearch.toLowerCase()) &&
                        !(entry.taggedStaff || []).some((ts) => ts.id === s.id),
                    ).length === 0 && (
                      <div className="px-4 py-6 text-center text-gray-400 text-sm italic">
                        No matching staff found
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
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
