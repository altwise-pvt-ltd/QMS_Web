import React from "react";
import { FileCheck, ShieldCheck } from "lucide-react";

const FormHeader = () => {
  return (
    <div className="mb-8 bg-linear-to-br from-indigo-700 via-indigo-600 to-slate-800 rounded-[2rem] p-8 shadow-2xl shadow-indigo-200/50 relative overflow-hidden group">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/10 transition-colors duration-700" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full -ml-16 -mb-16 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Competence Record
              </h1>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/30 backdrop-blur-sm">
                ISO 9001:2015
              </span>
            </div>
            <p className="text-indigo-100/80 font-medium text-sm flex items-center gap-2">
              <FileCheck size={14} className="text-indigo-300" />
              Clause 7.2 Compliant • Controlled Management System Document
            </p>
          </div>
        </div>

        <div className="hidden lg:block text-right">
          <p className="text-[10px] font-black text-indigo-200/50 uppercase tracking-[0.2em] mb-1">System Reference</p>
          <p className="text-white font-mono text-sm group-hover:text-indigo-200 transition-colors">QMS-STF-COMP-V2</p>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;
