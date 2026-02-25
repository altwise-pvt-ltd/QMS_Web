import React, { useState } from "react";
import {
  ChevronUp,
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
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden w-full">
      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                Risk ID
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                Date
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide whitespace-nowrap">
                Clause
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Quality Indicator
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center whitespace-nowrap">
                Severity
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center whitespace-nowrap">
                Likelihood
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1">
                  Score
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center whitespace-nowrap">
                Category
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center whitespace-nowrap">
                CAPA
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedRisks.map((risk) => (
              <tr
                key={risk.id}
                onClick={() => onRowClick(risk)}
                className={`
                  cursor-pointer transition-all duration-150 ease-in-out
                  ${
                    selectedRiskId === risk.id
                      ? "bg-indigo-50"
                      : "hover:bg-slate-50"
                  }
                `}
              >
                <td className="px-4 py-3 text-sm font-semibold text-indigo-600 whitespace-nowrap">
                  {risk.id}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                  {risk.date}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 italic whitespace-nowrap">
                  {risk.clause}
                </td>
                {/* Quality Indicator: inline, truncated with tooltip */}
                <td className="px-4 py-3 text-sm font-medium text-slate-700 max-w-[220px]">
                  <span className="block truncate" title={risk.description}>
                    {risk.description}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center font-semibold text-slate-700 whitespace-nowrap">
                  {risk.severity}
                </td>
                <td className="px-4 py-3 text-sm text-center font-semibold text-slate-700 whitespace-nowrap">
                  {risk.likelihood}
                </td>
                <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 font-bold text-slate-900 text-sm">
                    {risk.score}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryBadge(risk.category)}`}
                  >
                    {risk.category.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                      risk.capaStatus === "Open"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : risk.capaStatus === "Resolved"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-50 text-slate-500 border border-slate-200"
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
                  className="px-6 py-10 text-center text-sm text-slate-400"
                >
                  No risks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination — outside the table to avoid DOM nesting errors */}
      <div className="border-t border-slate-200 px-4 py-3 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-500 whitespace-nowrap">
            Rows per page:
          </span>
          <select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            className="px-2 py-1 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {[4, 5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Page info + nav */}
        <div className="flex items-center gap-3">
          <span className="font-medium whitespace-nowrap">
            {start}–{end} of {risks.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => handleChangePage(page - 1)}
              disabled={page === 0}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleChangePage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskTable;
