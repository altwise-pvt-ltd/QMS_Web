import React, { useState } from "react";
import { Plus, X, CheckCircle2, Trash2 } from "lucide-react";
import { RECORDING_CYCLES } from "../data/entriesData";

const EntryForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    cycle: "Daily",
    parameters: [""],
  });

  const addParameter = () => {
    setFormData((prev) => ({
      ...prev,
      parameters: [...prev.parameters, ""],
    }));
  };

  const removeParameter = (index) => {
    setFormData((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index),
    }));
  };

  const updateParameter = (index, value) => {
    setFormData((prev) => {
      const next = [...prev.parameters];
      next[index] = value;
      return { ...prev, parameters: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      id: Date.now(),
      type: "custom",
      parameters: formData.parameters.filter((p) => p.trim() !== ""),
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Create New Entry
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Define a new log category and its parameters.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="p-2 rounded-full text-slate-400
                     hover:bg-red -100 hover:text-red-600
                     transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Entry Name */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">
            Entry Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Daily Temperature Check"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-2.5
                       bg-slate-50
                       border border-slate-200
                       rounded-xl
                       text-sm font-medium
                       outline-none
                       focus:border-indigo-600"
          />
        </div>

        {/* Recording Cycle */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-slate-400 uppercase">
            Recording Cycle
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RECORDING_CYCLES.map((option) => {
              const active = formData.cycle === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      cycle: option.value,
                    }))
                  }
                  className={`py-2 rounded-lg text-[10px] font-semibold
                    border transition-all
                    ${
                      active
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold text-slate-400 uppercase">
              Entry Parameters
            </label>
            <button
              type="button"
              onClick={addParameter}
              className="flex items-center gap-1
                         text-[10px] font-semibold
                         text-indigo-600 hover:text-indigo-700"
            >
              <Plus size={12} strokeWidth={3} />
              Add
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {formData.parameters.map((param, index) => (
              <div key={index} className="flex gap-2 group">
                <input
                  type="text"
                  placeholder="e.g. Morning Temperature"
                  value={param}
                  onChange={(e) =>
                    updateParameter(index, e.target.value)
                  }
                  className="flex-1 px-3 py-2
                             bg-slate-50
                             border border-slate-200
                             rounded-lg
                             text-xs font-medium
                             outline-none
                             focus:border-indigo-500"
                />
                {formData.parameters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="p-2 text-slate-300
                               opacity-80 group-hover:opacity-100
                               hover:text-red-500
                               transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5
                       text-slate-500
                       font-medium text-sm
                       rounded-xl
                       hover:bg-red-100 hover:text-red-600
                       transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2.5
                       bg-indigo-600 text-white
                       font-semibold text-sm
                       rounded-xl
                       shadow-md shadow-indigo-200
                       hover:bg-indigo-700
                       transition-all
                       active:scale-95
                       flex items-center gap-2"
          >
            <CheckCircle2 size={16} />
            Save Entry
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;