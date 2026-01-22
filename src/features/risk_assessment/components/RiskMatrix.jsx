import React from "react";

const SEVERITY_LABELS = [
  "Insignificant",
  "Minor",
  "Moderate",
  "Major",
  "Catastrophic",
];
const LIKELIHOOD_LABELS = [
  "Rare",
  "Unlikely",
  "Possible",
  "Likely",
  "Almost Certain",
];

/**
 * Standard colors for Risk Matrix (5x5)
 * [Severity][Likelihood]
 */
const MATRIX_COLORS = [
  // Likelihood: Rare, Unlikely, Possible, Likely, Almost Certain
  [
    "bg-emerald-100",
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-amber-100",
  ], // Insignificant
  [
    "bg-emerald-100",
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-amber-100",
    "bg-amber-200",
  ], // Minor
  [
    "bg-emerald-200",
    "bg-emerald-300",
    "bg-amber-100",
    "bg-amber-200",
    "bg-rose-100",
  ], // Moderate
  [
    "bg-emerald-300",
    "bg-amber-100",
    "bg-amber-200",
    "bg-rose-100",
    "bg-rose-200",
  ], // Major
  ["bg-amber-100", "bg-amber-200", "bg-rose-100", "bg-rose-200", "bg-rose-300"], // Catastrophic
];

const RiskMatrix = ({ matrix, selectedCell, onCellClick }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all duration-300">
      <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2 uppercase tracking-tight">
        <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
        5×5 Risk Matrix
      </h3>

      <div className="flex flex-col">
        {/* Top Header: Likelihood */}
        <div className="flex">
          <div className="w-24 shrink-0"></div>
          <div className="flex-1 grid grid-cols-5 gap-1 mb-2">
            {LIKELIHOOD_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wider"
              >
                {label} (L{i + 1})
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {/* Left Y-Axis Header: Severity */}
          <div className="flex flex-col justify-between py-2 w-24 shrink-0">
            {SEVERITY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[10px] font-bold text-slate-500 text-right uppercase tracking-wider h-14 flex items-center justify-end pr-2 leading-tight"
              >
                {label} (S{i + 1})
              </div>
            ))}
          </div>

          {/* Matrix Grid */}
          <div className="flex-1 grid grid-rows-5 gap-1">
            {matrix.map((row, sIdx) => (
              <div key={sIdx} className="grid grid-cols-5 gap-1 h-14">
                {row.map((cell, lIdx) => {
                  const isSelected =
                    selectedCell &&
                    selectedCell.severity === cell.severity &&
                    selectedCell.likelihood === cell.likelihood;
                  return (
                    <button
                      key={lIdx}
                      onClick={() =>
                        onCellClick(cell.severity, cell.likelihood)
                      }
                      className={`
                        ${MATRIX_COLORS[sIdx][lIdx]} 
                        rounded-md flex items-center justify-center 
                        transition-all duration-200 
                        ${isSelected ? "ring-4 ring-indigo-500 ring-offset-2 scale-105 z-10" : "hover:brightness-95 hover:scale-[1.02]"}
                      `}
                    >
                      <span
                        className={`text-lg font-bold ${cell.count > 0 ? "text-slate-900" : "text-slate-400 opacity-30"}`}
                      >
                        {cell.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* X-Axis Label */}
        <div className="text-center mt-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
          Likelihood →
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;
