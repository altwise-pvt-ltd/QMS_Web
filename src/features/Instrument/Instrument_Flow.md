# Instrument Feature Flow & Worker Integration

This document explains the flow of the **Instrument** feature and how to integrate the **QMS Worker** for secure, scalable file uploads to Cloudflare R2.

## 📁 Directory Structure & Roles

| File | Role | Reason in Flow |
| :--- | :--- | :--- |
| `Instrument.jsx` | **Feature Orchestrator** | Acts as the parent container. Fetches instruments, normalizes data (including R2 URL formatting), and manages the toggle state for the registration form. |
| `Instrument_list.jsx` | **Data Presentation** | Displays instruments in a premium grid/table. Includes a **Detail Modal** for viewing full documentation and provides quick actions (Edit/Delete/View). |
| `Instrumentform.jsx` | **Data Entry & Validation** | Captures instrument details and documents. This is the **entry point** for file uploads. It validates all required fields before starting the submission process. |
| `instrumentService.js` | **Data Layer** | Bridges the frontend and backend. In the new flow, it orchestrates the two-step process: uploading to the Worker first, then sending Metadata + R2 URLs to the main API. |

---

## 🔄 File Upload Flow (Worker Integration)

To align with the QMS-wide standard, the Instrument feature uses a **two-step submission flow**:

### 1. The Legacy Flow (Binaries to Backend)
*   User selects files in `Instrumentform.jsx`.
*   Form sends `FormData` (containing binary files) directly to `/InstrumentCalibration/CreateInstrumentCalibration`.
*   **Drawback**: Heavy load on the main API; slow for large files; harder to manage distributed storage.

### 2. The New Flow (Worker → R2 → Backend)
This flow ensures the main API only handles JSON/Metadata, while files are managed by a dedicated worker.

#### Step A: Upload to R2 via Worker
When the user clicks "Submit", `Instrumentform.jsx` calls `instrumentService.submitInstrument()`.
The service loops through all files (Photograph, PO, Bill, etc.) and calls the `uploadFile` utility from `workerService.js`.

```javascript
// Example: Uploading the Photograph
const photoResult = await uploadFile(file, {
  module: "instrument",
  subType: "photo",
  instrumentName: formData.name
});
const photoUrl = photoResult.fileUrl; // Secure R2 URL
```

#### Step B: Submit URLs to Main API
Once all files are uploaded and R2 URLs are received, the service sends a single request to the backend with URL strings instead of binaries.

```javascript
const payload = {
  ...formData,
  equipmentPhotographFilePath: photoUrl, // URL string, not File object
  purchaseOrderFilePath: poUrl,
  // ... other URLs
};

await api.post("/InstrumentCalibration/CreateWithUrls", payload);
```

---

## 💡 Benefits
*   **Performance**: Files are streamed directly to R2.
*   **Security**: Verification happens at the Worker level.
*   **Consistency**: Follows the same pattern as `Staff` and `NC` modules.

## 🛠️ Implementation Checklist
1. [ ] Update `instrumentService.js` to import `uploadFile` from `workerService.js`.
2. [ ] Refactor `Instrumentform.jsx` to pass `File` objects to the service rather than building `FormData` locally.
3. [ ] Update `Instrument.jsx` normalization logic to handle both legacy Plesk paths and new R2 URLs seamlessly.
