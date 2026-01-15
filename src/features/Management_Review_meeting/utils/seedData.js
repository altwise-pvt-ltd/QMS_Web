import { db } from "../../../db/index";

let isSeeding = false;

/**
 * Seed sample MRM data to IndexedDB
 * Run this once to populate the database with test data
 */
export const seedMrmData = async () => {
  if (isSeeding) return;
  isSeeding = true;

  try {
    console.log("Seeding MRM sample data...");

    // Check if data already exists
    const existingMeetings = await db.mrm_meetings.toArray();
    if (existingMeetings.length > 0) {
      console.log("MRM data already exists. Skipping seed.");
      return;
    }

    // Create sample meeting
    console.log("Creating first sample meeting...");
    const meetingId = await db.mrm_meetings.add({
      title: "Q1 2026 Management Review Meeting",
      date: "2026-01-15",
      time: "10:00 AM",
      location: "Conference Room A",
      agenda:
        "Review Q1 performance, quality objectives, customer feedback, and strategic initiatives",
      invitedAttendees: [
        { username: "John Doe", role: "CEO" },
        { username: "Jane Smith", role: "Quality Manager" },
        { username: "Bob Johnson", role: "Operations Manager" },
        { username: "Alice Williams", role: "HR Manager" },
      ],
      status: "Completed",
      createdAt: new Date().toISOString(),
    });

    console.log(`Created meeting with ID: ${meetingId}`);

    // Add action items for the meeting
    await db.mrm_action_items.bulkAdd([
      {
        meetingId: meetingId,
        task: "Implement automated document control system",
        description:
          "Evaluate and implement a digital document management system to address audit findings",
        dueDate: "2026-04-30",
        createdAt: new Date().toISOString(),
      },
      {
        meetingId: meetingId,
        task: "Conduct customer satisfaction survey",
        description:
          "Design and execute customer satisfaction survey to validate Q1 improvements",
        dueDate: "2026-06-30",
        createdAt: new Date().toISOString(),
      },
      {
        meetingId: meetingId,
        task: "Analyze delivery delay root causes",
        description:
          "Conduct root cause analysis for delivery delays and develop improvement plan",
        dueDate: "2026-03-31",
        createdAt: new Date().toISOString(),
      },
    ]);

    console.log("Created action items");

    // Add minutes for the meeting
    await db.mrm_minutes.add({
      meetingId: meetingId,
      agendaItems: [
        {
          id: 1,
          input: "Review of Quality Policy",
          activity:
            "The current quality policy was reviewed and found to be aligned with organizational objectives. No changes required at this time.",
          responsibility: "Quality Manager",
          status: "Closed",
        },
        {
          id: 2,
          input: "Customer Feedback Analysis",
          activity:
            "Customer satisfaction score improved from 4.1 to 4.5 out of 5. Main positive feedback: improved delivery times. Areas for improvement: product documentation clarity.",
          responsibility: "Customer Service Manager",
          status: "In Progress",
        },
        {
          id: 3,
          input: "Internal Audit Results",
          activity:
            "Internal audit completed. Total findings: 2 minor non-conformances, 3 observations. All non-conformances related to documentation control.",
          responsibility: "Quality Manager",
          status: "In Progress",
        },
        {
          id: 4,
          input: "Process Performance Metrics",
          activity:
            "Key metrics reviewed: Production efficiency 94%, Quality rejection 1.8%, On-time delivery 85%. Delivery performance needs improvement.",
          responsibility: "Operations Manager",
          status: "Open",
        },
      ],
      createdAt: new Date().toISOString(),
    });

    console.log("Created minutes");
    console.log("✅ MRM sample data seeded successfully!");

    return meetingId;
  } catch (error) {
    console.error("Error seeding MRM data:", error);
    throw error;
  } finally {
    isSeeding = false;
  }
};

/**
 * Clear all MRM data from IndexedDB
 */
export const clearMrmData = async () => {
  try {
    await db.mrm_meetings.clear();
    await db.mrm_action_items.clear();
    await db.mrm_minutes.clear();
    console.log("✅ MRM data cleared successfully!");
  } catch (error) {
    console.error("Error clearing MRM data:", error);
    throw error;
  }
};
