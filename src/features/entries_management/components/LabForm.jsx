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
    <div className="bg-white rounded-2xl">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Register New Unit
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Establish a new monitoring entity
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
            Unit Designation
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Central Processing Hub"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Internal Code / UID
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Unit-QA-09"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="flex gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-2 py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 size={16} strokeWidth={3} />
            Initialize Unit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LabForm;
