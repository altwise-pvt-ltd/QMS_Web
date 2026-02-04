import React from "react";
import { FileText, AlertCircle, CheckCircle2, Clock } from "lucide-react";

const DocumentStatusWidget = () => {
  return (
    <div className="@container flex flex-col h-full justify-between">
      {/* Top Stats Row */}
      <div className="flex justify-between items-start mb-2">
        <div className="text-center flex-1">
          <span className="block text-xl @xs:text-2xl font-bold text-slate-800">142</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Total
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-100 mx-1 @xs:mx-2"></div>

        <div className="text-center flex-1">
          <span className="block text-xl @xs:text-2xl font-bold text-amber-500">4</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Review
          </span>
        </div>

        <div className="w-px h-8 bg-slate-100 mx-1 @xs:mx-2"></div>

        <div className="text-center flex-1">
          <span className="block text-xl @xs:text-2xl font-bold text-rose-500">1</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Expired
          </span>
        </div>
      </div>

      {/* Mini List of "To-Do" Documents */}
      <div className="space-y-2 mt-1">
        <div className="flex items-center justify-between text-xs p-2 bg-amber-50 rounded-lg border border-amber-100">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium text-slate-700">SOP-LAB-04</span>
          </div>
          <span className="text-amber-600 font-semibold">Due in 5d</span>
        </div>

        <div className="flex items-center justify-between text-xs p-2 bg-rose-50 rounded-lg border border-rose-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-medium text-slate-700">POL-HR-01</span>
          </div>
          <span className="text-rose-600 font-semibold">Expired</span>
        </div>
      </div>
    </div>
  );
};

// VITAL CHANGE: Use 'export default' so your import works without curly braces
export default DocumentStatusWidget;
