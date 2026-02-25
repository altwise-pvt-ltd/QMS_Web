import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Users,
  Layout,
  Clock,
  Minus,
} from "lucide-react";
import { db } from "../../../db";

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  completed: {
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    cell: "bg-emerald-50",
    dot: "bg-emerald-500",
    label: "Qualified",
  },
  "in-progress": {
    icon: <Clock className="w-3.5 h-3.5 text-blue-500" />,
    cell: "bg-blue-50",
    dot: "bg-blue-500",
    label: "In Training",
  },
  pending: {
    icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
    cell: "bg-amber-50",
    dot: "bg-amber-400",
    label: "Pending",
  },
  overdue: {
    icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
    cell: "bg-rose-50",
    dot: "bg-rose-500",
    label: "Overdue",
  },
  "not-required": {
    icon: <Minus className="w-3.5 h-3.5 text-slate-300" />,
    cell: "",
    dot: "bg-slate-200",
    label: "N/A",
  },
};

const LEGEND = ["completed", "in-progress", "pending", "overdue"];

// ── Completion % per staff row ────────────────────────────────────────────────
const getRowStats = (personId, modules, matrixData) => {
  const total = modules.length;
  if (!total) return null;
  const done = modules.filter(
    (m) => matrixData[personId]?.[m.name] === "completed",
  ).length;
  const pct = Math.round((done / total) * 100);
  return { done, total, pct };
};

// ── Skeleton loader row ───────────────────────────────────────────────────────
const SkeletonRow = ({ cols }) => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-slate-100">
      <div className="h-3 w-32 bg-slate-100 rounded mb-1.5" />
      <div className="h-2 w-20 bg-slate-100 rounded" />
    </td>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-3 py-4 text-center">
        <div className="w-5 h-5 rounded-full bg-slate-100 mx-auto" />
      </td>
    ))}
    <td className="px-5 py-4">
      <div className="h-1.5 w-20 bg-slate-100 rounded-full" />
    </td>
  </tr>
);

// ── Main component ────────────────────────────────────────────────────────────
const TrainingMatrix = () => {
  const [staff, setStaff] = useState([]);
  const [modules, setModules] = useState([]);
  const [matrixData, setMatrixData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatrixData = async () => {
      try {
        setLoading(true);
        const staffData = await db.staff.toArray();
        const eventTypes = await db.compliance_event_types.toArray();
        const trainingType = eventTypes.find((t) => t.name === "Training");

        if (!trainingType) {
          setStaff(staffData);
          setLoading(false);
          return;
        }

        const trainingEvents = await db.compliance_events
          .where("eventTypeId")
          .equals(trainingType.id)
          .toArray();

        const uniqueTitles = [...new Set(trainingEvents.map((e) => e.title))];
        const moduleList = uniqueTitles.map((title, idx) => ({
          id: `mod-${idx}`,
          name: title,
        }));
        setModules(moduleList);

        const attendance = await db.training_attendance.toArray();
        const today = new Date().toISOString().split("T")[0];

        const calculatedMatrix = {};
        staffData.forEach((person) => {
          calculatedMatrix[person.id] = {};
          uniqueTitles.forEach((title) => {
            const records = attendance.filter((a) => {
              const event = trainingEvents.find((e) => e.id === a.eventId);
              return a.staffId === person.id && event && event.title === title;
            });

            if (records.length > 0) {
              const latestRecord = records.sort((a, b) => {
                const eA = trainingEvents.find((e) => e.id === a.eventId);
                const eB = trainingEvents.find((e) => e.id === b.eventId);
                return new Date(eB.dueDate) - new Date(eA.dueDate);
              })[0];

              const relatedEvent = trainingEvents.find(
                (e) => e.id === latestRecord.eventId,
              );

              if (latestRecord.status === "completed") {
                calculatedMatrix[person.id][title] = "completed";
              } else if (relatedEvent.dueDate < today) {
                calculatedMatrix[person.id][title] = "overdue";
              } else {
                calculatedMatrix[person.id][title] = latestRecord.status;
              }
            } else {
              calculatedMatrix[person.id][title] = "not-required";
            }
          });
        });

        setStaff(staffData);
        setMatrixData(calculatedMatrix);
      } catch (error) {
        console.error("Error loading matrix data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatrixData();
  }, []);

  // Summary counts across all cells
  const summaryCounts = !loading
    ? Object.values(matrixData).reduce(
        (acc, row) => {
          Object.values(row).forEach((s) => {
            if (acc[s] !== undefined) acc[s]++;
          });
          return acc;
        },
        { completed: 0, "in-progress": 0, pending: 0, overdue: 0 },
      )
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 sticky top-0 bg-white z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-xl shadow-sm shadow-indigo-200">
            <Layout className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase">
              Competency Matrix
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Live Staff Qualification Tracking
            </p>
          </div>
        </div>

        {/* Legend + summary counts */}
        <div className="flex flex-wrap items-center gap-3">
          {LEGEND.map((key) => {
            const s = STATUS[key];
            return (
              <div key={key} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {s.label}
                </span>
                {summaryCounts && (
                  <span className="text-[10px] font-black text-slate-400">
                    ({summaryCounts[key]})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable table ─────────────────────────────────────── */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {/* Sticky name col header */}
              <th className="sticky left-0 z-20 bg-slate-50 px-6 py-4 border-r border-slate-100 min-w-[220px]">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Users className="w-3.5 h-3.5" />
                  Staff Member
                </div>
              </th>

              {/* Module columns — rotated labels */}
              {modules.map((mod) => (
                <th
                  key={mod.id}
                  className="px-2 py-4 text-center align-bottom w-16 min-w-[56px]"
                >
                  <div className="flex justify-center">
                    <span
                      className="text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        display: "inline-block",
                        minHeight: "100px",
                        paddingBottom: "4px",
                      }}
                    >
                      {mod.name}
                    </span>
                  </div>
                </th>
              ))}

              {/* Completion col */}
              <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-[120px]">
                Completion
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {loading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <SkeletonRow key={i} cols={3} />
              ))
            ) : staff.length === 0 ? (
              <tr>
                <td
                  colSpan={modules.length + 2}
                  className="py-16 text-center text-sm text-slate-400 font-medium"
                >
                  No active staff found in directory.
                </td>
              </tr>
            ) : (
              staff.map((person) => {
                const stats = getRowStats(person.id, modules, matrixData);
                return (
                  <tr
                    key={person.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Sticky name cell */}
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50/60 transition-colors px-6 py-4 border-r border-slate-100 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.04)]">
                      <p className="text-sm font-bold text-slate-800 whitespace-nowrap">
                        {person.name}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight mt-0.5">
                        {person.role}
                      </p>
                    </td>

                    {/* Status cells */}
                    {modules.map((mod) => {
                      const status =
                        matrixData[person.id]?.[mod.name] ?? "not-required";
                      const cfg = STATUS[status] ?? STATUS["not-required"];
                      return (
                        <td
                          key={mod.id}
                          className={`px-2 py-4 text-center ${cfg.cell}`}
                          title={`${person.name} · ${mod.name} · ${cfg.label}`}
                        >
                          <div className="flex items-center justify-center">
                            {cfg.icon}
                          </div>
                        </td>
                      );
                    })}

                    {/* Completion bar */}
                    <td className="px-5 py-4">
                      {stats ? (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-500">
                              {stats.done}/{stats.total}
                            </span>
                            <span
                              className={`text-[10px] font-black ${
                                stats.pct === 100
                                  ? "text-emerald-600"
                                  : stats.pct >= 50
                                    ? "text-indigo-600"
                                    : "text-amber-600"
                              }`}
                            >
                              {stats.pct}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                stats.pct === 100
                                  ? "bg-emerald-500"
                                  : stats.pct >= 50
                                    ? "bg-indigo-500"
                                    : "bg-amber-400"
                              }`}
                              style={{ width: `${stats.pct}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingMatrix;
