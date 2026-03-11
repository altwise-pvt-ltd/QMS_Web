import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  bar,
  accent,
  isRisk,
  trend,
  trendType,
}) => {
  const isCritical = isRisk && value > 0;

  return (
    <div
      className={`group relative bg-white rounded-4xl border-0 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden ring-1 ring-slate-100/80
        ${isCritical ? "ring-rose-200/50 bg-rose-50/10" : "hover:ring-indigo-100/80"}`}
    >
      {/* Dynamic Progress Indicator */}
      <div
        className={`h-1.5 w-full bg-linear-to-r ${bar} opacity-60 transition-transform duration-700 origin-left group-hover:scale-x-110 ${
          isCritical ? "animate-pulse" : ""
        }`}
      />

      <div className="p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 opacity-80 group-hover:text-slate-500 transition-colors">
              {title}
            </p>

            <div className="flex flex-col">
              <h3
                className={`text-4xl font-black tracking-tight leading-none tabular-nums transition-transform duration-500 group-hover:translate-x-1 ${
                  isCritical ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {value}
              </h3>

              {trend && (
                <div className="mt-4 flex items-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ring-1 ring-inset transition-all duration-300 ${
                      trendType === "up"
                        ? "bg-emerald-50 text-emerald-600 ring-emerald-600/10 group-hover:bg-emerald-100"
                        : trendType === "down"
                          ? "bg-rose-50 text-rose-600 ring-rose-600/10 group-hover:bg-rose-100"
                          : "bg-slate-50 text-slate-500 ring-slate-600/10 group-hover:bg-slate-100"
                    }`}
                  >
                    {trendType === "up" && <TrendingUp size={11} />}
                    {trendType === "down" && <TrendingDown size={11} />}
                    {trendType === "neutral" && <Minus size={11} />}
                    {trend}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute inset-0 rounded-2xl blur-xl opacity-0 transition-all duration-700 group-hover:opacity-30 ${
                isCritical ? "bg-rose-400" : "bg-indigo-400"
              }`}
            />
            <div
              className={`relative p-4 rounded-2xl border transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-3 ${
                isCritical
                  ? "bg-rose-50 border-rose-100 text-rose-600"
                  : `bg-slate-50/50 border-slate-100 ${accent} group-hover:bg-white group-hover:border-indigo-100 group-hover:text-indigo-600`
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.5px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Icon */}
      <div
        className={`absolute -right-4 -bottom-4 opacity-[0.02] transition-all duration-700 pointer-events-none group-hover:scale-150 group-hover:-rotate-12 group-hover:opacity-[0.05] ${accent}`}
      >
        <Icon size={120} />
      </div>
    </div>
  );
};

export default StatCard;
