import React from "react";
import { ClipboardList, X, CheckCircle2 } from "lucide-react";

const DataFeedForm = ({ selectedLab, selectedEntry, onSave, onCancel }) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-600">Feed Daily Data</h2>
          <p className="text-xs text-slate-500 font-medium">
            For {selectedLab?.name}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="bg-slate-100 px-2 py-1 rounded">
            {new Date().toLocaleDateString("en-GB")}
          </span>
          <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded">
            {selectedEntry?.name}
          </span>
        </div>

        <div className="space-y-3">
          {selectedEntry?.type === "refrigerator" ||
          selectedEntry?.type === "room_temp" ? (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Morning Reading
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4.5°C"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Evening Reading
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4.8°C"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold"
                />
              </div>
            </>
          ) : (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Observation
              </label>
              <textarea
                rows={3}
                placeholder="Enter details..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-slate-500 font-bold text-sm hover:bg-slate-50 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 bg-indigo-600 text-gray-500 font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            Update Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataFeedForm;
