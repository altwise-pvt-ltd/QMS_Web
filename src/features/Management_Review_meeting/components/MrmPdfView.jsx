import React from "react";
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import { useAuth } from "../../../auth/AuthContext";

const MrmPdfView = ({
  meeting,
  actionItems = [],
  minutes = null,
  attendance = [],
  onBack,
}) => {
  const { organization } = useAuth();
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
                <div className="pdf-header flex flex-row items-center border-b-2 border-black px-10 py-4 mb-2 text-left">
                  <div className="w-[20%] flex justify-center pr-4">
                    {organization?.logo && (
                      <img
                        src={organization.logo}
                        alt="Logo"
                        className="h-16 object-contain"
                      />
                    )}
                  </div>
                  <div className="w-[80%] pl-6 border-l border-black/10">
                    <h2 className="text-xl font-bold uppercase tracking-tight">
                      {organization?.name || "Your Company Name"}
                    </h2>
                    <p className="text-xs leading-5 mt-1 text-slate-700">
                      {organization?.address || "Your Company Address"}
                      {organization?.phone && ` | Tel: ${organization.phone}`}
                      {organization?.websiteUrl && ` | Web: ${organization.websiteUrl}`}
                    </p>
                    <h3 className="mt-2 text-sm font-bold uppercase underline decoration-1 underline-offset-4 text-black">
                      Minutes of Management Review Meeting
                    </h3>
                  </div>
                </div>
              </td>
            </tr>
          </thead>

          {/* MAIN CONTENT BODY */}
          <tbody>
            <tr>
              <td className="p-0">
                <div className="pdf-body px-10 py-6">
                  {/* NARRATIVE MEETING DETAILS */}
                  <div className="mb-6 text-sm leading-6">
                    <p>Management review meeting is scheduled on <b>{meeting.date}</b> at <b>{meeting.time}</b>.</p>
                    <p><b>Venue:</b> {show(meeting.location)}</p>
                    <p className="mt-2">Following points were discussed in the meeting. The meeting started at {meeting.time}, Chaired by Lab Director</p>
                    <p>As per the requirements of ISO Quality Standard, the following points were included in the agenda.</p>
                    <p>The quality manager has prepared the report on various relevant review parameters</p>
                  </div>

                  {/* AGENDA ITEMS / MINUTES */}
                  {minutes?.agendaItems && minutes.agendaItems.length > 0 && (
                    <div className="mb-8">
                      <table className="w-full border border-black text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="border border-black p-2 w-10 text-center">
                              Sr no
                            </th>
                            <th className="border border-black p-2 text-left">
                              MRM Agenda
                            </th>
                            <th className="border border-black p-2 text-left">
                              Review Input
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
                                {String.fromCharCode(97 + i)})
                              </td>
                              <td className="border border-black p-2">
                                {show(item.topic || item.agenda)}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.input)}
                              </td>
                              <td className="border border-black p-2">
                                {show(item.responsibility || "admin")}
                              </td>
                              <td className="border border-black p-2 text-center font-bold">
                                {show(item.status || "Approved")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* ATTENDEES LIST */}
                  <div className="mb-10">
                    <h4 className="font-bold text-sm mb-3">Following members attended the MRM</h4>
                    <div className="space-y-2 ml-2">
                      {(() => {
                        const hasConfirmedAttendance = attendance && attendance.length > 0;
                        const rawAttendees = hasConfirmedAttendance ? attendance : (meeting.invitedAttendees || meeting.invites || []);
                        const attendeesList = Array.isArray(rawAttendees) ? rawAttendees : [];

                        return attendeesList.map((att, i) => (
                          <div key={i} className="text-sm">
                            {i + 1}. {att.username || att.name || "Unknown Staff"} ({att.role || att.department || "Attendee"})
                            {att.status ? <span className="font-bold ml-1">{att.status === "Present" ? "— Present" : "— Absent"}</span> : " — Present"}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* ACTION ITEMS IF ANY */}
                  {actionItems && actionItems.length > 0 && (
                    <div className="mb-8 break-inside-avoid">
                      <h4 className="font-bold uppercase border-b border-black text-xs mb-2">Action Items</h4>
                      <table className="w-full border border-black text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-50">
                            <th className="border border-black p-1 w-8 text-center">Sr</th>
                            <th className="border border-black p-1 text-left">Task</th>
                            <th className="border border-black p-1 text-left">Description</th>
                            <th className="border border-black p-1 text-center w-20">Due Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actionItems.map((item, i) => (
                            <tr key={i}>
                              <td className="border border-black p-1 text-center">{i + 1}</td>
                              <td className="border border-black p-1">{show(item.task)}</td>
                              <td className="border border-black p-1">{show(item.description)}</td>
                              <td className="border border-black p-1 text-center">{show(item.dueDate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SIGNATURE SECTION */}
                  <div className="mt-16 flex justify-between px-2 no-break">
                    <div className="text-center w-64 border-t border-black pt-2">
                      <p className="text-base font-medium">Signature Lab Director</p>
                    </div>
                    <div className="text-center w-64 border-t border-black pt-2">
                      <p className="text-base font-medium">Signature of Quality Manager</p>
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
                          {meeting.documentMeta?.documentNo || "ADC/QM/VM/04"}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issue No</b>
                          <br />
                          {meeting.documentMeta?.issueNo || "02"}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issue Date</b>
                          <br />
                          {meeting.documentMeta?.issueDate || "15/05/2024"}
                        </td>
                        <td className="border border-black p-2">
                          <b>Status</b>
                          <br />
                          {meeting.documentMeta?.status || "Active"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-black p-2">
                          <b>Amendment No</b>
                          <br />
                          {meeting.documentMeta?.amendmentNo || "01"}
                        </td>
                        <td className="border border-black p-2">
                          <b>Amendment Date</b>
                          <br />
                          {meeting.documentMeta?.amendmentDate || "10/06/2024"}
                        </td>
                        <td className="border border-black p-2">
                          <b>Issued By</b>
                          <br />
                          {meeting.documentMeta?.issuedBy || "Quality Manager"}
                        </td>
                        <td className="border border-black p-2">
                          <b>Reviewed By</b>
                          <br />
                          {meeting.documentMeta?.reviewedBy || "Lab Director"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-2 text-[8px] text-right text-slate-400">
                    Proprietary Information — {organization?.name || "ALPINE DIAGNOSTIC CENTRE"} © {new Date().getFullYear()}
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

export default MrmPdfView;
