import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

/**
 * Helper for category colors
 */
const getCategoryBadge = (category) => {
  switch (category) {
    case "High":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Low":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const RiskTable = ({ risks, onRowClick, selectedRiskId }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Risk ID
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Clause
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Severity
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Likelihood
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                <div className="flex items-center justify-center gap-1 cursor-pointer">
                  Score
                  <ChevronDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                Category
              </th>
              <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                CAPA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {risks.map((risk) => (
              <tr
                key={risk.id}
                onClick={() => onRowClick(risk)}
                className={`
                  cursor-pointer transition-colors duration-150
                  ${selectedRiskId === risk.id ? "bg-indigo-50/50" : "hover:bg-slate-50"}
                `}
              >
                <td className="px-4 py-3 text-xs font-bold text-indigo-600">
                  {risk.id}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500 italic">
                  {risk.clause}
                </td>
                <td className="px-4 py-3 text-xs font-medium text-slate-700">
                  {risk.description}
                </td>
                <td className="px-4 py-3 text-xs text-center font-bold text-slate-600">
                  {risk.severity}
                </td>
                <td className="px-4 py-3 text-xs text-center font-bold text-slate-600">
                  {risk.likelihood}
                </td>
                <td className="px-4 py-3 text-xs text-center font-extrabold text-slate-900">
                  {risk.score}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold border ${getCategoryBadge(risk.category)}`}
                  >
                    {risk.category.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`text-[10px] font-semibold ${risk.capaStatus === "Open" ? "text-rose-600" : risk.capaStatus === "Resolved" ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    {risk.capaStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
