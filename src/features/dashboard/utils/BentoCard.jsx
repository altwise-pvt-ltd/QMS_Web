import React from "react";

const BentoCard = ({ children, className = "", title, icon: Icon, action }) => {
  const isInverted = className.includes("text-white");

  return (
    <div
      className={`
        group relative bg-white p-6 rounded-3xl
        border border-slate-200/80
        shadow-sm shadow-slate-100/50
        hover:shadow-xl hover:shadow-indigo-100/40
        hover:-translate-y-0.5 hover:border-indigo-200/60
        transition-all duration-300 ease-out
        flex flex-col
        ${className}
      `}
    >
      {/* Subtle top-edge accent line — visible on hover */}
      <div
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* Header */}
      {(Icon || title || action) && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div
                className={`
                  p-1.5 rounded-lg transition-colors duration-300
                  ${isInverted ? "bg-white/10" : "bg-indigo-50 group-hover:bg-indigo-100/70"}
                `}
              >
                <Icon
                  className={`w-4 h-4 ${isInverted ? "text-inherit" : "text-indigo-500"}`}
                />
              </div>
            )}
            {title && (
              <h3
                className={`font-semibold text-sm tracking-tight ${isInverted ? "text-inherit" : "text-slate-800"}`}
              >
                {title}
              </h3>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">{children}</div>
    </div>
  );
};

export default BentoCard;
