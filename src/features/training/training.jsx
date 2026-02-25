import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  ChevronRight,
  AlertCircle,
  FileText,
  X,
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

// ── Stat card ─────────────────────────────────────────────────────────────────
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

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
      {/* Top Progress Bar - Uses a subtle gradient instead of solid color */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${bar} opacity-80 ${isCritical ? "animate-pulse" : ""}`}
      />

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title: Increased tracking and slightly softer color for better scanability */}
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

              {/* Trend Badge: More compact and professional */}
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

          {/* Icon Section: Enhanced with a soft shadow and scale effect */}
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-xl blur-lg opacity-20 transition-all duration-500 group-hover:opacity-40 ${isCritical ? "bg-rose-400" : "bg-slate-400"}`}
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

      {/* Background Graphic: Moved to bottom-left for a different visual balance */}
      <div
        className={`absolute -left-2 -bottom-2 opacity-[0.04] transition-all duration-700 pointer-events-none group-hover:scale-125 group-hover:rotate-12 ${accent}`}
      >
        <Icon size={72} weight="fill" />
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

  const filteredTrainings = trainings.filter((t) => {
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

  const stats = {
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

  const totalPages = Math.ceil(filteredTrainings.length / rowsPerPage);
  const paginatedTrainings = filteredTrainings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const hasActiveFilters = filterStatus !== "All" || searchTerm || date;

  if (isPreviewOpen) {
    return (
      <YearlyTrainingPdfView
        trainings={trainings}
        onBack={() => setIsPreviewOpen(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <span className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200">
              <GraduationCap className="w-5 h-5 text-white" />
            </span>
            Training Management
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-1.5 ml-0.5">
            Personnel competency and training schedules
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700
                       text-sm font-bold rounded-xl shadow-sm hover:border-indigo-300 hover:text-indigo-600
                       active:scale-95 transition-all"
          >
            <FileText className="w-4 h-4" />
            Yearly Preview
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-gray-600
                       text-sm font-bold rounded-xl shadow-sm shadow-indigo-200
                       hover:bg-indigo-700 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Schedule Training
          </button>
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* ── Main grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-5 items-start">
        {/* Training schedule table — 8 cols */}
        <div className="col-span-12 xl:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Table toolbar */}
          <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                Training Schedule
              </h2>
              {date && (
                <button
                  onClick={() => setDate(null)}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50
                             border border-indigo-100 px-2 py-0.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  Date filter active <X className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search trainings…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm
                           text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2
                           focus:ring-indigo-500/20 focus:border-indigo-400 transition-all w-56"
              />
            </div>
          </div>

          {/* Status filter pills */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2 flex-wrap">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all
                  ${
                    filterStatus === s
                      ? "bg-indigo-600 text-gray-900 border-indigo-600 shadow-sm"
                      : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
              >
                {s === "All" ? "All" : (STATUS_CONFIG[s]?.label ?? s)}
                {s !== "All" && (
                  <span className="ml-1 opacity-60">
                    ({trainings.filter((t) => t.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "Training Requirement",
                    "Given By",
                    "Assignee",
                    "Due Date",
                    "Status",
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                ) : paginatedTrainings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-sm text-slate-400 font-medium"
                    >
                      No training events found
                    </td>
                  </tr>
                ) : (
                  paginatedTrainings.map((training) => {
                    const cfg =
                      STATUS_CONFIG[training.status] ?? STATUS_CONFIG.pending;
                    return (
                      <tr
                        key={training.id}
                        className={`hover:bg-slate-50/60 transition-colors group ${cfg.row}`}
                      >
                        {/* Title */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cfg.icon}`}
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm font-semibold text-slate-800 leading-snug">
                              {training.title}
                            </span>
                          </div>
                        </td>

                        {/* Given by */}
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                            {training.givenBy || "—"}
                          </span>
                        </td>

                        {/* Assignee */}
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                            {training.assignedTo}
                          </span>
                        </td>

                        {/* Due date */}
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span
                            className={`text-sm font-bold ${training.status === "overdue" ? "text-rose-600" : "text-slate-700"}`}
                          >
                            {new Date(training.dueDate).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "2-digit",
                              },
                            )}
                          </span>
                        </td>

                        {/* Status badge */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${cfg.badge}`}
                          >
                            {cfg.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-3.5">
                          <button
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500
                                             hover:bg-indigo-600 hover:text-gray-600 transition-all text-[10px] font-black uppercase tracking-wide border border-slate-200 hover:border-indigo-600"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer with Pagination */}
          {!loading && filteredTrainings.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 italic">
                Showing {paginatedTrainings.length} of{" "}
                {filteredTrainings.length} training events
              </span>
              <CustomPagination
                count={totalPages}
                page={currentPage}
                onChange={(e, p) => setCurrentPage(p)}
                size="small"
                showText={false}
              />
            </div>
          )}
        </div>

        {/* Calendar — 4 cols */}
        <div className="col-span-12 xl:col-span-4">
          <CustomCalendar
            date={date}
            setDate={setDate}
            selectRange={selectRange}
            setSelectRange={setSelectRange}
            trainings={trainings}
          />
        </div>
      </div>

      {/* ── Modal ───────────────────────────────────────────────── */}
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
