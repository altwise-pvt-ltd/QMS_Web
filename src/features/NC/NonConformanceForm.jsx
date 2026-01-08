import React, { useState } from "react";
import { Plus, Trash2, Save, FileText } from "lucide-react";

export default function DailyNCForm() {
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

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [
        ...formData.entries,
        {
          id: formData.entries.length + 1,
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
  };

  const removeEntry = (id) => {
    setFormData({
      ...formData,
      entries: formData.entries.filter((entry) => entry.id !== id),
    });
  };

  const updateEntry = (id, field, value) => {
    setFormData({
      ...formData,
      entries: formData.entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Non-Conformance form saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">
              NON-CONFORMANCE FORM
            </h1>
          </div>

          {/* Document Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="text-gray-500">Document No:</label>
              <p className="font-medium">{formData.documentNo}</p>
            </div>
            <div>
              <label className="text-gray-500">Issue No:</label>
              <p className="font-medium">{formData.issueNo}</p>
            </div>
            <div>
              <label className="text-gray-500">Amendment No:</label>
              <p className="font-medium">{formData.amendmentNo}</p>
            </div>
            <div>
              <label className="text-gray-500">Issue Date:</label>
              <p className="font-medium">{formData.issueDate}</p>
            </div>
            <div>
              <label className="text-gray-500">Amendment Date:</label>
              <p className="font-medium">{formData.amendmentDate}</p>
            </div>
            <div>
              <label className="text-gray-500">Status:</label>
              <p className="font-medium text-green-600">Controlled</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-8">
            {formData.entries.map((entry, index) => (
              <div
                key={entry.id}
                className="border border-gray-200 rounded-lg p-6 relative"
              >
                {/* Entry Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    NC Entry #{index + 1}
                  </h3>
                  {formData.entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Entry Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) =>
                        updateEntry(entry.id, "date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={entry.department}
                      onChange={(e) =>
                        updateEntry(entry.id, "department", e.target.value)
                      }
                      placeholder="e.g., Pathology"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Details of Daily N.C.
                    </label>
                    <textarea
                      value={entry.ncDetails}
                      onChange={(e) =>
                        updateEntry(entry.id, "ncDetails", e.target.value)
                      }
                      rows="3"
                      placeholder="Describe the non-conformance..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Root Cause
                    </label>
                    <textarea
                      value={entry.rootCause}
                      onChange={(e) =>
                        updateEntry(entry.id, "rootCause", e.target.value)
                      }
                      rows="2"
                      placeholder="Identify the root cause..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Corrective / Preventive Action Taken
                    </label>
                    <textarea
                      value={entry.correctiveAction}
                      onChange={(e) =>
                        updateEntry(
                          entry.id,
                          "correctiveAction",
                          e.target.value
                        )
                      }
                      rows="2"
                      placeholder="Describe actions taken..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsibility
                    </label>
                    <input
                      type="text"
                      value={entry.responsibility}
                      onChange={(e) =>
                        updateEntry(entry.id, "responsibility", e.target.value)
                      }
                      placeholder="Person responsible"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={entry.targetDate}
                      onChange={(e) =>
                        updateEntry(entry.id, "targetDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closure Verification
                    </label>
                    <textarea
                      value={entry.closureVerification}
                      onChange={(e) =>
                        updateEntry(
                          entry.id,
                          "closureVerification",
                          e.target.value
                        )
                      }
                      rows="2"
                      placeholder="Verification details..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={addEntry}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add NC Entry
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ml-auto"
            >
              <Save className="w-4 h-4" />
              Save Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
