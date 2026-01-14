// data.js

export const initialNCs = [
  {
    id: "NC-2026-001",
    issueNo: "ISS-982",
    name: "Temperature Excursion in Storage",
    reportedBy: "Dr. Sarah Smith",
    date: "2026-01-05",
    department: "Analytical - Clinical Chemistry",
    category: "Analytical",
    subCategory: "Environmental Control"
  },
  {
    id: "NC-2026-002",
    issueNo: "ISS-985",
    name: "Sample Labeling Mismatch",
    reportedBy: "James Wilson",
    date: "2026-01-07",
    department: "Phlebotomy",
    category: "Pre-Analytical",
    subCategory: "Sample labeling error"
  },
  {
    id: "NC-2026-003",
    issueNo: "ISS-988",
    name: "Turnaround Time Delay - Microbiology",
    reportedBy: "Emily Brown",
    date: "2026-01-08",
    department: "Analytical - Microbiology",
    category: "Post-Analytical",
    subCategory: "Turnaround time (TAT)"
  }
];

export const initialFiledCapas = [
  {
    // ================= BASIC CAPA INFO =================
    issueNo: "NC-2025-014",
    category: "Pre-Analytical",
    subCategory: "Vein puncture failure",

    date: "2025-01-10",
    targetDate: "2025-01-20",

    department: "Phlebotomy",
    responsibility: "Mr. Rajesh Kumar",

    // ================= CAPA CONTENT =================
    details:
      "Patient experienced difficulty during blood collection due to multiple puncture attempts. Sample collection was delayed and patient discomfort was reported.",

    rootCause:
      "Improper vein assessment and insufficient training of newly assigned phlebotomist.",

    correctiveAction:
      "Senior phlebotomist completed sample collection and patient was monitored. Staff counseling was done immediately.",

    preventiveAction:
      "Refresher training on vein selection and patient positioning scheduled for all phlebotomy staff.",

    closureVerification:
      "Training records reviewed and competency assessment completed. No repeat incidents reported in last 30 days.",

    // ================= DOCUMENT METADATA (NEW) =================
    documentMeta: {
      documentNo: "ADC-FORM-03",
      issueNo: "01",
      issueDate: "2025-01-10",
      amendmentNo: null,
      amendmentDate: null,
      issuedBy: "QA Department",
      reviewedBy: "Lab Director",
      status: "Controlled"
    },

    // ================= OPTIONAL QUESTIONS (NOT USED IN VIEW) =================
    questions: [
      "Was the patient properly identified before sample collection?",
      "Was appropriate vein selection performed?",
      "Was the tourniquet applied correctly?",
      "Was proper needle gauge used?",
      "Was the phlebotomist adequately trained?",
      "Was the patient properly identified before sample collection?",
      "Was appropriate vein selection performed?",
      "Was the tourniquet applied correctly?",
      "Was proper needle gauge used?",
      "Was the phlebotomist adequately trained?",
      "Was the patient properly identified before sample collection?",
      "Was appropriate vein selection performed?",
      "Was the tourniquet applied correctly?",
      "Was proper needle gauge used?",
      "Was the phlebotomist adequately trained?"
    ],

    questionAnswers: {
      0: "yes",
      1: "no",
      2: "yes",
      3: "yes",
      4: "no",
      5: "yes",
      6: "no",
      7: "yes",
      8: "no",
      9: "yes",
      10: "no",
      11: "yes",
      12: "no",
      13: "yes"
    },

    // ================= ATTACHED FILE =================
    uploadedFile: {
      fileName: "Vein_Puncture_Incident_Report.pdf",
      fileType: "application/pdf",
      fileSizeMB: 1.8,
      fileUrl:
        "https://example.com/uploads/Vein_Puncture_Incident_Report.pdf"
    },

    // ================= SYSTEM FIELDS =================
    submittedAt: "2025-01-10T14:35:22.000Z",
    status: "Open"
  }
];
