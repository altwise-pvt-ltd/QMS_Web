import React from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";

const AppointmentDocuments = ({
  formData,
  handleFileChange,
  handleFileRemove,
  addAppointmentDocument,
  removeAppointmentDocument,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className=" font-semibold text-gray-700 border-l-4 border-purple-500 pl-3">
          3. Appointment Documents
        </h2>
        <button
          type="button"
          onClick={addAppointmentDocument}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <Plus size={16} />
          Add Document
        </button>
      </div>

      <div className="space-y-4">
        {formData.appointmentDocuments.map((doc, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">
                Document #{index + 1}
              </h3>
              {formData.appointmentDocuments.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAppointmentDocument(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Document Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) =>
                    handleFileChange(e, "appointmentDocuments", index, "title")
                  }
                  placeholder="e.g., Appointment Letter, Roles & Responsibilities"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document *
                </label>
                {doc.file ? (
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-purple-600" />
                      <span className="text-sm text-gray-700">
                        {doc.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleFileRemove("appointmentDocuments", index)
                      }
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-purple-400 transition-colors">
                    <Upload size={18} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Choose file</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          "appointmentDocuments",
                          index,
                          "file",
                        )
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AppointmentDocuments;
