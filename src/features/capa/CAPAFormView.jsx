import React from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";

const CAPAFormView = ({ capa, onBack }) => {
    if (!capa) return null;

    const show = (v) => v || "—";
    const meta = capa.documentMeta || {};

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8">

            {/* TOP ACTION BAR */}
            <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to List
                </button>

                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="p-2 hover:bg-indigo-50 rounded-lg">
                        <Printer className="w-5 h-5 text-slate-400" />
                    </button>

                    {capa?.uploadedFile?.fileUrl && (
                        <a
                            href={capa.uploadedFile.fileUrl}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 hover:bg-indigo-50 rounded-lg"
                        >
                            <Download className="w-5 h-5 text-slate-400" />
                        </a>
                    )}

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                capa?.uploadedFile?.fileUrl || window.location.href
                            );
                            alert("Link copied");
                        }}
                        className="p-2 hover:bg-indigo-50 rounded-lg"
                    >
                        <Share2 className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
            </div>

            {/* PRINT AREA */}
            <div className="print-area relative max-w-[900px] mx-auto bg-white text-black font-['Times_New_Roman'] border border-slate-200">


                {/* HEADER (REPEATS) */}
                <div className="pdf-header text-center border-b-2 border-black px-10 py-4">
                    <h2 className="text-lg font-bold uppercase">Alpine Diagnostic Centre</h2>
                    <p className="text-xs leading-4 mt-1">
                        Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech Solution,<br />
                        Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra – 400604
                    </p>
                    <h3 className="mt-2 text-sm font-bold uppercase">
                        Corrective Action & Preventive Action (CAPA) Form
                    </h3>
                </div>

                {/* BODY */}
                <div className="pdf-body px-10 py-6">

                    {/* BASIC DETAILS */}
                    {/* BASIC DETAILS */}
                    <table className="w-full border border-black text-sm mb-5">
                        <tbody>
                            <tr>
                                <td className="border p-2 font-semibold w-[20%]">NC No</td>
                                <td className="border p-2 w-[30%]">{show(capa.issueNo)}</td>
                                <td className="border p-2 font-semibold w-[20%]">Issue Date</td>
                                <td className="border p-2 w-[30%]">{show(capa.date)}</td>
                            </tr>

                            <tr>
                                <td className="border p-2 font-semibold">Category</td>
                                <td className="border p-2">{show(capa.category)}</td>
                                <td className="border p-2 font-semibold">Sub Category</td>
                                <td className="border p-2">{show(capa.subCategory)}</td>
                            </tr>

                            <tr>
                                <td className="border p-2 font-semibold">Department</td>
                                <td className="border p-2">{show(capa.department)}</td>
                                <td className="border p-2 font-semibold">Target Date</td>
                                <td className="border p-2">{show(capa.targetDate)}</td>
                            </tr>

                            <tr>
                                <td className="border p-2 font-semibold">Responsibility</td>
                                <td className="border p-2" colSpan={3}>
                                    {show(capa.responsibility)}
                                </td>
                            </tr>
                        </tbody>
                    </table>


                    {[
                        ["Description of Non-Conformity / Failure", capa.details],
                        ["Root Cause Analysis", capa.rootCause],
                        ["Corrective Action Taken", capa.correctiveAction],
                        ["Preventive Action", capa.preventiveAction],
                    ].map(([title, value], i) => (
                        <div key={i} className="mb-4">
                            <h4 className="font-bold uppercase border-b border-black text-sm">{title}</h4>
                            <p className="text-sm mt-1 min-h-[50px]">{show(value)}</p>
                        </div>
                    ))}

                    {/* QUESTIONS */}
                    {Array.isArray(capa.questions) && (
                        <table className="w-full border border-black text-xs mt-6">
                            <thead>
                                <tr>
                                    <th className="border p-2">Sr</th>
                                    <th className="border p-2">Question</th>
                                    <th className="border p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {capa.questions.map((q, i) => (
                                    <tr key={i}>
                                        <td className="border p-2 text-center">{i + 1}</td>
                                        <td className="border p-2">{q}</td>
                                        <td className="border p-2 text-center uppercase">
                                            {capa.questionAnswers?.[i] || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* FOOTER (REPEATS) */}
                <div className="pdf-footer">
                    <table className="w-full border border-black text-xs table-fixed">
                        <tbody>
                            <tr>
                                <td className="border p-2"><b>Document No</b><br />{show(meta.documentNo)}</td>
                                <td className="border p-2"><b>Issue No</b><br />{show(meta.issueNo)}</td>
                                <td className="border p-2"><b>Issue Date</b><br />{show(meta.issueDate)}</td>
                                <td className="border p-2"><b>Status</b><br />{show(meta.status)}</td>
                            </tr>
                            <tr>
                                <td className="border p-2"><b>Amendment No</b><br />{show(meta.amendmentNo)}</td>
                                <td className="border p-2"><b>Amendment Date</b><br />{show(meta.amendmentDate)}</td>
                                <td className="border p-2"><b>Issued By</b><br />{show(meta.issuedBy)}</td>
                                <td className="border p-2"><b>Reviewed By</b><br />{show(meta.reviewedBy)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
};

export default CAPAFormView;
