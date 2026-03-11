import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Calendar,
  User,
  Repeat,
  FileText,
  Save,
  Users,
  ChevronDown,
  Loader2,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Timer,
} from "lucide-react";
import trainingService from "../services/trainingService";

/* ─────────────────────────────────────────────
   STATUS CONFIG — single source of truth
   ───────────────────────────────────────────── */
const STATUS_MAP = {
  Completed: {
    color: "emerald",
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Pending: {
    color: "amber",
    icon: Timer,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "",
  },
  Overdue: {
    color: "red",
    icon: AlertTriangle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  Cancelled: {
    color: "slate",
    icon: XCircle,
    bg: "bg-slate-100",
    text: "text-slate-500",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
};

const getStatusConfig = (status) => STATUS_MAP[status] || STATUS_MAP["Pending"];

/* ─────────────────────────────────────────────
   REUSABLE SUB-COMPONENTS
   ───────────────────────────────────────────── */

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

const InputWrapper = ({ icon: Icon, children }) => (
  <div className="relative group">
    {Icon && (
      <Icon
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200 pointer-events-none"
        size={16}
        strokeWidth={2}
      />
    )}
    {children}
  </div>
);

const inputBase =
  "w-full py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-400 transition-all duration-200";

const selectBase = `${inputBase} appearance-none cursor-pointer pr-10`;

const SelectChevron = () => (
  <ChevronDown
    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    size={14}
  />
);

const SectionHeader = ({ accent, label, icon: Icon }) => (
  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
    <div className="flex items-center gap-2.5">
      <span className={`w-1 h-5 rounded-full ${accent}`} />
      <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">
        {label}
      </h3>
    </div>
    {Icon && <Icon size={16} className="text-slate-300" />}
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center gap-3 p-3.5 rounded-lg animate-pulse">
    <div className="w-9 h-9 rounded-full bg-slate-100" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-slate-100 rounded w-2/3" />
      <div className="h-2.5 bg-slate-50 rounded w-1/3" />
    </div>
    <div className="h-5 w-16 bg-slate-100 rounded-full" />
  </div>
);

/* ─────────────────────────────────────────────
   ATTENDANCE CARD
   ───────────────────────────────────────────── */
const AttendanceCard = ({ record, staffName }) => {
  const cfg = getStatusConfig(record.status);

  const initials = staffName
    ? staffName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "??";

  return (
    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all duration-200 group">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-[11px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors duration-200">
          {initials}
        </div>
        {cfg.dot && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${cfg.dot}`}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {staffName || "Unassigned"}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {record.score != null && (
            <>
              <Award size={10} className="text-slate-400" />
              <span className="text-[11px] text-slate-500 font-medium">
                {record.score}%
              </span>
              <span className="text-slate-200 text-[8px]">•</span>
            </>
          )}
          <Clock size={10} className="text-slate-400" />
          <span className="text-[11px] text-slate-500">
            {record.completionDate
              ? new Date(record.completionDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "In progress"}
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <span
        className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        <cfg.icon size={10} />
        {record.status}
      </span>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN MODAL COMPONENT
   ───────────────────────────────────────────── */
const TrainingDetailModal = ({ isOpen, onClose, training, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    assignedTo: "",
    givenBy: "",
    recurrence: "One-Time",
    status: "Pending",
    notes: "",
  });

  /* ── Data loading ── */
  useEffect(() => {
    if (isOpen && training) {
      loadFullDetails();
      loadStaff();
    }
  }, [isOpen, training]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const loadFullDetails = async () => {
    try {
      setAttendanceLoading(true);
      const id = training.eventId || training.id;
      const fullData = await trainingService.getTrainingById(id);

      setFormData({
        title: fullData.title || "",
        dueDate: fullData.dueDate ? fullData.dueDate.split("T")[0] : "",
        assignedTo: fullData.assignedTo || "",
        givenBy: fullData.givenBy || "",
        recurrence: fullData.recurrence || "One-Time",
        status: fullData.status
          ? fullData.status.charAt(0).toUpperCase() + fullData.status.slice(1)
          : "Pending",
        notes: fullData.notes || "",
        eventTypeId: fullData.eventTypeId,
      });

      if (fullData.attendance) {
        setAttendance(fullData.attendance);
      } else {
        fetchAttendance(id);
      }
    } catch (error) {
      console.error("Error loading training details:", error);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const fetchAttendance = async (id) => {
    try {
      const data = await trainingService.getAttendanceByEventId(id);
      setAttendance(data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const loadStaff = async () => {
    try {
      const staffList = await trainingService.getStaff();
      setStaff(
        staffList.map((s) => ({
          id: s.staffId,
          name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
        })),
      );
    } catch (error) {
      console.error("Error loading staff:", error);
    }
  };

  /* ── Form handler ── */
  const updateField = useCallback(
    (field) => (e) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value })),
    [],
  );

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await trainingService.updateTraining(training.eventId || training.id, {
        ...formData,
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating training:", error);
      alert("Failed to update training. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Helpers ── */
  const resolveStaffName = (staffId) =>
    staff.find((s) => s.id === staffId)?.name || null;

  const completedCount = attendance.filter(
    (r) => r.status === "Completed",
  ).length;

  if (!isOpen) return null;

  const statusCfg = getStatusConfig(formData.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:ml-14">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Shell */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Training module details"
        className="relative bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden flex flex-col"
      >
        {/* ── HEADER ── */}
        <div className="flex-shrink-0 px-5 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm">
              <FileText className="text-white" size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate leading-tight">
                Module Details
              </h2>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide mt-0.5">
                TRN-{training?.eventId || training?.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live status indicator */}
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
              {formData.status}
            </span>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors duration-150"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* ── LEFT COLUMN: Form (3/5) ── */}
            <div className="lg:col-span-3 p-5 sm:p-8">
              <SectionHeader
                accent="bg-indigo-600"
                label="General Information"
              />

              <form onSubmit={handleUpdate} className="mt-6 space-y-5">
                {/* Title */}
                <div>
                  <FieldLabel>Training Title</FieldLabel>
                  <InputWrapper icon={FileText}>
                    <input
                      type="text"
                      className={`${inputBase} pl-10`}
                      value={formData.title}
                      onChange={updateField("title")}
                      required
                    />
                  </InputWrapper>
                </div>

                {/* Due Date + Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Due Date</FieldLabel>
                    <InputWrapper icon={Calendar}>
                      <input
                        type="date"
                        className={`${inputBase} pl-10`}
                        value={formData.dueDate}
                        onChange={updateField("dueDate")}
                        required
                      />
                    </InputWrapper>
                  </div>
                  <div>
                    <FieldLabel>Status</FieldLabel>
                    <div className="relative">
                      <select
                        className={`${selectBase} pl-3.5`}
                        value={formData.status}
                        onChange={updateField("status")}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <SelectChevron />
                    </div>
                  </div>
                </div>

                {/* Assigned To + Recurrence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Assigned To</FieldLabel>
                    <InputWrapper icon={User}>
                      <select
                        className={`${selectBase} pl-10`}
                        value={formData.assignedTo}
                        onChange={updateField("assignedTo")}
                      >
                        <option value="">Select staff</option>
                        <option value="All Staff">All Staff</option>
                        {staff.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <SelectChevron />
                    </InputWrapper>
                  </div>
                  <div>
                    <FieldLabel>Recurrence</FieldLabel>
                    <InputWrapper icon={Repeat}>
                      <select
                        className={`${selectBase} pl-10`}
                        value={formData.recurrence}
                        onChange={updateField("recurrence")}
                      >
                        <option value="One-Time">One-Time</option>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Yearly">Yearly</option>
                      </select>
                      <SelectChevron />
                    </InputWrapper>
                  </div>
                </div>

                {/* Given By */}
                <div>
                  <FieldLabel>Given By</FieldLabel>
                  <input
                    type="text"
                    className={`${inputBase} px-3.5`}
                    value={formData.givenBy}
                    onChange={updateField("givenBy")}
                    placeholder="Instructor name"
                  />
                </div>

                {/* Notes */}
                <div>
                  <FieldLabel>Internal Notes</FieldLabel>
                  <textarea
                    rows={3}
                    className={`${inputBase} px-3.5 resize-none`}
                    placeholder="Requirements, instructions, or context…"
                    value={formData.notes}
                    onChange={updateField("notes")}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={15} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ── RIGHT COLUMN: Attendance (2/5) ── */}
            <div className="lg:col-span-2 p-5 sm:p-8 bg-slate-50/40">
              <SectionHeader
                accent="bg-emerald-500"
                label="Participation"
                icon={Users}
              />

              {/* Summary stat */}
              {!attendanceLoading && attendance.length > 0 && (
                <div className="mt-4 mb-5 flex items-center gap-3 p-3 rounded-lg bg-white border border-slate-100">
                  <div className="flex-1">
                    <p className="text-[22px] font-bold text-slate-900 leading-none">
                      {completedCount}
                      <span className="text-slate-300 font-normal">
                        /{attendance.length}
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      Completed
                    </p>
                  </div>
                  {/* Mini progress bar */}
                  <div className="w-24">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            attendance.length
                              ? (completedCount / attendance.length) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance list */}
              <div className="space-y-2 mt-4">
                {attendanceLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : attendance.length > 0 ? (
                  attendance.map((record) => (
                    <AttendanceCard
                      key={record.trainingAttendanceId}
                      record={record}
                      staffName={resolveStaffName(record.staffId)}
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Users size={20} className="text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">
                      No participants yet
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Assign staff to start tracking attendance
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailModal;
