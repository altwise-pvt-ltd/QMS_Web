import React from "react";
import { Plus, Trash2, Upload, CheckCircle2, FileText, Calendar } from "lucide-react";

const TrainingCertifications = ({
  certifications,
  handleDynamicChange,
  addRow,
  removeRow,
}) => {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              3. Training & Certifications
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-0.5">Professional Development</p>
          </div>
        </div>
        
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
          className="group flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-sm border border-emerald-100"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Add Entry
        </button>
      </div>

      <div className="space-y-6">
        {certifications.map((cert, index) => (
          <div
            key={cert.staffTrainingAndCertificationId || cert.id || index}
            className="group/item relative bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-4 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <FileText size={12} /> Training / Certificate Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Quality Management"
                  value={cert.trainingOrCertificateTitle || ""}
                  onChange={(e) =>
                    handleDynamicChange(index, "trainingOrCertificateTitle", e.target.value, "certifications")
                  }
                  className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all outline-hidden"
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                <select
                  value={cert.trainingOrCertificateType || "Internal Training"}
                  onChange={(e) =>
                    handleDynamicChange(index, "trainingOrCertificateType", e.target.value, "certifications")
                  }
                  className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-emerald-500 transition-all outline-hidden appearance-none cursor-pointer"
                >
                  <option value="Internal Training">Internal Training</option>
                  <option value="External Course">External Course</option>
                  <option value="Certification">Certification</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  <Calendar size={12} /> Completed
                </label>
                <input
                  type="date"
                  value={cert.completionDate || ""}
                  onChange={(e) =>
                    handleDynamicChange(index, "completionDate", e.target.value, "certifications")
                  }
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-emerald-500 transition-all outline-hidden"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry</label>
                <input
                  type="date"
                  value={cert.expiryDate || ""}
                  onChange={(e) =>
                    handleDynamicChange(index, "expiryDate", e.target.value, "certifications")
                  }
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:border-emerald-500 transition-all outline-hidden"
                />
              </div>

              <div className="md:col-span-1 flex flex-col items-center gap-2">
                <input
                  type="file"
                  id={`file-upload-${index}`}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleDynamicChange(index, "certificateFile", file, "certifications");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById(`file-upload-${index}`).click()}
                  className={`p-3 rounded-2xl transition-all shadow-sm ${
                    cert.certificateFile || cert.existingFilePath
                      ? "bg-emerald-500 text-white shadow-emerald-100"
                      : "bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                  }`}
                  title="Upload certificate"
                >
                  <Upload size={20} />
                </button>
              </div>
            </div>

            {/* File Info / Remove */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="flex items-center gap-2">
                {(cert.certificateFile || cert.existingFilePath) ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={12} /> {cert.certificateFile ? "New file ready" : "File stored on server"}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 italic">No document attached yet</span>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => removeRow(index, "certifications")}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={12} /> Remove Entry
              </button>
            </div>
          </div>
        ))}
      </div>

      {certifications.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem]">
          <FileText className="text-slate-200 mb-3" size={48} />
          <p className="text-slate-400 font-bold">No certifications recorded</p>
        </div>
      )}
    </section>
  );
};

export default TrainingCertifications;
