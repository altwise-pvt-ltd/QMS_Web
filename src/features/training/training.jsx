import React, { useState, useEffect, useMemo } from "react";
import {
  GraduationCap,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import trainingService from "./services/trainingService";
import CustomCalendar from "./components/CustomCalendar";
import ScheduleTrainingModal from "./components/ScheduleTrainingModal";
import TrainingDetailModal from "./components/TrainingDetailModal";
import YearlyTrainingPdfView from "./components/YearlyTrainingPdfView";
import CustomPagination from "../../components/ui/CustomPagination";
import StatCard from "./components/StatCard";
import SkeletonRow from "./components/SkeletonRow";

// ── Status config with unified professional palette ───────────────────────────
const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    badge:
      "bg-emerald-50/50 text-emerald-700 border-emerald-100/80 hover:bg-emerald-100/50",
    icon: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100",
    dot: "bg-emerald-500",
  },
  "in-progress": {
    label: "In Progress",
    badge:
      "bg-blue-50/50 text-blue-700 border-blue-100/80 hover:bg-blue-100/50",
    icon: "bg-blue-50 text-blue-600 ring-1 ring-blue-100",
    dot: "bg-blue-500",
  },
  overdue: {
    label: "Overdue",
    badge:
      "bg-rose-50/50 text-rose-700 border-rose-100/80 hover:bg-rose-100/50",
    icon: "bg-rose-50 text-rose-600 ring-1 ring-rose-100",
    dot: "bg-rose-500",
  },
  pending: {
    label: "Pending",
    badge:
      "bg-amber-50/50 text-amber-700 border-amber-100/80 hover:bg-amber-100/50",
    icon: "bg-amber-50 text-amber-600 ring-1 ring-amber-100",
    dot: "",
  },
};

const STATUS_FILTERS = [
  "All",
  "pending",
  "in-progress",
  "completed",
  "overdue",
];

// ── Main component ────────────────────────────────────────────────────────────
const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [date, setDate] = useState(null);
  const [selectRange, setSelectRange] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    fetchTrainings();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, date]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const trainingEvents = await trainingService.getAllTrainings();

      const today = new Date().toISOString().split("T")[0];
      const normalizedEvents = trainingEvents.map((e) => {
        const s = (e.status || "Pending").toLowerCase();
        // Handle overdue status on client side if not set by backend
        if (s !== "completed" && e.dueDate < today) {
          return { ...e, status: "overdue" };
        }
        return { ...e, status: s };
      });

      setTrainings(
        normalizedEvents.sort(
          (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
        ),
      );
    } catch (error) {
      console.error("Error fetching trainings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = useMemo(() => {
    return trainings.filter((t) => {
      const matchesSearch = t.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "All" || t.status === filterStatus;

      let matchesDate = true;
      if (date) {
        if (Array.isArray(date)) {
          const start = new Date(date[0]);
          const end = new Date(date[1]);
          const d = new Date(t.dueDate);
          matchesDate = d >= start && d <= end;
        } else {
          const sel = new Date(date);
          const d = new Date(t.dueDate);
          matchesDate =
            d.getDate() === sel.getDate() &&
            d.getMonth() === sel.getMonth() &&
            d.getFullYear() === sel.getFullYear();
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [trainings, searchTerm, filterStatus, date]);

  const stats = useMemo(() => {
    return {
      total: trainings.length,
      upcoming: trainings.filter((t) => {
        const today = new Date();
        const limit = new Date();
        limit.setDate(today.getDate() + 30);
        const d = new Date(t.dueDate);
        return t.status !== "completed" && d >= today && d <= limit;
      }).length,
      completed: trainings.filter((t) => t.status === "completed").length,
      overdue: trainings.filter((t) => t.status === "overdue").length,
    };
  }, [trainings]);

  const totalPages = Math.ceil(filteredTrainings.length / rowsPerPage);
  const paginatedTrainings = filteredTrainings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  if (isPreviewOpen) {
    return (
      <YearlyTrainingPdfView
        trainings={trainings}
        onBack={() => setIsPreviewOpen(false)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header with Glassmorphism subtle effect */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-4 border-b border-slate-100/80">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
              <GraduationCap className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-[950] text-slate-900 tracking-tight">
              Training Center
            </h1>
          </div>
          <p className="text-slate-500 font-semibold text-lg max-w-xl leading-relaxed">
            Ensure team excellence with structured module assignment and unified
            competency tracking.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="group flex items-center gap-2.5 px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black shadow-sm hover:border-indigo-200 hover:text-indigo-600 hover:shadow-xl hover:shadow-slate-100 active:scale-95 transition-all text-xs uppercase tracking-widest"
          >
            <FileText
              size={18}
              className="text-slate-400 group-hover:text-indigo-500 transition-colors"
            />
            Yearly Grid
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-[0_15px_30px_-5px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-xs uppercase tracking-[0.15em]"
          >
            <Plus
              className="group-hover:rotate-90 transition-transform duration-500"
              size={18}
            />
            Schedule Module
          </button>
        </div>
      </div>

      {/* Stats overlay */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Modules"
          value={stats.total}
          icon={GraduationCap}
          bar="bg-indigo-500"
          accent="text-indigo-600"
        />
        <StatCard
          title="Upcoming (30d)"
          value={stats.upcoming}
          icon={Clock}
          bar="bg-blue-500"
          accent="text-blue-600"
        />
        <StatCard
          title="Overdue"
          value={stats.overdue}
          icon={AlertCircle}
          bar="bg-rose-500"
          accent="text-rose-600"
          isRisk
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          bar="bg-emerald-500"
          accent="text-emerald-600"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Table — 8 cols */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border-0 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] ring-1 ring-slate-100 overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="px-8 py-7 border-b border-slate-50 flex flex-wrap items-center justify-between gap-6 bg-linear-to-b from-white to-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-5 bg-indigo-600 rounded-full" />
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">
                  Curriculum Pipeline
                </h2>
              </div>
              {date && (
                <button
                  onClick={() => setDate(null)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider border border-indigo-100/50 hover:bg-indigo-100 transition-all active:scale-95"
                >
                  Clear Selection <X size={12} />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-80 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Find a module..."
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50/50 border border-slate-100 rounded-[1.25rem] text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium outline-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="px-8 py-5 bg-white border-b border-slate-50 flex items-center gap-2.5 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300
                  ${
                    filterStatus === s
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200"
                      : "bg-white text-slate-400 border-slate-100 hover:border-slate-200 hover:text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {s === "All" ? "Overview" : STATUS_CONFIG[s].label}
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${filterStatus === s ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}
                >
                  {s === "All"
                    ? trainings.length
                    : trainings.filter((t) => t.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {/* Table Content with Enhanced Scrollability */}
          <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
            <div className="overflow-x-auto overflow-y-auto max-h-[min(640px,70vh)] scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent scrollbar-gutter-stable">
              <table className="w-full border-separate border-spacing-0">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-slate-50/90 backdrop-blur-md text-left border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Requirement
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Assignee
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                      Status
                    </th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))
                  ) : paginatedTrainings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-20 text-center text-slate-400 font-bold italic"
                      >
                        No training events found matching current criteria.
                      </td>
                    </tr>
                  ) : (
                    paginatedTrainings.map((training) => {
                      const cfg =
                        STATUS_CONFIG[training.status] || STATUS_CONFIG.pending;
                      return (
                        <tr
                          key={training.id}
                          className="group hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 ${cfg.icon}`}
                              >
                                <GraduationCap size={18} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-[750] text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                  {training.title}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                  Requirement ID: #TRN-
                                  {training.id || training.eventId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                {training.assignedTo?.[0]}
                              </div>
                              <span className="text-[11px] font-bold text-slate-600">
                                {training.assignedTo}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <div className="flex flex-col items-center">
                              <span
                                className={`text-[11px] font-extrabold tracking-tight ${
                                  training.status === "overdue"
                                    ? "text-rose-600"
                                    : "text-slate-600"
                                }`}
                              >
                                {new Date(training.dueDate).toLocaleDateString(
                                  "en-GB",
                                  { day: "2-digit", month: "short" },
                                )}
                              </span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">
                                {new Date(training.dueDate).getFullYear()}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center text-gray-600">
                            <span
                              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border transition-all ${cfg.badge}`}
                            >
                              {cfg.dot && (
                                <span
                                  className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${cfg.dot}`}
                                />
                              )}
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => {
                                setSelectedTraining(training);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 rounded-2xl transition-all active:scale-95 group/btn"
                            >
                              <ChevronRight
                                size={20}
                                className="transition-transform group-hover/btn:translate-x-1"
                              />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {!loading && paginatedTrainings.length > 0 && (
            <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Showing {paginatedTrainings.length} of{" "}
                {filteredTrainings.length} events
              </p>
              <CustomPagination
                count={totalPages}
                page={currentPage}
                onChange={(e, p) => setCurrentPage(p)}
                size="small"
              />
            </div>
          )}
        </div>

        {/* Calendar — 4 cols */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-100 shadow-sm p-2">
          <CustomCalendar
            date={date}
            setDate={setDate}
            selectRange={selectRange}
            setSelectRange={setSelectRange}
            trainings={trainings}
          />
        </div>
      </div>

      <ScheduleTrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDate={date}
        onSuccess={fetchTrainings}
      />

      <TrainingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        training={selectedTraining}
        onSuccess={fetchTrainings}
      />
    </div>
  );
};

export default Training;
