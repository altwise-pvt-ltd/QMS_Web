import React from "react";
import { Icons, Icon, css, CYCLE_COLOR, getDaysInMonth, formatDate, TODAY } from "./Common";

export function ParameterScreen({ entry, parameter, records, onBack, onFill, onEdit }) {
    const now = new Date();
    const monthDates = getDaysInMonth(now.getFullYear(), now.getMonth());
    const paramRecords = records.filter(
        (r) => r.entryId === entry.id && r.parameter === parameter,
    );

    const rows = monthDates.map((date) => ({
        date,
        record: paramRecords.find((r) => r.date === date) || null,
        isMissed: date <= TODAY && !paramRecords.some((r) => r.date === date),
        isFuture: date > TODAY,
    }));

    const filled = rows.filter((r) => r.record).length;
    const missed = rows.filter((r) => r.isMissed).length;
    const pct = Math.round((filled / monthDates.length) * 100);
    const c = CYCLE_COLOR[entry.recordingCycle] || CYCLE_COLOR.daily;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start lg:items-center gap-4">
                <button onClick={onBack} className={css.btnSec + " py-2 px-3 w-fit"}>
                    <Icon d={Icons.back} size={16} />
                </button>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
                        <Icon d={Icons.entry} size={28} color="#fff" />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                                {parameter}
                            </h1>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate">{entry.name}</p>
                    </div>
                </div>
                <button onClick={() => onFill(null)} className={css.btnPri + " w-full sm:w-auto mt-2 sm:mt-0"}>
                    <Icon d={Icons.plus} size={16} strokeWidth={3} />
                    Fill Entry
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: "Filled", val: filled, color: "#16A34A" },
                    { label: "Missed", val: missed, color: "#DC2626" },
                    { label: "Progress", val: `${pct}%`, color: c.text },
                ].map((s) => (
                    <div key={s.label} className={css.card + " px-4 py-3 text-center"}>
                        <p className="text-2xl font-black" style={{ color: s.color }}>
                            {s.val}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                            {s.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Records List */}
            <div className={css.card + " overflow-hidden"}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                    <Icon d={Icons.list} size={16} color="#6366F1" />
                    <h3 className="font-bold text-slate-700 text-sm">
                        {new Date().toLocaleDateString("en-GB", {
                            month: "long",
                            year: "numeric",
                        })}{" "}
                        — All Days
                    </h3>
                </div>
                <div className="divide-y divide-slate-50 max-h-[480px] overflow-y-auto">
                    {rows.map(({ date, record, isMissed, isFuture }) => (
                        <div
                            key={date}
                            className={`flex items-center justify-between px-5 py-3.5 transition-colors ${isMissed ? "bg-red-50/40 hover:bg-red-50" : "hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full shrink-0 ${record ? "bg-green-500" : isMissed ? "bg-red-400" : "bg-slate-200"
                                        }`}
                                />
                                <div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {formatDate(date)}
                                    </p>
                                    {record && (
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {record.time} {record.remarks && `· ${record.remarks}`}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {record ? (
                                    <>
                                        <span className="font-black text-slate-800 text-sm">
                                            {record.value}
                                        </span>
                                        <button
                                            onClick={() => onEdit(record)}
                                            className="p-1.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                        >
                                            <Icon d={Icons.edit} size={14} />
                                        </button>
                                    </>
                                ) : isMissed ? (
                                    <button
                                        onClick={() => onFill(date)}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                                    >
                                        <Icon d={Icons.warning} size={12} color="currentColor" />
                                        Fill Missed
                                    </button>
                                ) : (
                                    <span className="text-[11px] text-slate-300">Upcoming</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
