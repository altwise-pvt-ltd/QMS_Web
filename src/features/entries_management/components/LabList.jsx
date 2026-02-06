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
  // Empty State
  if (labs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <FlaskConical size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-medium">
          No laboratories found. Add one to get started.
        </p>
        <button
          onClick={onAddLab}
          className="mt-6 px-6 py-2.5
                     bg-indigo-600 text-white
                     font-semibold text-sm
                     rounded-xl
                     shadow-md shadow-indigo-200
                     hover:bg-indigo-700
                     transition-all
                     active:scale-95"
        >
          Add your first Lab
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-white border border-slate-200 rounded-xl
                       text-slate-400 hover:text-indigo-600
                       hover:border-indigo-200
                       transition-colors shadow-sm"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {selectedEntry?.name || "Laboratories"}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Monitoring{" "}
              <span className="font-semibold text-slate-700">
                {labs.length}
              </span>{" "}
              active units
            </p>
          </div>
        </div>

        {/* SAME button style as earlier screens */}
        <button
          onClick={onAddLab}
          className="flex items-center justify-center gap-2
                     px-6 py-2.5
                     bg-white
                     border border-slate-200
                     text-slate-700
                     rounded-xl
                     font-semibold text-sm
                     shadow-sm
                     hover:bg-slate-100
                     transition-all
                     active:scale-95"
        >
          <Plus size={16} />
          New Lab
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {labs.map((lab) => (
          <button
            key={lab.id}
            onClick={() => onSelectLab(lab)}
            className="group flex flex-col text-left
                       bg-white
                       p-6
                       rounded-xl
                       border border-slate-200
                       hover:border-indigo-200 hover:shadow-md
                       transition-all"
          >
            <h3 className="text-base font-semibold text-slate-900">
              {lab.name}
            </h3>

            <p className="text-xs text-slate-500 font-mono mt-1 mb-5">
              ID: {lab.code}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <Activity size={14} />
                <span className="text-xs font-medium">
                  98% Compliance
                </span>
              </div>
              <ChevronRight
                size={16}
                className="text-slate-300 group-hover:text-indigo-500 transition-colors"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LabList;
