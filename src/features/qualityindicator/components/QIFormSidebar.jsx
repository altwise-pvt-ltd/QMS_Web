import React from "react";
import { Calendar as CalendarIcon, Filter, CheckSquare, Square } from "lucide-react";
import { QUALITY_INDICATORS, CATEGORIES } from "../qi_data";

const QIFormSidebar = ({
    selectedMonth,
    setSelectedMonth,
    selectedIndicators,
    toggleIndicator,
    onSelectAll
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CalendarIcon size={16} className="text-indigo-500" />
                    Report Period
                </h3>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                    <option>NOV 2025</option>
                    <option>DEC 2025</option>
                    <option>JAN 2026</option>
                </select>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <Filter size={16} className="text-indigo-500" />
                        Select Indicators
                    </h3>
                    <button
                        onClick={onSelectAll}
                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                    >
                        Select All
                    </button>
                </div>
                <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {CATEGORIES.map(category => (
                        <div key={category} className="mb-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">{category}</p>
                            {QUALITY_INDICATORS.filter(i => i.category === category).map(indicator => (
                                <button
                                    key={indicator.id}
                                    onClick={() => toggleIndicator(indicator.id)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${selectedIndicators.includes(indicator.id)
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-slate-500 hover:bg-slate-50"
                                        }`}
                                >
                                    {selectedIndicators.includes(indicator.id)
                                        ? <CheckSquare size={16} className="shrink-0" />
                                        : <Square size={16} className="shrink-0" />
                                    }
                                    <span className="text-xs font-medium truncate">{indicator.name}</span>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QIFormSidebar;
