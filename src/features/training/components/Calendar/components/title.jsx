import React from "react";
import PropTypes from "prop-types";

const Title = ({ title }) => {
  return (
    <div className="mb-4 text-center">
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">
        {title}
      </h2>
    </div>
  );
};

Title.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Title;
