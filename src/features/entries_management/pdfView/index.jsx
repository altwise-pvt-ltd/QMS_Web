import React, { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import EntriesHeader from "./EntriesHeader";
import EntriesSidebar from "./EntriesSidebar";
import EntriesReportTable from "./EntriesReportTable";
import entriesService from "../services/entriesService";
import { ChevronRight } from "lucide-react";

const EntriesPdfView = ({ entry, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase()
  );
  const [selectedIndicators, setSelectedIndicators] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const reportRef = useRef();

  // Initialize selected indicators when entry changes
  useEffect(() => {
    if (entry?.entryParameters) {
      setSelectedIndicators(entry.entryParameters.map(p => p.id));
      
      // Fetch all records for all parameters
      const fetchAll = async () => {
        setIsLoading(true);
        try {
          const all = [];
          for (const p of entry.entryParameters) {
            const data = await entriesService.getTransactionsByEntity(p.id);
            all.push(...data);
          }
          setRecords(all);
        } catch (err) {
          console.error("Failed to fetch records:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchAll();
    }
  }, [entry]);

  const toggleIndicator = (id) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIndicators.length === entry?.entryParameters?.length) {
      setSelectedIndicators([]);
    } else {
      setSelectedIndicators(entry.entryParameters.map(p => p.id));
    }
  };

  const handleDownload = () => {
    const element = reportRef.current;
    const opt = {
      margin: [5, 5, 5, 5],
      filename: `${entry?.name || 'Entry'}_Report_${selectedMonth}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => {
    window.print();
  };

  // Map entries data to the format expected by QI components
  const categories = [{
    id: entry?.id,
    name: "DAILY LOGS",
    qualityIndicatorCategoryId: entry?.id,
  }];

  const indicators = (entry?.entryParameters || []).map(p => {
    // Filter records for this parameter and selected month
    const [monthStr, yearStr] = selectedMonth.split(" ");
    const monthMap = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };
    const monthNum = monthMap[monthStr];
    
    const incidents = records
      .filter(r => r.parameterId === p.id)
      .filter(r => {
        const d = new Date(r.date);
        return d.getMonth() + 1 === monthNum && d.getFullYear() === parseInt(yearStr);
      })
      .map(r => ({
        date: r.date,
        value: r.value
      }));

    return {
      id: p.id,
      qualityIndicatorSubCategoryId: p.id,
      qualityIndicatorCategoryId: entry?.id,
      name: p.name,
      qualitySubCategoryName: p.name,
      incidents: incidents
    };
  });

  const displayedIndicators = indicators.filter(i => selectedIndicators.includes(i.id));

  const metadata = {
    documentNo: `ADC/LOG/${entry?.id || "001"}`,
    documentName: `${entry?.name?.toUpperCase()} MONTHLY LOG FORM`,
    issueNo: "01",
    issueDate: "01.07.2023",
    status: "Controlled",
    page: "1 OF 1",
    amendmentNo: "00",
    amendmentDate: "--"
  };

  return (
    <div className="flex flex-col bg-slate-50 h-[calc(100vh-80px)] overflow-hidden font-sans">
      <div className="p-4 md:p-8 space-y-6 flex-1 overflow-auto custom-scrollbar">
        <EntriesHeader 
          title={`${entry?.name} Report View`}
          onBack={onBack}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />

        <div className="flex justify-start no-print">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 shadow-sm rounded-xl text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 hover:shadow-md transition-all duration-300"
          >
            <ChevronRight
              size={14}
              strokeWidth={3}
              className={`transition-transform duration-500 ${isSidebarCollapsed ? "" : "rotate-180"}`}
            />
            {isSidebarCollapsed ? "Show Report Options" : "Hide Report Options"}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 transition-all duration-500 ease-in-out">
          <div className={`transition-all duration-500 ease-in-out shrink-0 overflow-hidden ${isSidebarCollapsed ? 'w-0' : 'w-full lg:w-80'}`}>
            <EntriesSidebar 
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              selectedIndicators={selectedIndicators}
              indicators={indicators}
              categories={categories}
              toggleIndicator={toggleIndicator}
              onSelectAll={handleSelectAll}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </div>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
              </div>
            ) : (
              <EntriesReportTable 
                ref={reportRef}
                selectedMonth={selectedMonth}
                displayedIndicators={displayedIndicators}
                categories={categories}
                metadata={metadata}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        @media print {
          @page { 
            size: A4 landscape; 
            margin: 0; 
          }
          
          /* Target Everything and Hide */
          body * {
            visibility: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Specifically show ONLY the report content */
          .printable-report, .printable-report * {
            visibility: visible !important;
          }

          /* Force the report to the top-left of the page */
          .printable-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 5mm !important;
            display: block !important;
            background: white !important;
            page-break-after: avoid !important;
          }

          /* Kill all layout-contributed styling that might break print */
          body, html, #root, main, [class*="MainLayout"] {
            overflow: hidden !important;
            height: 100% !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EntriesPdfView;
