import React from "react";
import { Plus, X, CheckCircle2 } from "lucide-react";
import { RECORDING_CYCLES } from "../data/entriesData";

const EntryForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    cycle: "Daily",
    parameters: [""],
  });

  const addParameter = () => {
    setFormData({ ...formData, parameters: [...formData.parameters, ""] });
  };

  const removeParameter = (index) => {
    const newParams = formData.parameters.filter((_, i) => i !== index);
    setFormData({ ...formData, parameters: newParams });
  };

  const updateParameter = (index, value) => {
    const newParams = [...formData.parameters];
    newParams[index] = value;
    setFormData({ ...formData, parameters: newParams });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave({
      ...formData,
      id: Date.now(),
      type: "custom", // Marking as custom since it's user-defined
      parameters: formData.parameters.filter((p) => p.trim() !== ""),
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Create New Entry</h2>
          <p className="text-xs text-slate-500 font-medium">
            Define a new log category and its parameters.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Entry Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Daily Temperature Check"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Recording Cycle
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RECORDING_CYCLES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, cycle: option.value })
                }
                className={`py-2 px-1 rounded-lg text-[10px] font-bold border-2 transition-all ${
                  formData.cycle === option.value
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-slate-400 uppercase">
              Entry Parameters
            </label>
            <button
              type="button"
              onClick={addParameter}
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <Plus size={12} strokeWidth={3} />
              Add
            </button>
          </div>

          <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
            {formData.parameters.map((param, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Morning Temperature"
                  value={param}
                  onChange={(e) => updateParameter(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none text-xs font-medium"
                />
                {formData.parameters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
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
