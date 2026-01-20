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
      const data = await db.staff.toArray();
      setStaff(data);
    } catch (error) {
      console.error("Error loading staff:", error);
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

      await createEvent(newEvent);
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
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/30">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Schedule New Training
            </h2>
            <p className="text-sm text-slate-500">
              Add a module to the compliance calendar
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-600 shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
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
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
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
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700"
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
                className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
              >
                <option value="one-time">One-time</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <User size={14} className="text-indigo-500" />
              Assigned To / Target
            </label>
            <select
              required
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData({ ...formData, assignedTo: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
            >
              <option value="">Select Personnel</option>
              {staff.map((person) => (
                <option key={person.id} value={person.name}>
                  {person.name} ({person.role})
                </option>
              ))}
              <option value="All Staff">All Staff</option>
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Additional Instructions
            </label>
            <textarea
              rows="3"
              placeholder="Provide context or links to materials..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-700 resize-none"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-6 py-4 bg-indigo-600 text-gray-600 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                "Scheduling..."
              ) : (
                <>
                  <CheckCircle2 size={18} /> Confirm
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
