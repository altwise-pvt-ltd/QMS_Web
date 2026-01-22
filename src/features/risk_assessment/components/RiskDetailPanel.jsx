import React from "react";
import { X, ExternalLink, Link as LinkIcon, ClipboardList } from "lucide-react";

const RiskDetailPanel = ({ risk, onClose }) => {
  if (!risk) return null;

  return (
    <div className="bg-white border-l border-slate-200 h-full w-full flex flex-col shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
            Risk Details
          </h2>
          <p className="text-[10px] text-indigo-600 font-bold mt-0.5">
            {risk.id}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Description Section */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
            Risk Description
          </label>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {risk.description}
          </p>
          <div className="mt-2 text-[11px] text-slate-500 italic">
            Clause: {risk.clause}
          </div>
        </section>

        {/* Evidence Section */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <ClipboardList className="w-3 h-3" />
            Evidence for Likelihood (Calculated)
          </label>
          <div className="space-y-3">
            {risk.evidence && risk.evidence.length > 0 ? (
              risk.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-100 rounded-lg p-3"
                >
                  <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">
                    {ev.type}
                  </div>
                  <div className="text-xs text-slate-600">{ev.detail}</div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                No linked evidence found.
              </div>
            )}
          </div>
        </section>

        {/* Action / CAPA Section */}
        {risk.score >= 15 && (
          <section className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 block">
              Mitigation / CAPA
            </label>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Linked CAPA
              </span>
              <a
                href={risk.capaLink || "#"}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                View Report
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
              Score
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">
              {risk.score}
            </div>
          </div>
          <div className="text-center border-x border-slate-200">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
              Severity
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">
              {risk.severity}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">
              Likelihood
            </div>
            <div className="text-lg font-black text-slate-900 leading-none">
              {risk.likelihood}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskDetailPanel;
