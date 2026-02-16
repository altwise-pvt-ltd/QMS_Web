import React from "react";
import { Upload, FileText, X, Plus, Trash2 } from "lucide-react";

const QualificationDocuments = ({
  formData,
  existingDocuments,
  handleFileChange,
  handleFileRemove,
  handleInputChange,
  addQualificationField,
  removeQualificationField,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-green-500 pl-3">
          2. Qualification Documents
        </h2>
        <button
          type="button"
          onClick={addQualificationField}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Plus size={16} />
          Add Document
        </button>
      </div>

      {/* Existing Documents List */}
      {existingDocuments?.qualifications?.length > 0 && (
        <div className="mb-6 space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Existing Qualifications
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {existingDocuments.qualifications.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {doc.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.collegeName} • {doc.graduationYear}
                  </p>
                </div>
                {doc.file?.url && (
                  <a
                    href={doc.file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <FileText size={14} />
                    View
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {formData.qualifications.map((qual, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
          >
            {formData.qualifications.length > 1 && (
              <button
                type="button"
                onClick={() => removeQualificationField(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <Trash2 size={16} />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={qual.title}
                  onChange={(e) =>
                    handleInputChange(e, "qualifications", index, "title")
                  }
                  placeholder="e.g., Bachelor's Degree"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College/University Name{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={qual.collegeName}
                  onChange={(e) =>
                    handleInputChange(e, "qualifications", index, "collegeName")
                  }
                  placeholder="Enter college name"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  value={qual.graduationYear}
                  onChange={(e) =>
                    handleInputChange(
                      e,
                      "qualifications",
                      index,
                      "graduationYear",
                    )
                  }
                  placeholder="YYYY"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document <span className="text-red-500">*</span>
                </label>
                {qual.file ? (
                  <div className="flex items-center justify-between border border-gray-300 bg-white rounded-lg p-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={18} className="text-green-600 shrink-0" />
                      <span className="text-xs text-gray-700 truncate">
                        {qual.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleFileRemove("qualifications", index, "file")
                      }
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 bg-white rounded-lg p-2 hover:border-green-400 transition-colors">
                    <Upload size={18} className="text-gray-400 mr-2" />
                    <span className="text-xs text-gray-500">Choose file</span>
                    <input
                      type="file"
                      required
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(e, "qualifications", index, "file")
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

export default QualificationDocuments;
