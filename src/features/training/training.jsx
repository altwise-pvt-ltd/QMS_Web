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
import { getAllEvents } from "../compliance_calendar/services/complianceService";
import { db } from "../../db";
import CustomCalendar from "./components/CustomCalendar";
import ScheduleTrainingModal from "./components/ScheduleTrainingModal";
import YearlyTrainingPdfView from "./components/YearlyTrainingPdfView";
import CustomPagination from "../../components/ui/CustomPagination";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    row: "",
    icon: "bg-emerald-100 text-emerald-600",
  },
  "in-progress": {
    label: "In Progress",
    badge: "bg-blue-50 text-blue-700 border-blue-100",
    row: "",
    icon: "bg-blue-100 text-blue-600",
  },
  overdue: {
    label: "Overdue",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
    row: "bg-rose-50/30",
    icon: "bg-rose-100 text-rose-600",
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    row: "",
    icon: "bg-amber-50 text-amber-600",
  },
};

const STATUS_FILTERS = [
  "All",
  "pending",
  "in-progress",
  "completed",
  "overdue",
];

// ── Stat card component ───────────────────────────────────────────────────────
const StatCard = ({
  title,
  value,
  icon: Icon,
  bar,
  accent,
  isRisk,
  trend,
  trendType,
}) => {
  const isCritical = isRisk && value > 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 overflow-hidden
        ${
          isCritical
            ? "border-rose-100 ring-4 ring-rose-50/30"
            : "border-slate-100 hover:border-slate-200"
        }`}
    >
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${bar} opacity-80 ${
          isCritical ? "animate-pulse" : ""
        }`}
      />

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mb-2.5">
              {title}
            </p>

            <div className="flex flex-col gap-1">
              <h3
                className={`text-3xl font-black tracking-tight leading-none ${
                  isCritical ? "text-rose-600" : "text-slate-900"
                }`}
              >
                {value}
              </h3>

              {trend && (
                <div className="mt-2 flex items-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ring-1 ring-inset ${
                      trendType === "up"
                        ? "bg-emerald-50 text-emerald-600 ring-emerald-600/10"
                        : trendType === "down"
                          ? "bg-rose-50 text-rose-600 ring-rose-600/10"
                          : "bg-slate-50 text-slate-500 ring-slate-600/10"
                    }`}
                  >
                    {trendType === "up" && <TrendingUp size={10} />}
                    {trendType === "down" && <TrendingDown size={10} />}
                    {trendType === "neutral" && <Minus size={10} />}
                    {trend}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div
              className={`absolute inset-0 rounded-xl blur-lg opacity-20 transition-all duration-500 group-hover:opacity-40 ${
                isCritical ? "bg-rose-400" : "bg-slate-400"
              }`}
            />
            <div
              className={`relative p-3.5 rounded-xl border transition-all duration-500 transform group-hover:rotate-6 ${
                isCritical
                  ? "bg-rose-50 border-rose-100 text-rose-600 shadow-sm"
                  : `bg-slate-50 border-slate-100 ${accent} shadow-sm group-hover:bg-white`
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.2px]" />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute -left-2 -bottom-2 opacity-[0.04] transition-all duration-700 pointer-events-none group-hover:scale-125 group-hover:rotate-12 ${accent}`}
      >
        <Icon size={72} />
      </div>
    </div>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-slate-50">
    {[220, 100, 100, 80, 80, 60].map((w, i) => (
      <td key={i} className="px-5 py-3.5">
        <div className={`h-3 bg-slate-100 rounded`} style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
      const allEvents = await getAllEvents();
      const eventTypes = await db.compliance_event_types.toArray();
      const trainingType = eventTypes.find((t) => t.name === "Training");

      if (trainingType) {
        const today = new Date().toISOString().split("T")[0];
        const trainingEvents = allEvents
          .filter((e) => e.eventTypeId === trainingType.id)
          .map((e) => {
            if (!e.givenBy) {
              e.givenBy = "Quality Manager";
              db.compliance_events.update(e.id, { givenBy: "Quality Manager" });
            }
            if (e.status !== "completed" && e.dueDate < today) {
              return { ...e, status: "overdue" };
            }
            return e;
          });

        setTrainings(
          trainingEvents.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
          ),
        );
      }
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="text-indigo-600" size={32} />
            Training Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Monitor personnel competency and training schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black shadow-sm hover:border-indigo-300 hover:text-indigo-600 active:scale-95 transition-all text-sm"
          >
            <FileText size={20} />
            Yearly Preview
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm"
          >
            <Plus
              className="group-hover:rotate-180 transition-transform duration-500"
              size={20}
            />
            Schedule Training
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
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {/* Table Toolbar */}
          <div className="p-6 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                Training Schedule
              </h2>
              {date && (
                <button
                  onClick={() => setDate(null)}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase border border-indigo-100 hover:bg-indigo-100 transition-colors"
                >
                  Filter Active <X size={10} />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search trainings..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all
                  ${
                    filterStatus === s
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
              >
                {s === "All" ? "All" : STATUS_CONFIG[s].label}
                {s !== "All" && (
                  <span className="ml-1.5 opacity-60">
                    ({trainings.filter((t) => t.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 text-left border-b border-slate-50">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Requirement
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Given By
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
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.icon}`}
                            >
                              <GraduationCap size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-800">
                              {training.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                            {training.givenBy}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                            {training.assignedTo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-[11px] font-black ${training.status === "overdue" ? "text-rose-600" : "text-slate-600"}`}
                          >
                            {new Date(training.dueDate).toLocaleDateString(
                              "en-GB",
                              { day: "numeric", month: "short" },
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cfg.badge}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
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
    </div>
  );
};

export default Training;
