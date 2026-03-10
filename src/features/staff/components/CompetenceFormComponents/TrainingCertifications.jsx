import React from "react";
import { Plus, Trash2, Upload, CheckCircle } from "lucide-react";

const TrainingCertifications = ({
  certifications,
  handleDynamicChange,
  addRow,
  removeRow,
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-green-500 pl-3">
          3. Training & Certifications
        </h2>
        <button
          type="button"
          onClick={() =>
            addRow("certifications", {
              staffTrainingAndCertificationId: 0,
              trainingOrCertificateTitle: "",
              trainingOrCertificateType: "Internal Training",
              completionDate: "",
              expiryDate: "",
              certificateFile: null,
              existingFilePath: "",
            })
          }
          className="text-sm bg-green-600 text-black px-4 py-2 rounded-lg hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div
            key={cert.staffTrainingAndCertificationId || cert.id || index}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-3 rounded"
          >
            <div className="md:col-span-4">
              <label className="text-xs text-gray-500">
                Training/Cert Title
              </label>
              <input
                type="text"
                value={cert.title || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "title",
                    e.target.value,
                    "certifications",
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Type</label>
              <select
                value={cert.type || "Internal Training"}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "type",
                    e.target.value,
                    "certifications",
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm bg-white"
              >
                <option value="Internal Training">Internal Training</option>
                <option value="External Course">External Course</option>
                <option value="Certification">Certification</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Completion Date</label>
              <input
                type="date"
                value={cert.completionDate || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "completionDate",
                    e.target.value,
                    "certifications",
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500">Expiry (If any)</label>
              <input
                type="date"
                value={cert.expiryDate || ""}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "expiryDate",
                    e.target.value,
                    "certifications",
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm"
              />
              {/* File status indicator */}
              <div className="mt-1 flex items-center gap-1">
                {cert.certificateFile || cert.existingFilePath ? (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle size={10} />{" "}
                    {cert.certificateFile ? "File selected" : "File exists"}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400">
                    No file uploaded
                  </span>
                )}
              </div>
            </div>
            <div className="md:col-span-1 flex gap-1 justify-end pb-1">
              <input
                type="file"
                id={`file-upload-${index}`}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleDynamicChange(
                      index,
                      "certificateFile",
                      file,
                      "certifications",
                    );
                  }
                }}
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById(`file-upload-${index}`).click()
                }
                className={`p-1.5 rounded transition-colors ${
                  cert.certificateFile || cert.existingFilePath
                    ? "text-emerald-500 hover:bg-emerald-50"
                    : "text-blue-500 hover:bg-blue-50"
                }`}
                title="Upload certificate"
              >
                <Upload size={16} />
              </button>
              <button
                type="button"
                onClick={() => removeRow(index, "certifications")}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                title="Remove entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrainingCertifications;
