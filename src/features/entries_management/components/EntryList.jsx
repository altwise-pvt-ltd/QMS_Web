import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Library,
  Plus,
} from "lucide-react";
import { RECORDING_CYCLES } from "../data/entriesData";
import CustomPagination from "../../../components/ui/CustomPagination";
import Skeleton from "../../../components/common/Skeleton";

const EntryList = ({
  filteredEntries,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  onViewDetails,
  onCreateNew,
  isLoading,
}) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Library className="text-indigo-600" size={28} />
            Entries Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Manage your quality log cycles and unit monitoring from a
            centralized dashboard.
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-gray-800 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 text-sm will-change-transform focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <Plus size={18} strokeWidth={3} />
          <span>New Entry</span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-medium placeholder:text-slate-400"
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
            className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm font-bold appearance-none cursor-pointer"
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
            strokeWidth={2}
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Skeleton
                    variant="rectangular"
                    width={44}
                    height={44}
                    className="rounded-lg"
                  />
                  <div className="space-y-2">
                    <Skeleton variant="text" width={180} height={20} />
                    <Skeleton variant="text" width={80} height={14} />
                  </div>
                </div>
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={32}
                  className="rounded-lg"
                />
              </div>
            ))
          : paginatedEntries.map((entry) => (
              <div
                key={entry.id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-slate-400 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                      entry.cycle === "Daily"
                        ? "bg-slate-50 text-indigo-600 border-slate-100"
                        : entry.cycle === "Weekly"
                          ? "bg-slate-50 text-emerald-600 border-slate-100"
                          : "bg-slate-50 text-amber-600 border-slate-100"
                    }`}
                  >
                    <Library size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {entry.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {entry.cycle}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {entry.parameters?.length || 0} Parameters
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onViewDetails(entry)}
                  className="mt-4 sm:mt-0 px-5 py-2 bg-slate-50 text-gray-700 border border-slate-200 rounded-lg font-bold text-xs flex items-center gap-2 transition-all hover:bg-slate-900 hover:text-gray-800 hover:border-slate-900 active:scale-95 uppercase tracking-wider"
                >
                  View Details
                  <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>
            ))}

        {!isLoading && filteredEntries.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No results found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Refine your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {!isLoading && totalPages > 1 && (
          <div className="pt-6 flex justify-center">
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
