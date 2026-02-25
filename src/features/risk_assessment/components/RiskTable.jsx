import React, { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * Helper for category colors
 */
const getCategoryBadge = (category) => {
  switch (category) {
    case "High":
      return "bg-red-50 text-red-700 border border-red-200";
    case "Medium":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    case "Low":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    default:
      return "bg-slate-50 text-slate-700 border border-slate-200";
  }
};

const RiskTable = ({ risks, onRowClick, selectedRiskId }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(risks.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRisks = risks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const start = page * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage + rowsPerPage, risks.length);

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden w-full flex flex-col h-full">
      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto w-full flex-1">
        <table className="w-full min-w-[800px] text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-50">
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                Risk ID
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                Date
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">
                Clause
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Quality Indicator
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">
                Severity
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">
                Likelihood
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  Score
                  <ChevronDown className="w-3 h-3 opacity-40" />
                </div>
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">
                Category
              </th>
              <th className="px-5 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center whitespace-nowrap">
                CAPA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedRisks.map((risk) => (
              <tr
                key={risk.id}
                onClick={() => onRowClick(risk)}
                className={`
                  cursor-pointer transition-colors duration-200 group
                  ${selectedRiskId === risk.id
                    ? "bg-indigo-50/50"
                    : "hover:bg-slate-50/50"
                  }
                `}
              >
                <td className="px-5 py-4 text-sm font-black text-indigo-600 whitespace-nowrap">
                  #{risk.id}
                </td>
                <td className="px-5 py-4 text-[11px] font-bold text-slate-500 whitespace-nowrap">
                  {risk.date}
                </td>
                <td className="px-5 py-4 text-[11px] font-bold text-slate-400 italic whitespace-nowrap">
                  {risk.clause}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-slate-800 max-w-[220px]">
                  <span className="block truncate" title={risk.description}>
                    {risk.description}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-center font-black text-slate-700 whitespace-nowrap">
                  {risk.severity}
                </td>
                <td className="px-5 py-4 text-sm text-center font-black text-slate-700 whitespace-nowrap">
                  {risk.likelihood}
                </td>
                <td className="px-5 py-4 text-sm text-center whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 font-black text-slate-900 text-xs">
                    {risk.score}
                  </span>
                </td>
                <td className="px-5 py-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryBadge(risk.category)}`}
                  >
                    {risk.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${risk.capaStatus === "Open"
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : risk.capaStatus === "Resolved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm"
                        : "bg-slate-50 text-slate-500 border-slate-100 shadow-sm"
                      }`}
                  >
                    {risk.capaStatus}
                  </span>
                </td>
              </tr>
            ))}

            {paginatedRisks.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-20 text-center text-slate-400 font-bold italic"
                >
                  No risks found in current registry.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modern Pagination UI */}
      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Rows per page:
          </span>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold bg-white focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Page info + nav */}
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {start}–{end} of {risks.length} records
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskTable;
