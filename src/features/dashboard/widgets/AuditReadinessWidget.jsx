import React from "react";

export const AuditReadinessWidget = () => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex items-end gap-2">
      <span className="text-4xl font-bold text-slate-800">92%</span>
      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full mb-1 font-semibold">
        Ready
      </span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
      <div
        className="bg-indigo-500 h-2 rounded-full"
        style={{ width: "92%" }}
      ></div>
    </div>
    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span className="text-slate-600">Docs: 100%</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span className="text-slate-600">Training: 98%</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
        <span className="text-slate-600">CAPA: 85%</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span className="text-slate-600">Records: 95%</span>
      </div>
    </div>
  </div>
);

export default AuditReadinessWidget;
