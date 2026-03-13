import React, { useState } from "react";
import {
  Icons,
  Icon,
  css,
  CYCLE_COLOR,
  CycleBadge,
  getDaysInMonth,
  formatDate,
  TODAY,
} from "./Common";

export function EntryDetailScreen({
  entry,
  records,
  loading,
  onBack,
  onSelectParam,
}) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  });

  const currentYear = parseInt(selectedMonth.split("-")[0], 10);
  const currentMonth = parseInt(selectedMonth.split("-")[1], 10) - 1;

  const monthDates = getDaysInMonth(currentYear, currentMonth);
  const monthLabel = new Date(currentYear, currentMonth).toLocaleDateString(
    "en-GB",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start lg:items-center gap-4">
        <button onClick={onBack} className={css.btnSec + " py-2 px-3 w-fit"}>
          <Icon d={Icons.back} size={16} />
        </button>

        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
              <Icon d={Icons.entry} size={28} color="#fff" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 truncate">
                {entry.name}
              </h1>

              <div className="flex items-center gap-2 mt-1">
                <CycleBadge cycle={entry.recordingCycle} />
                <span className="text-xs text-slate-400 font-medium">
                  {loading ? "..." : entry.entryParameters?.length || 0}{" "}
                  parameters
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectParam({ id: "pdf-view", name: "Report" })}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            <Icon d={Icons.download} size={16} />
            Print Monthly Report
          </button>
        </div>
      </div>

      {/* Parameter Cards */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Select a Parameter
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={css.card + " p-5 h-32 animate-pulse bg-slate-50"}
                />
              ))
            : (entry.entryParameters || []).map((param, idx) => {
                const paramRecords = records.filter(
                  (r) => r.parameterId === param.id,
                );

                const filled = monthDates.filter((d) =>
                  paramRecords.some((r) => r.date === d),
                ).length;

                const missed = monthDates.filter(
                  (d) => d <= TODAY && !paramRecords.some((r) => r.date === d),
                ).length;

                const pct = Math.round((filled / monthDates.length) * 100);
                const c = Object.values(CYCLE_COLOR)[idx % 3];

                return (
                  <button
                    key={param.id}
                    onClick={() => onSelectParam(param)}
                    className={
                      css.card +
                      " p-5 text-left hover:shadow-md active:scale-95 transition-all group"
                    }
                    style={{ borderColor: c.border }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="p-2.5 rounded-xl"
                        style={{ background: c.bg }}
                      >
                        <Icon d={Icons.clock} size={20} color={c.text} />
                      </div>

                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: c.bg, color: c.text }}
                      >
                        {pct}%
                      </span>
                    </div>

                    <h3 className="font-black text-slate-800 group-hover:text-indigo-600">
                      {param.name}
                    </h3>

                    <p className="text-[11px] text-slate-400 mt-1">
                      {filled} filled · {missed} missed this month
                    </p>

                    <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: c.dot }}
                      />
                    </div>
                  </button>
                );
              })}
        </div>
      </div>

      {/* Monthly Table */}
      <div className={css.card + " overflow-hidden"}>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon d={Icons.cal} size={16} color="#6366F1" />
            <h3 className="font-bold text-slate-700 text-sm">
              Monthly Overview — {monthLabel}
            </h3>
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-indigo-700"
          />
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-400 uppercase">
                  Date
                </th>

                {(entry.entryParameters || []).map((p) => (
                  <th
                    key={p.id}
                    className="px-4 py-3 text-center font-bold text-slate-400 uppercase"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {monthDates.map((date) => (
                <tr key={date} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-600">
                    {formatDate(date)}
                  </td>

                  {(entry.entryParameters || []).map((param) => {
                    const rec = records.find(
                      (r) => r.parameterId === param.id && r.date === date,
                    );

                    const isMissed = !rec && date <= TODAY;

                    return (
                      <td key={param.id} className="px-4 py-3 text-center">
                        {rec ? (
                          <span className="font-bold text-slate-800">
                            {rec.value}
                          </span>
                        ) : isMissed ? (
                          <span className="text-red-400">—</span>
                        ) : (
                          <span className="text-slate-200">·</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
