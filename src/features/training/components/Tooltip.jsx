import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Reusable Tooltip component for hover states
 */
const Tooltip = ({ children, content, className = "" }) => {
  const [show, setShow] = useState(false);

  if (!content) return <>{children}</>;

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-100 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-900/95 backdrop-blur text-white text-[11px] font-medium rounded-xl shadow-2xl whitespace-nowrap pointer-events-none scale-100 animate-in zoom-in-95 fade-in duration-200 origin-bottom">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/95" />
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node,
  className: PropTypes.string,
};

export default Tooltip;
