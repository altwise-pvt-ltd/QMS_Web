// 1. IMPORT STANDARD HOOKS
// We use standard React hooks (useState, useEffect) to build our custom one.
import { useState, useEffect } from "react";

// MOCK DATA - Sample Management Review Meetings
const MOCK_MEETINGS = [
  {
    id: 1,
    title: "Q4 2025 Management Review",
    date: "2025-12-15",
    time: "10:00 AM",
    location: "Conference Room A",
    agenda:
      "Review annual quality objectives, customer feedback analysis, and process improvements",
    attendees: "ceo@company.com, qm@company.com, operations@company.com",
    status: "Closed",
    // Inputs
    inputAuditResults:
      "Internal audit completed in November 2025. 3 minor non-conformances identified and closed. External audit scheduled for Q1 2026.",
    inputCustomerFeedback:
      "Customer satisfaction score: 4.2/5. Received 15 complaints this quarter, down from 22 last quarter. Main issues: delivery delays (60%), product defects (40%).",
    inputProcessPerformance:
      "Production efficiency: 92% (target: 90%). Quality rejection rate: 2.1% (target: <3%). On-time delivery: 88% (target: 95% - needs improvement).",
    inputRisks:
      "Supply chain disruptions due to vendor delays. Mitigation: Identified backup suppliers.",
    // Execution
    discussionPoints:
      "- Reviewed Q4 performance metrics\n- Discussed customer complaint trends\n- Analyzed audit findings\n- Evaluated resource adequacy",
    decisionsMade:
      "1. Hire additional QA staff to improve inspection coverage\n2. Implement new supplier evaluation process\n3. Invest in automated testing equipment",
    // Outputs
    actionItems: [
      {
        id: 1001,
        task: "Recruit 2 QA inspectors",
        owner: "HR Manager",
        deadline: "2026-01-31",
      },
      {
        id: 1002,
        task: "Develop supplier scorecard system",
        owner: "Procurement Lead",
        deadline: "2026-02-15",
      },
      {
        id: 1003,
        task: "Get quotes for automated testing equipment",
        owner: "QA Manager",
        deadline: "2026-01-20",
      },
    ],
  },
  {
    id: 2,
    title: "Q1 2026 Management Review",
    date: "2026-03-20",
    time: "2:00 PM",
    location: "Executive Boardroom",
    agenda:
      "Review Q1 performance, external audit results, and strategic quality initiatives",
    attendees:
      "ceo@company.com, cfo@company.com, qm@company.com, production@company.com",
    status: "Planned",
    // Inputs
    inputAuditResults:
      "External ISO 9001 surveillance audit scheduled for March 2026. Preparation in progress.",
    inputCustomerFeedback:
      "Q1 feedback collection ongoing. Preliminary data shows improvement in delivery times.",
    inputProcessPerformance:
      "January metrics: Production efficiency 93%, Quality rejection 1.8%. February data pending.",
    inputRisks:
      "New regulatory requirements for product testing expected in Q2 2026.",
    // Execution
    discussionPoints: "",
    decisionsMade: "",
    // Outputs
    actionItems: [],
  },
  {
    id: 3,
    title: "Mid-Year Strategic Review 2026",
    date: "2026-06-30",
    time: "9:00 AM",
    location: "Virtual Meeting",
    agenda:
      "Six-month performance review, strategic planning for H2, resource allocation",
    attendees: "leadership@company.com, qm@company.com, dept-heads@company.com",
    status: "Planned",
    // Inputs
    inputAuditResults: "",
    inputCustomerFeedback: "",
    inputProcessPerformance: "",
    inputRisks: "",
    // Execution
    discussionPoints: "",
    decisionsMade: "",
    // Outputs
    actionItems: [],
  },
];

export const useMrm = () => {
  // 2. DEFINE STATE (The Data)
  // This holds the actual array of meetings, initialized with mock data
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [loading, setLoading] = useState(false);

  // 3. DEFINE LOGIC (The Methods)
  // This function handles the logic of creating a new ID and saving.
  // Updated to handle the new data structure with invitedAttendees
  const createMeeting = (data) => {
    const newEntry = {
      ...data,
      id: Date.now(),
      status: "Draft",
      createdAt: new Date().toISOString(),
    };

    // In a real app, you would call axios.post() here
    setMeetings((prev) => [...prev, newEntry]);
    return newEntry; // Return the created meeting
  };

  const updateMeeting = (id, updatedFields) => {
    // Logic to find the specific item and update it
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
    );
  };

  // 4. RETURN THE INTERFACE (The Public API)
  // We only return what the UI needs to know.
  return {
    meetings, // The Data
    loading, // The Status
    createMeeting, // The Action
    updateMeeting, // The Action
  };
};
