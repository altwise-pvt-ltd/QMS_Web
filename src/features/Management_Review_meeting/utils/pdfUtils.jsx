import { db } from "../../../db";

/**
 * Transform IndexedDB meeting data to PDF format
 */
export const transformMeetingDataForPDF = (
  meeting,
  actionItems,
  minutes,
  companyInfo,
) => {
  // Extract attendees from various possible properties (invitedAttendees or invites)
  const rawAttendees = meeting.invitedAttendees || meeting.invites || [];

  const attendeesList = Array.isArray(rawAttendees)
    ? rawAttendees.map((att) =>
        typeof att === "string"
          ? att
          : `${att.username || att.name || "Unknown"} (${
              att.role || att.department || "Attendee"
            })`,
      )
    : typeof rawAttendees === "string"
      ? rawAttendees
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    header: {
      address: companyInfo
        ? `${companyInfo.name}\n${companyInfo.industry} | ${companyInfo.phone}\n${companyInfo.address}`
        : "Your Company Name, Address Line 1, City, State, ZIP",
      logo: companyInfo?.logo || null,
    },
    meeting: {
      title: meeting.title,
      subtitle:
        "Minutes of Management Review Meeting (ISO 9001:2015 Clause 9.3)",
      date: meeting.date,
      time: meeting.time,
      venue: meeting.location || "Not specified",
    },
    attendees: attendeesList,
    inputs:
      minutes?.agendaItems?.map((item, index) => ({
        no: index + 1,
        category: item.input || item.topic || "Review Item",
        discussion: item.activity || item.discussion || "—",
      })) || [],
    outputs:
      actionItems?.map((item, index) => ({
        no: index + 1,
        category: "Action Item",
        action: item.task || "—",
      })) || [],
    signOff: {
      preparedBy:
        attendeesList.find((a) =>
          a.toLowerCase().includes("quality manager"),
        ) || "Quality Manager",
      reviewedBy:
        attendeesList.find((a) =>
          a.toLowerCase().includes("management representative"),
        ) || "Management Representative",
      approvedBy:
        attendeesList.find(
          (a) =>
            a.toLowerCase().includes("ceo") ||
            a.toLowerCase().includes("director"),
        ) || "CEO",
    },
  };
};

/**
 * Generate and download MRM PDF
 */
export const generateMRMPdf = async (meeting, actionItems, minutes) => {
  try {
    const companyInfo = await db.company_info.toCollection().first();
    const data = transformMeetingDataForPDF(
      meeting,
      actionItems,
      minutes,
      companyInfo,
    );
    const blob = await pdf(<MRMPdf data={data} />).toBlob();
    saveAs(
      blob,
      `MRM_${meeting.title.replace(/\s+/g, "_")}_${meeting.date}.pdf`,
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
    const companyInfo = await db.company_info.toCollection().first();
    const data = transformMeetingDataForPDF(
      meeting,
      actionItems,
      minutes,
      companyInfo,
    );
    const blob = await pdf(<MinutesOfMeetingPdf data={data} />).toBlob();
    saveAs(
      blob,
      `Minutes_${meeting.title.replace(/\s+/g, "_")}_${meeting.date}.pdf`,
    );
    return true;
  } catch (error) {
    console.error("Error generating Minutes PDF:", error);
    return false;
  }
};

/**
 * Render PDF preview component (for inline viewing)
 * Note: If using company info, this might need to be wrapped in a component that fetches data.
 */
export const renderPdfPreview = (
  meeting,
  actionItems,
  minutes,
  companyInfo,
) => {
  const data = transformMeetingDataForPDF(
    meeting,
    actionItems,
    minutes,
    companyInfo,
  );
  return <MRMPdf data={data} />;
};
