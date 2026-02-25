import React from "react";
import Calendar from "react-calendar";
import "./calendar-style.css"; // See CSS below

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
