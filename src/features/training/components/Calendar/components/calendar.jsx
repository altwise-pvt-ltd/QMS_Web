import React from "react";
import Calendar from "react-calendar";
import Tooltip from "../../Tooltip";
import "./calendar-style.css";

const CalendarComponent = ({ setDate, date, selectRange, trainings = [] }) => {
  const getTileContent = ({ date: tileDate, view }) => {
    if (view === "month") {
      const dayTrainings = trainings.filter((t) => {
        const tDate = new Date(t.dueDate);
        return (
          tDate.getDate() === tileDate.getDate() &&
          tDate.getMonth() === tileDate.getMonth() &&
          tDate.getFullYear() === tileDate.getFullYear()
        );
      });

      if (dayTrainings.length > 0) {
        const tooltipContent = (
          <div className="flex flex-col gap-1.5 p-1">
            {dayTrainings.map((t, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    t.status === "completed"
                      ? "bg-emerald-400"
                      : t.status === "in-progress"
                        ? "bg-blue-400"
                        : "bg-amber-400"
                  }`}
                />
                <span className="text-[10px] font-bold text-slate-200">
                  {t.title}
                </span>
              </div>
            ))}
          </div>
        );

        return (
          <Tooltip content={tooltipContent}>
            <div className="flex justify-center gap-1 mt-1.5">
              {dayTrainings.slice(0, 4).map((t, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ring-1 ring-white ${
                    t.status === "completed"
                      ? "bg-emerald-500"
                      : t.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                  }`}
                />
              ))}
            </div>
          </Tooltip>
        );
      }
    }
    return <div className="h-3" />; // Maintain spacing
  };

  return (
    <div className="calendar-wrapper ring-1 ring-slate-100 rounded-2xl overflow-hidden shadow-inner bg-slate-50/30 p-2">
      <Calendar
        onChange={setDate}
        value={date}
        selectRange={selectRange}
        tileContent={getTileContent}
        prev2Label={null}
        next2Label={null}
        className="professional-calendar"
      />
    </div>
  );
};

export default CalendarComponent;
