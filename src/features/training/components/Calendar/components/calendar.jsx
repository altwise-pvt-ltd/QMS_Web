import React from "react";
import PropTypes from "prop-types";
import Calendar from "react-calendar";

// Note: Do NOT import 'react-calendar/dist/Calendar.css'.
// We are replacing it entirely with the CSS below.

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
        return (
          <div className="flex justify-center gap-1 mt-1">
            {dayTrainings.slice(0, 3).map((t, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  t.status === "completed"
                    ? "bg-emerald-500"
                    : t.status === "in-progress"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                }`}
              />
            ))}
            {dayTrainings.length > 3 && (
              <div className="w-1 h-1 rounded-full bg-slate-300" />
            )}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-slate-200 max-w-md mx-auto">
      <Calendar
        onChange={setDate}
        value={date}
        selectRange={selectRange}
        className="custom-calendar"
        tileContent={getTileContent}
      />
    </div>
  );
};

CalendarComponent.propTypes = {
  setDate: PropTypes.func,
  date: PropTypes.any,
  selectRange: PropTypes.bool,
  trainings: PropTypes.array,
};

export default CalendarComponent;
