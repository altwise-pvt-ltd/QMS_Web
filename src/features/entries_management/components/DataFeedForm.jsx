import React, { useState } from "react";
import { ClipboardList, X, CheckCircle2, Loader2 } from "lucide-react";
import entriesService from "../services/entriesService";

const DataFeedForm = ({ selectedLab, selectedEntry, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    reading: "",
    parameterValues: {},
    remarks: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (paramName, value) => {
    setFormData((prev) => ({
      ...prev,
      parameterValues: {
        ...prev.parameterValues,
        [paramName]: value,
      },
      reading: Object.values({
        ...prev.parameterValues,
        [paramName]: value,
      }).join(", "),
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const recordData = {
        entryId: selectedEntry.id,
        labId: selectedLab.id,
        date: new Date().toISOString(),
        status: "Completed",
        value: formData.reading,
        parameterValues: formData.parameterValues,
        remarks: formData.remarks,
      };

      await entriesService.createRecord(recordData);
      onSave();
    } catch (err) {
      console.error("Error saving record:", err);
      setError("Failed to save record. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Operational Log
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Unit: {selectedLab?.name}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
        >
          <X size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <ClipboardList size={12} className="text-indigo-600" />
            {new Date().toLocaleDateString("en-GB")}
          </div>
          <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest">
            {selectedEntry?.name}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4 max-h-80 overflow-y-auto px-1 custom-scrollbar">
          {selectedEntry?.parameters && selectedEntry.parameters.length > 0 ? (
            selectedEntry.parameters.map((param, index) => {
              const paramName = typeof param === "string" ? param : param.name;
              return (
                <div key={index} className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {paramName}
                  </label>
                  <input
                    type="text"
                    value={formData.parameterValues[paramName] || ""}
                    onChange={(e) =>
                      handleInputChange(paramName, e.target.value)
                    }
                    placeholder={`Enter value...`}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
                  />
                </div>
              );
            })
          ) : (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Reading / Observations
              </label>
              <textarea
                rows={3}
                value={formData.reading}
                onChange={(e) =>
                  setFormData({ ...formData, reading: e.target.value })
                }
                placeholder="Enter details..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Remarks
            </label>
            <textarea
              rows={2}
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="Internal notes..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 outline-none text-sm font-bold transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="flex-1 py-3 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all active:scale-95 disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-2 py-3 px-6 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-indigo-100"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" strokeWidth={3} />
            ) : (
              <CheckCircle2 size={16} strokeWidth={3} />
            )}
            {isSaving ? "Uploading..." : "Publish Entry"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataFeedForm;
