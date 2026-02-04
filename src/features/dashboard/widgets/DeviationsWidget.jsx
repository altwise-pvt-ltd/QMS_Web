import React from "react";
import { TrendingUp } from "lucide-react";

export const DeviationsWidget = () => (
  <div className="@container flex flex-col h-full justify-between">
    <div className="flex items-end gap-2">
      <span className="text-3xl @xs:text-4xl font-bold text-slate-800">7</span>
      <span className="text-sm text-emerald-500 mb-1 flex items-center">
        <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> -3
      </span>
    </div>
    <div className="space-y-2 mt-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Open</span>
        <span className="text-sm font-semibold text-amber-600">4</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Under Review</span>
        <span className="text-sm font-semibold text-blue-600">2</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">Closed This Month</span>
        <span className="text-sm font-semibold text-emerald-600">1</span>
      </div>
    </div>
  </div>
);

export default DeviationsWidget;
