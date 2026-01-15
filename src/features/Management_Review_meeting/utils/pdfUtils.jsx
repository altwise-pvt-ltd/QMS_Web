import { pdf } from "@react-pdf/renderer";
import { PDFViewer } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import MRMPdf from "../pdf Creations/MRMPdf";
import MinutesOfMeetingPdf from "../pdf Creations/MinutesOfMeetingPdf";

/**
 * Transform IndexedDB meeting data to PDF format
 */
export const transformMeetingDataForPDF = (meeting, actionItems, minutes) => {
  return {
    header: {
      address: "Your Company Name, Address Line 1, City, State, ZIP",
    },
    meeting: {
      title: meeting.title,
      subtitle:
        "Minutes of Management Review Meeting (ISO 9001:2015 Clause 9.3)",
      date: meeting.date,
      time: meeting.time,
      venue: meeting.location || "Not specified",
    },
    attendees:
      meeting.invitedAttendees?.map((att) => `${att.username} (${att.role})`) ||
      [],
    inputs:
      minutes?.agendaItems?.slice(0, 3).map((item, index) => ({
        no: index + 1,
        category: item.input || item.topic || "Review Item",
        discussion: item.activity || item.discussion || "—",
      })) || [],
    outputs:
      actionItems?.slice(0, 3).map((item, index) => ({
        no: index + 1,
        category: "Action Item",
        action: item.task || "—",
      })) || [],
    signOff: {
      preparedBy: "Quality Manager",
      reviewedBy: "Management Representative",
      approvedBy: "CEO",
    },
  };
};

/**
 * Generate and download MRM PDF
 */
export const generateMRMPdf = async (meeting, actionItems, minutes) => {
  try {
    const data = transformMeetingDataForPDF(meeting, actionItems, minutes);
    const blob = await pdf(<MRMPdf data={data} />).toBlob();
    saveAs(
      blob,
      `MRM_${meeting.title.replace(/\s+/g, "_")}_${meeting.date}.pdf`
    );
    return true;
  } catch (error) {
    console.error("Error generating MRM PDF:", error);
    return false;
  }
};

/**
 * Generate and download Minutes of Meeting PDF
 */
export const generateMinutesPdf = async (meeting, actionItems, minutes) => {
  try {
    const data = transformMeetingDataForPDF(meeting, actionItems, minutes);
    const blob = await pdf(<MinutesOfMeetingPdf data={data} />).toBlob();
    saveAs(
      blob,
      `Minutes_${meeting.title.replace(/\s+/g, "_")}_${meeting.date}.pdf`
    );
    return true;
  } catch (error) {
    console.error("Error generating Minutes PDF:", error);
    return false;
  }
};

/**
 * Render PDF preview component (for inline viewing)
 */
export const renderPdfPreview = (meeting, actionItems, minutes) => {
  const data = transformMeetingDataForPDF(meeting, actionItems, minutes);
  return <MRMPdf data={data} />;
};
