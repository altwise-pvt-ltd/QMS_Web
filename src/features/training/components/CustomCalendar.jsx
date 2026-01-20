import React from "react";
import PropTypes from "prop-types";
import CalendarComponent from "./Calendar/components/calendar";
import Actions from "./Calendar/components/Action";
import Title from "./Calendar/components/title";

const CustomCalendar = (props) => {
  const { setDate, date, selectRange, setSelectRange, trainings } = props;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Card Container */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-indigo-100 max-w-lg w-full border border-slate-100">
        {/* 1. Title */}
        <Title title="Schedule" />

        {/* 2. Calendar */}
        <div className="my-6">
          <CalendarComponent
            setDate={setDate}
            date={date}
            selectRange={selectRange}
            trainings={trainings}
          />
        </div>

        {/* 3. Actions (Date display & Toggle) */}
        <Actions
          setDate={setDate}
          date={date}
          selectRange={selectRange}
          setSelectRange={setSelectRange}
          trainings={trainings}
        />
      </div>
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
