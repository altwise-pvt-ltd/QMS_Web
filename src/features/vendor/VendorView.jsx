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
    reviewedBy: "Lab Director",
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
      <div className="max-w-225 mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
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
        className="print-area relative max-w-225 mx-auto bg-white text-black font-['Times_New_Roman'] border border-slate-200 shadow-sm"
      >
        {/* Watermark for controlled copy */}
        <div className="hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-bold text-black/5 pointer-events-none select-none z-9999 whitespace-nowrap rotate-[-30deg]">
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
                    Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech
                    Solution,
                    <br />
                    Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra
                    – 400604
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
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-slate-900">
                    <div className="bg-slate-900 text-white p-1.5 rounded text-xs font-black tracking-tighter">
                      PART A
                    </div>
                    <h4 className="font-bold uppercase text-base tracking-tight italic">
                      General Organization Details
                    </h4>
                  </div>
                  <table className="w-full border-2 border-slate-900 text-sm mb-10 table-fixed border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-slate-900 p-3 font-black w-[30%] bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Legal Entity Name
                        </td>
                        <td
                          className="border border-slate-900 p-3 w-[70%] font-bold text-base"
                          colSpan={3}
                        >
                          {show(vendor.name)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-3 font-black w-[30%] bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Authorized Contact
                        </td>
                        <td className="border border-slate-900 p-3 w-[20%] font-semibold">
                          {show(vendor.contactPerson)}
                        </td>
                        <td className="border border-slate-900 p-3 font-black w-[20%] bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Registration Type
                        </td>
                        <td className="border border-slate-900 p-3 w-[30%] font-black text-indigo-700">
                          {show(vendor.type)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-3 font-black bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Contact Number
                        </td>
                        <td className="border border-slate-900 p-3 font-medium italic">
                          {show(vendor.phone)}
                        </td>
                        <td className="border border-slate-900 p-3 font-black bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Digital Correspondence
                        </td>
                        <td className="border border-slate-900 p-3 font-medium underline decoration-slate-200">
                          {show(vendor.email)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-3 font-black bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Product Portfolio
                        </td>
                        <td className="border border-slate-900 p-3 font-semibold">
                          {show(vendor.category)}
                        </td>
                        <td className="border border-slate-900 p-3 font-black bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Period of Assessment
                        </td>
                        <td className="border border-slate-900 p-3 font-bold">
                          {show(vendor.assessmentDate || meta.issueDate)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-slate-900 p-3 font-black bg-slate-50 uppercase tracking-tighter text-[10px] text-slate-500">
                          Registered Business Address
                        </td>
                        <td
                          className="border border-slate-900 p-3 leading-relaxed"
                          colSpan={3}
                        >
                          {show(vendor.address)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* EVALUATION SECTION */}
                  {vendor.evaluation ? (
                    <div className="mb-10 animate-in fade-in duration-700">
                      <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-slate-900">
                        <div className="bg-slate-900 text-white p-1.5 rounded text-xs font-black tracking-tighter">
                          PART B
                        </div>
                        <h4 className="font-bold uppercase text-base tracking-tight italic">
                          Performance Assessment Metrics
                        </h4>
                      </div>
                      <table className="w-full border-2 border-slate-900 text-sm border-collapse mb-8 overflow-hidden rounded-lg font-sans">
                        <thead>
                          <tr className="bg-slate-900 text-white font-sans text-[10px] uppercase font-black tracking-widest">
                            <th className="border border-slate-900 p-4 text-left w-[75%]">
                              Evaluation Criteria & Performance Indicators
                            </th>
                            <th className="border border-slate-900 p-4 text-center w-[25%] transition-colors">
                              Score (Max: 50)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-sans">
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-900 p-4 font-bold text-slate-800">
                              Quality of Products / Materials
                              <div className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase">
                                Controls, Reagents, Consumables, Validation
                                Support
                              </div>
                            </td>
                            <td className="border border-slate-900 p-4 text-center text-2xl font-black text-indigo-600 bg-indigo-50/20">
                              {vendor.evaluation.quality || 0}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-900 p-4 font-bold text-slate-800">
                              Logistics & Delivery Excellence
                              <div className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase">
                                Punctuality, Cold Chain Integrity, Packaging
                                Standard
                              </div>
                            </td>
                            <td className="border border-slate-900 p-4 text-center text-2xl font-black text-indigo-600 bg-indigo-50/20">
                              {vendor.evaluation.delivery || 0}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-900 p-4 font-bold text-slate-800">
                              Commercial Competitiveness
                              <div className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase">
                                Pricing Level, Market Consistency, Credit Terms
                              </div>
                            </td>
                            <td className="border border-slate-900 p-4 text-center text-2xl font-black text-indigo-600 bg-indigo-50/20">
                              {vendor.evaluation.price || 0}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-900 p-4 font-bold text-slate-800">
                              Technological & Equipment Support
                              <div className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase">
                                Maintenance, Calibration, Closed System Support
                              </div>
                            </td>
                            <td className="border border-slate-900 p-4 text-center text-2xl font-black text-indigo-600 bg-indigo-50/20">
                              {vendor.evaluation.equipment || 0}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50 transition-colors">
                            <td className="border border-slate-900 p-4 font-bold text-slate-800">
                              Service Responsiveness
                              <div className="text-[10px] font-medium text-slate-400 mt-1 italic uppercase">
                                After-Sales Service, Complaint Resolution Speed
                              </div>
                            </td>
                            <td className="border border-slate-900 p-4 text-center text-2xl font-black text-indigo-600 bg-indigo-50/20">
                              {vendor.evaluation.service || 0}
                            </td>
                          </tr>
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border border-slate-900 p-5 text-right uppercase tracking-[0.2em] text-xs">
                              Gross Aggregate Score
                            </td>
                            <td className="border border-slate-900 p-5 text-center text-3xl font-black bg-indigo-600 italic tracking-tighter">
                              {vendor.evaluation.totalScore}{" "}
                              <span className="text-[10px] opacity-60 not-italic">
                                / 250
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* FINAL ASSESSMENT STATUS */}
                      <div
                        className={`p-8 border-4 rounded-3xl flex justify-between items-center shadow-xl shadow-slate-100 font-sans ${vendor.evaluation.status === "Accepted" ? "border-emerald-500 bg-emerald-50/40" : "border-rose-500 bg-rose-50/40"}`}
                      >
                        <div className="flex items-center gap-6 font-sans">
                          <div
                            className={`p-4 rounded-2xl ${vendor.evaluation.status === "Accepted" ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-rose-500 text-white shadow-lg shadow-rose-200"}`}
                          >
                            {vendor.evaluation.status === "Accepted" ? (
                              <CheckCircle className="w-12 h-12" />
                            ) : (
                              <AlertCircle className="w-12 h-12" />
                            )}
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">
                              Formal Certification Status
                            </div>
                            <div
                              className={`text-5xl font-black tracking-tighter ${vendor.evaluation.status === "Accepted" ? "text-emerald-700" : "text-rose-700"}`}
                            >
                              {vendor.evaluation.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right font-sans">
                          <div className="text-xs font-black text-slate-900 mb-2 leading-tight uppercase tracking-tighter">
                            Qualification Threshold: 150 Points
                          </div>
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest ${vendor.evaluation.status === "Accepted" ? "bg-emerald-200/50 text-emerald-800" : "bg-rose-200/50 text-rose-800"}`}
                          >
                            {vendor.evaluation.status === "Accepted"
                              ? "✓ QUALITY APPROVED"
                              : "✗ REJECTED / NON-COMPLIANT"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 border-2 border-dashed border-slate-300 rounded-3xl text-center mb-10">
                      <p className="text-slate-400 font-bold">
                        Assessment performance data not yet recorded.
                      </p>
                    </div>
                  )}

                  {/* SIGNATURE SECTION */}
                  <div className="mt-12 flex justify-between px-4 pb-4">
                    <div className="text-center">
                      <div className="h-20 flex items-end justify-center">
                        <div className="w-48 border-t-2 border-black pt-2 font-bold text-sm">
                          Evaluated By
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">
                        Quality Manager
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-20 flex items-end justify-center">
                        <div className="w-48 border-t-2 border-black pt-2 font-bold text-sm">
                          Approved By
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">
                        Lab Director
                      </div>
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
