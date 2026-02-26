import React, { useState, useRef } from "react";
import { RISK_INDICATORS } from "./risk_indicator_data";
import { ChevronRight } from "lucide-react";
import html2pdf from "html2pdf.js";

// Sub-components
import RIFormHeader from "./components/RIFormHeader";
import RIFormSidebar from "./components/RIFormSidebar";
import RIReportTable from "./components/RIReportTable";

const RiskIndicatorForm = ({ onBack, indicators = [], categories = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState("JAN 2026");
  const [selectedIndicators, setSelectedIndicators] = useState(
    indicators.map((i) => i.id),
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [metadata, setMetadata] = useState({
    documentNo: "ADC--L--23",
    documentName: "RISK INDICATOR CHART FORM",
    issueNo: "01",
    issueDate: "01.07.2023",
    status: "Controlled",
    page: "1 of 1",
    amendmentNo: "00",
    amendmentDate: "",
  });
  const reportRef = useRef(null);

  const toggleIndicator = (id) => {
    setSelectedIndicators((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const element = reportRef.current;
    const opt = {
      margin: [10, 5, 10, 5],
      filename: `Risk_Indicators_${selectedMonth.replace(" ", "_")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const displayedIndicators = indicators.filter((i) =>
    selectedIndicators.includes(i.id),
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-6 animate-in slide-in-from-right duration-500 pb-20">
      <RIFormHeader
        onBack={onBack}
        onDownload={handleDownloadPdf}
        onPrint={handlePrint}
        title="Risk Indicator Chart Form"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className={`transition-all duration-300 ${isSidebarCollapsed ? "w-0 overflow-hidden opacity-0" : "w-full lg:w-1/4"}`}
        >
          <RIFormSidebar
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedIndicators={selectedIndicators}
            indicators={indicators}
            toggleIndicator={toggleIndicator}
            onSelectAll={() =>
              setSelectedIndicators(indicators.map((i) => i.id))
            }
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        <div
          className={`transition-all duration-300 ${isSidebarCollapsed ? "w-full" : "w-full lg:w-3/4"}`}
        >
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="mb-4 flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-indigo-600 shadow-sm hover:shadow-md transition-all no-print"
            >
              <ChevronRight size={14} />
              Show Sidebar
            </button>
          )}
          <RIReportTable
            ref={reportRef}
            selectedMonth={selectedMonth}
            displayedIndicators={displayedIndicators}
            categories={categories}
            metadata={metadata}
          />
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A3 landscape !important;
            margin: 10mm !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide UI elements */
          nav, aside, .sidebar, .sidebar-container, 
          button, .no-print, header, footer,
          .lg:col-span-1, [className*="sidebar"],
          div:has(> button), .fixed {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }

          /* Show only report */
          body * {
            visibility: hidden !important;
          }

          .printable-report, .printable-report * {
            visibility: visible !important;
          }

          .printable-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 20px !important;
          }

          /* Table optimization */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default RiskIndicatorForm;
