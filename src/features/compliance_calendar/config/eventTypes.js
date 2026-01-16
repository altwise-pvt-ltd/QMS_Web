// Pre-configured compliance event types for regulatory tracking

export const EVENT_TYPES = {
  CALIBRATION: {
    id: "calibration",
    name: "Calibration",
    category: "Equipment",
    color: "#3B82F6", // Blue
    icon: "Gauge",
    defaultFrequency: "yearly",
    description: "Equipment calibration and verification",
  },
  AMC: {
    id: "amc",
    name: "AMC (Annual Maintenance Contract)",
    category: "Maintenance",
    color: "#10B981", // Green
    icon: "Wrench",
    defaultFrequency: "yearly",
    description: "Annual maintenance contract renewals",
  },
  PT_EQA: {
    id: "pt_eqa",
    name: "PT/EQA",
    category: "Quality Assurance",
    color: "#8B5CF6", // Purple
    icon: "TestTube",
    defaultFrequency: "quarterly",
    description: "Proficiency Testing / External Quality Assessment",
  },
  INTERNAL_AUDIT: {
    id: "internal_audit",
    name: "Internal Audit",
    category: "Audit",
    color: "#F59E0B", // Amber
    icon: "ClipboardCheck",
    defaultFrequency: "quarterly",
    description: "Internal quality system audits",
  },
  EXTERNAL_AUDIT: {
    id: "external_audit",
    name: "External Audit",
    category: "Audit",
    color: "#EF4444", // Red
    icon: "Shield",
    defaultFrequency: "yearly",
    description: "External certification/accreditation audits",
  },
  LICENSE_RENEWAL: {
    id: "license_renewal",
    name: "License Renewal",
    category: "Legal",
    color: "#EC4899", // Pink
    icon: "FileText",
    defaultFrequency: "yearly",
    description: "License and permit renewals",
  },
  KPI_SUBMISSION: {
    id: "kpi_submission",
    name: "KPI Submission",
    category: "Reporting",
    color: "#06B6D4", // Cyan
    icon: "BarChart",
    defaultFrequency: "monthly",
    description: "Key Performance Indicator submissions",
  },
  TRAINING: {
    id: "training",
    name: "Training",
    category: "HR",
    color: "#84CC16", // Lime
    icon: "GraduationCap",
    defaultFrequency: "yearly",
    description: "Staff training and competency assessments",
  },
  EQUIPMENT_VALIDATION: {
    id: "equipment_validation",
    name: "Equipment Validation",
    category: "Equipment",
    color: "#6366F1", // Indigo
    icon: "CheckCircle",
    defaultFrequency: "yearly",
    description: "Equipment validation and qualification",
  },
  CERTIFICATE_RENEWAL: {
    id: "certificate_renewal",
    name: "Certificate Renewal",
    category: "Legal",
    color: "#F97316", // Orange
    icon: "Award",
    defaultFrequency: "yearly",
    description: "Professional certificates and accreditations",
  },
};

// Frequency options
export const FREQUENCY_OPTIONS = [
  { value: "one-time", label: "One Time", days: null },
  { value: "weekly", label: "Weekly", days: 7 },
  { value: "monthly", label: "Monthly", days: 30 },
  { value: "quarterly", label: "Quarterly", days: 90 },
  { value: "half-yearly", label: "Half Yearly", days: 180 },
  { value: "yearly", label: "Yearly", days: 365 },
];

// Status options
export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "gray" },
  { value: "in-progress", label: "In Progress", color: "blue" },
  { value: "completed", label: "Completed", color: "green" },
  { value: "overdue", label: "Overdue", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
];

// Document types for legal documents
export const DOCUMENT_TYPES = [
  { value: "license", label: "License", icon: "FileText" },
  { value: "certificate", label: "Certificate", icon: "Award" },
  { value: "accreditation", label: "Accreditation", icon: "Shield" },
  { value: "permit", label: "Permit", icon: "FileCheck" },
  { value: "registration", label: "Registration", icon: "FileSignature" },
];

// Helper function to get event type by ID
export const getEventTypeById = (id) => {
  return Object.values(EVENT_TYPES).find((type) => type.id === id);
};

// Helper function to get all event types as array
export const getAllEventTypes = () => {
  return Object.values(EVENT_TYPES);
};
