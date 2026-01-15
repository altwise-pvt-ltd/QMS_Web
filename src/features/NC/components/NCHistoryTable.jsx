import React from "react";
import {
  FileText,
  ExternalLink,
  User,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";

/**
 * NCHistoryTable Component
 *
 * Renders a list of NC reports with key information and status.
 */
const NCHistoryTable = ({ reports, isLoading, onViewDetails }) => {
  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium tracking-wide">
            Loading NC reports...
          </p>
        </div>
      </div>
    );
  }

  // 2. EMPTY STATE
  if (!reports || reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <FileText className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">
          No records found
        </h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-1">
          No Non-Conformance reports match your search.
        </p>
      </div>
    );
  }

  // Helper for Badge Colors
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "resolved":
      case "closed":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  // Helper for Badge Icons
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "submitted":
        return <Clock size={14} />;
      case "resolved":
      case "closed":
        return <CheckCircle2 size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/4">
                NC Details & Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Classification
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Responsibility
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                {/* 1. Date & Primary Info */}
                <td className="px-6 py-4 align-top">
                  <div className="flex flex-col">
                    <span
                      className="font-semibold text-slate-800 text-sm group-hover:text-blue-700 transition-colors line-clamp-2"
                      title={report.entry?.ncDetails}
                    >
                      {report.entry?.ncDetails || "No description provided"}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-500">
                      <Calendar size={13} />
                      <span className="text-xs font-medium">
                        {report.entry?.date || "No date"}
                      </span>
                    </div>
                    {/* <div className="text-[10px] text-slate-400 mt-1">
                      ID: #{report.id}
                    </div> */}
                  </div>
                </td>

                {/* 2. Category & Department */}
                <td className="px-6 py-4 align-top">
                  <div className="space-y-1.5">
                    <div className="inline-flex">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {report.entry?.category || "Uncategorized"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Building2 size={13} />
                      <span className="text-xs">
                        {report.entry?.department || "General"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* 3. Responsibility & Submitter */}
                <td className="px-6 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shrink-0 mt-0.5">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {report.entry?.responsibility || "Unassigned"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        By: {report.submittedBy?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* 4. Status */}
                <td className="px-6 py-4 align-top">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                      report.status
                    )}`}
                  >
                    {getStatusIcon(report.status)}
                    <span className="capitalize">
                      {report.status || "Draft"}
                    </span>
                  </span>
                </td>

                {/* 5. Actions */}
                <td className="px-6 py-4 align-top text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Evidence Link */}
                    {report.entry?.evidenceImage && (
                      <a
                        href={
                          typeof report.entry.evidenceImage === "string"
                            ? report.entry.evidenceImage
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                        title="View Evidence"
                        onClick={(e) => {
                          // Prevent default if it's not a valid string URL
                          if (typeof report.entry.evidenceImage !== "string")
                            e.preventDefault();
                        }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}

                    {/* View Details Button */}
                    <button
                      onClick={() => onViewDetails(report)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-all shadow-xs"
                    >
                      <Eye size={14} />
                      DETAILS
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NCHistoryTable;
