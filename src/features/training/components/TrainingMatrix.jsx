import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Minus,
  Users,
  LayoutGrid,
  Search,
  ChevronDown,
  Loader2,
  Filter,
  Award,
} from "lucide-react";
import trainingService from "../services/trainingService";

/* ═══════════════════════════════════════════════════════════════
   STATUS CONFIGURATION — single source of truth
   ═══════════════════════════════════════════════════════════════ */
const STATUS = {
  completed: {
    Icon: CheckCircle2,
    cell: "bg-emerald-50/70",
    cellHover: "bg-emerald-100/60",
    dot: "bg-emerald-500",
    text: "text-emerald-600",
    label: "Qualified",
  },
  "in-progress": {
    Icon: Clock,
    cell: "bg-sky-50/70",
    cellHover: "bg-sky-100/60",
    dot: "bg-sky-500",
    text: "text-sky-600",
    label: "In Training",
  },
  pending: {
    Icon: AlertCircle,
    cell: "bg-amber-50/70",
    cellHover: "bg-amber-100/60",
    dot: "",
    text: "text-amber-600",
    label: "Pending",
  },
  overdue: {
    Icon: AlertCircle,
    cell: "bg-red-50/70",
    cellHover: "bg-red-100/60",
    dot: "bg-red-500",
    text: "text-red-600",
    label: "Overdue",
  },
  "not-required": {
    Icon: Minus,
    cell: "",
    cellHover: "bg-slate-50",
    dot: "bg-slate-200",
    text: "text-slate-300",
    label: "N/A",
  },
};

const LEGEND_KEYS = ["completed", "in-progress", "pending", "overdue"];

/* ═══════════════════════════════════════════════════════════════
   UTILITY HELPERS
   ═══════════════════════════════════════════════════════════════ */
const getRowStats = (personId, modules, matrixData) => {
  const total = modules.length;
  if (!total) return null;
  const done = modules.filter(
    (m) => matrixData[personId]?.[m.name] === "completed",
  ).length;
  const pct = Math.round((done / total) * 100);
  return { done, total, pct };
};

const getCompletionColor = (pct) => {
  if (pct === 100) return { bar: "bg-emerald-500", text: "text-emerald-700" };
  if (pct >= 60) return { bar: "bg-sky-500", text: "text-sky-700" };
  if (pct >= 30) return { bar: "bg-amber-400", text: "text-amber-700" };
  return { bar: "bg-red-400", text: "text-red-700" };
};

/* ═══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/** Skeleton loader row */
const SkeletonRow = ({ cols }) => (
  <tr className="animate-pulse">
    <td className="px-5 py-3.5 sticky left-0 bg-white z-10 border-r border-slate-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100" />
        <div>
          <div className="h-3 w-28 bg-slate-100 rounded mb-1.5" />
          <div className="h-2 w-18 bg-slate-50 rounded" />
        </div>
      </div>
    </td>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-2 py-3.5 text-center">
        <div className="w-5 h-5 rounded-md bg-slate-50 mx-auto" />
      </td>
    ))}
    <td className="px-4 py-3.5">
      <div className="h-1.5 w-20 bg-slate-100 rounded-full" />
    </td>
  </tr>
);

/** Status cell icon */
const StatusCell = ({ status, title }) => {
  const cfg = STATUS[status] ?? STATUS["not-required"];
  const { Icon } = cfg;
  return (
    <td
      className={`px-2 py-3 text-center transition-colors duration-150 ${cfg.cell} hover:${cfg.cellHover}`}
      title={title}
    >
      <div className="flex items-center justify-center">
        <Icon size={15} className={cfg.text} strokeWidth={2.25} />
      </div>
    </td>
  );
};

/** Completion bar */
const CompletionBar = ({ stats }) => {
  if (!stats) return <span className="text-[10px] text-slate-300">—</span>;
  const colors = getCompletionColor(stats.pct);
  return (
    <div className="w-full min-w-[80px]">
      <div className="flex items-baseline justify-between mb-1 gap-2">
        <span className="text-[11px] font-medium text-slate-500 tabular-nums">
          {stats.done}/{stats.total}
        </span>
        <span className={`text-[11px] font-bold tabular-nums ${colors.text}`}>
          {stats.pct}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colors.bar}`}
          style={{ width: `${stats.pct}%` }}
        />
      </div>
    </div>
  );
};

/** Summary stat card */
const StatCard = ({ label, count, dotColor, total }) => {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
      {dotColor && (
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
      )}
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500 font-medium leading-none">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 mt-0.5 leading-none tabular-nums">
          {count}
          <span className="text-slate-300 font-normal text-[10px] ml-0.5">
            ({pct}%)
          </span>
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const TrainingMatrix = () => {
  const [staff, setStaff] = useState([]);
  const [modules, setModules] = useState([]);
  const [matrixData, setMatrixData] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ── Data fetch ── */
  useEffect(() => {
    const loadMatrixData = async () => {
      try {
        setLoading(true);
        const [staffList, eventTypes, allTrainings] = await Promise.all([
          trainingService.getStaff(),
          trainingService.getEventTypes(),
          trainingService.getAllTrainings(),
        ]);

        const staffDataMapped = staffList.map((s) => ({
          id: s.staffId,
          name: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
          role: s.jobTitle,
        }));

        const trainingType = eventTypes.find((t) => t.name === "Training");
        if (!trainingType) {
          setStaff(staffDataMapped);
          setLoading(false);
          return;
        }

        const trainingEvents = allTrainings.filter(
          (e) => e.eventTypeId === trainingType.id,
        );

        const uniqueTitles = [...new Set(trainingEvents.map((e) => e.title))];
        const moduleList = uniqueTitles.map((title, idx) => ({
          id: `mod-${idx}`,
          name: title,
        }));
        setModules(moduleList);

        const today = new Date().toISOString().split("T")[0];
        const calculatedMatrix = {};

        const attendancePromises = trainingEvents.map((e) =>
          trainingService.getAttendanceByEventId(e.eventId || e.id),
        );
        const allAttendanceArrays = await Promise.all(attendancePromises);
        const allAttendance = allAttendanceArrays.flat();

        staffDataMapped.forEach((person) => {
          calculatedMatrix[person.id] = {};
          uniqueTitles.forEach((title) => {
            const records = allAttendance.filter((a) => {
              const event = trainingEvents.find(
                (e) => (e.eventId || e.id) === a.eventId,
              );
              return a.staffId === person.id && event && event.title === title;
            });

            if (records.length > 0) {
              const latestRecord = records.sort((a, b) => {
                const eA = trainingEvents.find(
                  (e) => (e.eventId || e.id) === a.eventId,
                );
                const eB = trainingEvents.find(
                  (e) => (e.eventId || e.id) === b.eventId,
                );
                return new Date(eB.dueDate) - new Date(eA.dueDate);
              })[0];

              const relatedEvent = trainingEvents.find(
                (e) => (e.eventId || e.id) === latestRecord.eventId,
              );

              if (latestRecord.status.toLowerCase() === "completed") {
                calculatedMatrix[person.id][title] = "completed";
              } else if (relatedEvent.dueDate < today) {
                calculatedMatrix[person.id][title] = "overdue";
              } else {
                calculatedMatrix[person.id][title] =
                  latestRecord.status.toLowerCase();
              }
            } else {
              calculatedMatrix[person.id][title] = "not-required";
            }
          });
        });

        setStaff(staffDataMapped);
        setMatrixData(calculatedMatrix);
      } catch (error) {
        console.error("Error loading matrix data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatrixData();
  }, []);

  /* ── Derived data ── */
  const summaryCounts = useMemo(() => {
    if (loading) return null;
    return Object.values(matrixData).reduce(
      (acc, row) => {
        Object.values(row).forEach((s) => {
          if (acc[s] !== undefined) acc[s]++;
        });
        return acc;
      },
      { completed: 0, "in-progress": 0, pending: 0, overdue: 0 },
    );
  }, [matrixData, loading]);

  const totalTracked = summaryCounts
    ? Object.values(summaryCounts).reduce((a, b) => a + b, 0)
    : 0;

  const filteredStaff = useMemo(() => {
    let result = staff;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.role && p.role.toLowerCase().includes(q)),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => {
        const row = matrixData[p.id] || {};
        return Object.values(row).some((s) => s === statusFilter);
      });
    }

    return result;
  }, [staff, searchQuery, statusFilter, matrixData]);

  /* ── Render ── */
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* ─── HEADER ─── */}
      <div className="flex-shrink-0 border-b border-slate-100">
        {/* Top bar */}
        <div className="px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-xl shadow-sm">
              <LayoutGrid className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 leading-tight">
                Competency Matrix
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                {staff.length} staff · {modules.length} modules
              </p>
            </div>
          </div>

          {/* Search + filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search staff…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 w-44 sm:w-52 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-400 transition-all"
              />
            </div>
            <div className="relative">
              <Filter
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-8 pr-8 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-400 transition-all"
              >
                <option value="all">All statuses</option>
                {LEGEND_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {STATUS[key].label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Summary stats bar */}
        {summaryCounts && (
          <div className="px-5 sm:px-6 pb-4 flex flex-wrap gap-2">
            {LEGEND_KEYS.map((key) => (
              <StatCard
                key={key}
                label={STATUS[key].label}
                count={summaryCounts[key]}
                dotColor={STATUS[key].dot}
                total={totalTracked}
              />
            ))}
          </div>
        )}
      </div>

      {/* ─── TABLE ─── */}
      <div className="overflow-auto flex-1">
        {loading ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="sticky left-0 z-20 bg-slate-50/80 px-5 py-3 border-r border-slate-100 min-w-[220px]">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Staff Member
                  </span>
                </th>
                {Array.from({ length: 3 }).map((_, i) => (
                  <th key={i} className="px-2 py-3 w-16" />
                ))}
                <th className="px-4 py-3 min-w-[100px]">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Completion
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonRow key={i} cols={3} />
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                {/* Sticky name column */}
                <th className="sticky left-0 z-20 bg-slate-50/80 px-5 py-3 border-r border-slate-100 min-w-[220px]">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Staff Member
                    </span>
                  </div>
                </th>

                {/* Module column headers — vertical text */}
                {modules.map((mod) => (
                  <th
                    key={mod.id}
                    className="px-1.5 py-3 text-center align-bottom w-14 min-w-[52px]"
                  >
                    <div className="flex justify-center">
                      <span
                        className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap leading-tight"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          display: "inline-block",
                          minHeight: "90px",
                          paddingBottom: "2px",
                        }}
                        title={mod.name}
                      >
                        {mod.name.length > 22
                          ? `${mod.name.slice(0, 20)}…`
                          : mod.name}
                      </span>
                    </div>
                  </th>
                ))}

                {/* Completion column */}
                <th className="px-4 py-3 min-w-[100px]">
                  <div className="flex items-center gap-1.5">
                    <Award size={13} className="text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Completion
                    </span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan={modules.length + 2}
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users size={18} className="text-slate-300" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">
                        {searchQuery || statusFilter !== "all"
                          ? "No staff match your filters"
                          : "No active staff found"}
                      </p>
                      {(searchQuery || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold mt-1"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((person) => {
                  const stats = getRowStats(person.id, modules, matrixData);
                  const initials = person.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={person.id}
                      className="group hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      {/* Sticky name cell */}
                      <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/50 transition-colors duration-150 px-5 py-3 border-r border-slate-100 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.04)]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-slate-500 group-hover:text-indigo-600 transition-colors duration-200 flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                              {person.name}
                            </p>
                            {person.role && (
                              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                                {person.role}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Status cells */}
                      {modules.map((mod) => {
                        const status =
                          matrixData[person.id]?.[mod.name] ?? "not-required";
                        return (
                          <StatusCell
                            key={mod.id}
                            status={status}
                            title={`${person.name} · ${mod.name} · ${STATUS[status]?.label || "N/A"}`}
                          />
                        );
                      })}

                      {/* Completion bar */}
                      <td className="px-4 py-3">
                        <CompletionBar stats={stats} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ─── FOOTER ─── */}
      {!loading && filteredStaff.length > 0 && (
        <div className="flex-shrink-0 px-5 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 font-medium">
            Showing {filteredStaff.length} of {staff.length} staff members
          </p>
          {searchQuery || statusFilter !== "all" ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="text-[11px] text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Reset filters
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TrainingMatrix;
