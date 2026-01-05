import React from "react";
import {
  FileText,
  Calendar,
  User,
  MoreVertical,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  File,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SavedDocumentsTable = ({ documents = [], showWrapper = true }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case "In Progress":
        return <Clock className="w-3.5 h-3.5 mr-1" />;
      case "Pending":
        return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  const tableContent = (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="text-slate-400 w-4 h-4" />
          <h2 className="font-semibold text-slate-700 text-sm">
            Documents ({documents.length})
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Total: {documents.length} items
        </div>
      </div>

      {/* Table - No Min Width, Fully Responsive */}
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="sticky top-0 bg-slate-50 z-10">
            <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wide border-b border-slate-100">
              <th className="px-3 py-2.5 w-[5%]">ID</th>
              <th className="px-3 py-2.5 w-[22%]">Description / Name</th>
              <th className="px-3 py-2.5 w-[12%]">Sub-Category</th>
              <th className="px-3 py-2.5 w-[12%]">Department</th>
              <th className="px-3 py-2.5 w-[12%]">Created Date</th>
              <th className="px-3 py-2.5 w-[12%]">Author</th>
              <th className="px-3 py-2.5 w-[11%]">Status</th>
              <th className="px-3 py-2.5 w-[8%]">Version</th>
              <th className="px-3 py-2.5 w-[6%] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50 transition-colors duration-150"
              >
                {/* ID */}
                <td className="px-3 py-2.5 font-bold text-blue-600 text-xs">
                  {doc.id}
                </td>

                {/* Description */}
                <td className="px-3 py-2.5">
                  <div className="font-medium text-slate-800 text-xs truncate">
                    {doc.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {doc.description}
                  </div>
                </td>

                {/* Sub-Category */}
                <td className="px-3 py-2.5">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-600 border border-orange-100 truncate max-w-full">
                    {doc.subCategory}
                  </span>
                </td>

                {/* Department */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center text-slate-600 text-xs gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.department}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center text-slate-600 text-xs gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.createdDate}</span>
                  </div>
                </td>

                {/* Author */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center text-slate-600 text-xs gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.author}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${getStatusStyle(
                      doc.status
                    )}`}
                  >
                    {getStatusIcon(doc.status)}
                    <span className="truncate">{doc.status}</span>
                  </span>
                </td>

                {/* Version */}
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-100">
                    <File className="w-3 h-3 mr-1 shrink-0" />
                    <span className="truncate">{doc.version}</span>
                  </span>
                </td>

                {/* Actions */}
                <td className="px-3 py-2.5 text-right">
                  <button className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500 shrink-0">
        <div>
          Showing {documents.length} of {documents.length} documents
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-slate-100 rounded disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded font-medium text-xs">
            1
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 text-xs">
            2
          </button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded text-slate-600 text-xs">
            3
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!showWrapper) {
    return tableContent;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
          Document Repository
        </h1>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Showing all saved documents
        </div>
      </div>
      {tableContent}
    </div>
  );
};

export default SavedDocumentsTable;
