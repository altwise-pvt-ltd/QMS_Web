import React from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";

const VaccinationRecords = ({
  formData,
  handleFileChange,
  handleFileRemove,
  handleInputChange,
  addVaccinationRecord,
  removeVaccinationRecord,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-orange-500 pl-3">
          5. Vaccination Records
        </h2>
        <button
          type="button"
          onClick={addVaccinationRecord}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <Plus size={16} />
          Add Record
        </button>
      </div>

      <div className="space-y-4">
        {formData.vaccinationRecords.map((record, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
          >
            {formData.vaccinationRecords.length > 1 && (
              <button
                type="button"
                onClick={() => removeVaccinationRecord(index)}
                className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                title="Remove Record"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Certificate Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name of Certificate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={record.name}
                  onChange={(e) =>
                    handleInputChange(e, "vaccinationRecords", index, "name")
                  }
                  placeholder="Enter certificate name"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                />
              </div>

              {/* Dose Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dose Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={record.date}
                  onChange={(e) =>
                    handleInputChange(e, "vaccinationRecords", index, "date")
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                />
              </div>

              {/* Upload Document */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-1.5 hover:border-orange-400 transition-colors">
                  {record.file ? (
                    <div className="flex items-center justify-between p-1">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText size={16} className="text-orange-600 shrink-0" />
                        <span className="text-xs text-gray-700 truncate">
                          {record.file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleFileRemove("vaccinationRecords", index, "file")
                        }
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center py-1">
                      <Upload size={16} className="text-gray-400 mr-2" />
                      <span className="text-xs text-gray-500">
                        Select file
                      </span>
                      <input
                        type="file"
                        required
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(e, "vaccinationRecords", index, "file")
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VaccinationRecords;
