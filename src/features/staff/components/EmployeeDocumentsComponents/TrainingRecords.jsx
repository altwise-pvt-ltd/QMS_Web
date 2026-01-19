import React from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";

const TrainingRecords = ({
  formData,
  handleFileChange,
  handleFileRemove,
  addTrainingRecord,
  removeTrainingRecord,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-indigo-500 pl-3">
          6. Training Records
        </h2>
        <button
          type="button"
          onClick={addTrainingRecord}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <Plus size={16} />
          Add Record
        </button>
      </div>

      <div className="space-y-4">
        {formData.trainingRecords.map((record, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={record.title}
                  onChange={(e) =>
                    handleInputChange(e, "trainingRecords", index, "title")
                  }
                  placeholder="e.g., Onboarding & Skills Training 2026"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-medium"
                />
              </div>
              {formData.trainingRecords.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTrainingRecord(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Induction Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Induction Training Record
                </label>
                <div className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-3 hover:border-indigo-400 transition-colors">
                  {record.inductionTraining ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600" />
                        <span className="text-sm text-gray-700">
                          {record.inductionTraining.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleFileRemove(
                            "trainingRecords",
                            index,
                            "inductionTraining",
                          )
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
                        Upload document
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            "trainingRecords",
                            index,
                            "inductionTraining",
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Initial onboarding and orientation training
                </p>
              </div>

              {/* Competency Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competency Training Record
                </label>
                <div className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-3 hover:border-indigo-400 transition-colors">
                  {record.competencyTraining ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-indigo-600" />
                        <span className="text-sm text-gray-700">
                          {record.competencyTraining.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleFileRemove(
                            "trainingRecords",
                            index,
                            "competencyTraining",
                          )
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
                        Upload document
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) =>
                          handleFileChange(
                            e,
                            "trainingRecords",
                            index,
                            "competencyTraining",
                          )
                        }
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Job-specific skills and competency training
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrainingRecords;
