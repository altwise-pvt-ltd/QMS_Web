import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  FileText,
  User,
  CheckCircle,
  ArrowLeft,
  UserCheck,
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
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleSave = () => {
    const formData = { agendaItems: items };
    console.log("Proceeding to attendance with minutes:", formData);
    if (onSave) onSave(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-4 group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-semibold text-sm">
                Return to Action Items
              </span>
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FileText className="text-indigo-600" size={24} />
              </div>
              {meeting?.title || "Management Review Meeting"}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Minutes of Meeting (ISO 9001:2015)
            </p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-black rounded-xl hover:bg-indigo-700 shadow-lg font-bold transition-all active:scale-95"
          >
            <UserCheck size={20} /> Next: Attendance Selection
          </button>
        </div>

        {/* Form List - Card Layout */}
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all relative group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                    {index + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Agenda Point
                  </span>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="Remove Entry"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Fields Grid */}
              <div className="space-y-6 lg:space-y-8">
                {/* 1. Review Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Review Input / Agenda Item
                  </label>
                  <input
                    type="text"
                    className="block w-full rounded-xl border-gray-200 shadow-xs focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 py-3.5 px-4 text-sm bg-gray-50 focus:bg-white transition-all font-medium"
                    placeholder="E.g., Review of Quality Policy and Objectives..."
                    value={item.input}
                    onChange={(e) =>
                      updateItem(item.id, "input", e.target.value)
                    }
                  />
                </div>

                {/* 2. Review Activities */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                    Discussion & Review Activities
                  </label>
                  <textarea
                    rows={4}
                    className="block w-full rounded-xl border-gray-200 shadow-xs focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 py-3 px-4 text-sm bg-gray-50 focus:bg-white transition-all resize-none font-medium"
                    placeholder="Enter detailed discussion points, findings, and decisions..."
                    value={item.activity}
                    onChange={(e) =>
                      updateItem(item.id, "activity", e.target.value)
                    }
                  />
                </div>

                {/* Row for Responsibility & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 3. Responsibility */}
                  <div>
                    <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2 uppercase tracking-wide">
                      <User size={16} className="text-gray-400" />{" "}
                      Responsibility
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-gray-200 shadow-xs focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 py-3 px-4 text-sm bg-gray-50 focus:bg-white transition-all font-medium"
                      placeholder="Name / Department"
                      value={item.responsibility}
                      onChange={(e) =>
                        updateItem(item.id, "responsibility", e.target.value)
                      }
                    />
                  </div>

                  {/* 4. Status */}
                  <div>
                    <label className="flex text-sm font-bold text-gray-700 mb-2 items-center gap-2 uppercase tracking-wide">
                      <CheckCircle size={16} className="text-gray-400" />{" "}
                      Current Status
                    </label>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-gray-200 shadow-xs focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 py-3 px-4 text-sm bg-gray-50 focus:bg-white transition-all font-medium"
                      placeholder="E.g., In Progress, Approved"
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
          className="w-full py-6 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center gap-3 group bg-white"
        >
          <div className="bg-gray-50 group-hover:bg-indigo-100 p-2 rounded-full transition-colors">
            <Plus size={32} />
          </div>
          <span className="font-bold text-sm uppercase tracking-widest">
            Add New Minutes Entry
          </span>
        </button>
      </div>
    </div>
  );
};

export default MinutesOfMeeting;
