import React from "react";
import { Save, X, Calendar } from "lucide-react";

const FormActions = ({ assessmentDate, isSaving }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-12 bg-white/80 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white sticky bottom-6 z-10 transition-all duration-500 hover:shadow-indigo-200/50">
      <div className="flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-2xl border border-slate-100">
        <Calendar size={16} className="text-indigo-500" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Assessment Date: <span className="ml-1 text-slate-900 font-black">{assessmentDate}</span>
        </p>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto">
        <button
          type="button"
          disabled={isSaving}
          className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <X size={18} /> Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSaving}
          className="flex-1 md:flex-none px-10 py-4 bg-linear-to-br from-indigo-600 to-indigo-700 text-white rounded-[1.5rem] font-black uppercase tracking-[0.1em] text-sm shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative group"
        >
          {/* Animated background on hover */}
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-shimmer" />
          
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Save size={18} className="group-hover:scale-110 transition-transform" />
              <span>Validate & Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FormActions;
