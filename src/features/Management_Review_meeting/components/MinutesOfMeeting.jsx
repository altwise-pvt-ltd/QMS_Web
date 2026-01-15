import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

const MinutesOfMeeting = ({ onSave, onBack, meeting }) => {
  const [items, setItems] = useState([
    { id: Date.now(), input: "", activity: "", responsibility: "", status: "" },
  ]);

  // --- Handlers ---
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        input: "",
        activity: "",
        responsibility: "",
        status: "",
      },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = () => {
    const formData = { agendaItems: items };
    console.log("Saving Minutes:", formData);
    if (onSave) onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors mb-3"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Actions</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-indigo-600" />
              {meeting?.title || "Management Review Meeting"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">Minutes of Meeting</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 shadow-sm font-medium transition-all"
          >
            <Save size={18} /> Save Minutes
          </button>
        </div>

        {/* Form List - Card Layout */}
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">
                  Item #{index + 1}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Fields Grid */}
              <div className="space-y-5">
                {/* 1. Review Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Review Input (Agenda)
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 text-sm bg-gray-50 focus:bg-white transition-colors"
                    placeholder="E.g., Review of Quality Policy..."
                    value={item.input}
                    onChange={(e) =>
                      updateItem(item.id, "input", e.target.value)
                    }
                  />
                </div>

                {/* 2. Review Activities */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Review Activities / Discussion
                  </label>
                  <textarea
                    rows={3}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-sm bg-gray-50 focus:bg-white transition-colors resize-none"
                    placeholder="Describe the discussion details here..."
                    value={item.activity}
                    onChange={(e) =>
                      updateItem(item.id, "activity", e.target.value)
                    }
                  />
                </div>

                {/* Row for Responsibility & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 3. Responsibility */}
                  <div>
                    <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1">
                      <User size={14} className="text-gray-400" />{" "}
                      Responsibility
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-sm bg-gray-50 focus:bg-white"
                      placeholder="Name / Role"
                      value={item.responsibility}
                      onChange={(e) =>
                        updateItem(item.id, "responsibility", e.target.value)
                      }
                    />
                  </div>

                  {/* 4. Status */}
                  <div>
                    <label className="flex text-sm font-semibold text-gray-700 mb-1 items-center gap-1">
                      <CheckCircle size={14} className="text-gray-400" /> Status
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-sm bg-gray-50 focus:bg-white"
                      placeholder="E.g., Completed, Pending"
                      value={item.status}
                      onChange={(e) =>
                        updateItem(item.id, "status", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={addItem}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2"
        >
          <Plus size={24} />
          <span className="font-semibold text-sm">Add New Entry</span>
        </button>
      </div>
    </div>
  );
};

export default MinutesOfMeeting;
