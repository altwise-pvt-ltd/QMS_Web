import React from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";

const MedicalRecords = ({
  formData,
  existingDocuments,
  handleFileChange,
  handleFileRemove,
  handleInputChange,
  addMedicalRecord,
  removeMedicalRecord,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-red-500 pl-3">
          4. Medical Fitness Records
        </h2>
        <button
          type="button"
          onClick={addMedicalRecord}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Plus size={16} />
          Add Record
        </button>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Medical fitness certificate is required yearly. Add multiple records
          to track history.
        </p>

        {/* Existing Documents List */}
        {existingDocuments?.medicalRecords?.length > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Existing Records
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {existingDocuments.medicalRecords.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
                >
                  <div>
                    <span className="text-sm font-medium text-red-900 block">
                      {doc.title}
                    </span>
                    <span className="text-xs text-red-700">
                      Issued: {doc.issueDate}
                    </span>
                  </div>
                  {doc.certificate?.url && (
                    <a
                      href={doc.certificate.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FileText size={14} /> View
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.medicalRecords.map((record, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                Record #{index + 1}
              </h3>
              {formData.medicalRecords.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicalRecord(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Record Title *
                </label>
                <input
                  type="text"
                  value={record.title}
                  onChange={(e) =>
                    handleInputChange(e, "medicalRecords", index, "title")
                  }
                  placeholder="e.g., Annual Medical Checkup 2026"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              {/* Certificate Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Fitness Certificate *
                </label>
                <div className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-3 hover:border-red-400 transition-colors">
                  {record.certificate ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-red-600" />
                        <span className="text-sm text-gray-700">
                          {record.certificate.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleFileRemove("medicalRecords", index)
                        }
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center">
                      <Upload size={18} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-500">
                        Upload certificate
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            "medicalRecords",
                            index,
                            "certificate",
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Issue Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Issue Date *
                </label>
                <input
                  type="date"
                  value={record.issueDate}
                  onChange={(e) =>
                    handleInputChange(e, "medicalRecords", index, "issueDate")
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Valid for 1 year from issue date
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MedicalRecords;
