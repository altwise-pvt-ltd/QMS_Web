import React, { useState, useEffect } from "react";
import {
  Eye,
  FileText,
  Plus,
  ClipboardList,
  CheckCircle,
  Search,
  Filter,
  Calendar,
  Download,
} from "lucide-react";
import CustomPagination from "../../../components/ui/CustomPagination";

const FormPreview = ({
  ncs = [],
  filedCapas = [],
  onFileCapa,
  onCreateNew,
  onView,
}) => {
  const [activeTab, setActiveTab] = useState("ncs");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 2;

  useEffect(() => {
    setPage(1);
  }, [activeTab, searchTerm]);

  const displayData = activeTab === "ncs" ? ncs : filedCapas;
  const filteredData = displayData.filter((item) => {
    const name = (item.name || item.subCategory || "").toLowerCase();
    const issueNo = (item.issueNo || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || issueNo.includes(search);
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ClipboardList className="text-indigo-600" size={32} />
            Corrective & Preventive Action
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Manage and track quality improvement measures (CAPA)
          </p>
        </div>
      </div>
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by NC name or issue number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onCreateNew}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-2 bg-slate-900 text-gray-600 rounded-xl text-sm font-black hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-slate-200"
          >
            <Plus className="w-4 h-4" />
            New CAPA Entry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-slate-100 flex items-center justify-between p-2 bg-slate-50/30">
          <div className="flex p-1 gap-2">
            <button
              onClick={() => setActiveTab("ncs")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${
                activeTab === "ncs"
                  ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              List of NC's
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === "ncs"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {ncs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("filed")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-black transition-all ${
                activeTab === "filed"
                  ? "bg-white text-emerald-600 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Filed CAPA's
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                  activeTab === "filed"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {filedCapas.length}
              </span>
            </button>
          </div>

          <div className="hidden md:flex items-center px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {activeTab === "ncs" ? "Awaiting Action" : "Historical Records"}
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-[0.15em] text-slate-400 font-black bg-slate-50/50">
                <th className="px-8 py-5">Issue Identity</th>
                <th className="px-8 py-5">Non-Conformity Name</th>
                <th className="px-8 py-5">Ownership</th>
                <th className="px-8 py-5">Timeline</th>
                <th className="px-8 py-5">Organization</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id || item.issueNo || index}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200" />
                        <span className="font-mono text-xs font-black text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                          {item.issueNo}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div>
                        <p className="font-black text-slate-900 text-sm leading-tight hover:text-indigo-600 transition-colors cursor-default">
                          {item.name || item.subCategory}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                          {activeTab === "ncs" ? item.category : "NC Resolved"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-600 ${
                            activeTab === "ncs"
                              ? "bg-indigo-500"
                              : "bg-emerald-500"
                          }`}
                        >
                          {(
                            item.reportedBy ||
                            item.filedBy ||
                            item.responsibility ||
                            "U"
                          ).charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-700">
                          {item.reportedBy ||
                            item.filedBy ||
                            item.responsibility}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                          {item.date || item.filedDate}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-tighter shadow-inner">
                        {item.department}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      {activeTab === "ncs" ? (
                        <button
                          onClick={() => onFileCapa(item)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-gray-600 transition-all shadow-sm active:scale-95 group/btn"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          File CAPA
                        </button>
                      ) : (
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => onView(item)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          {/* VIEW ATTACHED PDFS */}
                          <div className="flex items-center gap-1">
                            {item.uploadedFiles?.map((file, fIdx) => (
                              <a
                                key={fIdx}
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title={`View Attachment ${fIdx + 1}: ${file.fileName}`}
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            ))}
                            {!item.uploadedFiles &&
                              item.uploadedFile?.fileUrl && (
                                <a
                                  href={item.uploadedFile.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                  title="View Attached PDF"
                                >
                                  <Download className="w-5 h-5" />
                                </a>
                              )}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <Search className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 text-sm font-bold tracking-tight">
                        No records found matching "{searchTerm}"
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info & Pagination */}
        <div className="bg-slate-50/50 p-4 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing {paginatedData.length} of {filteredData.length} records
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />{" "}
                  Pending
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
                  Completed
                </span>
              </div>
            </div>

            {totalPages > 1 && (
              <CustomPagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;

