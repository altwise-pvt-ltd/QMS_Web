import React, { useState } from "react";
import { Icons, Icon, css, CYCLE_LABEL, CYCLES } from "./Common";

export function EntryForm({ initial, onSave, onCancel }) {
    const [name, setName] = useState(initial?.name || "");
    const [cycle, setCycle] = useState(initial?.recordingCycle || "daily");
    const [params, setParams] = useState(
        initial?.entryParameters?.length ? initial.entryParameters : [""],
    );
    const [loading, setLoading] = useState(false);

    const valid = name.trim() && params.some((p) => p.trim()) && !loading;

    const handleParamChange = (index, value) => {
        const newParams = [...params];
        newParams[index] = value;
        setParams(newParams);
    };

    const addParamField = () => {
        setParams([...params, ""]);
    };

    const removeParamField = (index) => {
        if (params.length > 1) {
            setParams(params.filter((_, i) => i !== index));
        } else {
            setParams([""]);
        }
    };

    const handleSave = async () => {
        const entryParameters = params
            .map((p) => p.trim())
            .filter(Boolean);

        setLoading(true);
        try {
            await onSave({
                id: initial?.id || Date.now(),
                name: name.trim(),
                recordingCycle: cycle,
                entryParameters,
            });
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {initial ? "Edit Entry" : "Create New Entry"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Configure the entry schema and cycle
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                    <Icon d={Icons.close} size={16} />
                </button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
                <div>
                    <label className={css.label}>Entry Name</label>
                    <input
                        className={css.input}
                        placeholder="e.g. Blood Refrigerator Temperature"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div>
                    <label className={css.label}>Recording Cycle</label>
                    <div className="grid grid-cols-3 gap-2">
                        {CYCLES.map((c) => (
                            <button
                                key={c}
                                onClick={() => setCycle(c)}
                                disabled={loading}
                                className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all active:scale-95 ${cycle === c
                                    ? "border-indigo-600 bg-indigo-600 text-white"
                                    : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {CYCLE_LABEL[c]}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className={css.label + " mb-0"}>Entry Parameters</label>
                        <button
                            type="button"
                            onClick={addParamField}
                            disabled={loading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50"
                        >
                            <Icon d={Icons.plus} size={14} strokeWidth={3} />
                            Add Parameter
                        </button>
                    </div>
                    <div className="space-y-3">
                        {params.map((param, index) => (
                            <div key={index} className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        className={css.input}
                                        placeholder={`Parameter ${index + 1} (e.g. Morning)`}
                                        value={param}
                                        onChange={(e) => handleParamChange(index, e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <button
                                    onClick={() => removeParamField(index)}
                                    disabled={loading || (params.length === 1 && !params[0])}
                                    className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30"
                                    title="Remove parameter"
                                >
                                    <Icon d={Icons.trash} size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3">
                        Each field becomes a separate parameter card for logging
                    </p>
                </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 shrink-0">
                <button
                    onClick={onCancel}
                    className={css.btnSec + " flex-1 justify-center"}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={!valid || loading}
                    className={
                        css.btnPri +
                        ` flex-1 justify-center ${(!valid || loading) ? "opacity-40 cursor-not-allowed" : ""}`
                    }
                >
                    {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    ) : (
                        <Icon d={Icons.check} size={16} />
                    )}
                    {loading ? "Saving..." : (initial ? "Save Changes" : "Create Entry")}
                </button>
            </div>
        </div>
    );
}

export function FillRecordForm({ entry, parameter, existingRecord, onSave, onCancel, TODAY }) {
    const [date, setDate] = useState(existingRecord?.date || TODAY);
    const [time, setTime] = useState(
        existingRecord?.time || new Date().toTimeString().slice(0, 5),
    );
    const [value, setValue] = useState(existingRecord?.value || "");
    const [remarks, setRemarks] = useState(existingRecord?.remarks || "");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await onSave({
                id: existingRecord?.id || Date.now(),
                entryId: entry.id,
                parameterId: parameter.id,
                date,
                time,
                value: value.trim(),
                remarks: remarks.trim(),
            });
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        {existingRecord?.value ? "Edit Record" : "Fill Entry"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {entry.name} ·{" "}
                        <span className="font-semibold text-indigo-600">{parameter.name}</span>
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                    <Icon d={Icons.close} size={16} />
                </button>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={css.label}>Date</label>
                        <input
                            type="date"
                            className={css.input}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label className={css.label}>Time</label>
                        <input
                            type="time"
                            className={css.input}
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>
                <div>
                    <label className={css.label}>Value / Reading</label>
                    <input
                        className={css.input}
                        placeholder="Enter measurement or value..."
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={loading}
                        autoFocus
                    />
                </div>
                <div>
                    <label className={css.label}>Remarks (optional)</label>
                    <textarea
                        className={css.input}
                        rows={3}
                        placeholder="Any notes or observations..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className={css.btnSec + " flex-1 justify-center disabled:opacity-50"}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading || !value.trim()}
                        className={css.btnPri + " flex-1 justify-center disabled:opacity-50"}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        ) : (
                            <Icon d={Icons.check} size={16} />
                        )}
                        {loading ? "Saving..." : "Save Record"}
                    </button>
                </div>
            </div>
        </div>
    );
}
