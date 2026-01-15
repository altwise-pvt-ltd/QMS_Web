export const QUALITY_INDICATORS = [
    // --- Pre-Analytical ---
    {
        id: "pre-1",
        name: "Vein puncture failure",
        category: "Pre-Analytical",
        count: 12,
        hasCapa: true,
        capaId: "CAPA-2026-001",
        incidents: [
            { date: "2026-01-05", value: 1 },
            { date: "2026-01-12", value: 2 },
        ]
    },
    {
        id: "pre-2",
        name: "Typographic Error",
        category: "Pre-Analytical",
        count: 5,
        hasCapa: false,
        incidents: []
    },
    {
        id: "pre-3",
        name: "Wrong sample identification",
        category: "Pre-Analytical",
        count: 3,
        hasCapa: true,
        capaId: "CAPA-2026-015",
        incidents: []
    },
    {
        id: "pre-4",
        name: "Incomplete form",
        category: "Pre-Analytical",
        count: 8,
        hasCapa: false,
        incidents: []
    },
    {
        id: "pre-5",
        name: "Sample Labeling error",
        category: "Pre-Analytical",
        count: 15,
        hasCapa: true,
        capaId: "CAPA-2026-008",
        incidents: []
    },
    {
        id: "pre-6",
        name: "Inappropriate vial selection",
        category: "Pre-Analytical",
        count: 2,
        hasCapa: false,
        incidents: []
    },
    {
        id: "pre-7",
        name: "Accidents reported",
        category: "Pre-Analytical",
        count: 1,
        hasCapa: false,
        incidents: []
    },

    // --- Analytical ---
    {
        id: "ana-1",
        name: "Wrong sample processed",
        category: "Analytical",
        count: 0,
        hasCapa: false,
        incidents: []
    },
    {
        id: "ana-2",
        name: "Random error",
        category: "Analytical",
        count: 4,
        hasCapa: false,
        incidents: []
    },
    {
        id: "ana-3",
        name: "Systematic error",
        category: "Analytical",
        count: 1,
        hasCapa: true,
        capaId: "CAPA-2026-022",
        incidents: []
    },
    {
        id: "ana-4",
        name: "IQC Failure",
        category: "Analytical",
        count: 9,
        hasCapa: true,
        capaId: "CAPA-2026-005",
        incidents: []
    },
    {
        id: "ana-5",
        name: "EQAS Failure",
        category: "Analytical",
        count: 2,
        hasCapa: true,
        capaId: "CAPA-2026-012",
        incidents: []
    },
    {
        id: "ana-6",
        name: "Sample Re-assay",
        category: "Analytical",
        count: 22,
        hasCapa: false,
        incidents: []
    },

    // --- Post-Analytical ---
    {
        id: "post-1",
        name: "Printing Error",
        category: "Post-Analytical",
        count: 6,
        hasCapa: false,
        incidents: []
    },
    {
        id: "post-2",
        name: "Urgent sample report",
        category: "Post-Analytical",
        count: 45,
        hasCapa: false,
        incidents: []
    },
    {
        id: "post-3",
        name: "Critical Value Reporting",
        category: "Post-Analytical",
        count: 120,
        hasCapa: false,
        incidents: []
    },
    {
        id: "post-4",
        name: "Turnaround time (TAT)",
        category: "Post-Analytical",
        count: 14,
        hasCapa: true,
        capaId: "CAPA-2026-030",
        incidents: []
    },
    {
        id: "post-5",
        name: "Improper report dispatch",
        category: "Post-Analytical",
        count: 3,
        hasCapa: false,
        incidents: []
    },
    {
        id: "post-6",
        name: "Report delivery Time",
        category: "Post-Analytical",
        count: 7,
        hasCapa: false,
        incidents: []
    }
];

export const CATEGORIES = ["Pre-Analytical", "Analytical", "Post-Analytical"];
