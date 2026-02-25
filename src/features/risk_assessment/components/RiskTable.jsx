import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { TablePagination } from "@mui/base/TablePagination";

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate paginated risks
  const paginatedRisks = risks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Risk ID
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Clause
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Quality Indicator
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
                Severity
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
                Likelihood
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
                <div className="flex items-center justify-center gap-1.5">
                  Score
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wide text-center">
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
                  cursor-pointer transition-all duration-200 ease-in-out
                  ${selectedRiskId === risk.id ? "bg-indigo-50 shadow-sm" : "hover:bg-slate-50"}
                `}
              >
                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                  {risk.id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {risk.date}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 italic">
                  {risk.clause}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700 max-w-md">
                  {risk.description}
                </td>
                <td className="px-6 py-4 text-sm text-center font-semibold text-slate-700">
                  {risk.severity}
                </td>
                <td className="px-6 py-4 text-sm text-center font-semibold text-slate-700">
                  {risk.likelihood}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-900">
                    {risk.score}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${getCategoryBadge(risk.category)}`}
                  >
                    {risk.category.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${risk.capaStatus === "Open"
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
          </tbody>
          <tfoot>
            <tr>
              <TablePagination
                colSpan={9}
                className="border-t border-slate-200 px-6 py-4 bg-slate-50"
                count={risks.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[4, 5, 10, 25, 50]}
                slotProps={{
                  root: {
                    className:
                      "flex items-center justify-between text-sm text-slate-600",
                  },
                  select: {
                    className:
                      "px-3 py-1.5 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  },
                  selectLabel: {
                    className: "text-sm text-slate-600 mr-2 font-medium",
                  },
                  displayedRows: {
                    className: "text-sm text-slate-600 font-medium",
                  },
                  actions: {
                    className: "flex gap-1",
                  },
                }}
              />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
