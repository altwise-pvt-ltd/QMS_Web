import React, { useEffect, useState } from "react";
import { getOverallHealth } from "../services/dashboardService";

export const HealthScoreWidget = () => {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getOverallHealth();
        setHealthData(data);
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const score = healthData?.healthScore ?? 0;
  const status = healthData?.status || "N/A";
  const summaries = healthData?.summaries || {};

  return (
    <div className="@container flex flex-col items-center justify-center h-full w-full">
      <div className="relative w-full max-w-40 max-h-40 aspect-square flex items-center justify-center mx-auto">
        {/* Background Circle */}
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 192 192"
        >
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
            className={
              score >= 80
                ? "text-emerald-500"
                : score >= 50
                  ? "text-amber-500"
                  : "text-rose-500"
            }
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl @xs:text-5xl font-bold text-slate-800">
            {score}
          </span>
          <span
            className={`text-sm font-medium px-2 py-1 rounded-full mt-2 ${
              score >= 80
                ? "text-emerald-600 bg-emerald-50"
                : score >= 50
                  ? "text-amber-600 bg-amber-50"
                  : "text-rose-600 bg-rose-50"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 @sm:gap-4 w-full mt-6 text-center">
        <div>
          <div className="text-xs text-slate-400 uppercase font-bold">Risk</div>
          <div className="text-lg font-semibold text-slate-700">
            {summaries.riskLevel || "Low"}
          </div>
        </div>
        <div className="border-x border-slate-100">
          <div className="text-xs text-slate-400 uppercase font-bold">Docs</div>
          <div className="text-lg font-semibold text-slate-700">
            {summaries.documentCompliance || 100}%
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase font-bold">CAPA</div>
          <div className="text-lg font-semibold text-slate-700">
            {summaries.openCapaCount || 0} Open
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreWidget;
