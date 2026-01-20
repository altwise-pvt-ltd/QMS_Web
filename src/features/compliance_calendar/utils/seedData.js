import { db } from "../../../db/index";
import {
  createEvent,
  createLegalDocument,
  initializeEventTypes,
} from "../services/complianceService";

/**
 * Seed sample compliance calendar data for testing
 */
export const seedComplianceData = async () => {
  try {
    // Initialize event types first
    await initializeEventTypes();

    // Check if data already exists
    const existingEvents = await db.compliance_events.toArray();
    if (existingEvents.length > 0) {
      console.log("Compliance data already seeded");
      return;
    }

    // Get event types
    const eventTypes = await db.compliance_event_types.toArray();

    // Sample events
    const sampleEvents = [
      {
        eventTypeId: eventTypes.find((t) => t.name === "Calibration")?.id,
        title: "Annual Equipment Calibration - Lab Instruments",
        dueDate: "2026-02-15",
        status: "pending",
        assignedTo: "Quality Manager",
        recurrence: "yearly",
        reminderDays: 14,
        notes:
          "Calibrate all laboratory instruments including pipettes, balances, and thermometers",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "PT/EQA")?.id,
        title: "Q1 2026 Proficiency Testing Submission",
        dueDate: "2026-01-25",
        status: "in-progress",
        assignedTo: "Lab Technician",
        recurrence: "quarterly",
        reminderDays: 7,
        notes: "Submit PT samples for clinical chemistry panel",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "Internal Audit")?.id,
        title: "Q1 Internal Quality Audit",
        dueDate: "2026-03-31",
        status: "pending",
        assignedTo: "Internal Auditor",
        recurrence: "quarterly",
        reminderDays: 14,
        notes: "Comprehensive audit of quality management system",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "License Renewal")?.id,
        title: "Laboratory License Renewal",
        dueDate: "2026-06-30",
        status: "pending",
        assignedTo: "Quality Manager",
        recurrence: "yearly",
        reminderDays: 30,
        notes: "Renew state laboratory operating license",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "Training")?.id,
        title: "Annual Safety Training - All Staff",
        dueDate: "2026-04-15",
        status: "pending",
        assignedTo: "HR Manager",
        recurrence: "yearly",
        reminderDays: 21,
        notes:
          "Mandatory safety and compliance training for all laboratory staff",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "Training")?.id,
        title: "Onboarding Training - New Batch",
        dueDate: "2026-01-30",
        status: "in-progress",
        assignedTo: "HR Manager",
        recurrence: "one-time",
        reminderDays: 5,
        notes: "Orientation and induction for new laboratory joins",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "Training")?.id,
        title: "Advanced Pipetting Workshop",
        dueDate: "2026-02-10",
        status: "pending",
        assignedTo: "Technical Lead",
        recurrence: "half-yearly",
        reminderDays: 7,
        notes: "Hands-on workshop for precision pipetting techniques",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "Training")?.id,
        title: "QMS awareness Training",
        dueDate: "2025-12-15",
        status: "completed",
        assignedTo: "Quality Manager",
        recurrence: "yearly",
        reminderDays: 14,
        notes: "Annual refresher on QMS policies and procedures",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "AMC")?.id,
        title: "HVAC System Annual Maintenance",
        dueDate: "2026-05-01",
        status: "pending",
        assignedTo: "Facilities Manager",
        recurrence: "yearly",
        reminderDays: 14,
        notes: "Annual maintenance contract for HVAC system",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "KPI Submission")?.id,
        title: "January 2026 KPI Report",
        dueDate: "2026-02-05",
        status: "pending",
        assignedTo: "Quality Manager",
        recurrence: "monthly",
        reminderDays: 3,
        notes: "Submit monthly key performance indicators to management",
      },
      {
        eventTypeId: eventTypes.find((t) => t.name === "External Audit")?.id,
        title: "ISO 15189 Surveillance Audit",
        dueDate: "2026-08-15",
        status: "pending",
        assignedTo: "Quality Manager",
        recurrence: "yearly",
        reminderDays: 30,
        notes: "Annual surveillance audit by accreditation body",
      },
    ];

    // Create events
    for (const event of sampleEvents) {
      await createEvent(event);
    }

    // Sample legal documents
    const sampleDocuments = [
      {
        documentType: "license",
        documentName: "State Laboratory Operating License",
        issueDate: "2025-07-01",
        expiryDate: "2026-06-30",
        status: "active",
        fileData: null,
      },
      {
        documentType: "accreditation",
        documentName: "ISO 15189:2022 Accreditation Certificate",
        issueDate: "2024-09-01",
        expiryDate: "2027-08-31",
        status: "active",
        fileData: null,
      },
      {
        documentType: "certificate",
        documentName: "Quality Manager Professional Certification",
        issueDate: "2023-03-15",
        expiryDate: "2026-03-14",
        status: "active",
        fileData: null,
      },
      {
        documentType: "permit",
        documentName: "Hazardous Waste Disposal Permit",
        issueDate: "2025-01-01",
        expiryDate: "2026-12-31",
        status: "active",
        fileData: null,
      },
      {
        documentType: "registration",
        documentName: "CLIA Laboratory Registration",
        issueDate: "2024-04-01",
        expiryDate: "2026-03-31",
        status: "active",
        fileData: null,
      },
    ];

    // Create documents
    for (const doc of sampleDocuments) {
      await createLegalDocument(doc);
    }

    console.log("✅ Compliance calendar data seeded successfully");
  } catch (error) {
    console.error("Error seeding compliance data:", error);
  }
};

/**
 * Clear all compliance data
 */
export const clearComplianceData = async () => {
  try {
    await db.compliance_events.clear();
    await db.compliance_event_types.clear();
    await db.legal_documents.clear();
    await db.compliance_records.clear();
    console.log("✅ Compliance data cleared");
  } catch (error) {
    console.error("Error clearing compliance data:", error);
  }
};
