import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  User,
  Repeat,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { db } from "../../../db";
import {
  createEvent,
  getAllEventTypes,
} from "../../compliance_calendar/services/complianceService";

const ScheduleTrainingModal = ({ isOpen, onClose, onSuccess, initialDate }) => {
  const [loading, setLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    assignedTo: "",
    recurrence: "one-time",
    notes: "",
  });

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

  const loadStaff = async () => {
    try {
      setStaffLoading(true);
      const data = await db.staff.toArray();
      setStaff(data);
    } catch (error) {
      console.error("Error loading staff:", error);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const eventTypes = await getAllEventTypes();
      const trainingType = eventTypes.find((t) => t.name === "Training");

      if (!trainingType) {
        throw new Error("Training event type not found");
      }

      const newEvent = {
        eventTypeId: trainingType.id,
        title: formData.title,
        dueDate: formData.dueDate,
        status: "pending",
        assignedTo: formData.assignedTo,
        recurrence: formData.recurrence,
        notes: formData.notes,
      };

      // 1. Create Calendar Entry
      const createdEvent = await createEvent(newEvent);
      const eventId = createdEvent.id;

      // 2. Create Assignment Mapping (Snapshotting)
      if (formData.assignedTo === "All Staff") {
        const currentStaff = await db.staff.toArray();
        const attendanceRecords = currentStaff.map((person) => ({
          eventId,
          staffId: person.id,
          status: "pending",
          completionDate: null,
        }));
        await db.training_attendance.bulkAdd(attendanceRecords);
      } else {
        // Find single staff member
        const assignedPerson = staff.find(
          (s) => s.name === formData.assignedTo,
        );
        if (assignedPerson) {
          await db.training_attendance.add({
            eventId,
            staffId: assignedPerson.id,
            status: "pending",
            completionDate: null,
          });
        }
      }

      // 3. Handle Recurrence (Auto-generate future instances)
      if (formData.recurrence !== "one-time") {
        const nextDates = [];
        let currentDate = new Date(formData.dueDate);

        // Generate next 3 instances as a safeguard for compliance visibility
        for (let i = 0; i < 3; i++) {
          if (formData.recurrence === "monthly")
            currentDate.setMonth(currentDate.getMonth() + 1);
          if (formData.recurrence === "quarterly")
            currentDate.setMonth(currentDate.getMonth() + 3);
          if (formData.recurrence === "yearly")
            currentDate.setFullYear(currentDate.getFullYear() + 1);

          nextDates.push(currentDate.toISOString().split("T")[0]);
        }

        for (const futureDate of nextDates) {
          const futureEvent = {
            ...newEvent,
            dueDate: futureDate,
            status: "pending",
          };
          const fEvent = await createEvent(futureEvent);

          // Duplicate attendance mapping for future events
          if (formData.assignedTo === "All Staff") {
            const currentStaff = await db.staff.toArray();
            const attendanceRecords = currentStaff.map((person) => ({
              eventId: fEvent.id,
              staffId: person.id,
              status: "pending",
              completionDate: null,
            }));
            await db.training_attendance.bulkAdd(attendanceRecords);
          } else {
            const assignedPerson = staff.find(
              (s) => s.name === formData.assignedTo,
            );
            if (assignedPerson) {
              await db.training_attendance.add({
                eventId: fEvent.id,
                staffId: assignedPerson.id,
                status: "pending",
                completionDate: null,
              });
            }
          }
        }
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: "",
        dueDate: new Date().toISOString().split("T")[0],
        assignedTo: "",
        recurrence: "one-time",
        notes: "",
      });
    } catch (error) {
      console.error("Error scheduling training:", error);
      alert("Failed to schedule training. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/20">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              Schedule New Training
            </h2>
            <p className="text-slate-500 font-medium mt-1">
              Add a module to the compliance calendar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white rounded-2xl transition-colors text-slate-400 hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Title - Full Width in Grid */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <FileText size={14} className="text-indigo-500" />
                Training Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Annual Safety Protocol"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Calendar size={14} className="text-indigo-500" />
                Scheduled Date
              </label>
              <input
                required
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700"
              />
            </div>

            {/* Recurrence */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Repeat size={14} className="text-indigo-500" />
                Recurrence
              </label>
              <select
                value={formData.recurrence}
                onChange={(e) =>
                  setFormData({ ...formData, recurrence: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
                * Future instances will be auto-generated for compliance
                visibility.
              </p>
            </div>

            {/* Assigned To */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <User size={14} className="text-indigo-500" />
                Assigned To / Target Personnel
              </label>
              <select
                required
                disabled={staffLoading}
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer disabled:opacity-50"
              >
                {staffLoading ? (
                  <option>Loading staff data...</option>
                ) : (
                  <>
                    <option value="">Select Personnel...</option>
                    <option
                      value="All Staff"
                      className="font-black text-indigo-700"
                    >
                      ALL STAFF (Group Assignment)
                    </option>
                    <option disabled className="text-slate-300">
                      ──────────────────
                    </option>
                    {staff.map((person) => (
                      <option key={person.id} value={person.name}>
                        {person.name} — {person.role} ({person.department})
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Notes */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Additional Instructions
              </label>
              <textarea
                rows="4"
                placeholder="Provide context or links to training materials..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-8 py-4 bg-indigo-600 text-gray-600 rounded-xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                "Scheduling..."
              ) : (
                <>
                  <CheckCircle2 size={20} /> Schedule Requirement
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
