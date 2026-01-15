import React from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";

const MrmPdfView = ({ meeting, actionItems = [], minutes = null, onBack }) => {
  if (!meeting) return null;

  const show = (v) => v || "—";

  const handleDownloadPdf = () => {
    const element = document.getElementById("mrm-report-content");
    const opt = {
      margin: [15, 10, 15, 10],
      filename: `MRM_${meeting.title.replace(/\s+/g, "_")}_${meeting.date}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        windowWidth: document.getElementById("mrm-report-content")?.scrollWidth,
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
              navigator.clipboard.writeText(window.location.href);
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
        id="mrm-report-content"
        className="print-area relative max-w-[900px] mx-auto bg-white text-black font-['Times_New_Roman'] border border-slate-200 shadow-sm"
      >
        <div className="hidden print:block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[64px] font-bold text-black/10 pointer-events-none select-none z-9999 whitespace-nowrap rotate-[-30deg]">
          CONTROLLED COPY
        </div>

        <table className="w-full border-separate border-spacing-0">
          {/* REPEATING HEADER ROW */}
          <thead>
            <tr>
              <td className="p-0">
                <div className="pdf-header text-center border-b-2 border-black px-10 py-4 mb-2">
                  <h2 className="text-xl font-bold uppercase tracking-tight">
                    Your Company Name
                  </h2>
                  <p className="text-xs leading-5 mt-1">
                    Your Company Address
                    <br />
                    City, State, ZIP Code
                  </p>
                  <h3 className="mt-3 text-base font-bold uppercase underline decoration-1 underline-offset-4">
                    Minutes of Management Review Meeting
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
                  {/* MEETING DETAILS */}
                  <table className="w-full border border-black text-sm mb-6 table-fixed border-collapse">
                    <tbody>
                      <tr>
                        <td className="border border-black p-2 font-bold w-[25%] bg-slate-50">
                          Meeting Title
                        </td>
                        <td
                          className="border border-black p-2 w-[75%]"
                          colSpan={3}
                        >
                          {show(meeting.title)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Date
                        </td>
                        <td className="border border-black p-2">
                          {show(meeting.date)}
                        </td>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Time
                        </td>
                        <td className="border border-black p-2">
                          {show(meeting.time)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Location
                        </td>
                        <td className="border border-black p-2">
                          {show(meeting.location)}
                        </td>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Status
                        </td>
                        <td className="border border-black p-2">
                          {show(meeting.status)}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2 font-bold bg-slate-50">
                          Agenda
                        </td>
                        <td className="border border-black p-2" colSpan={3}>
                          {show(meeting.agenda)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* ATTENDEES */}
                  {meeting.invitedAttendees &&
                    meeting.invitedAttendees.length > 0 && (
                      <div className="mb-6 break-inside-avoid">
                        <h4 className="font-bold uppercase border-b border-black text-sm mb-2">
                          Attendees
                        </h4>
                        <table className="w-full border border-black text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="border border-black p-2 w-10 text-center">
                                Sr
                              </th>
                              <th className="border border-black p-2 text-left">
                                Name
                              </th>
                              <th className="border border-black p-2 text-left">
                                Role
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {meeting.invitedAttendees.map((attendee, i) => (
                              <tr key={i}>
                                <td className="border border-black p-2 text-center">
                                  {i + 1}
                                </td>
                                <td className="border border-black p-2">
                                  {attendee.username}
                                </td>
                                <td className="border border-black p-2">
                                  {attendee.role}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  {/* AGENDA ITEMS / MINUTES */}
                  {minutes?.agendaItems && minutes.agendaItems.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                      <h4 className="font-bold uppercase border-b border-black text-sm mb-2">
                        Agenda Items & Discussion
                      </h4>
                      <table className="w-full border border-black text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="border border-black p-2 w-10 text-center">
                              Sr
                            </th>
                            <th className="border border-black p-2 text-left">
                              Agenda / Topic
                            </th>
                            <th className="border border-black p-2 text-left">
                              Discussion / Activities
                            </th>
                            <th className="border border-black p-2 text-left w-24">
                              Responsibility
                            </th>
                            <th className="border border-black p-2 text-center w-20">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {minutes.agendaItems.map((item, i) => (
                            <tr key={i}>
                              <td className="border border-black p-2 text-center">
                                {i + 1}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.input || item.topic)}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.activity || item.discussion)}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.responsibility)}
                              </td>
                              <td className="border border-black p-2 text-center font-bold">
                                {show(item.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ACTION ITEMS */}
                  {actionItems && actionItems.length > 0 && (
                    <div className="mb-6 break-inside-avoid">
                      <h4 className="font-bold uppercase border-b border-black text-sm mb-2">
                        Action Items
                      </h4>
                      <table className="w-full border border-black text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="border border-black p-2 w-10 text-center">
                              Sr
                            </th>
                            <th className="border border-black p-2 text-left">
                              Task
                            </th>
                            <th className="border border-black p-2 text-left">
                              Description
                            </th>
                            <th className="border border-black p-2 text-center w-24">
                              Due Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionItems.map((item, i) => (
                            <tr key={i}>
                              <td className="border border-black p-2 text-center">
                                {i + 1}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.task)}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.description)}
                              </td>
                              <td className="border border-black p-2 text-center">
                                {show(item.dueDate)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
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
                          MRM-{meeting.id}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issue Date</b>
                          <br />
                          {show(meeting.date)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Status</b>
                          <br />
                          {show(meeting.status)}
                        </td>
                        <td className="border border-black p-2">
                          <b>Version</b>
                          <br />
                          1.0
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2">
                          <b>Prepared By</b>
                          <br />
                          Quality Manager
                        </td>
                        <td className="border border-black p-2">
                          <b>Reviewed By</b>
                          <br />
                          Management Rep
                        </td>
                        <td className="border border-black p-2" colSpan={2}>
                          <b>Approved By</b>
                          <br />
                          CEO
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

export default MrmPdfView;
