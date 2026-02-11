import React from "react";
import { ChevronLeft, Download, Printer } from "lucide-react";

const QIFormHeader = ({ onBack, onDownload, onPrint, title }) => {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm sticky top-4 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="group p-2.5 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 active:scale-90 text-slate-400 hover:text-indigo-600 flex items-center justify-center"
        >
          <ChevronLeft
            size={22}
            strokeWidth={3}
            className="group-hover:-translate-x-0.5 transition-transform duration-300"
          />
        </button>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
        >
          <Printer size={18} />
          Print
        </button>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-gray-600 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
        >
          <Download size={18} />
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default QIFormHeader;
