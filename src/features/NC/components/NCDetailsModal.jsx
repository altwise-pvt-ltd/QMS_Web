import React, { useState, useEffect } from "react";
import {
  X,
  ClipboardList,
  Save,
  Loader2,
  Pencil,
  Lock,
  AlertCircle,
  Unlock,
} from "lucide-react";

/**
 * ReasonPopup Component
 * A small internal modal to capture the reason for editing a specific field.
 */
const ReasonPopup = ({ isOpen, onClose, onConfirm, fieldLabel }) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center bg-slate-900/20 backdrop-blur-[2px] rounded-2xl animate-in fade-in duration-200">
      <div className="bg-white w-80 p-5 rounded-xl shadow-2xl border border-slate-200 ring-4 ring-slate-50 transform transition-all scale-100">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Audit Requirement
            </h4>
            <p className="text-xs text-slate-500 leading-tight mt-1">
              Please provide a reason for modifying{" "}
              <strong>{fieldLabel}</strong>.
            </p>
          </div>
        </div>

        <textarea
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g., Typo correction, Updated per management review..."
          className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none resize-none mb-4 bg-slate-50"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setReason("");
              onClose();
            }}
            className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason);
              setReason(""); // Reset for next time
            }}
            className="px-4 py-2 text-xs font-bold text-black bg-slate-800 hover:bg-slate-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            <Unlock size={12} />
            Unlock Field
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main NCDetailsModal Component
 */
const NCDetailsModal = ({ report, onClose, onUpdate }) => {
  if (!report) return null;

  // Form Data State
  const [editableEntry, setEditableEntry] = useState(report.entry || {});
  const [isSaving, setIsSaving] = useState(false);

  // State: Which fields are currently unlocked? { rootCause: true, ... }
  const [unlockedFields, setUnlockedFields] = useState({});

  // State: Store the audit reasons provided { rootCause: "Typo fix", ... }
  const [auditReasons, setAuditReasons] = useState({});

  // State: Popup Control
  const [activeReasonModal, setActiveReasonModal] = useState({
    isOpen: false,
    fieldKey: null,
    fieldLabel: "",
  });

  // Reset state when opening a new report
  useEffect(() => {
    if (report && report.entry) {
      setEditableEntry(report.entry);
      setUnlockedFields({});
      setAuditReasons({});
    }
  }, [report]);

  // --- Handlers ---

  // 1. User clicks "Edit" -> Open Popup
  const initiateEdit = (key, label) => {
    setActiveReasonModal({
      isOpen: true,
      fieldKey: key,
      fieldLabel: label,
    });
  };

  // 2. User confirms popup -> Unlock field & Store reason
  const confirmUnlock = (reason) => {
    const { fieldKey } = activeReasonModal;

    setUnlockedFields((prev) => ({ ...prev, [fieldKey]: true }));
    setAuditReasons((prev) => ({ ...prev, [fieldKey]: reason }));

    setActiveReasonModal({ isOpen: false, fieldKey: null, fieldLabel: "" });
  };

  // 3. Save -> Send data AND audit reasons to parent
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // We pass the data AND the reasons to the parent/service
      await onUpdate(report.id, editableEntry, auditReasons);
      onClose();
    } catch (error) {
      console.error("Failed to update report:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Render Helpers ---

  const renderEditableSection = (label, key, placeholder, rows = 3) => {
    const isUnlocked = unlockedFields[key];

    return (
      <div className="relative group">
        <div className="flex justify-between items-end mb-1.5">
          <label className="block text-xs font-bold uppercase text-slate-500 tracking-wider">
            {label}
          </label>

          {!isUnlocked ? (
            <button
              onClick={() => initiateEdit(key, label)}
              className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2.5 py-1.5 rounded-lg transition-all border border-blue-100"
            >
              <Pencil size={11} />
              Edit
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 rounded-lg">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Editable
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            disabled={!isUnlocked}
            rows={rows}
            placeholder={placeholder}
            value={editableEntry[key] || ""}
            onChange={(e) =>
              setEditableEntry((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className={`w-full px-4 py-3 border rounded-xl text-sm transition-all outline-none 
              ${isUnlocked
                ? "border-blue-300 ring-4 ring-blue-50/50 bg-white text-slate-800 shadow-sm"
                : "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed resize-none hover:bg-slate-100 transition-colors"
              }
            `}
          />
          {/* Lock Icon overlay if disabled */}
          {!isUnlocked && (
            <div className="absolute top-3 right-3 text-slate-400 pointer-events-none opacity-50">
              <Lock size={14} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Render the internal popup if open */}
        <ReasonPopup
          isOpen={activeReasonModal.isOpen}
          fieldLabel={activeReasonModal.fieldLabel}
          onClose={() =>
            setActiveReasonModal({ ...activeReasonModal, isOpen: false })
          }
          onConfirm={confirmUnlock}
        />

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <ClipboardList size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                NC Report Details
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">
                  #{report.documentNo}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30">
          {/* Static Field (Always Read-only) */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
              Nature of N.C.
            </label>
            <div className="relative">
              <input
                disabled
                value={`${editableEntry?.category || "Uncategorized"}  •  ${editableEntry?.ncDetails || ""
                  }`}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium select-none cursor-not-allowed"
              />
              <Lock
                size={14}
                className="absolute top-3 right-3 text-slate-400 opacity-50"
              />
            </div>
          </div>

          {/* Tagged Staff (Read-only) */}
          {editableEntry.taggedStaff && editableEntry.taggedStaff.length > 0 && (
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 tracking-wider">
                Tagged Staff involved
              </label>
              <div className="flex flex-wrap gap-2">
                {editableEntry.taggedStaff.map(staff => (
                  <span key={staff.id} className="inline-flex items-center px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                    {staff.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Editable Fields using helper function */}
          <div className="md:col-span-2">
            {renderEditableSection(
              "Root Cause",
              "rootCause",
              "Describe root cause..."
            )}
          </div>

          <div>
            {renderEditableSection(
              "Corrective Action",
              "correctiveAction",
              "Action taken...",
              4
            )}
          </div>

          <div>
            {renderEditableSection(
              "Preventive Action",
              "preventiveAction",
              "Future prevention...",
              4
            )}
          </div>

          <div className="md:col-span-2">
            {renderEditableSection(
              "Closure Verification",
              "closureVerification",
              "QC Comments...",
              2
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 z-10">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            /* Button is disabled if no fields have been unlocked yet */
            disabled={isSaving || Object.keys(unlockedFields).length === 0}
            className="px-6 py-2.5 bg-blue-600 text-black rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200/50 flex items-center gap-2 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {Object.keys(unlockedFields).length === 0
              ? "No Changes"
              : "Save Changes"}
          </button>
        </div>
      </div >
    </div >
  );
};

export default NCDetailsModal;
