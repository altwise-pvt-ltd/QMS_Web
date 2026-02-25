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
import { ShieldAlert, RefreshCcw, SlidersHorizontal, X } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-in fade-in duration-500">
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
    <>
      <div className="max-w-[1600px] mx-auto p-5 sm:p-8 min-h-screen bg-slate-50/30 transition-all duration-500">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex flex-wrap items-center justify-between gap-6 mb-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-lg shadow-indigo-200/50">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Risk Assessment
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider ml-0.5">
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                ISO 15189:2022
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Auditor Module</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-indigo-500">Read-Only</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex items-center gap-1">
              <RiskDateFilter
                dateRange={dateRange}
                setDateRange={setDateRange}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
              />
            </div>
            <div className="px-3.5 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-xl border border-emerald-100 uppercase tracking-widest shadow-sm shadow-emerald-100/50 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Validated
            </div>
          </div>
        </header>

        {/* ── Content ─────────────────────────────────────────────── */}
        <main className="space-y-8">
          {/* Summary Cards */}
          <RiskSummary summary={summary} />

          {/* Active Filter Banner */}
          {hasActiveFilters && (
            <div className="flex items-center gap-4 px-5 py-3 bg-white border border-indigo-100 rounded-2xl shadow-sm shadow-indigo-100/20 animate-in slide-in-from-top-2 duration-300">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                  Active Filters:
                </span>
                {selectedCell && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                    Matrix Point: S{selectedCell.severity} × L
                    {selectedCell.likelihood}
                  </span>
                )}
                {(dateRange.start || dateRange.end) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                    Custom Date Range
                  </span>
                )}
                {selectedMonth && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">
                    Period: {selectedMonth}
                  </span>
                )}
                <span className="text-slate-400 text-xs ml-auto font-medium hidden sm:inline-block">
                  Showing{" "}
                  <span className="text-slate-900 font-bold">
                    {filteredRisks.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-slate-900 font-bold">
                    {risks.length}
                  </span>{" "}
                  records
                </span>
              </div>
              <button
                onClick={clearAllFilters}
                className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 border border-slate-100 hover:border-rose-100"
              >
                <X className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
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
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2.5">
                  <span className="w-2 h-5 bg-indigo-600 rounded-full shadow-sm" />
                  Risk Registry
                </h3>
                <div className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-500 font-bold uppercase">
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
      </div>

      {/* ── Detail Panel Backdrop ────────────────────────────────── */}
      {selectedRisk && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-all duration-500 animate-in fade-in"
          onClick={() => setSelectedRisk(null)}
        />
      )}

      {/* ── Floating Detail Panel ────────────────────────────────── */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-115 bg-white border-l border-slate-200
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
    </>
  );
};

export default RiskAssessmentPage;
