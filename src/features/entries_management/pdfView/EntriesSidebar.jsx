import React from "react";
import {
  Calendar as CalendarIcon,
  Filter,
  CheckSquare,
  Square,
  ChevronRight,
} from "lucide-react";

const EntriesSidebar = ({
  selectedMonth,
  setSelectedMonth,
  selectedIndicators,
  indicators = [],
  categories = [],
  toggleIndicator,
  onSelectAll,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className={`space-y-6 transition-all duration-300 ${isCollapsed ? "opacity-0 invisible h-0 scale-95" : "opacity-100 visible h-auto scale-100"}`}>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CalendarIcon size={16} className="text-indigo-500" />
            Report Period
          </h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            {/* Generate options for last 12 months */}
            {Array.from({ length: 12 }, (_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - i);
              const label = d.toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase();
              return (
                <option key={label} value={label}>
                  {label}
                </option>
              );
            })}
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
            {categories.map((categoryObj) => {
              const categoryName =
                categoryObj.qualityCategoryName ||
                categoryObj.qiCategory ||
                categoryObj.name;
              const catId = categoryObj.qualityIndicatorCategoryId || categoryName;
              const catKey = categoryObj.qiCategory;

              const categoryIndicators = indicators.filter((i) => {
                const indicatorCatId = String(
                  i.qualityIndicatorCategoryId || "",
                );
                return (
                  indicatorCatId === String(catId) ||
                  indicatorCatId === String(catKey) ||
                  String(i.categoryId) === String(catId)
                );
              });

              if (categoryIndicators.length === 0) return null;

              return (
                <div key={catId} className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                    {categoryName}
                  </p>
                  {categoryIndicators.map((indicator) => {
                    const id = indicator.qualityIndicatorSubCategoryId || indicator.id;
                    const isSelected = selectedIndicators.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() => toggleIndicator(id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare size={16} className="shrink-0" />
                        ) : (
                          <Square size={16} className="shrink-0" />
                        )}
                        <span className="text-xs font-medium truncate">
                          {indicator.qualitySubCategoryName || indicator.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
    </div>
  );
};

export default EntriesSidebar;
