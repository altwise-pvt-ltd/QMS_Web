import React from "react";
import {
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { getHistoryRecords } from "../data/entriesData";

const LabDetail = ({
  selectedLab,
  selectedEntry,
  onBack,
  onMonthlyPreview,
  onFeedData,
}) => {
  const todayLabel = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2.5 bg-white border border-slate-200 rounded-xl
                       text-slate-400 hover:text-indigo-600
                       hover:border-indigo-200
                       transition-colors shadow-sm"
          >
            <ChevronLeft size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {selectedLab?.name}
            </h1>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <ClipboardList size={14} />
              {selectedEntry?.name} · Daily Records
            </p>
          </div>
        </div>

        <button
          onClick={onMonthlyPreview}
          className="flex items-center gap-2
                     px-5 py-2.5
                     bg-white
                     border border-indigo-600
                     text-indigo-600
                     rounded-xl
                     font-semibold text-sm
                     hover:bg-indigo-50
                     transition-all
                     active:scale-95"
        >
          <LayoutDashboard size={18} />
          Monthly Preview
        </button>
      </div>

      {/* Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[520px]">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-semibold text-slate-800 text-sm">
            Daily Records ·{" "}
            {new Date().toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <span className="text-xs font-medium text-slate-500">
            Day {new Date().getDate()}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
              <tr>
                {["Date", "Status", "Reading", "By"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 font-semibold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {getHistoryRecords(
                selectedEntry?.name || "",
                selectedLab?.name || "",
              ).map((record, i) => {
                const isToday = record.date === todayLabel;

                return (
                  <tr
                    key={i}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-slate-600">
                      {record.date}
                    </td>

                    <td className="px-6 py-3">
                      {isToday ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-600">
                          Pending
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            record.status === "Verified"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {record.status}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-3 text-slate-500 font-medium">
                      {isToday ? (
                        <button
                          onClick={onFeedData}
                          className="px-3 py-1
                                     bg-indigo-50 text-indigo-600
                                     rounded-lg
                                     font-semibold text-[10px]
                                     hover:bg-indigo-600 hover:text-white
                                     transition-all
                                     active:scale-95"
                        >
                          Update
                        </button>
                      ) : (
                        record.value
                      )}
                    </td>

                    <td className="px-6 py-3 font-semibold text-slate-400">
                      {isToday ? "--" : record.initials}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Primary Action */}
      <div className="flex justify-center pt-6">
        <button
          onClick={onFeedData}
          className="flex items-center gap-3
                     px-10 py-4
                     bg-indigo-600 text-white
                     rounded-2xl
                     font-semibold text-base
                     shadow-lg shadow-indigo-200
                     hover:bg-indigo-700 hover:-translate-y-0.5
                     transition-all
                     active:scale-95"
        >
          <Plus size={22} strokeWidth={2.5} />
          Feed Data
        </button>
      </div>
    </div>
  );
};

export default LabDetail;
