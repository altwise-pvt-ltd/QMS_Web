import React from "react";
import { TrendingUp } from "lucide-react";

export const TrainingComplianceWidget = () => (
  <div className="flex flex-col h-full justify-between">
    <div className="flex items-end gap-2">
      <span className="text-4xl font-bold text-slate-800">98%</span>
      <span className="text-sm text-emerald-500 mb-1 flex items-center">
        <TrendingUp className="w-3 h-3 mr-1" /> +2.4%
      </span>
    </div>
    <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
      <div
        className="bg-emerald-500 h-2 rounded-full"
        style={{ width: "98%" }}
      ></div>
    </div>
    <p className="text-xs text-slate-400 mt-2">2 employees pending</p>
  </div>
);

export default TrainingComplianceWidget;
