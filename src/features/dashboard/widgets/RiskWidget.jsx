import React from "react";

export const RiskWidget = () => (
  <div className="@container flex flex-col h-full justify-between">
    <div className="grid grid-cols-3 gap-1 @xs:gap-2 mb-3">
      <div className="text-center p-2 bg-emerald-50 rounded-lg">
        <div className="text-xl @xs:text-2xl font-bold text-emerald-600">12</div>
        <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1">
          Low
        </div>
      </div>
      <div className="text-center p-2 bg-amber-50 rounded-lg">
        <div className="text-xl @xs:text-2xl font-bold text-amber-600">5</div>
        <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1">
          Medium
        </div>
      </div>
      <div className="text-center p-2 bg-rose-50 rounded-lg">
        <div className="text-xl @xs:text-2xl font-bold text-rose-600">1</div>
        <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1">
          High
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
      <span className="text-xs text-slate-600 font-medium">
        Overall Risk Level
      </span>
      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
        Low
      </span>
    </div>
  </div>
);

export default RiskWidget;
