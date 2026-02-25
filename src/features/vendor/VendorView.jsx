import React, { useState, useEffect } from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import api from "../../auth/api";
import staffService from "../staff/services/staffService";
import ImageWithFallback from "../../components/ui/ImageWithFallback";

const VendorView = ({ vendor, onCancel }) => {
  const [orgInfo, setOrgInfo] = useState({
    name: "Alpine Diagnostic Centre",
    address:
      "Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech Solution, Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra – 400604",
    phone: "",
    website: "",
    logoUrl: null,
  });

  useEffect(() => {
    const fetchOrgInfo = async () => {
      try {
        const response = await api.get("/Organization/GetAllOrganization");
        if (response.data?.isSuccess && response.data?.value?.length > 0) {
          const org = response.data.value[0];
          setOrgInfo({
            name:
              org.legalCompanyName ||
              org.LegalCompanyName ||
              "Alpine Diagnostic Centre",
            address:
              org.registeredAddress ||
              org.RegisteredAddress ||
              "Plot No: A232, Road No: 21, Y-Lane, Behind Cyber Tech Solution, Nehru Nagar, Wagle Industrial Estate, Thane (W), Maharashtra – 400604",
            phone: org.businessPhone || org.BusinessPhone || "",
            website: org.corporateWebsite || org.CorporateWebsite || "",
            logoUrl: staffService.getAssetUrl(org.logoPath || org.LogoPath),
          });
        }
      } catch (error) {
        console.error("Error fetching organization info:", error);
      }
    };
    fetchOrgInfo();
  }, []);

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
        windowWidth: 1240,
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
      <div className="w-full mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print">
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
          className="hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap rotate-[-30deg] text-[64px] font-bold"
          style={{ zIndex: 9999, color: "rgba(0,0,0,0.05)" }}
        >
          CONTROLLED COPY
        </div>

        <table className="w-full border-separate border-spacing-0">
          {/* REPEATING HEADER */}
          <thead>
            <tr>
              <td className="p-0">
                <div className="pdf-header border-b-2 border-black px-10 py-6 mb-2">
                  <div className="flex items-center justify-between gap-6">
                    {/* Logo Section */}
                    {orgInfo.logoUrl && (
                      <div className="shrink-0">
                        <ImageWithFallback
                          src={orgInfo.logoUrl}
                          alt="Logo"
                          className="h-20 w-auto object-contain"
                        />
                      </div>
                    )}

                    {/* Organization Info Section */}
                    <div className="flex-1 text-center">
                      <h2 className="text-xl font-bold uppercase tracking-tight">
                        {orgInfo.name}
                      </h2>
                      <p className="text-xs leading-5 mt-1 whitespace-pre-line">
                        {orgInfo.address}
                      </p>
                      <div className="flex justify-center gap-4 mt-1 text-[10px] font-bold">
                        {orgInfo.phone && <span>Phone: {orgInfo.phone}</span>}
                        {orgInfo.website && (
                          <span>Website: {orgInfo.website}</span>
                        )}
                      </div>
                    </div>

                    {/* Placeholder to balance the logo if needed, or another element */}
                    {orgInfo.logoUrl && (
                      <div className="w-20 hidden md:block" />
                    )}
                  </div>

                  <h3 className="mt-6 text-center text-base font-bold uppercase underline decoration-1 underline-offset-4">
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
                <div className="pdf-body px-10 py-6">
                  {/* PART A — General Organization Details */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                    <span className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-black tracking-tighter">
                      PART A
                    </span>
                    <h4 className="font-bold uppercase text-sm tracking-tight">
                      General Organization Details
                    </h4>
                  </div>

                  <table className="w-full border border-black text-sm mb-8 table-fixed border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 font-bold w-[25%] bg-slate-50 text-[11px] uppercase">
                          Legal Entity Name
                        </td>
                        <td
                          className="border border-black p-2 font-bold text-base"
                          colSpan={3}
                        >
                          {show(vendor.name)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50 text-[11px] uppercase">
                          Authorized Contact
                        </td>
                        <td className="border border-black p-2 w-[25%]">
                          {show(vendor.contactPerson)}
                        </td>
                        <td className="border border-black p-2 font-bold w-[25%] bg-slate-50 text-[11px] uppercase">
                          Registration Type
                        </td>
                        <td className="border border-black p-2 font-bold">
                          {show(vendor.type)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50 text-[11px] uppercase">
                          Contact Number
                        </td>
                        <td className="border border-black p-2">
                          {show(vendor.phone)}
                        </td>
                        <td className="border border-black p-2 font-bold bg-slate-50 text-[11px] uppercase">
                          Digital Correspondence
                        </td>
                        <td className="border border-black p-2">
                          {show(vendor.email)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50 text-[11px] uppercase">
                          Product Portfolio
                        </td>
                        <td className="border border-black p-2">
                          {show(vendor.category)}
                        </td>
                        <td className="border border-black p-2 font-bold bg-slate-50 text-[11px] uppercase">
                          Period of Assessment
                        </td>
                        <td className="border border-black p-2 font-bold">
                          {show(vendor.assessmentDate)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50 text-[11px] uppercase">
                          Registered Address
                        </td>
                        <td
                          className="border border-black p-2 leading-relaxed"
                          colSpan={3}
                        >
                          {show(vendor.address)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* PART B — Performance Assessment */}
                  {evaluation ? (
                    <div
                      className="mb-8 break-inside-avoid"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-black">
                        <span className="bg-slate-900 text-white px-2 py-0.5 text-[10px] font-black tracking-tighter">
                          PART B
                        </span>
                        <h4 className="font-bold uppercase text-sm tracking-tight">
                          Performance Assessment Metrics
                        </h4>
                      </div>

                      <table className="w-full border border-black text-sm border-collapse mb-6">
                        <thead>
                          <tr className="bg-slate-900 text-white text-[10px] uppercase font-black tracking-widest">
                            <th className="border border-black p-3 text-left w-[75%]">
                              Evaluation Criteria & Performance Indicators
                            </th>
                            <th className="border border-black p-3 text-center w-[25%]">
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
                              <td className="border border-black p-3 font-bold text-slate-800">
                                {label}
                                <div className="text-[10px] font-medium text-slate-500 mt-0.5 uppercase">
                                  {sub}
                                </div>
                              </td>
                              <td className="border border-black p-3 text-center text-2xl font-black bg-slate-50">
                                {score || 0}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="border border-black p-4 text-right uppercase tracking-widest text-xs">
                              Gross Aggregate Score
                            </td>
                            <td className="border border-black p-4 text-center text-3xl font-black">
                              {totalScore}{" "}
                              <span className="text-[10px] opacity-60">
                                / 250
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* FINAL STATUS BLOCK */}
                      <div
                        className="border-2 border-black p-6 flex justify-between items-center break-inside-avoid"
                        style={{ pageBreakInside: "avoid" }}
                      >
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
                    <div className="p-8 border-2 border-dashed border-slate-300 text-center mb-8">
                      <p className="text-slate-400 font-bold text-sm">
                        Assessment performance data not yet recorded.
                      </p>
                    </div>
                  )}

                  {/* REMARKS */}
                  {vendor.remarks && (
                    <div
                      className="mb-6 break-inside-avoid"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      <h4 className="font-bold uppercase border-b border-black text-sm mb-2">
                        Remarks / Additional Notes
                      </h4>
                      <p className="text-sm mt-1 min-h-[40px] leading-relaxed whitespace-pre-wrap">
                        {show(vendor.remarks)}
                      </p>
                    </div>
                  )}

                  {/* SIGNATURE SECTION */}
                  <div
                    className="mt-10 flex justify-between px-4 pb-2 break-inside-avoid"
                    style={{ pageBreakInside: "avoid" }}
                  >
                    <div className="text-center">
                      <div className="h-16 flex items-end justify-center">
                        <div className="w-44 border-t-2 border-black pt-2 font-bold text-sm">
                          Evaluated By
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">
                        Quality Manager
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-16 flex items-end justify-center">
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
                    Proprietary Information — {orgInfo.name} ©{" "}
                    {new Date().getFullYear()}
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
