import React, { useState } from "react";
import { Icons, Icon, css, CYCLE_COLOR, CycleBadge } from "./Common";
import { SummaryCards } from "./SummaryCards";

export function DashboardScreen({
  entries,
  onSelect,
  onCreateNew,
  onEditEntry,
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = entries.filter((e) => {
    const matchCycle = filter === "all" || e.recordingCycle === filter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    return matchCycle && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <Icon d={Icons.entry} size={28} color="currentColor" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Entries Management
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Track and manage your monitoring cycles
            </p>
          </div>
        </div>
        <button
          onClick={onCreateNew}
          className={css.btnPri + " w-full sm:w-auto"}
        >
          <Icon d={Icons.plus} size={16} strokeWidth={3} />
          Create Entry
        </button>
      </div>

      <SummaryCards
        entries={entries}
        activeFilter={filter}
        onFilter={setFilter}
      />

      <div className={css.card + " overflow-hidden"}>
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Icon d={Icons.search} size={16} />
            </span>
            <input
              className={css.input + " pl-10"}
              placeholder="Search entries by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Icon d={Icons.search} size={32} color="#CBD5E1" />
            <p className="mt-3 text-sm font-medium text-slate-400">
              No entries found
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-5 sm:py-4 hover:bg-slate-50 transition-colors group gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background:
                        CYCLE_COLOR[entry.recordingCycle]?.bg || "#F8FAFC",
                    }}
                  >
                    <Icon
                      d={Icons.entry}
                      size={18}
                      color={
                        CYCLE_COLOR[entry.recordingCycle]?.text || "#64748B"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors whitespace-normal sm:truncate">
                      {entry.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <CycleBadge cycle={entry.recordingCycle} />
                      <span className="text-[11px] text-slate-400 font-medium">
                        {entry.entryParameters?.length || 0} parameters
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end sm:justify-start gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50">
                  <button
                    onClick={() => onEditEntry(entry)}
                    className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Edit entry"
                  >
                    <Icon d={Icons.edit} size={16} />
                  </button>
                  <button
                    onClick={() => onSelect(entry)}
                    className={
                      css.btnSec +
                      " text-xs py-2 px-6 flex-1 sm:flex-none justify-center"
                    }
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
