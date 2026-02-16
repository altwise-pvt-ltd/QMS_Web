import React from "react";
import { Upload, FileText, X, Eye } from "lucide-react";
import ImageWithFallback from "../../../../components/ui/ImageWithFallback";

const PersonalDocuments = ({
  formData,
  existingDocuments,
  handleFileChange,
  handleFileRemove,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-l-4 border-blue-500 pl-3">
        1. Personal Documents
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Passport Photo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Photo *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            {formData.passportPhoto ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {formData.passportPhoto.preview ? (
                    <ImageWithFallback
                      src={formData.passportPhoto.preview}
                      alt="Passport"
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                  ) : (
                    <FileText size={20} className="text-blue-600" />
                  )}
                  <div>
                    <span className="text-sm text-gray-700 block font-medium">
                      {formData.passportPhoto.name}
                    </span>
                    <span className="text-xs text-green-500">
                      File selected
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFileRemove("passportPhoto")}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove Photo"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload photo
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG (Max 2MB)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={(e) => handleFileChange(e, "passportPhoto")}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* CV / Resume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CV / Resume *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            {formData.cv ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  <span className="text-sm text-gray-700">
                    {formData.cv.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFileRemove("cv")}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Click to upload CV
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PDF, DOC, DOCX (Max 5MB)
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "cv")}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalDocuments;
