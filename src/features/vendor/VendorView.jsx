import React, { useState, useEffect } from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import api from "../../auth/api";
import staffService from "../staff/services/staffService";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { useAuth } from "../../auth/AuthContext";

const VendorView = ({ vendor, onCancel }) => {
  const { organization } = useAuth();

  if (!vendor) return null;

  const show = (v) => v || "—";

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
        windowWidth: document.getElementById("report-content")?.scrollWidth || 1240,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };
    html2pdf().set(opt).from(element).save();
  };

  const evaluation = vendor.evaluation || null;
  const totalScore = evaluation?.totalScore ?? 0;
  const isAccepted = evaluation?.status === "Accepted";

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* TOP ACTION BAR */}
      <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="p-2 hover:bg-slate-50 rounded-lg"
            title="Print Report"
          >
            <Printer className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={handleDownloadPdf}
            className="p-2 hover:bg-slate-50 rounded-lg"
            title="Download PDF"
          >
            <Download className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard");
            }}
            className="p-2 hover:bg-slate-50 rounded-lg"
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
        {/* Watermark - print only */}
        <div
          className="hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-bold text-black/10 pointer-events-none select-none z-[9999] whitespace-nowrap rotate-[-30deg]"
        >
          CONTROLLED COPY
        </div>

        <table className="w-full border-separate border-spacing-0">
          {/* REPEATING HEADER */}
          <thead>
            <tr>
              <td className="p-0">
                <div className="pdf-header flex flex-row items-center border-b-2 border-black px-10 py-2 mb-1 text-left">
                  {/* Logo Section (20%) */}
                  <div className="w-[20%] flex justify-center pr-4">
                    {organization?.logo ? (
                      <div className="shrink-0">
                        <ImageWithFallback
                          src={organization.logo}
                          alt="Logo"
                          className="h-16 object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl italic">
                        {organization?.name?.charAt(0) || "A"}
                      </div>
                    )}
                  </div>

                  {/* Organization Info Section (80%) */}
                  <div className="w-[80%] flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-center">
                      {organization?.name || "Your Company Name"}
                    </h2>
                    <p className="text-sm leading-5 mt-1 text-center font-medium">
                      {organization?.address || "Your Company Address"}
                      {organization?.phone && ` | Tel: ${organization.phone}`}
                      {organization?.websiteUrl &&
                        ` | Web: ${organization.websiteUrl}`}
                    </p>
                  </div>
                </div>

                <div className="text-center py-2">
                  <h3 className="text-lg font-bold uppercase underline decoration-1 underline-offset-4">
                    Vendor Assessment Record
                  </h3>
                </div>
              </td>
            </tr>
          </thead>

          {/* MAIN BODY */}
          <tbody>
            <tr>
              <td className="p-0">
                <div className="pdf-body px-10 py-2">
                  {/* PART A — General Organization Details */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                    <span className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-black tracking-tighter">
                      PART A
                    </span>
                    <h4 className="font-bold uppercase text-sm tracking-tight">
                      General Organization Details
                    </h4>
                  </div>

                  <table
                    className="w-full border border-black text-sm mb-4 border-collapse"
                    style={{ wordBreak: "break-word" }}
                  >
                    <tbody>
                      <tr>
                        <td className="border border-black p-1.5 font-bold w-[25%] bg-slate-50 text-[11px] uppercase">
                          Legal Entity Name
                        </td>
                        <td
                          className="border border-black p-1.5 font-bold text-base"
                          colSpan={3}
                        >
                          {show(vendor.name)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 font-bold bg-slate-50 text-[11px] uppercase">
                          Authorized Contact
                        </td>
                        <td className="border border-black p-1.5 w-[25%]">
                          {show(vendor.contactPerson)}
                        </td>
                        <td className="border border-black p-1.5 font-bold w-[25%] bg-slate-50 text-[11px] uppercase">
                          Registration Type
                        </td>
                        <td className="border border-black p-1.5 font-bold">
                          {show(vendor.type)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 font-bold bg-slate-50 text-[11px] uppercase">
                          Contact Number
                        </td>
                        <td className="border border-black p-1.5">
                          {show(vendor.phone)}
                        </td>
                        <td className="border border-black p-1.5 font-bold bg-slate-50 text-[11px] uppercase">
                          Digital Correspondence
                        </td>
                        <td className="border border-black p-1.5">
                          {show(vendor.email)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 font-bold bg-slate-50 text-[11px] uppercase">
                          Product Portfolio
                        </td>
                        <td className="border border-black p-1.5">
                          {show(vendor.category)}
                        </td>
                        <td className="border border-black p-1.5 font-bold bg-slate-50 text-[11px] uppercase">
                          Period of Assessment
                        </td>
                        <td className="border border-black p-1.5 font-bold">
                          {show(vendor.assessmentDate)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-1.5 font-bold bg-slate-50 text-[11px] uppercase">
                          Registered Address
                        </td>
                        <td
                          className="border border-black p-1.5 leading-relaxed"
                          colSpan={3}
                        >
                          {show(vendor.address)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* PART B — Performance Assessment */}
                  {evaluation ? (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                        <span className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-black tracking-tighter">
                          PART B
                        </span>
                        <h4 className="font-bold uppercase text-sm tracking-tight">
                          Performance Assessment Metrics
                        </h4>
                      </div>

                      <table className="w-full border border-black text-sm border-collapse mb-4">
                        <thead>
                          <tr className="bg-slate-900 text-white text-[10px] uppercase font-black tracking-widest">
                            <th className="border border-black p-2 text-left w-[75%]">
                              Evaluation Criteria & Performance Indicators
                            </th>
                            <th className="border border-black p-2 text-center w-[25%]">
                              Score (Max: 50)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            [
                              "Quality of Products / Materials",
                              "Controls, Reagents, Consumables, Validation Support",
                              evaluation.quality,
                            ],
                            [
                              "Logistics & Delivery Excellence",
                              "Punctuality, Cold Chain Integrity, Packaging Standard",
                              evaluation.delivery,
                            ],
                            [
                              "Commercial Competitiveness",
                              "Pricing Level, Market Consistency, Credit Terms",
                              evaluation.price,
                            ],
                            [
                              "Technological & Equipment Support",
                              "Maintenance, Calibration, Closed System Support",
                              evaluation.equipment,
                            ],
                            [
                              "Service Responsiveness",
                              "After-Sales Service, Complaint Resolution Speed",
                              evaluation.service,
                            ],
                          ].map(([label, sub, score], i) => (
                            <tr key={i}>
                              <td className="border border-black px-2 py-1.5 font-bold text-slate-800 text-[13px]">
                                {label}
                                <div className="text-[10px] font-medium text-slate-500 mt-0.5 uppercase">
                                  {sub}
                                </div>
                              </td>
                              <td className="border border-black px-2 py-1.5 text-center text-2xl font-black bg-slate-50">
                                {score || 0}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border border-black p-2 text-right uppercase tracking-widest text-xs">
                              Gross Aggregate Score
                            </td>
                            <td className="border border-black p-2 text-center text-3xl font-black">
                              {totalScore}{" "}
                              <span className="text-[10px] opacity-60">
                                / 250
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* FINAL STATUS BLOCK */}
                      <div className="border-2 border-black p-4 flex justify-between items-center break-inside-avoid">
                        <div>
                          <div className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">
                            Formal Certification Status
                          </div>
                          <div className="text-4xl font-black tracking-tighter">
                            {isAccepted ? "✓ ACCEPTED" : "✗ REJECTED"}
                          </div>
                          <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                            {isAccepted
                              ? "Vendor meets quality threshold"
                              : "Vendor does not meet quality threshold"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-slate-900 mb-1 uppercase tracking-tight">
                            Qualification Threshold
                          </div>
                          <div className="text-3xl font-black">150</div>
                          <div className="text-[10px] text-slate-500 uppercase font-bold">
                            Minimum Points Required
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-dashed border-slate-300 text-center mb-4 break-inside-avoid">
                      <p className="text-slate-400 font-bold text-sm">
                        Assessment performance data not yet recorded.
                      </p>
                    </div>
                  )}

                  {/* REMARKS */}
                  {vendor.remarks && (
                    <div className="mb-4 break-inside-avoid">
                      <h4 className="font-bold uppercase border-b border-black text-sm mb-1">
                        Remarks / Additional Notes
                      </h4>
                      <p className="text-sm mt-1 min-h-[30px] leading-relaxed whitespace-pre-wrap">
                        {show(vendor.remarks)}
                      </p>
                    </div>
                  )}

                  {/* SIGNATURE SECTION */}
                  <div className="mt-6 flex justify-between px-4 pb-2 break-inside-avoid">
                    <div className="text-center">
                      <div className="h-12 flex items-end justify-center">
                        <div className="w-44 border-t-2 border-black pt-2 font-bold text-sm">
                          Evaluated By
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                        Quality Manager
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-12 flex items-end justify-center">
                        <div className="w-44 border-t-2 border-black pt-2 font-bold text-sm">
                          Approved By
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                        Lab Director
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          {/* REPEATING FOOTER */}
          <tfoot>
            <tr>
              <td className="p-0">
                <div className="pdf-footer px-10 pb-4 pt-2 border-t-2 border-black">
                  <table
                    className="w-full border border-black text-[10px] border-collapse"
                    style={{ tableLayout: "fixed" }}
                  >
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
                  <div className="mt-1 text-[8px] text-right text-slate-400">
                    Proprietary Information — {organization?.name || "QMS"} ©{" "}
                    {new Date().getFullYear()}
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm;
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
          .fixed {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }

          /* Show only report */
          body * {
            visibility: hidden !important;
          }

          .print-area, .print-area * {
            visibility: visible !important;
          }

          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            display: block !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          tr {
            page-break-inside: avoid !important;
          }

          .break-inside-avoid {
            page-break-inside: avoid !important;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default VendorView;
