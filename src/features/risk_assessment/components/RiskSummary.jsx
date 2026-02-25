import React from "react";
import {
  AlertTriangle,
  Info,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const CARDS = [
  {
    key: "total",
    label: "Total Risks",
    sublabel: "Identified",
    icon: Info,
    accent: {
      icon: "text-indigo-600",
      iconBg: "bg-indigo-100",
      value: "text-indigo-700",
      bar: "bg-indigo-500",
      barBg: "bg-indigo-100",
      border: "border-indigo-100",
      badge: "bg-indigo-50 text-indigo-600",
    },
  },
  {
    key: "high",
    label: "High Risk",
    sublabel: "Score ≥ 15",
    icon: AlertTriangle,
    accent: {
      icon: "text-rose-600",
      iconBg: "bg-rose-100",
      value: "text-rose-700",
      bar: "bg-rose-500",
      barBg: "bg-rose-100",
      border: "border-rose-100",
      badge: "bg-rose-50 text-rose-600",
    },
  },
  {
    key: "medium",
    label: "Medium Risk",
    sublabel: "Score 6–14",
    icon: AlertTriangle,
    accent: {
      icon: "text-amber-600",
      iconBg: "bg-amber-100",
      value: "text-amber-700",
      bar: "bg-amber-400",
      barBg: "bg-amber-100",
      border: "border-amber-100",
      badge: "bg-amber-50 text-amber-600",
    },
  },
  {
    key: "low",
    label: "Low Risk",
    sublabel: "Score 1–5",
    icon: CheckCircle,
    accent: {
      icon: "text-emerald-600",
      iconBg: "bg-emerald-100",
      value: "text-emerald-700",
      bar: "bg-emerald-500",
      barBg: "bg-emerald-100",
      border: "border-emerald-100",
      badge: "bg-emerald-50 text-emerald-600",
    },
  },
];

const TrendBadge = ({ trend }) => {
  if (trend === "up")
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
        <TrendingUp className="w-2.5 h-2.5" /> +2
      </span>
    );
  if (trend === "down")
    return (
      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
        <TrendingDown className="w-2.5 h-2.5" /> -1
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
      <Minus className="w-2.5 h-2.5" /> —
    </span>
  );
};

const RiskSummary = ({ summary }) => {
  const total = summary.total || 1; // avoid division by zero

  // Derive simple trend hints from proportions (static demo — replace with real delta props if available)
  const trends = {
    total: "up",
    high: "down",
    medium: "up",
    low: "neutral",
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {CARDS.map(({ key, label, sublabel, icon: Icon, accent }) => {
        const value = summary[key] ?? 0;
        const pct = key === "total" ? 100 : Math.round((value / total) * 100);

        return (
          <div
            key={key}
            className={`bg-white border ${accent.border} rounded-xl shadow-sm overflow-hidden flex flex-col`}
          >
            {/* Top coloured accent bar */}
            <div className={`h-1 w-full ${accent.bar}`} />

            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* Icon + label row */}
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${accent.iconBg}`}>
                  <Icon className={`w-4 h-4 ${accent.icon}`} />
                </div>
                <TrendBadge trend={trends[key]} />
              </div>

              {/* Value + label */}
              <div>
                <p
                  className={`text-3xl font-black leading-none tracking-tight ${accent.value}`}
                >
                  {value}
                </p>
                <p className="text-xs font-bold text-slate-700 mt-1.5 uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {sublabel}
                </p>
              </div>

              {/* Progress bar (share of total) */}
              {key !== "total" && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Share of total
                    </span>
                    <span className={`text-[10px] font-bold ${accent.value}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full ${accent.barBg}`}>
                    <div
                      className={`h-full rounded-full ${accent.bar} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Total: show breakdown pill row instead */}
              {key === "total" && (
                <div className="flex gap-1.5 flex-wrap">
                  {["high", "medium", "low"].map((k) => (
                    <span
                      key={k}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        k === "high"
                          ? "bg-rose-50 text-rose-600"
                          : k === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {summary[k] ?? 0} {k.charAt(0).toUpperCase() + k.slice(1)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RiskSummary;
