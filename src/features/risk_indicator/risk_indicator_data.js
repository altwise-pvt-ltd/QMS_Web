export const RISK_INDICATORS = [
    // Impartiality Ethics
    { id: "risk-1", name: "Conflict of interest influencing results", category: "Impartiality Ethics", count: 2, hasCapa: true, severity: 4, threshold: 1, incidents: [] },
    { id: "risk-2", name: "Commercial pressure affecting reporting", category: "Impartiality Ethics", count: 0, hasCapa: false, severity: 5, threshold: 0, incidents: [] },
    { id: "risk-3", name: "Referral incentives biasing test selection", category: "Impartiality Ethics", count: 1, hasCapa: false, severity: 3, threshold: 2, incidents: [] },

    // Confidentiality
    { id: "risk-4", name: "Unauthorized access to patient data", category: "Confidentiality", count: 3, hasCapa: true, severity: 5, threshold: 1, incidents: [] },
    { id: "risk-5", name: "Data leakage via email WhatsApp", category: "Confidentiality", count: 12, hasCapa: true, severity: 4, threshold: 5, incidents: [] },
    { id: "risk-6", name: "Improper record disposal", category: "Confidentiality", count: 1, hasCapa: false, severity: 3, threshold: 3, incidents: [] },

    // Organizational Structure
    { id: "risk-7", name: "Unclear authority responsibility", category: "Organizational Structure", count: 4, hasCapa: false, severity: 2, threshold: 10, incidents: [] },
    { id: "risk-8", name: "Noncompliance with statutory licenses", category: "Organizational Structure", count: 0, hasCapa: false, severity: 5, threshold: 0, incidents: [] },

    // Personnel
    { id: "risk-9", name: "Incompetent staff performing tests", category: "Personnel", count: 1, hasCapa: true, severity: 5, threshold: 0, incidents: [] },
    { id: "risk-10", name: "High staff turnover", category: "Personnel", count: 15, hasCapa: false, severity: 3, threshold: 10, incidents: [] },
    { id: "risk-11", name: "Inadequate training documentation", category: "Personnel", count: 8, hasCapa: false, severity: 2, threshold: 5, incidents: [] },

    // Facilities
    { id: "risk-12", name: "Temperature excursions", category: "Facilities", count: 24, hasCapa: true, severity: 4, threshold: 15, incidents: [] },
    { id: "risk-13", name: "Power failure during testing", category: "Facilities", count: 2, hasCapa: false, severity: 4, threshold: 3, incidents: [] },
    { id: "risk-14", name: "Biohazard exposure", category: "Facilities", count: 0, hasCapa: false, severity: 5, threshold: 0, incidents: [] },

    // Reagents Consumables
    { id: "risk-15", name: "Expired reagents in use", category: "Reagents Consumables", count: 1, hasCapa: true, severity: 5, threshold: 0, incidents: [] },
    { id: "risk-16", name: "Lot-to-lot variation", category: "Reagents Consumables", count: 6, hasCapa: false, severity: 3, threshold: 5, incidents: [] },
    { id: "risk-17", name: "Supplier failure", category: "Reagents Consumables", count: 2, hasCapa: false, severity: 3, threshold: 2, incidents: [] },

    // Document Control
    { id: "risk-18", name: "Obsolete SOP in use", category: "Document Control", count: 3, hasCapa: true, severity: 4, threshold: 1, incidents: [] },

    // Nonconformity & CAPA
    { id: "risk-19", name: "Repeat nonconformities", category: "Nonconformity & CAPA", count: 5, hasCapa: true, severity: 4, threshold: 2, incidents: [] },

    // Business Continuity
    { id: "risk-20", name: "Power failure", category: "Business Continuity", count: 4, hasCapa: false, severity: 3, threshold: 5, incidents: [] },
    { id: "risk-21", name: "LIS downtime", category: "Business Continuity", count: 1, hasCapa: false, severity: 4, threshold: 2, incidents: [] },
    { id: "risk-22", name: "Pandemic staff loss", category: "Business Continuity", count: 0, hasCapa: false, severity: 5, threshold: 0, incidents: [] },
];

export const CATEGORIES = [
    "Impartiality Ethics",
    "Confidentiality",
    "Organizational Structure",
    "Personnel",
    "Facilities",
    "Reagents Consumables",
    "Document Control",
    "Nonconformity & CAPA",
    "Business Continuity",
];
