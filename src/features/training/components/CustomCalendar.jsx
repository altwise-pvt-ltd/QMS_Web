import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import CalendarComponent from "./Calendar/components/calendar";
import Actions from "./Calendar/components/Action";
import Title from "./Calendar/components/title";

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
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/50 w-full max-w-lg mx-auto">
      <Title title="Training Schedule" />

      {/* Filter Bar */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveFilter(opt.id)}
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
              activeFilter === opt.id
                ? `${opt.color} text-gray-800 border-transparent shadow-sm`
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
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
