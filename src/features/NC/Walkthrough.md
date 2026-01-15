# Non-Conformance (NC) Module Documentation

This directory contains the core logic and UI components for the Non-Conformance reporting system.

## Directory Structure

```text
src/features/NC/
├── NonConformanceForm.jsx    # Main container component (state & logic)
├── components/
│   ├── NCHeader.jsx          # Document-level metadata (Issue No, Title, etc.)
│   ├── NCEntry.jsx           # Main data entry fields (Date, Category, NC Details)
│   └── NCActions.jsx         # Footer actions (Save, Cancel, Clear)
└── data/
    └── NcCategories.js       # Configuration for hierarchical NC categories
```

## Data Flow

The application follows a standard React parent-to-child data flow with integrated services for persistence.

### 1. Initialization & User Context

- **Source**: `src/auth/AuthContext.jsx`
- **Logic**: Upon mounting, `NonConformanceForm` retrieves the `user` object from `useAuth`.
- **Pre-fill**: A `useEffect` hook auto-populates "Responsibility" and "Department" fields if they are empty, ensuring traceability.

### 2. State Management

- **Local State**: Managed in `NonConformanceForm` using `useState`.
- **Nesting**: NC entry data is kept in a nested `entry` object to separate incident data from document metadata.
- **Hierarchical Dropdowns**: In `NCEntry.jsx`, choosing an "NC Category" (from `NcCategories.js`) filters the subcategories displayed in the "Nature of N.C." dropdown.

### 3. Image Handling

- **Capture**: Images are selected in `NCEntry.jsx` as binary `File` objects.
- **Preview**: Temporary URLs are generated using `URL.createObjectURL(file)` for instant UI feedback.
- **Remote Storage**: Before saving metadata, the `ncService` sends the `File` to the Cloudflare Worker via `documentService.uploadFile`.
- **Storage Result**: The binary `File` is replaced by a permanent `fileUrl` string for the database.

### 4. Persistence (Dexie.js)

- **Service**: `src/services/ncService.js`
- **Storage**: Data is stored in the `nc_reports` table in IndexedDB.
- **Schema**: Defined in `src/db/index.js`. The `id` field uses a `++id` prefix for auto-incrementing if a UUID isn't already provided.

## Key Services Used

- `ncService.js`: Interface for Dexie and remote upload orchestration.
- `documentService.js`: Reused for the `uploadFile` utility (Cloudflare integration).
- `nc_reports` (Dexie): Local-first persistent storage.
