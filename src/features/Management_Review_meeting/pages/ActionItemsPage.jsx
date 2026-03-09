// ActionItemsPage.jsx — Full fixed component
import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Calendar,
  CheckCircle2,
  Edit2,
  X,
  Loader2,
} from "lucide-react";
import { getActionItems } from "../services/mrmService";

const ActionItemsPage = ({ meeting, onSave, onBack, onNext }) => {
  const [actionItems, setActionItems] = useState(meeting?.actionItems || []);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    task: "",
    description: "",
    dueDate: "",
  });

  // ── Always fetch fresh data from backend on mount ───────────────────────
  React.useEffect(() => {
    if (meeting?.id) {
      fetchItems();
    }
  }, [meeting?.id]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getActionItems(meeting.id);
      // Clean up data and ensure we have fresh items from backend
      setActionItems(data || []);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch action items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Utility: deduplicate array by item.id (guards against any stale cache issues)
  const deduplicateById = (items) => {
    const seen = new Set();
    return items.filter((item) => {
      if (!item?.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
  };

  const resetForm = () => {
    setFormData({ task: "", description: "", dueDate: "" });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleFormSave = async () => {
    if (!formData.task.trim()) {
      alert("Please enter a task description");
      return;
    }

    setSaving(true);

    try {
      if (editingItem) {
        // ── EDIT: pass the full item WITH its existing id so service does PUT ─
        const itemToUpdate = {
          ...editingItem,   // preserves id, meetingId, createdAt
          task: formData.task,
          description: formData.description,
          dueDate: formData.dueDate,
        };

        const updated = await onSave(itemToUpdate);

        // Replace only the edited item in local state — do NOT append
        setActionItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? { ...item, ...updated } : item
          )
        );
      } else {
        // ── CREATE: no id on the payload → service does POST ──────────────
        const newItem = {
          task: formData.task,
          description: formData.description,
          dueDate: formData.dueDate,
          // No id — intentional
        };

        const savedItem = await onSave(newItem);

        if (savedItem) {
          // Prepend only if we don't already have this id in state
          setActionItems((prev) => {
            const alreadyExists = prev.some((i) => i.id === savedItem.id);
            return alreadyExists ? prev : [savedItem, ...prev];
          });
        }
      }

      setLastSaved(new Date().toLocaleTimeString());
      resetForm();
    } catch (error) {
      console.error("Failed to save action item:", error);
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item); // keeps item.id in scope for the PUT call
    setFormData({
      task: item.task,
      description: item.description || "",
      dueDate: item.dueDate || "",
    });
    setShowForm(true);
  };

  const deleteActionItem = (id) => {
    if (window.confirm("Are you sure you want to remove this action item?")) {
      setActionItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(actionItems);
      setLastSaved(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to save action items:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                {meeting?.title || "MRM Action Plan"}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={12} className="text-indigo-500" />
                  {meeting?.date}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2 text-sm shadow-sm active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin text-indigo-600" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {onNext && (
              <button
                onClick={async () => {
                  await handleSave();
                  onNext();
                }}
                disabled={saving}
                className="px-5 py-2.5 bg-indigo-600 text-gray-600 rounded-lg hover:bg-indigo-700 transition-all font-semibold flex items-center gap-2 shadow-md text-sm active:scale-95 disabled:opacity-50"
              >
                {saving ? "Processing..." : "Next Step: Minutes →"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4 lg:py-12">
        <div className="w-full px-4 md:px-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Action Items</h2>
                <p className="text-sm text-gray-500">
                  Manage deliverables and assigned tasks for this review cycle
                </p>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 bg-indigo-600 text-gray-600 rounded-lg hover:bg-indigo-700 transition-all font-semibold flex items-center gap-2 text-sm shadow-sm active:scale-95"
              >
                <Plus size={18} />
                New Action Item
              </button>
            </div>

            {/* Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div
                  className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900">
                        {editingItem ? "Edit Action Item" : "New Action Item"}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium mt-0.5">
                        {editingItem
                          ? "Update the details for this task"
                          : "Define a new task and assignment"}
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
                        Task Description
                      </label>
                      <input
                        type="text"
                        autoFocus
                        placeholder="What needs to be done?"
                        value={formData.task}
                        onChange={(e) =>
                          setFormData({ ...formData, task: e.target.value })
                        }
                        className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-lg font-semibold text-gray-900 placeholder-gray-400 px-4 py-3.5 shadow-sm transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                          Additional Details (Optional)
                        </label>
                        <textarea
                          placeholder="Add context or specific instructions..."
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          rows={3}
                          className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm text-gray-600 placeholder-gray-400 px-4 py-3 resize-none shadow-sm transition-all"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                          Due Date
                        </label>
                        <div className="relative">
                          <Calendar
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) =>
                              setFormData({ ...formData, dueDate: e.target.value })
                            }
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-all"
                          />
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
                      onClick={handleFormSave}
                      disabled={saving}
                      className="px-8 py-2.5 bg-indigo-600 text-gray-600 rounded-xl hover:bg-indigo-700 transition-all font-bold flex items-center gap-2 shadow-lg hover:shadow-indigo-200 active:scale-95 disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 size={18} className="animate-spin text-gray-600" />
                      ) : editingItem ? (
                        <Edit2 size={18} />
                      ) : (
                        <Plus size={18} />
                      )}
                      {saving
                        ? "Saving..."
                        : editingItem
                          ? "Update Task"
                          : "Create Task"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-100 h-[600px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <Loader2 size={40} className="animate-spin text-indigo-600" />
                  <p className="text-gray-500 font-medium">Fetching action items...</p>
                </div>
              ) : actionItems.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-gray-900 text-lg font-semibold">
                    No action items yet
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                    Start by adding action items from the meeting minutes to track
                    accountability and ensure ISO compliance.
                  </p>
                </div>
              ) : (
                actionItems
                  .filter((item) => !!item)
                  .map((item, index) => (
                    <div
                      key={item.id || index}
                      className="group p-5 hover:bg-gray-50 transition-all border-l-4 border-transparent hover:border-indigo-500"
                    >
                      <div className="flex gap-5 items-start">
                        <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs mt-1 border border-indigo-100">
                          {index + 1}
                        </span>

                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-base font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                                {item.task || "No title"}
                              </h4>
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-md border border-amber-100">
                                  <Calendar size={13} className="text-amber-600" />
                                  <span className="text-xs font-bold text-amber-700">
                                    {item.dueDate || "No date set"}
                                  </span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                  Created{" "}
                                  {item.createdAt
                                    ? new Date(item.createdAt).toLocaleDateString()
                                    : "Today"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit Item"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => deleteActionItem(item.id)}
                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete Item"
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
              <span>{actionItems.length} records found in this cycle</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActionItemsPage;