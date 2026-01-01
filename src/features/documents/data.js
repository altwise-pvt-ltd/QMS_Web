import { Book, Shield, FileText, ClipboardList } from "lucide-react";

export const DOC_LEVELS = [
  {
    id: "level-1",
    level: 1,
    title: "Quality Manual",
    description: "Strategic governance and policies.",
    icon: Book,
    color: "bg-purple-100 text-purple-600",
    items: [
      { name: "Quality Manual (Master Document)" },
      { name: "Scope of Services & Locations" },
      { name: "Quality Policy & Objectives" },
      { name: "Organizational Structure / Organogram" },
      { name: "QMS Description & Procedure Map" },
    ],
  },
  {
    id: "level-2",
    level: 2,
    title: "Management Procedures",
    description: "System-wide SOPs & policies.",
    icon: Shield,
    color: "bg-blue-100 text-blue-600",
    items: [
      { name: "Document Control Procedure" },
      { name: "Records Management / Retention" },
      { name: "Risk & Opportunity Management" },
      { name: "Nonconformity & CAPA Management" },
      { name: "Complaints Handling" },
      { name: "Internal Audit Procedure" },
      { name: "Management Review (MRM)" },
      { name: "Training & Competence" },
      { name: "Supplier Management" },
      { name: "Equipment & Calibration Management" },
      { name: "IT & LIS Management" },
      { name: "Business Continuity Plan" },
    ],
  },
  {
    id: "level-3",
    level: 3,
    title: "Technical SOPs",
    description: "Step-by-step analytical instructions.",
    icon: FileText,
    color: "bg-teal-100 text-teal-600",
    // Sub-categories handling
    sections: [
      {
        title: "Pre-Examination",
        items: [
          "Patient Info & Consent",
          "Sample Collection (Phlebotomy)",
          "Sample Transport & Reception",
          "Acceptance & Rejection Criteria",
        ],
      },
      {
        title: "Examination (Analytical)",
        items: [
          "Haematology SOPs",
          "Biochemistry SOPs",
          "Microbiology SOPs",
          "Method Verification & Validation",
          "IQC & EQA Procedures",
        ],
      },
      {
        title: "Post-Examination",
        items: [
          "Result Review & Authorization",
          "Critical Results Reporting",
          "Report Issue & Amendment",
        ],
      },
      {
        title: "Support",
        items: [
          "Biosafety & PPE",
          "Waste Disposal",
          "Environmental Monitoring",
        ],
      },
    ],
  },
  {
    id: "level-4",
    level: 4,
    title: "Forms & Records",
    description: "Logs, checklists, and raw data.",
    icon: ClipboardList,
    color: "bg-slate-100 text-slate-600",
    sections: [
      {
        title: "Quality & Governance",
        items: [
          "CAPA Form",
          "Risk Register",
          "Audit Checklist",
          "Complaint Form",
        ],
      },
      {
        title: "HR & Competence",
        items: ["Job Descriptions", "Training Logs", "Competency Assessments"],
      },
      {
        title: "Operational",
        items: [
          "Test Requisition Forms",
          "Temperature Logs",
          "Maintenance Logs",
          "Calibration Certificates",
        ],
      },
    ],
  },
];
