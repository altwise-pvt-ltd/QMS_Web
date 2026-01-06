# Alert System Integration Guide

## Quick Start

### 1. Add AlertProvider to your App

Add the `AlertProvider` to your main layout or App.jsx:

```jsx
// In App.jsx or MainLayout.jsx
import { AlertProvider } from "./services/alert/AlertProvider";

function App() {
  return (
    <>
      <AlertProvider /> {/* Add this at the top level */}
      {/* Your other components */}
      <YourRoutes />
    </>
  );
}
```

### 2. Use AlertManager anywhere in your app

```jsx
import { AlertManager } from "@/services/alert/alertService";

// Success notification
AlertManager.success("Document uploaded successfully!");

// Error notification
AlertManager.error("Failed to upload document. Please try again.");

// Warning notification
AlertManager.warning("This document will expire in 30 days.");

// Info notification
AlertManager.info("New features have been added.");

// With custom title and duration
AlertManager.success(
  "Document uploaded successfully!",
  "Upload Complete", // title
  5000 // duration in ms
);
```

## Complete Examples

### Example 1: Document Upload

```jsx
import { AlertManager } from "@/services/alert/alertService";

const handleUpload = async (formData) => {
  try {
    await createDocument({
      file: formData.file,
      metadata: { ... }
    });

    // Show success alert
    AlertManager.success("Document uploaded successfully!");

    // Navigate or reset form
    navigate("/documents");

  } catch (error) {
    // Show error alert
    AlertManager.error(
      error.message || "Failed to upload document. Please try again.",
      "Upload Failed"
    );
  }
};
```

### Example 2: Document Delete

```jsx
const handleDelete = async (docId) => {
  try {
    await deleteDocument(docId);
    AlertManager.success("Document deleted successfully!");
    refreshDocuments();
  } catch (error) {
    AlertManager.error("Failed to delete document.");
  }
};
```

### Example 3: Form Validation

```jsx
const handleSubmit = (formData) => {
  if (!formData.department) {
    AlertManager.warning(
      "Please fill in the department field.",
      "Missing Information"
    );
    return;
  }

  if (!formData.author) {
    AlertManager.warning(
      "Please fill in the author field.",
      "Missing Information"
    );
    return;
  }

  // Continue with submission
  submitForm(formData);
};
```

### Example 4: Document Expiration Check

```jsx
import { AlertService } from "@/services/alert/alertService";

// Check and show expiration alerts
const checkExpirations = async () => {
  await AlertService.showExpirationAlerts();
};

// Call on dashboard load
useEffect(() => {
  checkExpirations();
}, []);
```

## API Reference

### AlertManager Methods

| Method                                | Parameters                                                                      | Description                  |
| ------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------- |
| `success(message, title?, duration?)` | message: string<br>title: string (optional)<br>duration: number (default: 3000) | Show success alert           |
| `error(message, title?, duration?)`   | message: string<br>title: string (optional)<br>duration: number (default: 5000) | Show error alert             |
| `warning(message, title?, duration?)` | message: string<br>title: string (optional)<br>duration: number (default: 4000) | Show warning alert           |
| `info(message, title?, duration?)`    | message: string<br>title: string (optional)<br>duration: number (default: 3000) | Show info alert              |
| `close()`                             | none                                                                            | Manually close current alert |

### Alert Types

- **success** - Green, CheckCircle icon
- **error** - Red, XCircle icon
- **warning** - Amber, AlertTriangle icon
- **info** - Blue, Info icon

### Duration

- Set to `0` for alerts that don't auto-dismiss (user must close manually)
- Default durations:
  - Success: 3000ms (3 seconds)
  - Error: 5000ms (5 seconds)
  - Warning: 4000ms (4 seconds)
  - Info: 3000ms (3 seconds)

## Integration Checklist

- [x] Add `<AlertProvider />` to App.jsx or MainLayout.jsx
- [x] Import `AlertManager` in components that need alerts
- [x] Replace console.log or alert() calls with AlertManager methods
- [x] Test all alert types
- [x] Verify auto-dismiss works correctly
- [x] Check alert positioning on different screen sizes
