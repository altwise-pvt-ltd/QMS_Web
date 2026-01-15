import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const ActionItemsPage = ({ meeting, onSave, onBack, onNext }) => {
  const [actionItems, setActionItems] = useState(meeting?.actionItems || []);

  const addActionItem = () => {
    const newItem = {
      id: Date.now(),
      task: "",
      description: "",
      dueDate: "",
      createdAt: new Date().toISOString(),
    };
    setActionItems([newItem, ...actionItems]); // Add to top
  };

  const updateActionItem = (id, field, value) => {
    setActionItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const deleteActionItem = (id) => {
    if (window.confirm("Are you sure you want to remove this action item?")) {
      setActionItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const handleSave = () => {
    onSave({ ...meeting, actionItems });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {meeting?.title || "MRM Action Plan"}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {meeting?.date}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2 text-sm"
            >
              <Save size={18} />
              Save Changes
            </button>

            {onNext && (
              <button
                onClick={() => {
                  handleSave();
                  onNext();
                }}
                className="px-5 py-2.5 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center gap-2 shadow-sm text-sm"
              >
                Next: Minutes →
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Action List Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Action Items
                </h2>
                <p className="text-sm text-gray-500">
                  Manage deliverables and assigned tasks
                </p>
              </div>
              <button
                onClick={addActionItem}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-medium flex items-center gap-2 text-sm shadow-sm"
              >
                <Plus size={16} />
                New Item
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {actionItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="text-gray-300" size={32} />
                  </div>
                  <h3 className="text-gray-900 font-medium">
                    No action items yet
                  </h3>
                  <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                    Start by adding action items from the meeting minutes to
                    track accountability.
                  </p>
                </div>
              ) : (
                actionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group p-5 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex gap-4 items-start">
                      {/* ID / Counter */}
                      <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-mono text-xs font-bold mt-1">
                        #{index + 1}
                      </span>

                      {/* Main Form Area */}
                      <div className="flex-1 space-y-3">
                        {/* Row 1: Title & Delete */}
                        <div className="flex justify-between items-start gap-4">
                          <input
                            type="text"
                            placeholder="Enter action item description..."
                            value={item.task}
                            onChange={(e) =>
                              updateActionItem(item.id, "task", e.target.value)
                            }
                            className="flex-1 bg-transparent border-0 border-b border-gray-200 focus:border-indigo-500 focus:ring-0 px-0 py-2 text-base font-medium text-gray-900 placeholder-gray-400 transition-colors"
                          />
                          <button
                            onClick={() => deleteActionItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1"
                            title="Delete Item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Row 2: Description */}
                        <textarea
                          placeholder="Add additional details or context (optional)..."
                          value={item.description}
                          onChange={(e) =>
                            updateActionItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg text-sm text-gray-600 placeholder-gray-400 px-3 py-2 resize-none"
                        />

                        {/* Row 3: Due Date */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1">
                            <Calendar size={14} />
                            Due Date:
                          </label>
                          <input
                            type="date"
                            value={item.dueDate}
                            onChange={(e) =>
                              updateActionItem(
                                item.id,
                                "dueDate",
                                e.target.value
                              )
                            }
                            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
              <span>Last saved: {new Date().toLocaleTimeString()}</span>
              <span>{actionItems.length} records found</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActionItemsPage;
