import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Tag, User, List, Clock, AlignLeft, Info } from "lucide-react";
import { createEvent, updateEvent } from "../services/complianceService";
import AlertManager from "../../../services/alert/alertService";
import { FREQUENCY_OPTIONS, STATUS_OPTIONS } from "../config/eventTypes";
import staffService from "../../staff/services/staffService";

const EventForm = ({ event, eventTypes, onClose }) => {
  const [eventId, setEventId] = useState(null);
  const [formData, setFormData] = useState({
    eventTypeId: "",
    title: "",
    dueDate: "",
    status: "pending",
    assignedTo: "",
    recurrence: "one-time",
    reminderDays: 7,
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [staffOptions, setStaffOptions] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await staffService.getAllStaff();
        setStaffOptions(response.data || []);
      } catch (error) {
        console.error("Failed to load staff list:", error);
      }
    };
    fetchStaff();
  }, []);

  useEffect(() => {
    if (event) {
      const id = event.id || event.resource?.id || null;
      setEventId(id);

      setFormData({
        eventTypeId: event.eventTypeId || "",
        title: event.title || "",
        dueDate: event.dueDate || "",
        status: event.status || "pending",
        assignedTo: event.assignedTo || "",
        recurrence: event.recurrence || "one-time",
        reminderDays: event.reminderDays || 7,
        notes: event.notes || "",
      });
    }
  }, [event]);

  const validate = () => {
    const newErrors = {};
    if (!formData.eventTypeId) newErrors.eventTypeId = "Event type is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSaving(true);
    try {
      if (eventId) {
        await updateEvent(eventId, formData);
        AlertManager.success("Event updated successfully", "Success");
      } else {
        await createEvent(formData);
        AlertManager.success("New event created successfully", "Created");
      }
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
      AlertManager.error(error.message || "Error saving event. Please try again.", "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        {/* Header - Premium Gradient */}
        <div className="relative overflow-hidden bg-linear-to-r from-indigo-600 to-violet-600 p-6">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <Calendar className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {eventId ? "Update Compliance Event" : "Define New Event"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -right-4 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-4 -bottom-8 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl" />
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Type */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Tag size={16} className="text-indigo-500" />
                  Event Type <span className="text-rose-500">*</span>
                </label>
                <select
                  name="eventTypeId"
                  value={formData.eventTypeId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${
                    errors.eventTypeId ? 'border-rose-300 ring-rose-50' : 'border-slate-200'
                  } rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none cursor-pointer`}
                >
                  <option value="">Select event type...</option>
                  {(eventTypes || []).map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {errors.eventTypeId && <p className="text-xs font-medium text-rose-500 mt-1">{errors.eventTypeId}</p>}
              </div>

              {/* Title */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <List size={16} className="text-indigo-500" />
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Annual Equipment Calibration"
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${
                    errors.title ? 'border-rose-300 ring-rose-50' : 'border-slate-200'
                  } rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all`}
                />
                {errors.title && <p className="text-xs font-medium text-rose-500 mt-1">{errors.title}</p>}
              </div>

              {/* Due Date */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock size={16} className="text-indigo-500" />
                  Due Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 border ${
                    errors.dueDate ? 'border-rose-300 ring-rose-50' : 'border-slate-200'
                  } rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all`}
                />
                {errors.dueDate && <p className="text-xs font-medium text-rose-500 mt-1">{errors.dueDate}</p>}
              </div>

              {/* Recurrence */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Calendar size={16} className="text-indigo-500" />
                  Recurrence
                </label>
                <select
                  name="recurrence"
                  value={formData.recurrence}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none"
                >
                  {FREQUENCY_OPTIONS.map((freq) => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assigned To */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User size={16} className="text-indigo-500" />
                  Assigned To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Assignee...</option>
                  {staffOptions.map((staff) => {
                    const fullName = `${staff.firstName || ""} ${staff.lastName || ""}`.trim() || "Unnamed";
                    return (
                      <option key={staff.staffId} value={fullName}>
                        {fullName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Info size={16} className="text-indigo-500" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reminder Days */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock size={16} className="text-indigo-500" />
                  Reminder <span className="text-slate-400 font-normal text-xs">(days before)</span>
                </label>
                <input
                  type="number"
                  name="reminderDays"
                  value={formData.reminderDays}
                  onChange={handleChange}
                  min="1"
                  max="90"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <AlignLeft size={16} className="text-indigo-500" />
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional details or instructions..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          </form>
        </div>

        {/* Actions - Sticky Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-200/70 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Processing..." : eventId ? "Save Changes" : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
