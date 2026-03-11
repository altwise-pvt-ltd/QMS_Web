import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  User,
  Repeat,
  FileText,
  CheckCircle2,
  ChevronDown,
  Loader2,
  StickyNote,
} from "lucide-react";
import trainingService from "../services/trainingService";

/* ═══════════════════════════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

const FieldLabel = ({ icon: Icon, children }) => (
  <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
    {Icon && <Icon size={13} className="text-indigo-500" strokeWidth={2.25} />}
    {children}
  </label>
);

const inputBase =
  "w-full py-2.5 px-3.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-400 transition-all duration-200";

const selectBase = `${inputBase} appearance-none cursor-pointer pr-10`;

const SelectChevron = () => (
  <ChevronDown
    size={14}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
  />
);

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const ScheduleTrainingModal = ({ isOpen, onClose, onSuccess, initialDate }) => {
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    assignedTo: "",
    givenBy: "",
    recurrence: "One-Time",
    notes: "",
  });

  /* ── Lifecycle ── */
  useEffect(() => {
    if (isOpen) {
      loadStaff();
      if (initialDate && !Array.isArray(initialDate)) {
        setFormData((prev) => ({
          ...prev,
          dueDate: new Date(initialDate).toISOString().split("T")[0],
        }));
      }
    }
  }, [isOpen, initialDate]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  /* ── Data ── */
  const loadStaff = async () => {
    try {
      setStaffLoading(true);
      const staffList = await trainingService.getStaff();
      setStaff(
        staffList.map((s) => ({
          id: s.staffId,
          name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
          role: s.jobTitle,
        })),
      );
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  /* ── Form helpers ── */
  const updateField = useCallback(
    (field) => (e) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  );

  const resetForm = () => {
    setFormData({
      title: "",
      dueDate: new Date().toISOString().split("T")[0],
      assignedTo: "",
      givenBy: "",
      recurrence: "One-Time",
      notes: "",
    });
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const eventTypes = await trainingService.getEventTypes();
      const trainingType = eventTypes.find((t) => t.name === "Training");

      if (!trainingType) {
        throw new Error("Training event type not found");
      }

      const trainingData = {
        eventTypeId: trainingType.id,
        title: formData.title,
        dueDate: formData.dueDate,
        status: "Pending",
        assignedTo: formData.assignedTo,
        givenBy: formData.givenBy,
        recurrence: formData.recurrence,
        notes: formData.notes,
      };

      const res = await trainingService.createTraining(trainingData);
      const eventId = res.data?.complianceEventId;

      if (!eventId) throw new Error("Failed to retrieve new event ID");

      // Create attendance mappings
      const createAttendancePromises = [];
      if (formData.assignedTo === "All Staff") {
        staff.forEach((person) => {
          createAttendancePromises.push(
            trainingService.createAttendance({
              eventId,
              staffId: person.id,
              status: "Pending",
            }),
          );
        });
      } else {
        const assignedPerson = staff.find(
          (s) => s.name === formData.assignedTo,
        );
        if (assignedPerson) {
          createAttendancePromises.push(
            trainingService.createAttendance({
              eventId,
              staffId: assignedPerson.id,
              status: "Pending",
            }),
          );
        }
      }
      await Promise.all(createAttendancePromises);

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error scheduling training:", error);
      alert("Failed to schedule training. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:ml-14">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Schedule new training"
        className="relative bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden flex flex-col"
      >
        {/* ── HEADER ── */}
        <div className="flex-shrink-0 px-5 sm:px-7 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <Calendar className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Schedule Training
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                Add a new module to the compliance calendar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-150"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── FORM ── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 sm:px-7 py-6"
        >
          <div className="space-y-5">
            {/* Title — full width */}
            <div>
              <FieldLabel icon={FileText}>Training Title</FieldLabel>
              <input
                required
                type="text"
                placeholder="e.g. Annual Safety Protocol"
                value={formData.title}
                onChange={updateField("title")}
                className={inputBase}
              />
            </div>

            {/* Date + Recurrence row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={Calendar}>Scheduled Date</FieldLabel>
                <input
                  required
                  type="date"
                  value={formData.dueDate}
                  onChange={updateField("dueDate")}
                  className={inputBase}
                />
              </div>
              <div>
                <FieldLabel icon={Repeat}>Recurrence</FieldLabel>
                <div className="relative">
                  <select
                    value={formData.recurrence}
                    onChange={updateField("recurrence")}
                    className={selectBase}
                  >
                    <option value="One-Time">One-Time</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <SelectChevron />
                </div>
                {formData.recurrence !== "One-Time" && (
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                    Future instances will be auto-generated for compliance
                    tracking.
                  </p>
                )}
              </div>
            </div>

            {/* Given By + Assigned To row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel icon={User}>Given By</FieldLabel>
                <input
                  required
                  type="text"
                  placeholder="Instructor or department"
                  value={formData.givenBy}
                  onChange={updateField("givenBy")}
                  className={inputBase}
                />
              </div>
              <div>
                <FieldLabel icon={User}>Assigned To</FieldLabel>
                <div className="relative">
                  <select
                    required
                    disabled={staffLoading}
                    value={formData.assignedTo}
                    onChange={updateField("assignedTo")}
                    className={`${selectBase} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {staffLoading ? (
                      <option>Loading staff…</option>
                    ) : (
                      <>
                        <option value="">Select personnel</option>
                        <option value="All Staff">All Staff</option>
                        {staff.map((person) => (
                          <option key={person.id} value={person.name}>
                            {person.name}
                            {person.role ? ` — ${person.role}` : ""}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  {staffLoading ? (
                    <Loader2
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 animate-spin pointer-events-none"
                    />
                  ) : (
                    <SelectChevron />
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <FieldLabel icon={StickyNote}>Additional Instructions</FieldLabel>
              <textarea
                rows={3}
                placeholder="Context, links to materials, or special requirements…"
                value={formData.notes}
                onChange={updateField("notes")}
                className={`${inputBase} resize-none`}
              />
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Schedule Training
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleTrainingModal;
