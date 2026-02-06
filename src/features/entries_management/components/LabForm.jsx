import React, { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";

const LabForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;
    onSave(formData);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Add New Laboratory
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Create a new laboratory entity.
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
            Laboratory Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Regional Quality Lab"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">
            Laboratory Code
          </label>
          <input
            type="text"
            required
            placeholder="e.g. LB-01"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl text-slate-600 font-bold text-sm 
    hover:bg-red-50 hover:text-red-600 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 bg-indigo-600 text-white font-bold text-sm 
    rounded-xl shadow-lg shadow-indigo-100 
    transition-all active:scale-95 
    flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            Create Lab
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabForm;
