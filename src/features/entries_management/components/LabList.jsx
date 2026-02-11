import React from "react";
import {
  ChevronLeft,
  Plus,
  FlaskConical,
  ChevronRight,
  Activity,
} from "lucide-react";

const LabList = ({
  selectedEntry,
  labs = [],
  onBack,
  onAddLab,
  onSelectLab,
}) => {
  // Empty State Handling
  if (labs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <FlaskConical size={48} className="mb-4 opacity-20" />
        <p>No laboratories found. Add one to get started.</p>
        <button
          onClick={onAddLab}
          className="mt-4 text-indigo-600 font-medium hover:underline"
        >
          Add your first Lab
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8 px-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* --- Minimal Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="group mt-1 p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft
              size={24}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              {selectedEntry?.name || "Laboratories"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Monitoring{" "}
              <span className="font-medium text-slate-700">{labs.length}</span>{" "}
              active units
            </p>
          </div>
        </div>

        <button
          onClick={onAddLab}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-gray-600 text-sm font-medium rounded-lg hover:bg-slate-800 transition-all shadow-sm ring-1 ring-slate-900/5"
        >
          <Plus size={16} />
          <span>New Lab</span>
        </button>
      </div>

      {/* --- Clean Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => onSelectLab(lab)}
            className="group flex flex-col text-left bg-white p-6 rounded-xl border border-gray-300 transition-all duration-200"
          >
            {/* Content */}
            <h3 className="text-lg font-semibold text-slate-900">{lab.name}</h3>
            <p className="text-xs text-slate-500 font-mono mt-1 mb-6">
              ID: {lab.code}
            </p>

            {/* Footer: Metrics/Action */}
            <div className="mt-auto w-full pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <Activity size={14} />
                <span className="text-xs">98% Compliance</span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LabList;
