import React from "react";
import {
  Calendar as CalendarIcon,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "../qi_data";

const QIFormSidebar = ({
  selectedMonth,
  setSelectedMonth,
  selectedIndicators,
  indicators = [],
  toggleIndicator,
  onSelectAll,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className="space-y-4">
      {/* Sidebar Header with Toggle */}
      <div className="flex justify-end pr-2">
        <button
          onClick={onToggleCollapse}
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 no-print"
        >
          <ChevronRight
            size={16}
            strokeWidth={3}
            className={`transition-all duration-500 ease-in-out ${isCollapsed ? "" : "rotate-180"}`}
          />
          {isCollapsed ? "Show Options" : "Hide Options"}
        </button>
      </div>

      <div
        className={`space-y-6 transition-all duration-300 ${isCollapsed ? "opacity-0 invisible h-0 scale-95" : "opacity-100 visible h-auto scale-100"}`}
      >
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
            {CATEGORIES.map((category) => (
              <div key={category} className="mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                  {category}
                </p>
                {indicators
                  .filter((i) => i.category === category)
                  .map((indicator) => (
                    <button
                      key={indicator.id}
                      onClick={() => toggleIndicator(indicator.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${selectedIndicators.includes(indicator.id)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                      {selectedIndicators.includes(indicator.id) ? (
                        <CheckSquare size={16} className="shrink-0" />
                      ) : (
                        <Square size={16} className="shrink-0" />
                      )}
                      <span className="text-xs font-medium truncate">
                        {indicator.name}
                      </span>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QIFormSidebar;
