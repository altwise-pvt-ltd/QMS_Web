import React from "react";
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  ExternalLink,
} from "lucide-react";
import html2pdf from "html2pdf.js";

const CAPAFormView = ({ capa, onBack }) => {
  if (!capa) return null;

  const show = (v) => v || "—";
  const meta = capa.documentMeta || {};

  const handleDownloadPdf = () => {
    const element = document.getElementById("report-content");
    const opt = {
      margin: [15, 10, 15, 10],
      filename: `CAPA_${capa.issueNo || "report"}.pdf`,
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
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 hover:bg-indigo-50 rounded-lg"
            title="Print Report"
          >
            <Printer className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={handleDownloadPdf}
            className="p-2 hover:bg-indigo-50 rounded-lg"
            title="Download PDF"
          >
            <Download className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(
                capa?.uploadedFile?.fileUrl || window.location.href
              );
              alert("Link copied");
            }}
            className="p-2 hover:bg-indigo-50 rounded-lg"
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
        <div className=" hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-64px font-bold text-black/10 pointer-events-none select-none z-[9999] whitespace-nowrap rotate-[-30deg] text-[64px] font-bold  text-black/10 ">
          CONTROLED COPY
        </div>

        <table className="w-full border-separate border-spacing-0">
          {/* REPEATING HEADER ROW */}
          <thead>
            <tr>
              <td className="p-0 ">
                <div className="pdf-header text-center border-b-2 border-black px-10 py-4 mb-2">
                  <h2 className="text-xl font-bold uppercase tracking-tight">
                    Alpine Diagnostic Centre
                  </h2>
                  <p className="text-xs leading-5 mt-1">
                    Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech
                    Solution,
                    <br />
                    Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra
                    – 400604
                  </p>
                  <h3 className="mt-3 text-base font-bold uppercase underline decoration-1 underline-offset-4">
                    Corrective Action & Preventive Action (CAPA) Form
                  </h3>
                </div>
                {/* <div style={{ height: '40px', clear: 'both' }}></div> */}
              </td>
            </tr>
          </thead>

          {/* MAIN CONTENT BODY */}
          <tbody>
            <tr>
              <td className="p-0">
                <div className="pdf-body px-10 py-6">
                  {/* BASIC DETAILS */}
                  <table className="w-full border border-black text-sm mb-6 table-fixed border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 font-bold w-[20%] bg-slate-50">
                          NC No
                        </td>
                        <td className="border border-black p-2 w-[30%]">
                          {show(capa.issueNo)}
                        </td>
                        <td className="border border-black p-2 font-bold w-[20%] bg-slate-50">
                          Issue Date
                        </td>
                        <td className="border border-black p-2 w-[30%]">
                          {show(capa.date)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Category
                        </td>
                        <td className="border border-black p-2">
                          {show(capa.category)}
                        </td>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Sub Category
                        </td>
                        <td className="border border-black p-2">
                          {show(capa.subCategory)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Department
                        </td>
                        <td className="border border-black p-2">
                          {show(capa.department)}
                        </td>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Target Date
                        </td>
                        <td className="border border-black p-2">
                          {show(capa.targetDate)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Responsibility
                        </td>
                        <td className="border border-black p-2" colSpan={3}>
                          {show(capa.responsibility)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* DESCRIPTION BLOCKS */}
                  {[
                    ["Description of Non-Conformity / Failure", capa.details],
                    ["Root Cause Analysis", capa.rootCause],
                    ["Corrective Action Taken", capa.correctiveAction],
                    ["Preventive Action", capa.preventiveAction],
                  ].map(([title, value], i) => (
                    <div
                      key={i}
                      className="mb-6 break-inside-avoid"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      <h4 className="font-bold uppercase border-b border-black text-sm mb-2">
                        {title}
                      </h4>
                      <p className="text-sm mt-1 min-h-[40px] leading-relaxed whitespace-pre-wrap">
                        {show(value)}
                      </p>
                    </div>
                  ))}

                  {/* QUESTIONS TABLE */}
                  {Array.isArray(capa.questions) &&
                    capa.questions.length > 0 && (
                      <div className="mt-8 mb-6">
                        <h4 className="font-bold uppercase border-b border-black text-sm mb-3">
                          Audit Checklist / Evaluation
                        </h4>
                        <table className="w-full border border-black text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="border border-black p-2 w-10 text-center">
                                Sr
                              </th>
                              <th className="border border-black p-2 text-left">
                                Question
                              </th>
                              <th className="border border-black p-2 w-20 text-center">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {capa.questions.map((q, i) => (
                              <tr key={i}>
                                <td className="border border-black p-2 text-center">
                                  {i + 1}
                                </td>
                                <td className="border border-black p-2">{q}</td>
                                <td className="border border-black p-2 text-center font-bold uppercase">
                                  {capa.questionAnswers?.[i] || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* CLOSURE VERIFICATION */}
                  <div
                    className="mt-8 mb-4 break-inside-avoid"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    <h4 className="font-bold uppercase border-b border-black text-sm mb-2">
                      Closure Verification
                    </h4>
                    <div className="border border-black p-4 min-h-[80px]">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">
                        {show(capa.closureVerification)}
                      </p>

                      {/* PROOF LINK */}
                      {capa.uploadedFile && (
                        <div className="mt-4 pt-4 border-t border-dotted border-black">
                          <p className="text-xs font-bold mb-1">
                            Attached Proof:
                          </p>
                          <div className="flex items-center gap-2 text-xs text-blue-700">
                            <ExternalLink className="w-3 h-3" />
                            <a
                              href={capa.uploadedFile.fileUrl || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-bold"
                            >
                              {capa.uploadedFile.fileName || "View Attachment"}
                            </a>
                            <span className="text-black/50 ml-1">
                              ({capa.uploadedFile.fileSizeMB} MB)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          {/* REPEATING FOOTER ROW */}
          <tfoot>
            <tr>
              <td className="p-0 ">
                {/* <div style={{ height: '60px', clear: 'both' }}></div> */}
                <div className="pdf-footer px-10 pb-8 pt-4 border-t-2 border-black">
                  <table className="w-full border border-black text-[10px] table-fixed border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2">
                          <b>Document No</b>
                          <br />
                          {show(meta.documentNo)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issue No</b>
                          <br />
                          {show(meta.issueNo)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issue Date</b>
                          <br />
                          {show(meta.issueDate)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Status</b>
                          <br />
                          {show(meta.status)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2">
                          <b>Amendment No</b>
                          <br />
                          {show(meta.amendmentNo)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Amendment Date</b>
                          <br />
                          {show(meta.amendmentDate)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issued By</b>
                          <br />
                          {show(meta.issuedBy)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Reviewed By</b>
                          <br />
                          {show(meta.reviewedBy)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CAPAFormView;
