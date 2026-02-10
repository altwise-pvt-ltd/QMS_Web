import React from "react";

export const HealthScoreWidget = () => (
  <div className="@container flex flex-col items-center justify-center h-full w-full">
    <div className="relative w-full max-w-40 max-h-40 aspect-square flex items-center justify-center mx-auto">
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor" 
          strokeWidth="12"
          fill="transparent"
          className="text-slate-100"
        />
        {/* Progress Circle (94%) */}
        <circle
          cx="96"
          cy="96"
          r="88"
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 88}
          strokeDashoffset={2 * Math.PI * 88 * (1 - 0.94)}
          className="text-emerald-500"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl @xs:text-5xl font-bold text-slate-800">94</span>
        <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mt-2">
          Excellent
        </span>
      </div>  
    </div>
    <div className="grid grid-cols-3 gap-2 @sm:gap-4 w-full mt-6 text-center">
      <div>
        <div className="text-xs text-slate-400 uppercase font-bold">Risk</div>
        <div className="text-lg font-semibold text-slate-700">Low</div>
      </div>
      <div className="border-x border-slate-100">
        <div className="text-xs text-slate-400 uppercase font-bold">Docs</div>
        <div className="text-lg font-semibold text-slate-700">100%</div>
      </div>
      <div>
        <div className="text-xs text-slate-400 uppercase font-bold">CAPA</div>
        <div className="text-lg font-semibold text-slate-700">2 Open</div>
      </div>
    </div>
  </div>
);

export default HealthScoreWidget;
