import React from "react";
import PropTypes from "prop-types";
import CalendarComponent from "./Calendar/components/calendar";
import Actions from "./Calendar/components/Action";
import Title from "./Calendar/components/title";

const CustomCalendar = (props) => {
  const { setDate, date, selectRange, setSelectRange, trainings } = props;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full">
      <Title title="Training Calendar" />

      {/* 2. Calendar */}
      <div className="my-4">
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
