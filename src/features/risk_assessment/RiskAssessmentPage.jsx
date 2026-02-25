import React, { useState, useEffect, useMemo } from "react";
import RiskSummary from "./components/RiskSummary";
import RiskMatrix from "./components/RiskMatrix";
import RiskTable from "./components/RiskTable";
import RiskDetailPanel from "./components/RiskDetailPanel";
import RiskDateFilter from "./components/RiskDateFilter";
import {
  getRisks,
  getRiskSummary,
  getMatrixData,
} from "./services/riskService";
import { ShieldAlert, SlidersHorizontal, X } from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";

const RiskAssessmentPage = () => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRisks();
        const sortedData = [...data].sort((a, b) => b.score - a.score);
        setRisks(sortedData);
      } catch (error) {
        console.error("Error fetching risks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const summary = useMemo(() => getRiskSummary(risks), [risks]);
  const matrix = useMemo(() => getMatrixData(risks), [risks]);

  const handleCellClick = (severity, likelihood) => {
    if (
      selectedCell &&
      selectedCell.severity === severity &&
      selectedCell.likelihood === likelihood
    ) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ severity, likelihood });
    }
  };

  const filteredRisks = useMemo(() => {
    let result = risks;

    if (selectedCell) {
      result = result.filter(
        (r) =>
          r.severity === selectedCell.severity &&
          r.likelihood === selectedCell.likelihood,
      );
    }

    if (dateRange.start && dateRange.end) {
      result = result.filter((r) => {
        const riskDate = parseISO(r.date);
        return isWithinInterval(riskDate, {
          start: dateRange.start,
          end: dateRange.end,
        });
      });
    } else if (selectedMonth) {
      result = result.filter((r) => {
        const riskDate = parseISO(r.date);
        return format(riskDate, "yyyy-MM") === selectedMonth;
      });
    }

    return result;
  }, [risks, selectedCell, dateRange, selectedMonth]);

  const hasActiveFilters =
    selectedCell || dateRange.start || dateRange.end || selectedMonth;

  const clearAllFilters = () => {
    setSelectedCell(null);
    setDateRange({ start: null, end: null });
    setSelectedMonth("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen animate-in fade-in duration-500">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-full border-[3px] border-indigo-50 border-t-indigo-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-indigo-500/80" />
          </div>
        </div>
        <h2 className="text-slate-800 font-bold text-base tracking-tight">
          Initializing Risk Registry
        </h2>
        <p className="text-slate-400 font-medium text-xs mt-1.5 px-6 text-center max-w-xs">
          Compiling ISO 15189:2022 complaint data and validating risk
          indicators...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-indigo-600" size={32} />
            Risk Assessment
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            ISO 15189:2022 Compliant • Read-Only Auditor View
          </p>
        </div>

        <div className="flex items-center gap-4">
          <RiskDateFilter
            dateRange={dateRange}
            setDateRange={setDateRange}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-black rounded-xl border border-emerald-100 uppercase tracking-widest shadow-sm">
            System Validated
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="space-y-8">
        {/* Summary Cards */}
        <RiskSummary summary={summary} />

        {/* Active Filter Banner */}
        {hasActiveFilters && (
          <div className="flex items-center gap-4 px-6 py-4 bg-white border border-indigo-100 rounded-3xl shadow-lg shadow-indigo-100/20 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mr-2">
                Active Filters:
              </span>
              {selectedCell && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black border border-indigo-100 shadow-sm">
                  Matrix Point: S{selectedCell.severity} × L{selectedCell.likelihood}
                </span>
              )}
              {(dateRange.start || dateRange.end) && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black border border-indigo-100 shadow-sm">
                  Custom Date Range
                </span>
              )}
              {selectedMonth && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black border border-indigo-100 shadow-sm">
                  Period: {selectedMonth}
                </span>
              )}
              <span className="text-slate-400 text-xs ml-auto font-bold uppercase tracking-widest hidden sm:inline-block">
                Showing <span className="text-slate-900">{filteredRisks.length}</span> / {risks.length} records
              </span>
            </div>
            <button
              onClick={clearAllFilters}
              className="group flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border border-slate-100 hover:border-rose-200"
            >
              <X size={16} className="transition-transform group-hover:rotate-90" />
              Reset
            </button>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Risk Matrix */}
          <div className="lg:col-span-5 h-full">
            <RiskMatrix
              matrix={matrix}
              selectedCell={selectedCell}
              onCellClick={handleCellClick}
            />
          </div>

          {/* Risk Table */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="mb-4 flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2.5">
                <span className="w-2 h-5 bg-indigo-600 rounded-full shadow-sm" />
                Risk Registry
              </h3>
              <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Registry Items: {filteredRisks.length}
              </div>
            </div>
            <RiskTable
              risks={filteredRisks}
              onRowClick={(risk) =>
                setSelectedRisk((prev) =>
                  prev?.id === risk.id ? null : risk,
                )
              }
              selectedRiskId={selectedRisk?.id}
            />
          </div>
        </div>
      </main>

      {/* Floating Detail Panel Overlay */}
      {selectedRisk && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-all duration-500 animate-in fade-in"
          onClick={() => setSelectedRisk(null)}
        />
      )}

      {/* Floating Detail Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white border-l border-slate-200
          shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] z-50
          transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${selectedRisk ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <RiskDetailPanel
          risk={selectedRisk}
          onClose={() => setSelectedRisk(null)}
        />
      </div>
    </div>
  );
};

export default RiskAssessmentPage;
