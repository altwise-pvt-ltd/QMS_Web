import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  CheckCircle,
  ArrowLeft,
  X,
  Edit2,
  Loader2,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { getMinutes } from "../services/mrmService";

const MinutesOfMeeting = ({ onSave, onBack, meeting }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    input: "",
    activity: "",
    responsibility: "",
    status: "", // Mandatory selection required
  });

  // --- Always fetch fresh data from backend on mount ---
  useEffect(() => {
    if (meeting?.id) {
      fetchMinutes();
    }
  }, [meeting?.id]);

  const fetchMinutes = async () => {
    setLoading(true);
    try {
      const data = await getMinutes(meeting.id);
      if (data?.agendaItems) {
        setItems(data.agendaItems);
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (error) {
      console.error("Failed to fetch minutes:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ input: "", activity: "", responsibility: "", status: "" });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleAddItem = async () => {
    if (!formData.input.trim()) {
      alert("Please enter an agenda item title");
      return;
    }

    if (!formData.status) {
      alert("Please select a status for this agenda point");
      return;
    }

    let updatedItems;
    if (editingItem) {
      updatedItems = items.map((item) =>
        item.id === editingItem.id ? { ...editingItem, ...formData } : item
      );
    } else {
      const newItem = {
        ...formData,
        id: `local_${Date.now()}`,
      };
      updatedItems = [...items, newItem];
    }

    setItems(updatedItems);
    resetForm();

    // 🔥 AUTO-SAVE: Push to backend immediately after adding/editing
    console.log("Auto-saving new agenda point...");
    await handleSave(false, updatedItems);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      input: item.input,
      activity: item.activity || "",
      responsibility: item.responsibility || "",
      status: item.status || "",
    });
    setShowForm(true);
  };

  const removeItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this agenda point?")) {
      const updatedItems = items.filter((item) => item.id !== id);
      setItems(updatedItems);
      // 🔥 AUTO-SAVE: Sync removal with backend
      await handleSave(false, updatedItems);
    }
  };

  const handleSave = async (shouldNavigate = true, itemsToSave = null) => {
    const listToPersist = itemsToSave || items;
    if (listToPersist.length === 0 && !shouldNavigate) return;

    setSaving(true);
    try {
      const payload = { agendaItems: listToPersist };

      // Save locally first
      sessionStorage.setItem(`mrm_minutes_${meeting.id}`, JSON.stringify(payload));

      // Call API (MrmPage -> saveMinutes)
      if (onSave) {
        console.log("📡 Triggering POST to /CreateMultipleMinutes", payload);
        const result = await onSave(payload, shouldNavigate);
        // 🚀 Sync UI with the fresh list returned from backend (contains IDs)
        if (result?.agendaItems) {
          setItems(result.agendaItems);
        }
      }

      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to save minutes:", error);
      alert("Server sync failed. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="w-full flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                {meeting?.title || "MRM Minutes"}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 font-medium">
                  <FileText size={12} className="text-indigo-500" />
                  Agenda Points & Discussion
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="font-medium text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  ISO 9001:2015
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold flex items-center gap-2 text-sm shadow-sm active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin text-indigo-600" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Progress"}
            </button>

            <button
              onClick={async () => {
                await handleSave(true);
              }}
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-bold flex items-center gap-2 shadow-lg text-sm active:scale-95 disabled:opacity-50 whitespace-nowrap min-w-[180px] justify-center"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowLeft size={18} className="rotate-180" />
              )}
              {saving ? "Processing..." : "Next Step: Attendance"}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4 lg:py-12">
        <div className="w-full px-4 md:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* List Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Agenda Points</h2>
                <p className="text-sm text-gray-500">
                  Document deliverables, decisions, and discussions for each ISO parameter.
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold flex items-center gap-2 text-sm shadow-sm active:scale-95"
              >
                <Plus size={18} />
                New Agenda Point
              </button>
            </div>

            {/* Modal / Form */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900">
                        {editingItem ? "Edit Agenda Point" : "New Agenda Point"}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5 uppercase tracking-wider">
                        ISO Compliance Entry
                      </p>
                    </div>
                    <button
                      onClick={resetForm}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="p-8 space-y-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                        Agenda Item / Review Input
                      </label>
                      <input
                        type="text"
                        autoFocus
                        placeholder="E.g., Review of Quality Objectives"
                        value={formData.input}
                        onChange={(e) =>
                          setFormData({ ...formData, input: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-lg font-bold text-gray-900 placeholder-gray-400 px-4 py-3.5 shadow-sm transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                        Discussion & Review Activities
                      </label>
                      <textarea
                        placeholder="Detailed findings, decisions, and observations..."
                        value={formData.activity}
                        onChange={(e) =>
                          setFormData({ ...formData, activity: e.target.value })
                        }
                        rows={5}
                        className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm text-gray-700 leading-relaxed placeholder-gray-400 px-4 py-3 resize-none shadow-sm transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                          Responsibility
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            placeholder="Owner/Dept"
                            value={formData.responsibility}
                            onChange={(e) =>
                              setFormData({ ...formData, responsibility: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                          Current Status
                        </label>
                        <div className="relative">
                          <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <select
                            value={formData.status}
                            onChange={(e) =>
                              setFormData({ ...formData, status: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all appearance-none"
                          >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-bold transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      onClick={handleAddItem}
                      disabled={saving}
                      className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : editingItem ? (
                        <Edit2 size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                      {saving ? "Saving..." : editingItem ? "Update Point" : "Add Agenda Point"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List Content */}
            <div className="divide-y divide-gray-100 h-[600px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 size={40} className="animate-spin text-indigo-600" />
                  <p className="text-gray-500 font-medium">Fetching minutes...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="text-gray-200" size={40} />
                  </div>
                  <h3 className="text-gray-900 text-lg font-bold">No minutes recorded</h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto font-medium">
                    Break down the meeting agenda into individual points and document the discussion for each.
                  </p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="group p-6 hover:bg-gray-50 transition-all border-l-4 border-transparent hover:border-indigo-500 relative"
                  >
                    <div className="flex gap-6 items-start">
                      <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs mt-1 border border-indigo-100 shadow-sm">
                        {index + 1}
                      </span>

                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-4 w-full">
                            <div>
                              <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                {item.input || "Unspecified Agenda Item"}
                              </h4>
                              {item.activity && (
                                <p className="text-sm text-gray-600 mt-2 leading-relaxed whitespace-pre-wrap max-w-4xl italic px-4 border-l-2 border-gray-100">
                                  "{item.activity}"
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-1">
                              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <User size={13} className="text-indigo-500" />
                                <span className="text-xs font-bold text-gray-700">
                                  {item.responsibility || "No owner"}
                                </span>
                              </div>
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border shadow-sm ${item.status?.toLowerCase() === 'approved'
                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                : item.status?.toLowerCase() === 'rejected'
                                  ? 'bg-rose-50 border-rose-100 text-rose-700'
                                  : 'bg-amber-50 border-amber-100 text-amber-700'
                                }`}>
                                <CheckCircle size={13} />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                  {item.status || "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-6 right-6 lg:relative lg:top-0 lg:right-0">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                              title="Edit Point"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Point"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between font-medium">
              <span>Last saved: {lastSaved || new Date().toLocaleTimeString()}</span>
              <span>{items.length} records found in this cycle</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MinutesOfMeeting;
