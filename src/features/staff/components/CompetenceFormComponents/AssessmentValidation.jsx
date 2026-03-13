import React from "react";
import { UserCheck, AlertTriangle, CheckSquare, ClipboardList } from "lucide-react";

const AssessmentValidation = ({ formData, handleInputChange }) => {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-rose-500 rounded-full" />
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            4. Assessment & Validation
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-0.5">Final Verification & Sign-off</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-rose-600 transition-colors">
            <CheckSquare size={14} /> Overall Competence Status
          </label>
          <div className="relative">
            <select
              name="overallStatus"
              value={formData.overallStatus}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-hidden appearance-none cursor-pointer"
            >
              <option value="">Select Status</option>
              <option value="Fully Competent">Fully Competent</option>
              <option value="Competent with Supervision">Competent with Supervision</option>
              <option value="Training Required">Not Competent / Training Required</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
            <UserCheck size={14} /> Responsible Assessor
          </label>
          <div className="relative">
            <input
              type="text"
              name="assessorName"
              readOnly
              value={formData.assessorName}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed italic"
            />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2 group">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-rose-600 transition-colors">
            <ClipboardList size={14} /> Gap Analysis & Recommendations (ISO 7.2c)
          </label>
          <div className="relative">
            <AlertTriangle className="absolute left-4 top-4 text-amber-300 group-focus-within:text-amber-500 transition-colors" size={18} />
            <textarea
              name="skillGaps"
              rows="4"
              placeholder="Identify specific gaps and recommended training actions to ensure competence..."
              value={formData.skillGaps}
              onChange={handleInputChange}
              className="w-full pl-12 pr-5 py-4 bg-white border border-slate-200 rounded-[2rem] text-sm font-medium text-slate-700 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition-all outline-hidden min-h-[120px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentValidation;
