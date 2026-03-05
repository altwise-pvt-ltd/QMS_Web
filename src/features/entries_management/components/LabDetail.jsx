import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ClipboardList,
  LayoutDashboard,
  CheckCircle2,
  Plus,
  Calendar,
} from "lucide-react";
import Skeleton from "../../../components/common/Skeleton";
import entriesService from "../services/entriesService";

const LabDetail = ({
  selectedLab,
  selectedEntry,
  onBack,
  onMonthlyPreview,
  onFeedData,
}) => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedLab) {
      const fetchRecords = async () => {
        try {
          setIsLoading(true);
          const data = await entriesService.getRecordsByLaboratoryId(
            selectedLab.id,
          );
          setRecords(data);
        } catch (err) {
          console.error("Failed to fetch records:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecords();
    }
  }, [selectedLab]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Detail Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-5">
          <button
            onClick={onBack}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {selectedLab?.name}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                <ClipboardList size={14} className="text-indigo-600" />
                {selectedEntry?.name}
              </span>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                Activity Logs
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onMonthlyPreview}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-900 hover:text-white transition-all text-xs active:scale-95 uppercase tracking-wider"
        >
          <LayoutDashboard size={18} strokeWidth={2.5} />
          Monthly Log
        </button>
      </div>

      {/* Structured Table Container */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400">
              <Calendar size={16} strokeWidth={2} />
            </div>
            <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest">
              Daily Records -{" "}
              {new Date().toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
              Active Stream
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest">
                  Reading
                </th>
                <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-widest">
                  Operator
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton variant="text" width="60%" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <Skeleton
                          variant="rectangular"
                          width={70}
                          height={20}
                          className="rounded-md"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton variant="text" width="40%" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton variant="text" width="50%" />
                    </td>
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-16 text-center text-slate-400 font-medium italic"
                  >
                    No operational data recorded for this unit yet.
                  </td>
                </tr>
              ) : (
                records.map((record, i) => {
                  const recordDateObj = new Date(record.date);
                  const formattedDate = recordDateObj.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  );

                  return (
                    <tr
                      key={i}
                      className="group hover:bg-slate-50/50 transition-all"
                    >
                      <td className="px-6 py-4 text-slate-900 font-bold">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border-2 ${
                            record.status === "Verified" ||
                            record.status === "Completed"
                              ? "bg-slate-50 text-emerald-600 border-emerald-50"
                              : "bg-slate-50 text-amber-600 border-amber-50"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-black">
                        {record.value || "--"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">
                            {(record.recordedBy || "U").charAt(0)}
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wide">
                            {record.recordedBy || "System Admin"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center px-4 pb-8 text-center">
        <button
          onClick={onFeedData}
          className="flex items-center justify-center gap-3 px-12 py-5 bg-indigo-600 text-white rounded-[1.25rem] font-black text-lg shadow-xl shadow-indigo-200/50 hover:bg-slate-900 hover:shadow-slate-200 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 uppercase tracking-widest"
        >
          <Plus size={24} strokeWidth={4} />
          Feed Operational Data
        </button>
      </div>
    </div>
  );
};

export default LabDetail;
