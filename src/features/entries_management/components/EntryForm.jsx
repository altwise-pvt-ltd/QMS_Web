import React, { useState } from "react";
import { Plus, X, CheckCircle2, Trash2 } from "lucide-react";
import { RECORDING_CYCLES } from "../data/entriesData";

const EntryForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    cycle: "Daily",
    parameters: [{ id: crypto.randomUUID(), value: "" }],
  });

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.parameters.some((p) => p.value.trim() !== "");

  const addParameter = () => {
    setFormData({
      ...formData,
      parameters: [
        ...formData.parameters,
        { id: crypto.randomUUID(), value: "" },
      ],
    });
  };

  const removeParameter = (id) => {
    if (formData.parameters.length <= 1) return;
    setFormData({
      ...formData,
      parameters: formData.parameters.filter((p) => p.id !== id),
    });
  };

  const updateParameter = (id, value) => {
    setFormData({
      ...formData,
      parameters: formData.parameters.map((p) =>
        p.id === id ? { ...p, value } : p,
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const validParams = formData.parameters
      .map((p) => p.value.trim())
      .filter((v) => v !== "");

    onSave({
      name: formData.name.trim(),
      cycle: formData.cycle,
      id: Date.now(),
      type: "custom",
      parameters: validParams,
    });
  };

  return (
    <div className="bg-white rounded-2xl">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            New Logging Category
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Define entry schema & cycle
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Category Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Sterilization Registry"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Expected Frequency
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RECORDING_CYCLES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, cycle: option.value })
                }
                className={`py-2 px-1 rounded-lg text-[10px] font-black border transition-all ${
                  formData.cycle === option.value
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100"
                }`}
              >
                {option.label.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Schema Parameters
            </label>
            <button
              type="button"
              onClick={addParameter}
              className="px-3 py-1 bg-slate-50 text-[10px] font-black text-slate-600 rounded-md hover:bg-slate-900 hover:text-white transition-all flex items-center gap-1.5 border border-slate-200 uppercase tracking-wider"
            >
              <Plus size={12} strokeWidth={4} />
              Add Field
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto px-1 custom-scrollbar">
            {formData.parameters.map((param) => (
              <div
                key={param.id}
                className="flex gap-2 group animate-in slide-in-from-right-1"
              >
                <input
                  type="text"
                  placeholder="Field Label (e.g. Temp C)"
                  value={param.value}
                  onChange={(e) => updateParameter(param.id, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold focus:border-indigo-400 transition-all placeholder:text-slate-300"
                />
                {formData.parameters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameter(param.id)}
                    className="p-2 text-slate-300 hover:text-red-600 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
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
            className="flex-1 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`flex-2 py-3 px-6 flex items-center justify-center gap-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all
              ${
                isFormValid
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95"
                  : "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
              }`}
          >
            <CheckCircle2 size={16} strokeWidth={3} />
            <span>Save Category</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
