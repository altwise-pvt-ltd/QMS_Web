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
      <div className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl w-full text-center shadow-sm relative group">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
          <CalendarDays size={12} />
          {selectRange ? "Selected Range" : "Selected Date"}
        </div>
        <p className="text-base font-bold text-slate-800">
          {date ? (
            Array.isArray(date) && selectRange ? (
              <>
                {date[0]?.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                }) || "..."}
                <span className="mx-2 text-indigo-400">→</span>
                {date[1]?.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                }) || "..."}
              </>
            ) : Array.isArray(date) ? (
              date[0]?.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              }) || "..."
            ) : (
              date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              }) || "..."
            )
          ) : (
            "No date selected"
          )}
        </p>

        {!selectRange && trainingCount > 0 && (
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              {trainingCount} {trainingCount === 1 ? "Training" : "Trainings"}{" "}
              Scheduled
            </span>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={`
          relative w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all
          ${
            selectRange
              ? "bg-indigo-600 text-white border-2 border-indigo-700 shadow-md shadow-indigo-100"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <ArrowRightLeft
            size={14}
            className={selectRange ? "text-white" : "text-slate-400"}
          />
          {selectRange ? "Single Date Mode" : "Select Range Mode"}
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
