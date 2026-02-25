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
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const deleteActionItem = (id) => {
    if (window.confirm("Are you sure you want to remove this action item?")) {
      setActionItems((items) => items.filter((item) => item.id !== id));
    }
  };

  const handleSave = () => {
    onSave(actionItems); // Pass action items array directly
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
                  <Calendar size={12} className="text-indigo-500" />{" "}
                  {meeting?.date}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium flex items-center gap-2 text-sm shadow-sm active:scale-95"
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
                className="px-5 py-2.5 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 transition-all font-semibold flex items-center gap-2 shadow-md text-sm active:scale-95"
              >
                Next Step: Minutes →
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto py-8 px-4 lg:py-12">
        <div className="w-full px-4 md:px-8">
          {/* Main Action List Area */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Action Items
                </h2>
                <p className="text-sm text-gray-500">
                  Manage deliverables and assigned tasks for this review cycle
                </p>
              </div>
              <button
                onClick={addActionItem}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold flex items-center gap-2 text-sm shadow-sm active:scale-95"
              >
                <Plus size={18} />
                New Action Item
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {actionItems.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-gray-300" size={40} />
                  </div>
                  <h3 className="text-gray-900 text-lg font-semibold">
                    No action items yet
                  </h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                    Start by adding action items from the meeting minutes to
                    track accountability and ensure ISO compliance.
                  </p>
                </div>
              ) : (
                actionItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group p-6 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex gap-6 items-start">
                      {/* ID / Counter */}
                      <span className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-indigo-600 font-mono text-sm font-bold mt-1 shadow-xs border border-gray-200">
                        {index + 1}
                      </span>

                      {/* Main Form Area */}
                      <div className="flex-1 space-y-4">
                        {/* Row 1: Title & Delete */}
                        <div className="flex justify-between items-start gap-4">
                          <input
                            type="text"
                            placeholder="Enter action item description..."
                            value={item.task}
                            onChange={(e) =>
                              updateActionItem(item.id, "task", e.target.value)
                            }
                            className="flex-1 bg-transparent border-0 border-b-2 border-transparent focus:border-indigo-500 focus:ring-0 px-0 py-2 text-lg font-semibold text-gray-900 placeholder-gray-400 transition-all"
                          />
                          <button
                            onClick={() => deleteActionItem(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Delete Item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        {/* Row 2: Description & Due Date Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                          <div className="lg:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                              Task Details
                            </label>
                            <textarea
                              placeholder="Add additional details or context (optional)..."
                              value={item.description}
                              onChange={(e) =>
                                updateActionItem(
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={2}
                              className="w-full bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl text-sm text-gray-600 placeholder-gray-400 px-4 py-3 resize-none shadow-xs"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block">
                              Due Date
                            </label>
                            <div className="relative">
                              <Calendar
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={16}
                              />
                              <input
                                type="date"
                                value={item.dueDate}
                                onChange={(e) =>
                                  updateActionItem(
                                    item.id,
                                    "dueDate",
                                    e.target.value,
                                  )
                                }
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between font-medium">
              <span>Last saved: {new Date().toLocaleTimeString()}</span>
              <span>{actionItems.length} records found in this cycle</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ActionItemsPage;
