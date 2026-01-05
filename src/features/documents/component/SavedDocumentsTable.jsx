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

const SavedDocumentsTable = ({ documents = [] }) => {
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
        return <CheckCircle2 size={14} className="mr-1.5" />;
      case "In Progress":
        return <Clock size={14} className="mr-1.5" />;
      case "Pending":
        return <AlertCircle size={14} className="mr-1.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full min-w-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-slate-400" />
          <h2 className="font-semibold text-slate-700 text-sm">
            Documents ({documents.length})
          </h2>
        </div>
      </div>

      {/* ✅ ONLY horizontal scroll lives here */}
      <div className="overflow-x-auto overflow-y-hidden flex-1 min-w-0">
        <table className="min-w-[1100px] w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-xs font-semibold uppercase text-slate-500">
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Sub-Category</th>
              <th className="p-4">Department</th>
              <th className="p-4">Created</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4">Version</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-indigo-600 text-sm">
                  {doc.id}
                </td>

                <td className="p-4 max-w-xs">
                  <div className="font-medium text-slate-800 truncate">
                    {doc.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {doc.description}
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded-md bg-orange-50 text-orange-600 border border-orange-100 whitespace-nowrap">
                    {doc.subCategory}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin size={12} className="mr-1 text-slate-400" />
                    {doc.department}
                  </div>
                </td>

                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                  <Calendar size={12} className="inline mr-1 text-slate-400" />
                  {doc.createdDate}
                </td>

                <td className="p-4 text-sm text-slate-600">
                  <User size={12} className="inline mr-1 text-slate-400" />
                  {doc.author}
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusStyle(
                      doc.status
                    )}`}
                  >
                    {getStatusIcon(doc.status)}
                    {doc.status}
                  </span>
                </td>

                <td className="p-4">
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                    <File size={12} className="mr-1" />
                    {doc.version}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <button className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 shrink-0">
        <span>Showing {documents.length} documents</span>
        <div className="flex gap-2">
          <button className="p-2 rounded hover:bg-slate-100">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 rounded hover:bg-slate-100">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedDocumentsTable;
