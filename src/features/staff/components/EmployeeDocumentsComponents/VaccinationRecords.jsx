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
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={record.title}
                  onChange={(e) =>
                    handleInputChange(e, "vaccinationRecords", index, "title")
                  }
                  placeholder="e.g., COVID-19 & Hepatitis B Vaccination Record"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm font-medium"
                />
              </div>
              {formData.vaccinationRecords.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVaccinationRecord(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            {/* COVID Vaccination */}
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">
                COVID-19 Vaccination
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccination Certificate
                  </label>
                  <div className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-2 hover:border-orange-400 transition-colors">
                    {record.covidCertificate ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-orange-600" />
                          <span className="text-xs text-gray-700">
                            {record.covidCertificate.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleFileRemove(
                              "vaccinationRecords",
                              index,
                              "covidCertificate",
                            )
                          }
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center">
                        <Upload size={16} className="text-gray-400 mr-2" />
                        <span className="text-xs text-gray-500">
                          Upload certificate
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              "vaccinationRecords",
                              index,
                              "covidCertificate",
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Dose Date
                  </label>
                  <input
                    type="date"
                    value={record.covidDate}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        "vaccinationRecords",
                        index,
                        "covidDate",
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* HBsAg Vaccination */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3 text-sm">
                HBsAg (Hepatitis B) Vaccination
              </h4>

              <div className="space-y-3">
                {/* Certificate Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccination Certificate
                  </label>
                  <div className="border-2 border-dashed border-gray-300 bg-white rounded-lg p-2 hover:border-blue-400 transition-colors">
                    {record.hbsagCertificate ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          <span className="text-xs text-gray-700">
                            {record.hbsagCertificate.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleFileRemove(
                              "vaccinationRecords",
                              index,
                              "hbsagCertificate",
                            )
                          }
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex items-center justify-center">
                        <Upload size={16} className="text-gray-400 mr-2" />
                        <span className="text-xs text-gray-500">
                          Upload certificate
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange(
                              e,
                              "vaccinationRecords",
                              index,
                              "hbsagCertificate",
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Dose Dates */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dose 1 Date
                    </label>
                    <input
                      type="date"
                      value={record.hbsagDose1Date}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          "vaccinationRecords",
                          index,
                          "hbsagDose1Date",
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dose 2 Date
                    </label>
                    <input
                      type="date"
                      value={record.hbsagDose2Date}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          "vaccinationRecords",
                          index,
                          "hbsagDose2Date",
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Dose 3 Date
                    </label>
                    <input
                      type="date"
                      value={record.hbsagDose3Date}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          "vaccinationRecords",
                          index,
                          "hbsagDose3Date",
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Booster Date
                    </label>
                    <input
                      type="date"
                      value={record.hbsagBoosterDate}
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          "vaccinationRecords",
                          index,
                          "hbsagBoosterDate",
                        )
                      }
                      className="w-full border border-gray-300 rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-xs"
                    />
                  </div>
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
