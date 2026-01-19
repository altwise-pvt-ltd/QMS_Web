import React from "react";
import { Upload, FileText, X, Plus } from "lucide-react";

const QualificationDocuments = ({
  formData,
  handleFileChange,
  handleFileRemove,
  addQualificationField,
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

      <div className="space-y-4">
        {formData.qualifications.map((qual, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={qual.title}
                  onChange={(e) =>
                    handleFileChange(e, "qualifications", index, "title")
                  }
                  placeholder="e.g., Bachelor's Degree, Certification"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Document
                </label>
                {qual.file ? (
                  <div className="flex items-center justify-between border border-gray-300 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-green-600" />
                      <span className="text-sm text-gray-700">
                        {qual.file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFileRemove("qualifications", index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-green-400 transition-colors">
                    <Upload size={18} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Choose file</span>
                    <input
                      type="file"
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
