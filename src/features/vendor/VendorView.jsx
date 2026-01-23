import React from "react";
import {
    ArrowLeft,
    Printer,
    Download,
    Share2,
    ExternalLink,
} from "lucide-react";
import html2pdf from "html2pdf.js";

const VendorView = ({ vendor, onCancel }) => {
    if (!vendor) return null;

    const show = (v) => v || "—";

    // Professional Metadata for Vendor Assessment Record
    const meta = vendor.documentMeta || {
        documentNo: "ADC/QM/VM/04",
        issueNo: "02",
        issueDate: "15/05/2024",
        status: "Active",
        amendmentNo: "01",
        amendmentDate: "10/06/2024",
        issuedBy: "Quality Manager",
        reviewedBy: "Lab Director"
    };

    const handleDownloadPdf = () => {
        const element = document.getElementById("report-content");
        const opt = {
            margin: [15, 10, 15, 10],
            filename: `Vendor_Assessment_${vendor.name.replace(/\s+/g, "_")}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 3,
                useCORS: true,
                letterRendering: true,
                scrollY: 0,
                windowWidth: document.getElementById("report-content")?.scrollWidth,
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["css", "legacy"] },
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* TOP ACTION BAR */}
            <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.print()}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Print Report"
                    >
                        <Printer className="w-5 h-5 text-slate-400" />
                    </button>

                    <button
                        onClick={handleDownloadPdf}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Download PDF"
                    >
                        <Download className="w-5 h-5 text-slate-400" />
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied to clipboard");
                        }}
                        className="p-2 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Copy Link"
                    >
                        <Share2 className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* PRINT AREA */}
            <div
                id="report-content"
                className="print-area relative max-w-[900px] mx-auto bg-white text-black font-['Times_New_Roman'] border border-slate-200 shadow-sm"
            >
                {/* Watermark for controlled copy */}
                <div className="hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-bold text-black/5 pointer-events-none select-none z-[9999] whitespace-nowrap rotate-[-30deg]">
                    CONTROLLED COPY
                </div>

                <table className="w-full border-separate border-spacing-0">
                    {/* REPEATING HEADER ROW */}
                    <thead>
                        <tr>
                            <td className="p-0">
                                <div className="pdf-header text-center border-b-2 border-black px-10 py-6 mb-4">
                                    <h2 className="text-xl font-bold uppercase tracking-tight">
                                        Alpine Diagnostic Centre
                                    </h2>
                                    <p className="text-xs leading-5 mt-1">
                                        Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech Solution,
                                        <br />
                                        Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra – 400604
                                    </p>
                                    <h3 className="mt-4 text-base font-bold uppercase underline decoration-1 underline-offset-4">
                                        Vendor Assessment Record
                                    </h3>
                                </div>
                            </td>
                        </tr>
                    </thead>

                    {/* MAIN CONTENT BODY */}
                    <tbody>
                        <tr>
                            <td className="p-0">
                                <div className="pdf-body px-10 py-6">
                                    {/* VENDOR INFORMATION TABLE */}
                                    <h4 className="font-bold uppercase border-b border-black text-sm mb-3">
                                        A. General Information
                                    </h4>
                                    <table className="w-full border border-black text-sm mb-8 table-fixed border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="border border-black p-2 font-bold w-[25%] bg-slate-50">Vendor Name</td>
                                                <td className="border border-black p-2 w-[75%]" colSpan={3}>{show(vendor.name)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-2 font-bold w-[25%] bg-slate-50">Contact Person</td>
                                                <td className="border border-black p-2 w-[25%]">{show(vendor.contactPerson)}</td>
                                                <td className="border border-black p-2 font-bold w-[25%] bg-slate-50">Vendor Type</td>
                                                <td className="border border-black p-2 w-[25%] font-bold">{show(vendor.type)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-2 font-bold bg-slate-50">Phone Number</td>
                                                <td className="border border-black p-2">{show(vendor.phone)}</td>
                                                <td className="border border-black p-2 font-bold bg-slate-50">Email Address</td>
                                                <td className="border border-black p-2">{show(vendor.email)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-2 font-bold bg-slate-50">Category / Item</td>
                                                <td className="border border-black p-2">{show(vendor.category)}</td>
                                                <td className="border border-black p-2 font-bold bg-slate-50">Assessment Date</td>
                                                <td className="border border-black p-2">{show(vendor.assessmentDate || meta.issueDate)}</td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-2 font-bold bg-slate-50">Address</td>
                                                <td className="border border-black p-2" colSpan={3}>{show(vendor.address)}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    {/* EVALUATION SECTION */}
                                    {vendor.evaluation ? (
                                        <div className="mb-8">
                                            <h4 className="font-bold uppercase border-b border-black text-sm mb-3">
                                                B. Performance Evaluation
                                            </h4>
                                            <table className="w-full border border-black text-sm border-collapse mb-6">
                                                <thead>
                                                    <tr className="bg-slate-100">
                                                        <th className="border border-black p-3 text-left w-[70%]">Evaluation Criteria</th>
                                                        <th className="border border-black p-3 text-center w-[30%]">Score (Max: 50)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border border-black p-3 font-medium">Quality of Products (Items, Reagents, Controls, Validation)</td>
                                                        <td className="border border-black p-3 text-center text-lg font-bold">{vendor.evaluation.quality || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black p-3 font-medium">Delivery Performance (Punctuality, Cold Chain Compliance)</td>
                                                        <td className="border border-black p-3 text-center text-lg font-bold">{vendor.evaluation.delivery || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black p-3 font-medium">Pricing (Competitive Level, Price Consistency)</td>
                                                        <td className="border border-black p-3 text-center text-lg font-bold">{vendor.evaluation.price || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black p-3 font-medium">Technical Support (Equipment Support, Closed System)</td>
                                                        <td className="border border-black p-3 text-center text-lg font-bold">{vendor.evaluation.equipment || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border border-black p-3 font-medium">After-Sales Service & Promptness</td>
                                                        <td className="border border-black p-3 text-center text-lg font-bold">{vendor.evaluation.service || 0}</td>
                                                    </tr>
                                                    <tr className="bg-slate-50 font-black">
                                                        <td className="border border-black p-3 text-right uppercase tracking-wider">Total Cumulative Score</td>
                                                        <td className="border border-black p-3 text-center text-xl">{vendor.evaluation.totalScore} / 250</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {/* FINAL ASSESSMENT STATUS */}
                                            <div className={`p-6 border-2 rounded-xl flex justify-between items-center ${vendor.evaluation.status === "Accepted" ? "border-emerald-500 bg-emerald-50/30" : "border-rose-500 bg-rose-50/30"
                                                }`}>
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Final Approval Status</div>
                                                    <div className={`text-3xl font-black ${vendor.evaluation.status === "Accepted" ? "text-emerald-600" : "text-rose-600"
                                                        }`}>
                                                        VENDOR {vendor.evaluation.status.toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-slate-900 mb-1 leading-tight">
                                                        Benchmark: 150 Points for Approval
                                                    </div>
                                                    <div className={`text-sm font-bold ${vendor.evaluation.status === "Accepted" ? "text-emerald-700" : "text-rose-700"
                                                        }`}>
                                                        {vendor.evaluation.status === "Accepted" ? "✓ Verified & Approved" : "✗ Assessment Failed"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-10 border-2 border-dashed border-slate-300 rounded-3xl text-center mb-10">
                                            <p className="text-slate-400 font-bold">Assessment performance data not yet recorded.</p>
                                        </div>
                                    )}

                                    {/* SIGNATURE SECTION */}
                                    <div className="mt-12 flex justify-between px-4 pb-4">
                                        <div className="text-center">
                                            <div className="h-20 flex items-end justify-center">
                                                <div className="w-48 border-t-2 border-black pt-2 font-bold text-sm">Evaluated By</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Quality Manager</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="h-20 flex items-end justify-center">
                                                <div className="w-48 border-t-2 border-black pt-2 font-bold text-sm">Approved By</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Lab Director</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>

                    {/* REPEATING FOOTER ROW */}
                    <tfoot>
                        <tr>
                            <td className="p-0">
                                <div className="pdf-footer px-10 pb-8 pt-4 border-t-2 border-black">
                                    <table className="w-full border border-black text-[10px] table-fixed border-collapse">
                                        <tbody>
                                            <tr>
                                                <td className="border border-black p-2">
                                                    <b>Document No</b><br />{show(meta.documentNo)}
                                                </td>
                                                <td className="border border-black p-2">
                                                    <b>Issue No</b><br />{show(meta.issueNo)}
                                                </td>
                                                <td className="border border-black p-2">
                                                    <b>Issue Date</b><br />{show(meta.issueDate)}
                                                </td>
                                                <td className="border border-black p-2">
                                                    <b>Status</b><br />{show(meta.status)}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-black p-2">
                                                    <b>Amendment No</b><br />{show(meta.amendmentNo)}
                                                </td>
                                                <td className="border border-black p-2">
                                                    <b>Amendment Date</b><br />{show(meta.amendmentDate)}
                                                </td>
                                                <td className="border border-black p-2">
                                                    <b>Issued By</b><br />{show(meta.issuedBy)}
                                                </td>
                                                <td className="border border-black p-2">
                                                    <b>Reviewed By</b><br />{show(meta.reviewedBy)}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className="mt-2 text-[8px] text-right text-slate-400">
                                        Proprietary Information - Alpine Diagnostic Centre © 2024
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default VendorView;

