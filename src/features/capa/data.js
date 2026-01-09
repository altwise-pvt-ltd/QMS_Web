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
    id: "CAPA-2026-001",
    ncId: "NC-2025-095",
    issueNo: "ISS-950",
    name: "Reagent Expiry Not Tracked",
    filedBy: "Harsh Patel",
    filedDate: "2026-01-02",
    department: "Quality Assurance",
    status: "Closed"
  }
];