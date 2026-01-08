import React, { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import ncService from "../../services/ncService";
import NCHeader from "./components/NCHeader";
import NCEntry from "./components/NCEntry";
import NCActions from "./components/NCActions";

/**
 * DailyNCForm
 *
 * The main container for the Non-Conformance (NC) reporting form.
 * orchestrates the form state and delegates rendering to modular sub-components.
 */
export default function DailyNCForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    documentNo: "ADC-FORM-24",
    issueNo: "01",
    amendmentNo: "00",
    issueDate: "15/03/2022",
    amendmentDate: "NA",
    documentName: "NON-CONFORMANCE FORM",
    entries: [
      {
        id: 1,
        date: "",
        department: "",
        ncDetails: "",
        rootCause: "",
        correctiveAction: "",
        responsibility: "",
        targetDate: "",
        closureVerification: "",
      },
    ],
  });

  /**
   * Updates top-level document metadata fields.
   */
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Adds a new empty NC entry record.
   */
  const addEntry = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        {
          id: Date.now(), // Use timestamp for unique ID
          date: "",
          department: "",
          ncDetails: "",
          rootCause: "",
          correctiveAction: "",
          responsibility: "",
          targetDate: "",
          closureVerification: "",
        },
      ],
    }));
  };

  /**
   * Removes an NC entry by ID.
   */
  const removeEntry = (id) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.filter((entry) => entry.id !== id),
    }));
  };

  /**
   * Updates a specific field within an NC entry.
   */
  const updateEntry = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  /**
   * Handles form submission and data forwarding.
   * Now integrates with ncService for persistent IndexedDB storage via Dexie.
   */
  const handleSubmit = async () => {
    console.log("Preparing to forward form data for document storage...");

    // Construct the data structure for the documentation module
    const payload = {
      ...formData,
      lastModified: new Date().toISOString(),
      category: "Quality Control",
      type: "NC_RECORD",
      status: "Submitted",
      // Attach user context for traceability
      submittedBy: {
        name: user?.name || "Anonymous",
        id: user?.id || "unknown",
        role: user?.role || "user",
      },
    };

    try {
      // PERSISTENT STORAGE: Save the report to local IndexedDB via ncService
      await ncService.saveNCReport(payload);

      console.log("Forwarded Payload:", payload);

      alert(
        `Non-Conformance report submitted by ${
          user?.name || "Anonymous"
        } and saved to local repository!`
      );
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to save the report. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Modular Header for Document Metadata */}
        <NCHeader formData={formData} onFieldChange={handleFieldChange} />

        {/* Main Content Area */}
        <div className="p-6">
          <div className="space-y-8">
            {formData.entries.map((entry, index) => (
              <NCEntry
                key={entry.id}
                entry={entry}
                index={index}
                isRemoveable={formData.entries.length > 1}
                onUpdate={updateEntry}
                onRemove={removeEntry}
              />
            ))}
          </div>

          {/* Form Action Buttons */}
          <NCActions onAddEntry={addEntry} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
