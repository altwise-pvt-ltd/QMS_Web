import React from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";

const YearlyTrainingPdfView = ({ trainings, onBack }) => {
  const currentYear = new Date().getFullYear();
  const show = (v) => v || "—";

  const handleDownloadPdf = () => {
    const element = document.getElementById("training-report-content");
    if (!element) return;

    const opt = {
      margin: [15, 10, 15, 10],
      filename: `Yearly_Training_Schedule_${currentYear}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        windowWidth: element.scrollWidth,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 animate-in fade-in duration-500">
      {/* TOP ACTION BAR */}
      <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 no-print relative z-[100]">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Scheduling
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer group"
            title="Print Schedule"
          >
            <Printer className="w-5 h-5 text-slate-500 group-active:scale-95 transition-transform" />
          </button>

          <button
            onClick={handleDownloadPdf}
            className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer group"
            title="Download PDF"
          >
            <Download className="w-5 h-5 text-slate-500 group-active:scale-95 transition-transform" />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied to clipboard");
            }}
            className="p-2.5 hover:bg-indigo-50 rounded-xl transition-all cursor-pointer"
            title="Copy Link"
          >
            <Share2 className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* DOCUMENT PREVIEW AREA */}
      <div
        id="training-report-content"
        className="print-area relative max-w-[900px] mx-auto bg-white text-black border border-slate-200 shadow-xl mb-10 overflow-hidden"
        style={{ fontFamily: "'Times New Roman', serif" }}
      >
        {/* Controlled Copy Watermark */}
        <div
          className="hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-bold pointer-events-none select-none z-50 whitespace-nowrap rotate-[-30deg]"
          style={{ color: "rgba(0, 0, 0, 0.05)" }}
        >
          CONTROLLED COPY
        </div>

        <table
          className="w-full border-separate border-spacing-0"
          style={{ borderCollapse: "collapse" }}
        >
          {/* HEADER */}
          <thead>
            <tr>
              <td style={{ padding: 0 }}>
                <div
                  className="text-center px-10 py-6 mb-4"
                  style={{ borderBottom: "2px solid black" }}
                >
                  <h2 className="text-2xl font-bold uppercase tracking-tight">
                    QMS ORGANIZATION
                  </h2>
                  <p
                    className="text-xs leading-5 mt-1 pt-1 inline-block px-4"
                    style={{
                      borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                      borderColor: "rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    ACADEMY OF QUALITY MANAGEMENT & STANDARDS
                  </p>
                  <h3
                    className="mt-4 text-lg font-bold uppercase underline"
                    style={{
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    Yearly Training Schedule - {currentYear}
                  </h3>
                </div>
              </td>
            </tr>
          </thead>

          {/* CONTENT */}
          <tbody>
            <tr>
              <td style={{ padding: 0 }}>
                <div className="px-10 py-6">
                  {/* SCHEDULE TABLE */}
                  <table
                    className="w-full text-xs"
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: "#f8fafc" }}>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "12px",
                            width: "40px",
                            textAlign: "center",
                          }}
                        >
                          Sr
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "12px",
                            textAlign: "left",
                            width: "100px",
                          }}
                        >
                          Date
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "12px",
                            textAlign: "left",
                          }}
                        >
                          Training Module / Topic
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "12px",
                            textAlign: "left",
                            width: "130px",
                          }}
                        >
                          Given By
                        </th>
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "12px",
                            textAlign: "left",
                            width: "130px",
                          }}
                        >
                          Assignee / Target
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const yearTrainings = (trainings || [])
                          .filter(
                            (t) =>
                              new Date(t.dueDate).getFullYear() === currentYear,
                          )
                          .sort(
                            (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
                          );

                        if (yearTrainings.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan={5}
                                style={{
                                  border: "1px solid black",
                                  padding: "40px",
                                  textAlign: "center",
                                  color: "#94a3b8",
                                  fontStyle: "italic",
                                }}
                              >
                                No training records scheduled for {currentYear}.
                              </td>
                            </tr>
                          );
                        }

                        return yearTrainings.map((t, i) => (
                          <tr key={i} style={{ pageBreakInside: "avoid" }}>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "12px",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {i + 1}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {show(
                                new Date(t.dueDate).toLocaleDateString("en-GB"),
                              )}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "12px",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                              }}
                            >
                              {show(t.title)}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "12px",
                                fontWeight: "500",
                              }}
                            >
                              {show(t.givenBy)}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "12px",
                                textTransform: "capitalize",
                              }}
                            >
                              {show(t.assignedTo || t.targetGroup)}
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>

                  {/* SIGNATURE SECTION */}
                  <div className="mt-16" style={{ pageBreakInside: "avoid" }}>
                    <table
                      className="w-full text-[10px]"
                      style={{
                        borderCollapse: "collapse",
                        border: "1px solid black",
                      }}
                    >
                      <tbody>
                        <tr>
                          {/* PREPARED BY */}
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "16px",
                              width: "33.33%",
                            }}
                          >
                            <div
                              style={{
                                height: "48px",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                marginBottom: "8px",
                              }}
                            ></div>
                            <div className="font-bold uppercase mb-1">
                              Prepared By:
                            </div>
                            <div style={{ color: "#475569" }}>
                              Quality Manager
                            </div>
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "8px",
                                fontStyle: "italic",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>Signature</span>
                              <span>Date</span>
                            </div>
                          </td>

                          {/* REVIEWED BY */}
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "16px",
                              width: "33.33%",
                            }}
                          >
                            <div
                              style={{
                                height: "48px",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                marginBottom: "8px",
                              }}
                            ></div>
                            <div className="font-bold uppercase mb-1">
                              Reviewed By:
                            </div>
                            <div style={{ color: "#475569" }}>
                              MR (Management Representative)
                            </div>
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "8px",
                                fontStyle: "italic",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>Signature</span>
                              <span>Date</span>
                            </div>
                          </td>

                          {/* APPROVED BY */}
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "16px",
                              width: "33.33%",
                            }}
                          >
                            <div
                              style={{
                                height: "48px",
                                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                marginBottom: "8px",
                              }}
                            ></div>
                            <div className="font-bold uppercase mb-1">
                              Approved By:
                            </div>
                            <div style={{ color: "#475569" }}>
                              Director / CEO
                            </div>
                            <div
                              style={{
                                marginTop: "8px",
                                fontSize: "8px",
                                fontStyle: "italic",
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>Signature</span>
                              <span>Date</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div
                      className="mt-4 flex justify-between px-2"
                      style={{
                        fontSize: "9px",
                        fontStyle: "italic",
                        color: "#64748b",
                      }}
                    >
                      <span>Document ID: QMS-TR-SCH-{currentYear}</span>
                      <span>
                        Controlled Document - Do not duplicate without
                        authorization
                      </span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
           .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default YearlyTrainingPdfView;
