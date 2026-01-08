# NC Form: Auth & Storage Reference

This document serves as a reference for the integration of authentication context and persistent storage within the Non-Conformance (NC) reporting module.

## 1. Authentication Integration

The `NonConformanceForm.jsx` uses the `useAuth` hook from `../../auth/AuthContext` to capture the current user's session.

- **Captured Data**: `name`, `id`, `role`.
- **Usage**: Automatically attached to the `submittedBy` field in the submission payload for traceability.

## 2. Persistent Storage (Dexie.js)

NC reports are stored locally using IndexedDB through the Dexie.js wrapper.

- **Database**: `QMS_Web_DB` (Version 2)
- **Table**: `nc_reports`
- **Schema**: `id, documentNo, documentName, status, submittedBy.name, lastModified`
- **Service**: `src/services/ncService.js` provides methods for CRUD operations.

## 3. Form Refactoring

The form is broken down into modular components:

- `NCHeader.jsx`: Manages document metadata.
- `NCEntry.jsx`: Handles individual NC records.
- `NCActions.jsx`: Manages form-level actions.

## 4. Key Submission Logic

```javascript
const handleSubmit = async () => {
  const payload = {
    ...formData,
    lastModified: new Date().toISOString(),
    submittedBy: { name: user.name, id: user.id, role: user.role },
  };
  await ncService.saveNCReport(payload);
  // ... feedback ...
};
```

_Created on: 2026-01-08_
