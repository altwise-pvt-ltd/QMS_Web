import React, { useState } from "react";

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
const SEVERITY_SHORT = ["S1", "S2", "S3", "S4", "S5"];
const LIKELIHOOD_SHORT = ["L1", "L2", "L3", "L4", "L5"];

// Score = (sIdx+1) * (lIdx+1)
const getScore = (sIdx, lIdx) => (sIdx + 1) * (lIdx + 1);

const getRiskLevel = (score) => {
  if (score >= 15) return "high";
  if (score >= 6) return "medium";
  return "low";
};

// Rich color config per risk level
const CELL_STYLES = {
  low: {
    base: "bg-emerald-50 border border-emerald-200",
    hover: "hover:bg-emerald-100 hover:border-emerald-300",
    selected:
      "bg-emerald-100 ring-2 ring-emerald-500 ring-offset-1 border-emerald-400",
    score: "text-emerald-700",
    badge: "bg-emerald-500",
    label: "Low",
  },
  medium: {
    base: "bg-amber-50 border border-amber-200",
    hover: "hover:bg-amber-100 hover:border-amber-300",
    selected:
      "bg-amber-100 ring-2 ring-amber-500 ring-offset-1 border-amber-400",
    score: "text-amber-700",
    badge: "bg-amber-500",
    label: "Medium",
  },
  high: {
    base: "bg-rose-50 border border-rose-200",
    hover: "hover:bg-rose-100 hover:border-rose-300",
    selected: "bg-rose-100 ring-2 ring-rose-500 ring-offset-1 border-rose-400",
    score: "text-rose-700",
    badge: "bg-rose-500",
    label: "High",
  },
};

const Tooltip = ({ children, content, className = "" }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-800 text-gray-600 text-[11px] rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
        </div>
      )}
    </div>
  );
};

const RiskMatrix = ({ matrix, selectedCell, onCellClick }) => {
  // Legend items
  const legend = [
    { level: "low", label: "Low", range: "Score 1–5" },
    { level: "medium", label: "Medium", range: "Score 6–14" },
    { level: "high", label: "High", range: "Score 15–25" },
  ];

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tight">
          <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
          5×5 Risk Matrix
        </h3>
        {/* Legend */}
        <div className="flex items-center gap-3">
          {legend.map(({ level, label, range }) => (
            <div key={level} className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-sm ${CELL_STYLES[level].badge}`}
              />
              <span className="text-[11px] font-medium text-slate-500">
                {label}
                <span className="hidden sm:inline text-slate-400">
                  {" "}
                  · {range}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Matrix wrapper — scrollable on tiny screens */}
      <div className="overflow-x-auto">
        <div className="min-w-[420px]">
          {/* Likelihood header row */}
          <div className="flex items-end mb-1.5 pl-24 gap-1">
            {LIKELIHOOD_LABELS.map((label, i) => (
              <div key={i} className="flex-1 text-center">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">
                  {label}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  ({LIKELIHOOD_SHORT[i]})
                </div>
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="flex gap-1">
            {/* Severity Y-axis labels */}
            <div className="flex flex-col gap-1 shrink-0 w-24">
              {SEVERITY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="h-12 flex flex-col items-end justify-center pr-2 text-right"
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">
                    {label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({SEVERITY_SHORT[i]})
                  </span>
                </div>
              ))}
            </div>

            {/* Cells */}
            <div className="flex-1 flex flex-col gap-1">
              {matrix.map((row, sIdx) => (
                <div key={sIdx} className="flex gap-1">
                  {row.map((cell, lIdx) => {
                    const score = getScore(sIdx, lIdx);
                    const level = getRiskLevel(score);
                    const style = CELL_STYLES[level];
                    const isSelected =
                      selectedCell &&
                      selectedCell.severity === cell.severity &&
                      selectedCell.likelihood === cell.likelihood;
                    const hasRisks = cell.count > 0;

                    return (
                      <Tooltip
                        key={lIdx}
                        className="flex-1"
                        content={`${SEVERITY_LABELS[sIdx]} × ${LIKELIHOOD_LABELS[lIdx]} · Score ${score} · ${style.label} Risk${hasRisks ? ` · ${cell.count} item${cell.count !== 1 ? "s" : ""}` : ""}`}
                      >
                        <button
                          onClick={() =>
                            onCellClick(cell.severity, cell.likelihood)
                          }
                          className={`
                            relative flex-1 w-full h-12 rounded-lg flex flex-col items-center justify-center
                            transition-all duration-150 cursor-pointer select-none
                            ${isSelected ? style.selected : `${style.base} ${style.hover}`}
                          `}
                          style={{ minWidth: 0 }}
                        >
                          {/* Score (tiny, top-right corner) */}
                          <span
                            className={`absolute top-1 right-1.5 text-[9px] font-bold opacity-50 ${style.score}`}
                          >
                            {score}
                          </span>

                          {/* Count */}
                          {hasRisks ? (
                            <span
                              className={`text-base font-bold leading-none ${style.score}`}
                            >
                              {cell.count}
                            </span>
                          ) : (
                            <span className="text-slate-300 text-sm font-bold leading-none">
                              —
                            </span>
                          )}
                        </button>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* X-axis label */}
          <div className="text-center mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-24">
            Likelihood →
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMatrix;

