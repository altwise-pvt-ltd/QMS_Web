import React, { useState, useRef } from "react";
import { QUALITY_INDICATORS } from "./qi_data";
import html2pdf from "html2pdf.js";

// Sub-components
import QIFormHeader from "./components/QIFormHeader";
import QIFormSidebar from "./components/QIFormSidebar";
import QIReportTable from "./components/QIReportTable";

const QalityIndicatorForm = ({ onBack }) => {
    const [selectedMonth, setSelectedMonth] = useState("NOV 2025");
    const [selectedIndicators, setSelectedIndicators] = useState(QUALITY_INDICATORS.map(i => i.id));
    const [metadata, setMetadata] = useState({
        documentNo: "ADC--L--22",
        documentName: "QUALITY INDICATOR CHART FORM",
        issueNo: "01",
        issueDate: "01.07.2022",
        status: "Controlled",
        page: "1 of 1",
        amendmentNo: "00",
        amendmentDate: ""
    });
    const reportRef = useRef(null);

    const toggleIndicator = (id) => {
        setSelectedIndicators(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const element = reportRef.current;
        const opt = {
            margin: [10, 5, 10, 5],
            filename: `Quality_Indicators_${selectedMonth.replace(' ', '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const displayedIndicators = QUALITY_INDICATORS.filter(i => selectedIndicators.includes(i.id));

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-20">
            <QIFormHeader
                onBack={onBack}
                onDownload={handleDownloadPdf}
                onPrint={handlePrint}
                title="Quality Indicator Chart Form"
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                    <QIFormSidebar
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedIndicators={selectedIndicators}
                        toggleIndicator={toggleIndicator}
                        onSelectAll={() => setSelectedIndicators(QUALITY_INDICATORS.map(i => i.id))}
                    />
                </div>

                <div className="lg:col-span-3">
                    <QIReportTable
                        ref={reportRef}
                        selectedMonth={selectedMonth}
                        displayedIndicators={displayedIndicators}
                        metadata={metadata}
                    />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
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
      `}} />
            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-report, .printable-report * {
            visibility: visible;
          }
          .printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          /* Hide sidebar, header and other UI elements */
          nav, aside, button, select, .no-print {
            display: none !important;
          }
        }
      `}} />
        </div>
    );
};

export default QalityIndicatorForm;
