import React, { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  Filter,
  ChevronRight,
  Search,
  CheckCircle2,
  X,
  History,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import ReceptionLog from "./components/ReceptionLog";

const DUMMY_ENTRIES = [
  { id: 1, name: "Refrigerator Temperature Log", cycle: "Daily" },
  { id: 2, name: "Room Temperature & Humidity Log", cycle: "Daily" },
  { id: 3, name: "1% Hypochlorite Preparation Log", cycle: "Daily" },
  { id: 4, name: "Daily Maintenance Log for Microscope", cycle: "Daily" },
  { id: 5, name: "General House Keeping Log", cycle: "Weekly" },
];

const RECORDING_CYCLES = [
  { label: "Daily", value: "Daily" },
  { label: "Weekly", value: "Weekly" },
  { label: "Alternative Days", value: "Alternative Days" },
];

const EntriesManagement = () => {
  const [view, setView] = useState("list"); // "list", "form", or "preview"
  const [entries, setEntries] = useState(DUMMY_ENTRIES);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    cycle: "Daily",
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newEntry = {
      id: Date.now(),
      ...formData,
    };

    setEntries([newEntry, ...entries]);
    setView("list");
    setFormData({ name: "", cycle: "Daily" });
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesFilter = filter === "All" || entry.cycle === filter;
    const matchesSearch = entry.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans">
      <main className="">
        {view === "list" ? (
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
                onClick={() => setView("form")}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-gray-600 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
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
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Alternative Days">Alternative Days</option>
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
              </div>
            </div>

            {/* List */}
            <div className="grid gap-4">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        entry.cycle === "Daily"
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
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            entry.cycle === "Daily"
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
                    onClick={() => {
                      setSelectedEntry(entry);
                      setView("preview");
                    }}
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
            </div>
          </div>
        ) : view === "form" ? (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
            {/* Form Header */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mb-4">
                <Plus size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Create New Entry
              </h2>
              <p className="text-slate-500 mt-2 font-medium">
                Fill in the details below to add a new cycle entry.
              </p>
            </div>

            {/* Form Card */}
            <form
              onSubmit={handleSave}
              className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8"
            >
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Entry Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daily Temperature Check"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Recording Cycle
                </label>

                <div
                  role="radiogroup"
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  {RECORDING_CYCLES.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={formData.cycle === option.value}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          cycle: option.value,
                        }))
                      }
                      className={`px-4 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                        formData.cycle === option.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md"
                          : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="flex-1 px-6 py-4 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 
                  hover:text-red-600
                  transition-all flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-indigo-600 text-gray-600
                   font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} />
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        ) : (
          <ReceptionLog entry={selectedEntry} onBack={() => setView("list")} />
        )}
      </main>
    </div>
  );
};

export default EntriesManagement;
