import React, { useState, useEffect } from "react";
import { FileText, Download, Eye, ArrowLeft } from "lucide-react";
import { db } from "../../../db";

const MinutesOfMeetingPreview = ({
  meeting,
  actionItems = [],
  minutes = null,
  attendance = [],
  onBack,
}) => {
  const [showPreview, setShowPreview] = useState(true); // Auto-show preview
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const info = await db.company_info.orderBy("id").last();
        if (info) {
          setCompanyInfo(info);
        }
      } catch (error) {
        console.error("Failed to fetch company info:", error);
      }
    };
    fetchCompanyInfo();
  }, []);

  // Transform Dexie data to match the preview format
  const meetingData = {
    date: meeting?.date || "Not specified",
    time: meeting?.time || "Not specified",
    venue: meeting?.location || "Not specified",
    standard: "ISO 15189:2012",
    agendaItems:
      minutes?.agendaItems?.map((item, index) => ({
        id: String.fromCharCode(97 + index), // a, b, c, etc.
        agenda: item.input || item.topic || "—",
        reviewInput: item.activity || item.discussion || "—",
        reviewActivities: item.reviewActivities || "—",
        responsibility: item.responsibility || "—",
        status: item.status || "Completed",
      })) || [],
    attendees:
      attendance && attendance.length > 0
        ? attendance
            .filter((att) => att.status === "Present")
            .map((att) => {
              const roleInfo = att.role || att.department;
              return roleInfo ? `${att.username} (${roleInfo})` : att.username;
            })
        : Array.isArray(meeting?.invitedAttendees || meeting?.invites)
          ? (meeting?.invitedAttendees || meeting?.invites).map((att) =>
              typeof att === "string"
                ? att
                : `${att.username || att.name || "Unknown"} (${
                    att.role || att.department || "Attendee"
                  })`,
            )
          : typeof (
                meeting?.invitedAttendees ||
                meeting?.invites ||
                meeting?.attendees
              ) === "string"
            ? (
                meeting?.invitedAttendees ||
                meeting?.invites ||
                meeting?.attendees
              )
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
  };

  const generatePDFContent = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Minutes of Management Review Meeting</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    body {
      font-family: Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      margin: 0;
      padding: 20px;
    }
    .letterhead {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .letterhead img {
      max-height: 80px;
      margin-bottom: 10px;
    }
    .company-name {
      font-weight: bold;
      font-size: 16pt;
      margin: 0;
    }
    .company-details {
      font-size: 10pt;
      color: #555;
      margin: 5px 0 0 0;
    }
    h1 {
      text-align: center;
      font-size: 14pt;
      margin: 15px 0;
      font-weight: bold;
    }
    .meeting-info {
      margin: 15px 0;
      font-size: 10pt;
    }
    .meeting-info p {
      margin: 5px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9pt;
    }
    th {
      background-color: #f0f0f0;
      border: 1px solid #000;
      padding: 6px 4px;
      text-align: left;
      font-weight: bold;
    }
    td {
      border: 1px solid #000;
      padding: 6px 4px;
      vertical-align: top;
    }
    .sr-no {
      width: 4%;
      text-align: center;
    }
    .agenda {
      width: 26%;
    }
    .review-input {
      width: 30%;
    }
    .review-activities {
      width: 15%;
    }
    .responsibility {
      width: 15%;
    }
    .status {
      width: 10%;
    }
    .attendees {
      margin-top: 20px;
    }
    .attendees h3 {
      font-size: 11pt;
      margin-bottom: 10px;
    }
    .attendees ol {
      margin: 5px 0;
      padding-left: 20px;
    }
    .signatures {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
    }
    .signature-block {
      text-align: center;
      width: 45%;
    }
    .signature-line {
      border-top: 1px solid #000;
      margin-top: 50px;
      padding-top: 5px;
    }
  </style>
</head>
<body>
  <div class="letterhead">
    ${companyInfo?.logo ? `<img src="${companyInfo.logo}" alt="Logo">` : ""}
    <p class="company-name">${companyInfo?.name || "Your Company Name"}</p>
    ${companyInfo?.address ? `<p class="company-details">${companyInfo.address}</p>` : ""}
    ${
      companyInfo?.phone || companyInfo?.websiteUrl
        ? `
      <p class="company-details">
        ${companyInfo.phone ? `Tel: ${companyInfo.phone}` : ""}
        ${companyInfo.phone && companyInfo.websiteUrl ? " | " : ""}
        ${companyInfo.websiteUrl ? `${companyInfo.websiteUrl}` : ""}
      </p>
    `
        : ""
    }
  </div>
  
  <h1>Minutes of Management Review Meeting</h1>
  
  <div class="meeting-info">
    <p><strong>Meeting Title:</strong> ${
      meeting?.title || "Management Review Meeting"
    }</p>
    <p>Management review meeting as per ${
      meetingData.standard
    } is scheduled on ${meetingData.date} at ${meetingData.time}.</p>
    <p><strong>Venue:</strong> ${meetingData.venue}</p>
    <p>Following points were discussed in the meeting. Chaired by Lab Director</p>
    <p>As per the requirements of ${
      meetingData.standard
    }, the following points were included in the agenda.</p>
    <p>The quality manager has prepared the report on various relevant review parameters</p>
  </div>

  <table>
    <thead>
      <tr>
        <th class="sr-no">Sr no</th>
        <th class="agenda">MRM Agenda</th>
        <th class="review-input">Review Input</th>
        <th class="review-activities">Review Activities</th>
        <th class="responsibility">Responsibility</th>
        <th class="status">Status</th>
      </tr>
    </thead>
    <tbody>
      ${meetingData.agendaItems
        .map(
          (item) => `
        <tr>
          <td class="sr-no">${item.id})</td>
          <td class="agenda">${item.agenda}</td>
          <td class="review-input">${item.reviewInput}</td>
          <td class="review-activities">${item.reviewActivities}</td>
          <td class="responsibility">${item.responsibility}</td>
          <td class="status">${item.status}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <div class="attendees">
    <h3>Following members attended the MRM</h3>
    <ol>
      ${meetingData.attendees
        .map((attendee) => `<li>${attendee}</li>`)
        .join("")}
    </ol>
  </div>

  <div class="signatures">
    <div class="signature-block">
      <div class="signature-line">Signature Lab Director</div>
    </div>
    <div class="signature-block">
      <div class="signature-line">Signature of Quality Manager</div>
    </div>
  </div>
</body>
</html>
    `;
  };

  const handleDownloadPDF = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MRM_Minutes.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const content = generatePDFContent();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Back to List"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                {meeting?.title || "Management Review Meeting Minutes"}
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-gray-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Print/Save as PDF
              </button>
            </div>
          </div>

          {showPreview && (
            <div className="border border-gray-300 rounded-lg p-8 bg-white mb-6 overflow-auto">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center border-b-2 border-gray-800 pb-6 mb-6">
                  {companyInfo?.logo && (
                    <img
                      src={companyInfo.logo}
                      alt="Company Logo"
                      className="h-20 mb-3 object-contain"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900">
                    {companyInfo?.name || "Your Company Name"}
                  </h2>
                  {companyInfo?.address && (
                    <p className="text-gray-600 text-sm mt-1 max-w-lg text-center">
                      {companyInfo.address}
                    </p>
                  )}
                  <div className="text-gray-500 text-xs mt-2 flex gap-3">
                    {companyInfo?.phone && (
                      <span>
                        <strong>Tel:</strong> {companyInfo.phone}
                      </span>
                    )}
                    {companyInfo?.websiteUrl && (
                      <span>
                        <strong>Web:</strong> {companyInfo.websiteUrl}
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-center text-xl font-bold mb-4">
                  Minutes of Management Review Meeting
                </h2>

                <div className="mb-6 text-sm space-y-2">
                  <p>
                    Management review meeting as per ISO15189 is scheduled on{" "}
                    {meetingData.date} at {meetingData.time}.
                  </p>
                  <p>
                    <strong>Venue:</strong> {meetingData.venue}
                  </p>
                  <p>
                    Following points were discussed in the meeting. The meeting
                    started at 2 pm, Chaired by Lab Director
                  </p>
                  <p>
                    As per the requirements of {meetingData.standard}, the
                    following points were included in the agenda, though Our
                    Molecular Laboratory is newly established.
                  </p>
                  <p>
                    The quality manager has prepared the report on various
                    relevant review parameters
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-800 p-2 text-left w-12">
                          Sr no
                        </th>
                        <th className="border border-gray-800 p-2 text-left">
                          MRM Agenda
                        </th>
                        <th className="border border-gray-800 p-2 text-left">
                          Review Input
                        </th>
                        <th className="border border-gray-800 p-2 text-left">
                          Review Activities
                        </th>
                        <th className="border border-gray-800 p-2 text-left">
                          Responsibility
                        </th>
                        <th className="border border-gray-800 p-2 text-left">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetingData.agendaItems.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-gray-800 p-2 text-center">
                            {item.id})
                          </td>
                          <td className="border border-gray-800 p-2">
                            {item.agenda}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {item.reviewInput}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {item.reviewActivities}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {item.responsibility}
                          </td>
                          <td className="border border-gray-800 p-2">
                            {item.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h3 className="font-bold mb-3">
                    Following members attended the MRM
                  </h3>
                  <ol className="list-decimal list-inside space-y-1">
                    {meetingData.attendees.map((attendee, idx) => (
                      <li key={idx}>{attendee}</li>
                    ))}
                  </ol>
                </div>

                <div className="flex justify-between mt-16">
                  <div className="text-center">
                    <div className="border-t border-gray-800 pt-2 w-64">
                      Signature Lab Director
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-800 pt-2 w-64">
                      Signature of Quality Manager
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Click "Show Preview" to view the document before downloading
              </li>
              <li>• Click "Print/Save as PDF" to open the print dialog</li>
              <li>
                • In the print dialog, select "Save as PDF" as your printer
              </li>
              <li>
                • You can customize the meeting data in the component code
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinutesOfMeetingPreview;
