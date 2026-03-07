# Corrective and Preventive Action (CAPA) - Backend Integration Documentation

This document outlines the backend requirements for the **CAPA (Corrective and Preventive Action)** module, based on the React frontend implementation.

---

## 1. Feature Overview
The CAPA module allows users to document, track, and manage non-conformities (NC) identified within the laboratory or organization. It provides a structured workflow for performing root cause analysis and implementing corrective/preventive actions.

**User Capabilities:**
- Log a new CAPA entry from scratch or linked to an existing Non-Conformance (NC).
- Select departments and categories (Pre-Analytical, Analytical, Post-Analytical, etc.).
- Perform an "Audit Evaluation" through a dynamic questionnaire tailored to the selected category.
- Receive automated suggestions for Root Cause, Corrective, and Preventive actions based on audit answers.
- Tag staff members involved in the incident.
- Upload supporting documents/proofs.
- View and print a formal CAPA report with a controlled copy watermark.

---

## 2. Frontend Flow
1. **Initiation**: User opens the CAPA screen and either clicks "Create New" or selects an existing NC from a history list to "File CAPA".
2. **Setup**: The user selects the **Date**, **Department**, and **Primary Category**. Choosing a category filters the **Sub-category** list.
3. **Audit Execution**:
   - If a category/sub-category matches predefined templates, an **Audit Evaluation** link appears.
   - User opens a popup questionnaire and answers "Yes" or "No" to specific quality checks.
   - For "No" answers, the system suggests typical Root Causes and Actions.
   - User can also add custom questions and manual notes.
4. **Form Completion**: Results from the audit are "Applied," automatically populating the **Root Cause**, **Corrective Action**, and **Preventive Action** text areas (which the user can then refine).
5. **Staff Tagging**: User searches and tags staff members involved (fetched from the staff service).
6. **Documentation**: User writes incident details, effectiveness notes, and closure verification text. Files are selected for upload.
7. **Submission**: User submits the form. The frontend expects a unique CAPA ID and a success status to redirect back to the history view.

---

## 3. Screens and Components

### `Capa.jsx` (Container)
- **Responsibility**: Manages the view state (`history`, `form`, `preview-original`) and handles the submission logic.
- **Key State**: `filedCapas` (list of submitted entries), `selectedNC` (data from an NC being converted to CAPA).

### `CapaForm.jsx` (Main Form)
- **Responsibility**: Captures all CAPA metadata and details.
- **Key Logic**: Merges audit suggestions into text areas; handles staff tagging search; manages file selection.
- **Props**: `selectedNC` (initial data), `onSubmit` (callback).

### `QuestionPopup.jsx` (Audit Logic)
- **Responsibility**: Displays the questionnaire based on `category`.
- **State**: `localAnswers` (Yes/No map), `selectedSuggestions` (which RC/CA/PA suggestions the user wants to keep).

### `CAPAFormView.jsx` (PDF/Print View)
- **Responsibility**: Displays a read-only, formal version of the CAPA for printing.
- **Logic**: Uses `html2pdf.js` for PDF generation.

---

## 4. API Requirements

| Endpoint Name | Method | Purpose |
| :--- | :--- | :--- |
| `POST /api/CAPA/CreateCAPA` | `POST` | Saves a new CAPA entry to the database. |
| `GET /api/CAPA/GetAllCAPAs` | `GET` | Retrieves all submitted CAPA entries for the history table. |
| `GET /api/Department/GetDepartments`| `GET` | Fetches list of departments for the dropdown. |
| `GET /api/Staff/GetAllStaff` | `GET` | Fetches staff list for tagging. |
| `POST /api/Files/Upload` | `POST` | (Suggested) Endpoint to handle multipart file uploads for attachments. |

---

## 5. Request Payload Structure

### `POST /api/CAPA/CreateCAPA`
```json
{
  "category": "Analytical",
  "subCategory": "Random error",
  "date": "2026-03-07",
  "targetDate": "2026-03-20",
  "department": "Pathology",
  "details": "High variance in IQC results for glucose.",
  "effectiveness": "Awaiting re-run results",
  "rootCause": "Improper reagent storage temperature.",
  "correctiveAction": "Discarded batch, recalibrated equipment.",
  "preventiveAction": "Installed digital temperature logger in fridge.",
  "closureVerification": "Verified by Lab Manager on 2026-03-08",
  "responsibility": "John Doe",
  "ncId": "NC-2026-012", 
  "issueNo": "12",
  "questions": ["Is IQC performed daily?", "Is reagent log maintained?"],
  "questionAnswers": {
    "0": "yes",
    "1": "no"
  },
  "taggedStaff": [
    { "id": 101, "name": "Jane Smith", "role": "Technician" }
  ],
  "attachments": [
    { "fileName": "calib_report.pdf", "fileUrl": "base64_or_signed_url" }
  ]
}
```

---

## 6. Expected API Response

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "CAPA entry saved successfully",
  "data": {
    "capaId": "CAPA-2026-005",
    "status": "Submitted",
    "submittedAt": "2026-03-07T15:00:00Z"
  }
}
```

---

## 7. Database Design Suggestions

### Table: `Capas`
| Column | Type | Notes |
| :--- | :--- | :--- |
| `CapaId` | `INT (PK)` | Auto-increment or GUID |
| `DisplayId` | `VARCHAR(20)` | e.g. "CAPA-2026-001" |
| `NCReferenceId` | `INT (FK)` | Links to the Non-Conformance table (Nullable) |
| `Category` | `VARCHAR(50)` | |
| `SubCategory` | `VARCHAR(100)` | |
| `IncidentDate` | `DATE` | |
| `TargetDate` | `DATE` | |
| `Department` | `VARCHAR(100)` | Or FK to Departments table |
| `Details` | `TEXT` | |
| `RootCause` | `TEXT` | |
| `CorrectiveAction` | `TEXT` | |
| `PreventiveAction` | `TEXT` | |
| `Effectiveness` | `TEXT` | |
| `ClosureVerification` | `TEXT` | |
| `Status` | `VARCHAR(20)` | "Open", "Closed", "Submitted" |
| `CreatedBy` | `VARCHAR(100)` | |
| `CreatedAt` | `DATETIME` | |

### Table: `CapaTaggedStaff` (Many-to-Many)
- `CapaId` (FK)
- `StaffId` (FK)

### Table: `CapaAttachments`
- `AttachmentId` (PK)
- `CapaId` (FK)
- `FileName`
- `FilePath` (S3/Local storage path)

---

## 8. Validation Requirements
- **Mandatory Fields**: `Category`, `SubCategory`, `Department`, `Date`, and `Responsibility` must not be null.
- **Date Logic**: `TargetDate` should not be earlier than `IncidentDate`.
- **References**: If `ncId` is provided, it must exist in the Non-Conformance table.
- **File Size**: Limit attachments (suggested 5MB per file).

---

## 9. Error Handling
The backend should return a standardized error object.

### Example: Validation Error (400 Bad Request)
```json
{
  "success": false,
  "error": "ValidationError",
  "details": [
    { "field": "targetDate", "message": "Target Date cannot be in the past." }
  ]
}
```

---

## 10. Integration Notes for .NET Backend
- **Audit Storage**: Store the `questionAnswers` as a JSON string in a column (PostgreSQL `jsonb` or SQL Server `NVARCHAR(MAX)` with JSON check constraint) to keep the schema flexible.
- **File Handling**: Use `IFormFile` in the controller. Store files in a dedicated storage provider (Azure Blob, AWS S3, or a local volume) and store only the path/URL in the database.
- **Service Layer**: Create a `ICapaService` to handle the business logic of linking a CAPA to an NC and potentially updating the NC status.
- **Auto-ID Generation**: Implement a logic to generate `DisplayId` based on the current year and a sequence (e.g., `CAPA-{Year}-{Sequence}`).

---

## Follow-up Considerations

### 1. Missing Information
- The frontend logic for "Other" sub-categories requires a `customSubCategory` field, which should be stored if `category === "Other"`.
- The exact file upload strategy (single multipart request vs. separate attachment API) needs to be finalized between teams.

### 2. Backend Assumptions
- `taggedStaff` IDs are expected to map to an existing `Staff` entity in the backend.
- It is assumed the backend will handle the translation of the frontend's local file URLs (`blob:`) into persistent storage paths.

### 3. Possible Improvements
- **Master Audit Table**: Move the questionnaire from frontend `quedata.js` to a backend table so that quality audits can be updated by administrators without redeploying code.
- **Status Workflow**: Add logic to handle "Draft" saves before final "Submission".
