import React from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";

const CAPAFormView = ({ capa, onBack }) => {
    if (!capa) return null;

    const show = (v) => v || "—";
    const meta = capa.documentMeta || {};

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">
            {/* Top Bar Actions */}
            <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>

                <div className="flex gap-2 text-black">
                    {/* PRINT / SAVE AS PDF */}
                    <button
                        onClick={() => window.print()}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Print / Save as PDF"
                    >
                        <Printer className="w-5 h-5" />
                    </button>

                    {/* DOWNLOAD ATTACHED PDF */}
                    {capa?.uploadedFile?.fileUrl && (
                        <a
                            href={capa.uploadedFile.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Download CAPA PDF"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                    )}

                    {/* SHARE LINK */}
                    <button
                        onClick={() => {
                            const link =
                                capa?.uploadedFile?.fileUrl || window.location.href;
                            navigator.clipboard.writeText(link);
                            alert("Link copied to clipboard");
                        }}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="Copy Link"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>


            {/* DOCUMENT */}
            <div className="print-area relative max-w-[900px] mx-auto bg-white text-black p-10 font-['Times_New_Roman'] shadow-xl border border-slate-200">

                {/* WATERMARK */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="text-[80px] font-bold text-gray-200 rotate-[-30deg] opacity-80">
                        CONTROLLED COPY
                    </span>
                </div>

                {/* HEADER */}
                <div className="relative text-center border-b-2 border-black pb-3 mb-6">
                    <h2 className="text-lg font-bold uppercase">
                        Alpine Diagnostic Centre
                    </h2>
                    <p className="text-xs leading-4 mt-1">
                        Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech Solution, <br />
                        Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra – 400604
                    </p>
                    <h3 className="mt-3 text-sm font-bold uppercase">
                        Corrective Action & Preventive Action (CAPA) Form
                    </h3>
                </div>

                {/* BASIC DETAILS */}
                <table className="w-full border border-black text-sm mb-5">
                    <tbody>
                        <tr>
                            <td className="border border-black p-2 font-semibold">NC No</td>
                            <td className="border border-black p-2">{show(capa.issueNo)}</td>
                            <td className="border border-black p-2 font-semibold">Issue Date</td>
                            <td className="border border-black p-2">{show(capa.date)}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 font-semibold">Category</td>
                            <td className="border border-black p-2">{show(capa.category)}</td>
                            <td className="border border-black p-2 font-semibold">Sub Category</td>
                            <td className="border border-black p-2">{show(capa.subCategory)}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 font-semibold">Department</td>
                            <td className="border border-black p-2">{show(capa.department)}</td>
                            <td className="border border-black p-2 font-semibold">Target Date</td>
                            <td className="border border-black p-2">{show(capa.targetDate)}</td>
                        </tr>
                        <tr>
                            <td className="border border-black p-2 font-semibold">
                                Responsibility
                            </td>
                            <td className="border border-black p-2" colSpan={3}>
                                {show(capa.responsibility)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* SECTIONS */}
                <div className="mb-5 relative">
                    <h4 className="text-sm font-bold uppercase border-b border-black mb-1">
                        Description of Non-Conformity / Failure
                    </h4>
                    <p className="text-sm leading-5 min-h-[60px]">{show(capa.details)}</p>
                </div>

                <div className="mb-5 relative">
                    <h4 className="text-sm font-bold uppercase border-b border-black mb-1">
                        Root Cause Analysis
                    </h4>
                    <p className="text-sm leading-5 min-h-[60px]">{show(capa.rootCause)}</p>
                </div>

                <div className="mb-5 relative">
                    <h4 className="text-sm font-bold uppercase border-b border-black mb-1">
                        Corrective Action Taken
                    </h4>
                    <p className="text-sm leading-5 min-h-[60px]">{show(capa.correctiveAction)}</p>
                </div>

                <div className="mb-5 relative">
                    <h4 className="text-sm font-bold uppercase border-b border-black mb-1">
                        Preventive Action
                    </h4>
                    <p className="text-sm leading-5 min-h-[60px]">{show(capa.preventiveAction)}</p>
                </div>

                {/* QUESTIONNAIRE TABLE */}
                {Array.isArray(capa.questions) && capa.questions.length > 0 && (
                    <div className="mb-8 relative">
                        <h4 className="text-sm font-bold uppercase border-b border-black mb-3">
                            Audit Questionnaire
                        </h4>
                        <table className="w-full border border-black text-xs">
                            <thead>
                                <tr className="bg-slate-50 uppercase tracking-wider">
                                    <th className="border border-black p-2 w-12 text-center">Sr No</th>
                                    <th className="border border-black p-2 text-left">Evaluation Question</th>
                                    <th className="border border-black p-2 w-28 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capa.questions.map((question, index) => (
                                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="border border-black p-2 text-center font-bold">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>
                                        <td className="border border-black p-2 text-slate-800">
                                            {question}
                                        </td>
                                        <td className="border border-black p-2 text-center uppercase font-black">
                                            <span className={capa.questionAnswers?.[index] === 'yes' ? 'text-emerald-700' : 'text-rose-700'}>
                                                {capa.questionAnswers?.[index] || "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mb-5 relative">
                    <h4 className="text-sm font-bold uppercase border-b border-black mb-1">
                        Closure Verification
                    </h4>
                    <p className="text-sm leading-5 min-h-[60px]">{show(capa.closureVerification)}</p>
                </div>

                {/* FOOTER (Govt Style) */}
                <div className="border-t-2 border-black pt-3 mt-8">
                    <table className="w-full border border-black text-xs">
                        <tbody>
                            <tr>
                                <td className="border border-black p-2">
                                    <b>Document No</b><br />
                                    {show(meta.documentNo)}
                                </td>
                                <td className="border border-black p-2">
                                    <b>Issue No</b><br />
                                    {show(meta.issueNo)}
                                </td>
                                <td className="border border-black p-2">
                                    <b>Issue Date</b><br />
                                    {show(meta.issueDate)}
                                </td>
                                <td className="border border-black p-2">
                                    <b>Status</b><br />
                                    {show(meta.status)}
                                </td>
                            </tr>

                            <tr>
                                <td className="border border-black p-2">
                                    <b>Amendment No</b><br />
                                    {show(meta.amendmentNo)}
                                </td>
                                <td className="border border-black p-2">
                                    <b>Amendment Date</b><br />
                                    {show(meta.amendmentDate)}
                                </td>
                                <td className="border border-black p-2">
                                    <b>Issued By</b><br />
                                    {show(meta.issuedBy)}
                                </td>
                                <td className="border border-black p-2">
                                    <b>Reviewed By</b><br />
                                    {show(meta.reviewedBy)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CAPAFormView;
