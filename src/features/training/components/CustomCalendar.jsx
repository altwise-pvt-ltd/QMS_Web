import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import CalendarComponent from "./Calendar/components/calendar";
import Actions from "./Calendar/components/Action";

const CustomCalendar = ({
  setDate,
  date,
  selectRange,
  setSelectRange,
  trainings = [],
}) => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Logic: Only filter if activeFilter is NOT "all"
  const filteredTrainings = useMemo(() => {
    if (activeFilter === "all") return trainings;
    return trainings.filter((t) => t.status === activeFilter);
  }, [trainings, activeFilter]);

  const filterOptions = [
    { id: "all", label: "All", color: "bg-slate-500" },
    { id: "completed", label: "Completed", color: "bg-emerald-500" },
    { id: "in-progress", label: "In Progress", color: "bg-blue-500" },
    { id: "pending", label: "Pending", color: "bg-amber-500" },
  ];

  return (
    <div className="bg-white p-5 rounded-4xl border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] w-full max-w-lg mx-auto overflow-hidden">
      {/* Risk Matrix Style Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 px-1">
        <h3 className="text-xs font-black text-slate-800 flex items-center gap-2.5 uppercase tracking-widest">
          <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
          Module Timeline
        </h3>

        {/* Integrated Legend Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveFilter(opt.id)}
              className="group flex items-center gap-1.5 focus:outline-none"
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${opt.color} 
                  ${activeFilter === opt.id ? "scale-125 ring-2 ring-offset-2 ring-slate-100" : "opacity-30 group-hover:opacity-60"}`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-wider transition-colors
                ${activeFilter === opt.id ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"}`}
              >
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <CalendarComponent
          setDate={setDate}
          date={date}
          selectRange={selectRange}
          trainings={filteredTrainings}
        />
      </div>

      <Actions
        setDate={setDate}
        date={date}
        selectRange={selectRange}
        setSelectRange={setSelectRange}
        trainings={filteredTrainings}
      />
    </div>
  );
};

CustomCalendar.propTypes = {
  setDate: PropTypes.func,
  date: PropTypes.any,
  selectRange: PropTypes.bool,
  setSelectRange: PropTypes.func,
  trainings: PropTypes.array,
};

export default CustomCalendar;
