import React, { useState } from "react";
import Calendar from "react-calendar";
import { Calendar as CalendarIcon, ChevronDown, X, Filter } from "lucide-react";
import { format } from "date-fns";
import PropTypes from "prop-types";

/**
 * RiskDateFilter Component
 * Provides month-wise and custom date range filtering.
 */
const RiskDateFilter = ({
  dateRange,
  setDateRange,
  selectedMonth,
  setSelectedMonth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState("month"); // 'month' or 'custom'

  const months = [
    { label: "January 2026", value: "2026-01" },
    { label: "December 2025", value: "2025-12" },
    { label: "November 2025", value: "2025-11" },
  ];

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    setDateRange({ start: null, end: null });
    setIsOpen(false);
  };

  const handleDateChange = (value) => {
    if (Array.isArray(value)) {
      setDateRange({ start: value[0], end: value[1] });
      setSelectedMonth("");
      setIsOpen(false);
    }
  };

  const clearFilters = () => {
    setSelectedMonth("");
    setDateRange({ start: null, end: null });
    setIsOpen(false);
  };

  const getActiveFilterLabel = () => {
    if (dateRange.start && dateRange.end) {
      return `${format(dateRange.start, "MMM d")} - ${format(dateRange.end, "MMM d")}`;
    }
    if (selectedMonth) {
      const activeMonth = months.find((m) => m.value === selectedMonth);
      return activeMonth ? activeMonth.label : selectedMonth;
    }
    return "All Dates";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 bg-transparent border border-slate-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all min-w-[160px]"
      >
        <CalendarIcon className="w-4 h-4 text-indigo-600 shrink-0" />
        <span className="text-sm font-semibold text-slate-700 flex-1 text-left truncate">
          {getActiveFilterLabel()}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-3 h-3 text-indigo-600" />
                Filter by Date
              </h4>
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold text-red-500 uppercase hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg mb-4">
              <button
                onClick={() => setFilterType("month")}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
                  filterType === "month"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                By Month
              </button>
              <button
                onClick={() => setFilterType("custom")}
                className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${
                  filterType === "custom"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Custom Range
              </button>
            </div>

            {filterType === "month" ? (
              <div className="grid grid-cols-1 gap-1">
                {months.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => handleMonthChange(m.value)}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedMonth === m.value
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="scale-90 origin-top -mx-4">
                <Calendar
                  onChange={handleDateChange}
                  selectRange={true}
                  className="custom-calendar"
                  value={
                    dateRange.start && dateRange.end
                      ? [dateRange.start, dateRange.end]
                      : null
                  }
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

RiskDateFilter.propTypes = {
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
  }).isRequired,
  setDateRange: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  setSelectedMonth: PropTypes.func.isRequired,
};

export default RiskDateFilter;
