# Non-Conformance (NC) Module Documentation

This directory contains the logic and components for reporting Non-Conformances.

## Directory Structure

```text
src/features/NC/
├── NonConformanceForm.jsx    # Main container (state, Auth integration, Alerts)
├── components/
│   ├── NCHeader.jsx          # Document metadata (Issue No, Title)
│   ├── NCEntry.jsx           # Incident fields (Hierarchical Categories, Image Upload)
│   └── NCActions.jsx         # Footer actions (Save/Submit)
└── data/
    └── NcCategories.js       # Hierarchical category configuration
```

## Core Features & Data Flow

### 1. User Integration

- Uses `AuthContext` to auto-fill "Responsibility" and "Department" fields.
- Submissions include `submittedBy` metadata for traceability.

### 2. Category Hierarchy

- Selecting a category (e.g., Pre-Analytical) dynamically filters the sub-categories in the "Nature of N.C." dropdown.

### 3. Image Upload (Cloudflare Integration)

- Images are captured as binary `File` objects.
- `ncService.js` intercepts the save action and uploads the file via `documentService.uploadFile`.
- The binary `File` is replaced with a permanent `fileUrl` before saving to the database.

### 4. Persistence

- Stored in the `nc_reports` table in Dexie (`src/db/index.js`).
- Uses auto-incrementing IDs (`++id`).
- Feedback is provided via MUI `Snackbar` and `Alert` components on success/error.
