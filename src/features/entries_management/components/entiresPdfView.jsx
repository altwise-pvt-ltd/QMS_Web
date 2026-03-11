import React, { useState, useRef, useEffect } from "react";
import html2pdf from "html2pdf.js";
import {
    ChevronLeft,
    Download,
    Plus,
    Minus,
    Loader2,
    Printer,
    Calendar as CalendarIcon,
    Filter,
    ChevronRight,
    Search
} from "lucide-react";
import { LOG_TYPES } from "../data/entriesData";
import entriesService from "../services/entriesService";
import { useAuth } from "../../../auth/AuthContext";

const ReceptionLog = ({ entry, onBack }) => {
    const { organization } = useAuth();
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Month management
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase()
    );

    // List of last 6 months for selection
    const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            label: d.toLocaleString("default", { month: "short", year: "numeric" }).toUpperCase(),
            fullLabel: d.toLocaleString("default", { month: "long", year: "numeric" }).toUpperCase(),
            monthIndex: d.getMonth(),
            year: d.getFullYear()
        };
    });

    const currentMonthData = months.find(m => m.label === selectedMonth) || months[0];

    useEffect(() => {
        if (entry?.entryParameters) {
            const fetchRecords = async () => {
                try {
                    setIsLoading(true);
                    const all = [];
                    for (const p of entry.entryParameters) {
                        const data = await entriesService.getTransactionsByEntity(p.id);
                        all.push(...data);
                    }
                    setRecords(all);
                } catch (err) {
                    console.error("Failed to fetch records for report:", err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchRecords();
        }
    }, [entry]);

    const printRef = useRef();

    const getCellData = (m, day, paramId) => {
        const dateStr = `${m.year}-${String(m.monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const record = records.find(r => r.date === dateStr && r.parameterId === paramId);
        return record ? record.value : "";
    };

    const handleDownload = () => {
        const element = printRef.current;
        const opt = {
            margin: [5, 5, 5, 5],
            filename: `${entry?.name || 'Entry'}_Report.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        };
        html2pdf().set(opt).from(element).save();
    };

    const handlePrint = () => {
        window.print();
    };

    // Styling derived from QI templates
    const s = {
        tableContainer: "bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-black",
        reportTable: "w-full border-collapse border-2 border-slate-800 text-[10px]",
        th: "border border-slate-800 text-center font-bold px-1 py-2 italic",
        td: "border border-slate-800 text-center h-8",
        sideLabel: "border-r border-slate-800 text-center font-bold bg-slate-50 [writing-mode:vertical-rl] rotate-180 text-[10px]",
        footerGrid: "mt-8 grid grid-cols-3 border-2 border-slate-800 text-[10px] font-bold uppercase",
        footerCell: "p-3 border-r-2 border-slate-800 last:border-r-0",
        label: "text-slate-500 mr-2 uppercase",
        value: "text-slate-900"
    };

    return (
        <div className="flex flex-col bg-slate-50 h-[calc(100vh-80px)] overflow-hidden font-sans">
            {/* QI Header Style */}
            <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-slate-100  z-30 shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="group p-2.5 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 active:scale-90 text-slate-400 hover:text-indigo-600 flex items-center justify-center"
                    >
                        <ChevronLeft size={22} strokeWidth={3} className="group-hover:-translate-x-0.5 transition-transform duration-300" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">{entry?.name} Report View</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Printer size={18} />
                        Print
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95"
                    >
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Style */}
                <div className={`transition-all duration-500 ease-in-out border-r border-slate-100 bg-white no-print overflow-y-auto ${isSidebarCollapsed ? "w-0 opacity-0" : "w-80 p-6 opacity-100"}`}>
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CalendarIcon size={16} className="text-indigo-500" />
                                Report Period
                            </h3>
                            <div className="space-y-2">
                                {months.slice(0, 6).map((m) => (
                                    <button
                                        key={m.label}
                                        onClick={() => setSelectedMonth(m.label)}
                                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedMonth === m.label ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"}`}
                                    >
                                        {m.fullLabel}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Filter size={16} className="text-indigo-500" />
                                Parameters
                            </h3>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {(entry?.entryParameters || []).map((p) => (
                                    <div key={p.id} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                        <span className="text-[11px] font-bold text-slate-600 truncate">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Area */}
                <div className="flex-1 bg-slate-50/50 overflow-auto p-4 lg:p-10 flex flex-col items-center custom-scrollbar relative">
                    {/* Floating Toggle Button */}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="fixed left-6 bottom-6 z-40 group flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-2xl shadow-xl transition-all duration-300 no-print"
                    >
                        <ChevronRight size={18} strokeWidth={3} className={`transition-all duration-500 ${isSidebarCollapsed ? "" : "rotate-180"}`} />
                        {isSidebarCollapsed ? "Show Options" : "Hide Options"}
                    </button>

                    <div className="bg-white rounded-2xl border border-slate-300 shadow-xl p-12 min-w-[1050px] printable-report overflow-hidden mb-12" ref={printRef}>
                        {/* Dynamic Pyramid Header */}
                        <div className="border-b-2 border-slate-800 mb-6 pb-6">
                            <div className="flex items-center">
                                <div className="w-[20%] flex justify-center border-r border-slate-200 pr-6 mr-6">
                                    {organization?.logo ? (
                                        <img
                                            src={organization.logo}
                                            alt="Logo"
                                            className="h-20 object-contain"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-2xl italic tracking-tighter">
                                            {organization?.name?.substring(0, 1) || "A"}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-center pr-16">
                                    <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight leading-tight">
                                        {organization?.name || "ALPINE DIAGNOSTIC CENTRE"}
                                    </h1>
                                    <p className="text-[11px] font-semibold text-slate-500 mt-2 tracking-wide uppercase">
                                        {organization?.address || "Building Address Line, Area Name, City - Zip Code"}
                                        {organization?.phone && ` | Tel: ${organization.phone}`}
                                        {organization?.email && ` | Email: ${organization.email}`}
                                        <br />
                                        <span className="text-indigo-500 lowercase mt-1 inline-block">Web: {organization?.websiteUrl || "www.quantumsolutions.com"}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-xl font-black uppercase tracking-widest text-slate-800 underline decoration-2 underline-offset-8 decoration-slate-900">
                                {entry?.name?.toUpperCase()} MONTHLY LOG FORM
                            </h2>
                        </div>

                        {/* Main Grid Table - Styled like QIReportTable */}
                        <table className="w-full border-collapse border-2 border-slate-800 text-[10px]">
                            <thead>
                                <tr className="bg-slate-50 h-10 border-b border-slate-800">
                                    <td className="border border-slate-800 px-4 font-black text-xs text-slate-500 w-[100px]">
                                        Month:
                                    </td>
                                    <td className="border border-slate-800 px-4 font-black text-sm text-indigo-700 w-auto">
                                        {currentMonthData.fullLabel}
                                    </td>
                                    {Array.from({ length: 31 }, (_, i) => (
                                        <td key={i} className="border border-slate-800 text-center font-black text-[10px] w-6 italic bg-slate-50/50">
                                            {String(i + 1).padStart(2, '0')}
                                        </td>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(entry?.entryParameters || []).map((param, pIdx) => (
                                    <tr key={param.id} className="border-b border-slate-800 h-9">
                                        {pIdx === 0 && (
                                            <td
                                                rowSpan={entry.entryParameters.length}
                                                className="border-r border-slate-800 text-center font-black text-[10px] bg-slate-50 [writing-mode:vertical-rl] rotate-180 py-4"
                                            >
                                                {entry.recordingCycle?.toUpperCase() || "DAILY"} LOGS
                                            </td>
                                        )}
                                        <td className="border-r border-slate-800 px-4 font-black text-slate-700 min-w-[200px]">
                                            {param.name}
                                        </td>
                                        {Array.from({ length: 31 }, (_, i) => {
                                            const val = getCellData(currentMonthData, i + 1, param.id);
                                            return (
                                                <td key={i} className="border-r last:border-r-0 border-slate-800 text-center font-bold text-slate-900 w-6">
                                                    {val || "·"}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                <tr className="h-14 bg-slate-50/30">
                                    <td colSpan={33} className="px-6 py-4 italic font-bold text-slate-500 text-[11px]">
                                        No major observations in {currentMonthData.fullLabel}
                                        <span className="float-right font-black text-slate-900 not-italic border-t-2 border-slate-900 pt-1 mt-2 min-w-[250px] text-center">
                                            Assigned Signature / Date
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* QI Style Footer Metadata */}
                        <div className="mt-10 grid grid-cols-3 border-2 border-slate-800 text-[10px] font-black uppercase tracking-tight divide-x-2 divide-y-2 divide-slate-800 bg-white">
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-slate-400 text-[9px]">Document No:</span>
                                <span>ADC/LOG/{entry?.id || "001"}</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1 bg-slate-50/50">
                                <span className="text-slate-400 text-[9px]">Document Name:</span>
                                <span>{entry?.name?.toUpperCase()} LOG</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-slate-400 text-[9px]">Issue No:</span>
                                <span>01</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-slate-400 text-[9px]">Issue Date:</span>
                                <span>01.07.2023</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-slate-400 text-[9px]">Status:</span>
                                <span className="text-emerald-600">Controlled</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1">
                                <span className="text-slate-400 text-[9px]">Page:</span>
                                <span>1 OF 1</span>
                            </div>
                            <div className="p-4 flex flex-col gap-1 border-b-0">
                                <span className="text-slate-400 text-[9px]">Amendment No:</span>
                                <span>00</span>
                            </div>
                            <div className="p-4 border-b-0" colSpan={2}>
                                <span className="text-slate-400 text-[9px] block mb-1">Amendment Date:</span>
                                <span>--</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                @media print {
                    .no-print { display: none !important; }
                    .printable-report { 
                        box-shadow: none !important; 
                        border: none !important; 
                        padding: 0 !important;
                        margin: 0 !important;
                        width: 100% !important;
                    }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
};

export default ReceptionLog;