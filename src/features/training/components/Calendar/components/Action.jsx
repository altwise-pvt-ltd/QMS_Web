import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="flex flex-col items-center w-full mt-6 space-y-4"
    >
      {/* Date Display Area */}
      <div className="bg-slate-50 border border-slate-100 text-slate-600 px-5 py-3 rounded-xl w-full max-w-[80vw] text-center shadow-sm relative group">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-400 mb-1">
          <CalendarDays size={14} />
          {selectRange ? "Selected Range" : "Selected Date"}
        </div>
        <p className="text-lg font-bold text-slate-800">
          {date ? (
            Array.isArray(date) && selectRange ? (
              <>
                {date[0]?.toDateString() || "..."}
                <span className="mx-2 text-indigo-400">→</span>
                {date[1]?.toDateString() || "..."}
              </>
            ) : Array.isArray(date) ? (
              date[0]?.toDateString() || "..."
            ) : (
              date.toDateString()
            )
          ) : (
            "No date selected"
          )}
        </p>

        {!selectRange && trainingCount > 0 && (
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">
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
          relative group overflow-hidden w-48 h-16 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg hover:-translate-y-1
          ${
            selectRange
              ? "bg-indigo-600 text-gray-600 shadow-indigo-200"
              : "bg-white text-slate-600 border-2 border-slate-100 hover:border-indigo-100 hover:text-indigo-600"
          }
        `}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <ArrowRightLeft
            size={16}
            className={
              selectRange
                ? "text-indigo-200"
                : "text-slate-400 group-hover:text-indigo-500"
            }
          />
          {selectRange ? "Switch to Single" : "Select Range"}
        </span>
      </button>
    </motion.div>
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
