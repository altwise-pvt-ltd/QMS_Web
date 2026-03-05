import React from "react";
import {
  ChevronLeft,
  Plus,
  FlaskConical,
  ChevronRight,
  Activity,
} from "lucide-react";
import Skeleton from "../../../components/common/Skeleton";

const LabList = ({
  selectedEntry,
  labs = [],
  onBack,
  onAddLab,
  onSelectLab,
  isLoading,
}) => {
  // Empty State Handling
  if (!isLoading && labs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-200">
          <FlaskConical size={40} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          No units registered
        </h3>
        <p className="text-slate-500 mt-2 max-w-xs mx-auto text-sm font-medium">
          Start monitoring by adding your first unit to the "
          {selectedEntry?.name}" category.
        </p>
        <button
          onClick={onAddLab}
          className="mt-8 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          <Plus size={18} strokeWidth={3} />
          Add First Unit
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              {selectedEntry?.name}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Registered Units:
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-md">
                {labs.length} TOTAL
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onAddLab}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-gray-800 text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95 uppercase tracking-wide"
        >
          <Plus size={16} strokeWidth={3} />
          Add Unit
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton
                    variant="rectangular"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                </div>
                <Skeleton variant="text" width="30%" height={14} />
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <Skeleton variant="text" width="40%" height={14} />
                  <Skeleton variant="text" width="20%" height={14} />
                </div>
              </div>
            ))
          : labs.map((lab) => (
              <button
                key={lab.id}
                onClick={() => onSelectLab(lab)}
                className="group flex flex-col text-left bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {lab.name}
                  </h3>
                  <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    <ChevronRight size={18} strokeWidth={3} />
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  CODE: {lab.code}
                </p>

                <div className="mt-8 w-full pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 font-bold">
                    <Activity size={14} className="text-indigo-500" />
                    <span className="text-[10px] tracking-wider uppercase font-black">
                      Unit Tracking
                    </span>
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md border border-emerald-100">
                    MONITORED
                  </div>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
};

export default LabList;
