import React from "react";
import {
  X,
  ExternalLink,
  ClipboardList,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────

const getRiskLevel = (score) => {
  if (score >= 15) return "high";
  if (score >= 6) return "medium";
  return "low";
};

const RISK_LEVEL_CONFIG = {
  high: {
    label: "High Risk",
    bar: "bg-rose-500",
    barBg: "bg-rose-100",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    accent: "text-rose-600",
    border: "border-rose-100",
    bg: "bg-rose-50",
    dot: "bg-rose-500",
  },
  medium: {
    label: "Medium Risk",
    bar: "bg-amber-500",
    barBg: "bg-amber-100",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    accent: "text-amber-600",
    border: "border-amber-100",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  low: {
    label: "Low Risk",
    bar: "bg-emerald-500",
    barBg: "bg-emerald-100",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    accent: "text-emerald-600",
    border: "border-emerald-100",
    bg: "bg-emerald-50",
    dot: "bg-emerald-500",
  },
};

const CAPA_CONFIG = {
  Open: {
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    style: "bg-rose-50 text-rose-700 border-rose-200",
  },
  Resolved: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  "In Progress": {
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

const ScoreBar = ({ value, max = 25, level }) => {
  const pct = Math.min((value / max) * 100, 100);
  const cfg = RISK_LEVEL_CONFIG[level];
  return (
    <div className={`w-full h-2 rounded-full ${cfg.barBg} overflow-hidden`}>
      <div
        className={`h-full rounded-full ${cfg.bar} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

const StatBlock = ({ label, value, sub, accent }) => (
  <div className="text-center">
    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">
      {label}
    </div>
    <div
      className={`text-2xl font-black leading-none ${accent ?? "text-slate-900"}`}
    >
      {value}
    </div>
    {sub && (
      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{sub}</div>
    )}
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const RiskDetailPanel = ({ risk, onClose }) => {
  if (!risk) return null;

  const level = getRiskLevel(risk.score);
  const cfg = RISK_LEVEL_CONFIG[level];
  const capaConfig = CAPA_CONFIG[risk.capaStatus] ?? CAPA_CONFIG["Open"];

  return (
    <div className="bg-white h-full w-full flex flex-col overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Risk ID pill */}
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 shadow-sm shadow-indigo-200 shrink-0">
              <span className="text-white text-[11px] font-black tracking-tight">
                {risk.id}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                Risk Details
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${capaConfig.style}`}
                >
                  {capaConfig.icon}
                  CAPA: {risk.capaStatus}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600 shrink-0 mt-0.5"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Score bar strip ─────────────────────────────────────── */}
      <div className={`px-5 py-3 ${cfg.bg} border-b ${cfg.border} shrink-0`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Risk Score
          </span>
          <span className={`text-sm font-black ${cfg.accent}`}>
            {risk.score} / 25
          </span>
        </div>
        <ScoreBar value={risk.score} level={level} />
      </div>

      {/* ── Scrollable body ─────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Date + Clause row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Date
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                {risk.date}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <FileText className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Clause
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5 italic">
                {risk.clause}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
            Quality Indicator
          </label>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl border border-slate-100 px-4 py-3">
            {risk.description}
          </p>
        </section>

        {/* Evidence */}
        <section>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <ClipboardList className="w-3 h-3" />
            Evidence for Likelihood
          </label>
          <div className="space-y-2.5">
            {risk.evidence && risk.evidence.length > 0 ? (
              risk.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex gap-3"
                >
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <div>
                    <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide mb-1">
                      {ev.type}
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {ev.detail}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 italic bg-slate-50 p-3.5 rounded-xl border border-dashed border-slate-200 text-center">
                No linked evidence found.
              </div>
            )}
          </div>
        </section>

        {/* CAPA — only for medium + high */}
        {risk.score >= 6 && (
          <section className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
            <label
              className={`text-[10px] font-bold uppercase tracking-widest mb-3 block ${cfg.accent}`}
            >
              Mitigation / CAPA
            </label>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-slate-700">
                  Linked CAPA Report
                </div>
                <div className={`text-[10px] mt-0.5 font-medium ${cfg.accent}`}>
                  Action required — {cfg.label}
                </div>
              </div>
              <a
                href={risk.capaLink || "#"}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700  hover:text-white   active:scale-95 transition-all shadow-sm whitespace-nowrap"
              >
                View Report
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        )}
      </div>

      {/* ── Footer stats ───────────────────────────────────────── */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/40 shrink-0">
        <div className="grid grid-cols-3 gap-2 divide-x divide-slate-200">
          <StatBlock
            label="Score"
            value={risk.score}
            sub="out of 25"
            accent={cfg.accent}
          />
          <StatBlock label="Severity" value={risk.severity} sub="S-level" />
          <StatBlock label="Likelihood" value={risk.likelihood} sub="L-level" />
        </div>
      </div>
    </div>
  );
};

export default RiskDetailPanel;
