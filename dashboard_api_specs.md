# QMS Dashboard API Specifications

This document outlines the API endpoints required to power the Quality Management System (QMS) Dashboard. All endpoints should follow RESTful principles and return JSON responses.

## Base URL
`https://api.yourdomain.com/v1/dashboard`

## Authentication
All requests must include a Bearer Token in the `Authorization` header.
`Authorization: Bearer <token>`

---

## 1. Overall System Health
**Endpoint:** `GET /stats`  
**Description:** Returns the overall health score and high-level summary metrics.

### Response
```json
{
  "healthScore": 94,
  "status": "Excellent",
  "summaries": {
    "riskLevel": "Low",
    "documentCompliance": 100,
    "openCapaCount": 2
  }
}
```

---

## 2. Training Compliance
**Endpoint:** `GET /training-compliance`  
**Description:** Returns training completion percentage and trends.

### Response
```json
{
  "compliancePercentage": 98.0,
  "trend": {
    "direction": "up",
    "value": 2.4
  },
  "pendingEmployees": 2
}
```

---

## 3. Document Status
**Endpoint:** `GET /document-status`  
**Description:** Provides counts of documents by status and a shortlist of critical documents.

### Response
```json
{
  "counts": {
    "total": 142,
    "inReview": 4,
    "expired": 1
  },
  "criticalDocuments": [
    {
      "id": "SOP-LAB-04",
      "title": "Laboratory Safety Protocol",
      "status": "pending_review",
      "daysUntilDue": 5
    },
    {
      "id": "POL-HR-01",
      "title": "Employee Conduct Policy",
      "status": "expired",
      "daysUntilDue": 0
    }
  ]
}
```

---

## 4. Next Audit
**Endpoint:** `GET /next-audit`  
**Description:** Details of the single most immediate upcoming audit.

### Response
```json
{
  "auditType": "ISO 9001 Internal Audit",
  "daysRemaining": 12,
  "date": "2025-10-15T00:00:00Z"
}
```

---

## 5. My Actions (Task List)
**Endpoint:** `GET /tasks`  
**Description:** Retrive a list of urgent tasks assigned to the current user.

### Query Parameters
- `limit` (int, optional): Number of tasks to return. Default: 5.

### Response
```json
{
  "urgentCount": 3,
  "tasks": [
    {
      "id": "TASK-101",
      "title": "Review Calibration Report - Centrifuge B",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-10-04T17:00:00Z",
      "isOverdue": false
    },
    {
      "id": "TASK-102",
      "title": "Submit Monthly KPI Data",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2025-10-01T17:00:00Z",
      "isOverdue": true
    }
  ]
}
```

---

## 6. Incident Trends (CAPA)
**Endpoint:** `GET /incident-trends`  
**Description:** Returns time-series data for incident frequency, typically for the current week.

### Response
```json
{
  "totalThisWeek": 74,
  "averagePerDay": 10.5,
  "isImproving": true,
  "data": [
    { "day": "Mon", "count": 6 },
    { "day": "Tue", "count": 10 },
    { "day": "Wed", "count": 8 },
    { "day": "Thu", "count": 13 },
    { "day": "Fri", "count": 9 },
    { "day": "Sat", "count": 11 },
    { "day": "Sun", "count": 7 }
  ]
}
```

---

## 7. Recent Activity Feed
**Endpoint:** `GET /activity`  
**Description:** A stream of recent actions performed across the system.

### Response
```json
{
  "activities": [
    {
      "userName": "Sarah C.",
      "userInitial": "S",
      "action": "released document",
      "target": "SOP-Quality-01",
      "timestamp": "2025-03-04T08:30:00Z",
      "timeAgo": "2h ago"
    },
    {
      "userName": "System",
      "userInitial": "S",
      "action": "flagged deviation",
      "target": "Batch 292",
      "timestamp": "2025-03-04T05:30:00Z",
      "timeAgo": "5h ago"
    }
  ]
}
```

---

## 8. Risk Assessment Status
**Endpoint:** `GET /risk-assessment`  
**Description:** Breakdown of current risks by severity levels.

### Response
```json
{
  "overallRisk": "Low",
  "breakdown": {
    "low": 12,
    "medium": 5,
    "high": 1
  }
}
```

---

## 9. Deviations Summary
**Endpoint:** `GET /deviations`  
**Description:** Summary of open and closed deviations with monthly trends.

### Response
```json
{
  "totalOpen": 7,
  "trend": -3,
  "statusBreakdown": {
    "open": 4,
    "underReview": 2,
    "closedThisMonth": 1
  }
}
```

---

## 10. Audit Readiness Breakdown
**Endpoint:** `GET /audit-readiness`  
**Description:** Percentage-based readiness scores across key QMS modules.

### Response
```json
{
  "overallReadiness": 92,
  "modules": {
    "documents": 100,
    "training": 98,
    "capa": 85,
    "records": 95
  }
}
```

---

## 11. Supplier Quality
**Endpoint:** `GET /supplier-quality`  
**Description:** Aggregated quality percentage for vendors and critical alerts.

### Response
```json
{
  "averageScore": 89,
  "status": "warning",
  "criticalAlert": "Vendor B requires review"
}
```
