import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Plus,
} from "lucide-react";
import { RECORDING_CYCLES } from "../data/entriesData";
import CustomPagination from "../../../components/ui/CustomPagination";

const EntryList = ({
  filteredEntries,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  onViewDetails,
  onCreateNew,
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Entries Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Configure and manage maintenance and quality log cycles.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-gray-500 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Create New Entry
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search entry name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
          />
        </div>

        <div className="relative w-full md:w-64">
          <Filter
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
          >
            <option value="All">All Cycles</option>
            {RECORDING_CYCLES.map((cycle) => (
              <option key={cycle.value} value={cycle.value}>
                {cycle.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {paginatedEntries.map((entry) => (
          <div
            key={entry.id}
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${entry.cycle === "Daily"
                  ? "bg-indigo-50 text-indigo-600"
                  : entry.cycle === "Weekly"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                  }`}
              >
                <ClipboardList size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {entry.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${entry.cycle === "Daily"
                      ? "bg-indigo-100 text-indigo-700"
                      : entry.cycle === "Weekly"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {entry.cycle}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewDetails(entry)}
              className="mt-4 sm:mt-0 px-4 py-2 text-slate-400 hover:text-indigo-600 font-bold text-sm flex items-center gap-1 transition-colors"
            >
              View Details
              <ChevronRight size={16} />
            </button>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              No entries found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="pt-4">
            <CustomPagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryList;
