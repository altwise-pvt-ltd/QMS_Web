import React from "react";
import { Plus, Trash2, Upload } from "lucide-react";

const TrainingCertifications = ({
  certifications,
  handleDynamicChange,
  addRow,
  removeRow,
}) => {
  const fileUpload = () => {
    const [SelectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState(null);

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
      setMessage("file Selected");
    };
  };
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
              title: "",
              type: "Internal",
              completionDate: "",
              expiryDate: "",
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
            key={cert.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-gray-50 p-3 rounded"
          >
            <div className="md:col-span-4">
              <label className="text-xs text-gray-500">
                Training/Cert Title
              </label>
              <input
                type="text"
                value={cert.title}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "title",
                    e.target.value,
                    "certifications"
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Type</label>
              <select
                value={cert.type}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "type",
                    e.target.value,
                    "certifications"
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm bg-white"
              >
                <option>Internal Training</option>
                <option>External Course</option>
                <option>Certification</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500">Completion Date</label>
              <input
                type="date"
                value={cert.completionDate}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "completionDate",
                    e.target.value,
                    "certifications"
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm"
              />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500">Expiry (If any)</label>
              <input
                type="date"
                value={cert.expiryDate}
                onChange={(e) =>
                  handleDynamicChange(
                    index,
                    "expiryDate",
                    e.target.value,
                    "certifications"
                  )
                }
                className="w-full border-gray-300 rounded border p-1.5 text-sm"
              />
            </div>
            <div className="md:col-span-1 text-right pb-1">
              <button
                type="button"
                onClick={() => removeRow(index, "certifications")}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                title="Remove entry"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => fileUpload()}
                className="text-green-500 hover:text-green-700 hover:bg-green-50 p-1.5 rounded transition-colors"
              >
                <Upload size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrainingCertifications;
