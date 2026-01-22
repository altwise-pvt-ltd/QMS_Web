// src/pages/risk/services/riskService.js

/**
 * Risk Scoring Model
 * Score = Severity × Likelihood
 * Both are integers from 1–5
 */

/**
 * Fetch risks
 * In real life: API call
 * For now: static or mocked backend response
 */
export const getRisks = async () => {
  // Replace with API later
  return [
    {
      id: "R-001",
      clause: "5.5",
      title: "Delayed calibration of equipment",
      description:
        "Critical testing equipment not calibrated within scheduled intervals, leading to potential result inaccuracy",
      category: "Equipment",
      severity: 4,
      likelihood: 3,
      owner: "Quality Manager",
      capaStatus: "Open",
    },
    {
      id: "R-002",
      clause: "5.2",
      title: "Staff competency gap",
      description:
        "Laboratory personnel lack documented competency for specific test procedures",
      category: "Human Resource",
      severity: 3,
      likelihood: 4,
      owner: "Lab Manager",
      capaStatus: "In Progress",
    },
    {
      id: "R-003",
      clause: "4.3",
      title: "Document control lapse",
      description:
        "Obsolete SOPs accessible in work areas, risk of using outdated procedures",
      category: "Documentation",
      severity: 2,
      likelihood: 2,
      owner: "QA",
      capaStatus: "Closed",
    },
    {
      id: "R-004",
      clause: "5.6",
      title: "Reagent expiry oversight",
      description:
        "Expired reagents used in testing due to inadequate inventory management",
      category: "Pre-analytical",
      severity: 5,
      likelihood: 2,
      owner: "Technical Manager",
      capaStatus: "Open",
    },
    {
      id: "R-005",
      clause: "5.4",
      title: "Sample mix-up",
      description:
        "Patient samples incorrectly labeled or swapped during processing",
      category: "Pre-analytical",
      severity: 5,
      likelihood: 1,
      owner: "Lab Supervisor",
      capaStatus: "In Progress",
    },
    {
      id: "R-006",
      clause: "5.9",
      title: "Result reporting delay",
      description:
        "Critical results not communicated to clinicians within turnaround time",
      category: "Post-analytical",
      severity: 4,
      likelihood: 2,
      owner: "Operations Manager",
      capaStatus: "Open",
    },
    {
      id: "R-007",
      clause: "7.4",
      title: "IT system downtime",
      description:
        "Laboratory Information System (LIS) failure causing workflow disruption",
      category: "Information Management",
      severity: 3,
      likelihood: 3,
      owner: "IT Manager",
      capaStatus: "Closed",
    },
    {
      id: "R-008",
      clause: "6.4",
      title: "External quality control failure",
      description:
        "Failure to meet proficiency testing requirements for critical tests",
      category: "Quality Control",
      severity: 4,
      likelihood: 2,
      owner: "Quality Manager",
      capaStatus: "In Progress",
    },
  ].map(enrichRisk);
};

/**
 * Enrich raw risk with derived fields
 * Centralized logic – UI never calculates
 */
const enrichRisk = (risk) => {
  const score = risk.severity * risk.likelihood;

  return {
    ...risk,
    score,
    level: getRiskLevel(score),
    color: getRiskColor(score),
  };
};

/**
 * Risk Level Buckets (ISO 31000 standard)
 */
export const getRiskLevel = (score) => {
  if (score >= 20) return "Extreme";
  if (score >= 15) return "High";
  if (score >= 8) return "Medium";
  return "Low";
};

/**
 * UI Color Mapping (single source)
 */
export const getRiskColor = (score) => {
  if (score >= 20) return "red";
  if (score >= 15) return "orange";
  if (score >= 8) return "yellow";
  return "green";
};

/**
 * Risk Summary for dashboard cards
 */
export const getRiskSummary = (risks) => {
  return {
    total: risks.length,
    extreme: risks.filter((r) => r.level === "Extreme").length,
    high: risks.filter((r) => r.level === "High").length,
    medium: risks.filter((r) => r.level === "Medium").length,
    low: risks.filter((r) => r.level === "Low").length,
  };
};

/**
 * Risk Matrix Data
 * Output shape: 2D array (5x5 grid)
 * matrix[row][col] = { severity, likelihood, count, risks, score }
 */
export const getMatrixData = (risks) => {
  const matrix = [];

  // Build 5x5 grid (severity 5 to 1 from top to bottom)
  for (let severity = 5; severity >= 1; severity--) {
    const row = [];
    for (let likelihood = 1; likelihood <= 5; likelihood++) {
      // Find all risks for this cell
      const cellRisks = risks.filter(
        (r) => r.severity === severity && r.likelihood === likelihood,
      );

      const score = severity * likelihood;

      row.push({
        severity,
        likelihood,
        count: cellRisks.length,
        risks: cellRisks,
        score,
        level: getRiskLevel(score),
        color: getRiskColor(score),
      });
    }
    matrix.push(row);
  }

  return matrix;
};
