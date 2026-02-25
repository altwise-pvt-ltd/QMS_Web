import React from "react";
import {
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  CheckCircle2,
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
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {selectedLab?.name}
            </h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <ClipboardList size={16} />
              {selectedEntry?.name} - Daily Records
            </p>
          </div>
        </div>
        <button
          onClick={onMonthlyPreview}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all active:scale-95"
        >
          <LayoutDashboard size={20} />
          Monthly Preview
        </button>
      </div>

      {/* Simplified Scrollable Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">
            Daily Records -{" "}
            {new Date().toLocaleDateString("en-GB", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <span className="text-xs font-medium text-slate-500">
            Day: {new Date().getDate()}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-wider">
                  Reading
                </th>
                <th className="px-6 py-3 font-bold text-slate-400 uppercase tracking-wider">
                  By
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {getHistoryRecords(
                selectedEntry?.name || "",
                selectedLab?.name || "",
              ).map((record, i) => {
                const isToday =
                  record.date ===
                  new Date().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                return (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-600">
                      {record.date}
                    </td>
                    <td className="px-6 py-3">
                      {isToday ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600">
                          Pending
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                          className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-[10px] hover:bg-indigo-600 hover:text-gray-600 transition-all active:scale-95 shadow-sm"
                        >
                          Update
                        </button>
                      ) : (
                        record.value
                      )}
                    </td>
                    <td className="px-6 py-3 font-bold text-slate-400">
                      {isToday ? (
                        <span className="text-slate-200">--</span>
                      ) : (
                        record.initials
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onFeedData}
          className="flex items-center justify-center gap-3 px-12 py-5 bg-indigo-600 text-gray-500 rounded-3xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
        >
          <Plus size={24} strokeWidth={3} />
          Feed Data
        </button>
      </div>
    </div>
  );
};

export default LabDetail;

