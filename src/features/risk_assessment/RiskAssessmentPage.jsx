import React, { useState, useEffect, useMemo } from "react";
import RiskSummary from "./components/RiskSummary";
import RiskMatrix from "./components/RiskMatrix";
import RiskTable from "./components/RiskTable";
import RiskDetailPanel from "./components/RiskDetailPanel";
import {
  getRisks,
  getRiskSummary,
  getMatrixData,
} from "./services/riskService";
import { ShieldAlert, RefreshCcw } from "lucide-react";

/**
 * RiskAssessmentPage Component
 * A professional, auditor-focused read-only screen for QMS risks.
 */
const RiskAssessmentPage = () => {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null); // { severity, likelihood }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getRisks();
        // Default sort by Score (descending)
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

  // Derived data
  const summary = useMemo(() => getRiskSummary(risks), [risks]);
  const matrix = useMemo(() => getMatrixData(risks), [risks]);

  // Handle cell click in matrix
  const handleCellClick = (severity, likelihood) => {
    // If clicking same cell, deselect
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

  // Filter risks based on matrix selection
  const filteredRisks = useMemo(() => {
    if (!selectedCell) return risks;
    return risks.filter(
      (r) =>
        r.severity === selectedCell.severity &&
        r.likelihood === selectedCell.likelihood,
    );
  }, [risks, selectedCell]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-pulse">
        <RefreshCcw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-sm">
          Loading Risk Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-6 min-h-screen bg-slate-50/30">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-indigo-600" />
            Risk Assessment
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            ISO 15189:2022 Compliant • Read-Only Auditor View
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100 uppercase tracking-wider">
            System Validated
          </div>
        </div>
      </div>

      <div className="flex gap-8 relative">
        {/* Main Content Area */}
        <div
          className={`transition-all duration-300 ${selectedRisk ? "flex-1 pr-[400px]" : "w-full"}`}
        >
          <RiskSummary summary={summary} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Risk Matrix Section - 5 Columns */}
            <div className="lg:col-span-5">
              <RiskMatrix
                matrix={matrix}
                selectedCell={selectedCell}
                onCellClick={handleCellClick}
              />
              {selectedCell && (
                <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">
                    Filtering Matrix: S{selectedCell.severity} × L
                    {selectedCell.likelihood}
                  </span>
                  <button
                    onClick={() => setSelectedCell(null)}
                    className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>

            {/* Risk Table Section - 7 Columns */}
            <div className="lg:col-span-7">
              <div className="mb-4 flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
                  Risk Registry
                </h3>
                <div className="text-[10px] text-slate-400 font-medium italic">
                  Showing {filteredRisks.length} of {risks.length} identified
                  risks
                </div>
              </div>
              <RiskTable
                risks={filteredRisks}
                onRowClick={setSelectedRisk}
                selectedRiskId={selectedRisk?.id}
              />
            </div>
          </div>
        </div>

        {/* Floating Detail Panel */}
        <div
          className={`
            fixed top-0 right-0 h-full w-[400px] bg-white border-l shadow-2xl transition-transform duration-300 ease-in-out z-50
            ${selectedRisk ? "translate-x-0" : "translate-x-full"}
          `}
        >
          <RiskDetailPanel
            risk={selectedRisk}
            onClose={() => setSelectedRisk(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentPage;
