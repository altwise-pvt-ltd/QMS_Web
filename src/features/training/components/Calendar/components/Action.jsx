import React from "react";
import PropTypes from "prop-types";
import { CalendarDays, ArrowRightLeft } from "lucide-react"; // Optional icons

const Actions = ({
  setDate,
  date,
  selectRange,
  setSelectRange,
  trainings = [],
}) => {
  const getTrainingCount = (targetDate) => {
    if (!targetDate) return 0;
    return trainings.filter((t) => {
      const tDate = new Date(t.dueDate);
      return (
        tDate.getDate() === targetDate.getDate() &&
        tDate.getMonth() === targetDate.getMonth() &&
        tDate.getFullYear() === targetDate.getFullYear()
      );
    }).length;
  };

  const handleToggle = () => {
    setSelectRange(!selectRange);
    if (selectRange) {
      setDate(new Date());
    }
  };

  const trainingCount = !selectRange && date ? getTrainingCount(date) : 0;

  return (
    <div className="flex flex-col items-center w-full mt-4 space-y-3">
      {/* Date Display Area */}
      <div className="bg-slate-50/50 border border-slate-100/80 text-slate-600 px-5 py-4 rounded-3xl w-full text-center relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
          <CalendarDays size={12} className="text-indigo-400" />
          {selectRange ? "Selected Window" : "Snapshot"}
        </div>
        <p className="text-lg font-extrabold text-slate-900 tracking-tight">
          {date ? (
            Array.isArray(date) && selectRange ? (
              <div className="flex items-center justify-center gap-3">
                <span className="text-slate-900">
                  {date[0]?.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  }) || "..."}
                </span>
                <span className="w-4 h-px bg-slate-200" />
                <span className="text-slate-900">
                  {date[1]?.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  }) || "..."}
                </span>
              </div>
            ) : Array.isArray(date) ? (
              date[0]?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) || "..."
            ) : (
              date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) || "..."
            )
          ) : (
            "No selection"
          )}
        </p>

        {!selectRange && trainingCount > 0 && (
          <div className="mt-2.5 flex items-center justify-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">
              {trainingCount} {trainingCount === 1 ? "Training" : "Trainings"}{" "}
              Expected
            </span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`
          relative w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98]
          ${
            selectRange
              ? "bg-slate-900 text-white shadow-xl shadow-slate-200 border-transparent"
              : "bg-white text-slate-400 border border-slate-100 hover:border-slate-200 hover:text-slate-600"
          }
        `}
      >
        <div className="flex items-center justify-center gap-3">
          <ArrowRightLeft
            size={14}
            className={selectRange ? "text-indigo-400" : "text-slate-300"}
          />
          {selectRange ? "Switch to Individual" : "Toggle Range Analysis"}
        </div>
      </button>
    </div>
  );
};

Actions.propTypes = {
  setDate: PropTypes.func.isRequired,
  date: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.array]),
  selectRange: PropTypes.bool.isRequired,
  setSelectRange: PropTypes.func.isRequired,
  trainings: PropTypes.array,
};

export default Actions;
