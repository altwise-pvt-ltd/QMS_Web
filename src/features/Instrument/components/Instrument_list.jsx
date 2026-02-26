import React, { useState } from "react";
import {
  FileText,
  Upload,
  Eye,
  Trash2,
  Calendar,
  Building2,
  FileCheck2,
  X,
  ClipboardCheck,
  History,
  FileSearch,
  UserCircle,
  Pencil,
  Camera,
  Info,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

import instrumentService from "../services/instrumentService";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getFileName = (url) => {
  if (!url || url === "N/A") return "No Attachment Found";
  if (url.startsWith('blob:')) return "New File Selected";
  try {
    const parts = url.split('/');
    const fullName = parts[parts.length - 1];
    // Remove the UUID prefix if it exists (e.g. 6ccafd24-..._filename.pdf)
    return fullName.includes('_') ? fullName.split('_').slice(1).join('_') : fullName;
  } catch {
    return url;
  }
};

const InstrumentDetailModal = ({ item, onClose }) => {
  if (!item) return null;
  const isExpired = new Date(item.expiryDate) < new Date();

  const handleFileUpdate = async (label, file) => {
    if (file) {
      try {
        const payload = new FormData();
        // Map label to expected API field
        const labelToField = {
          "Purchase Order": "PurchaseOrderFile",
          "Bill Receipt": "BillReceiptFile",
          "Installation Report": "InstallationReportFile",
          "IQ/OQ/PQ Protocol": "IqOqPqProtocolFile",
          "Operations Manual": "UserOperationsManualFile",
          "Calibration Cert": "LatestCalibrationCert"
        };

        const fieldName = labelToField[label];
        if (!fieldName) return;

        payload.append(fieldName, file);
        // Map required fields for update validation
        payload.append("InstrumentCalibrationId", item.instrumentCalibrationId);
        payload.append("InstrumentNomenclature", item.name);
        payload.append("OperatingDepartment", item.department);
        payload.append("PreventiveMaintenanceNotes", item.maintenanceText || item.preventiveMaintenanceNotes || "Updated via Profile View");
        payload.append("ExpiryDate", item.expiryDate);
        payload.append("Status", "Active");

        await instrumentService.updateInstrumentCalibration(item.instrumentCalibrationId, payload);
        alert(`${label} updated successfully!`);
        // Note: In a real app, you'd trigger a refresh here. 
        // For now, we update the local state if onAdd or similar prop was passed, 
        // but here we just show success.
        window.location.reload(); // Simple refresh to show new data
      } catch (error) {
        console.error("Error updating file:", error);
        alert("Failed to update file.");
      }
    }
  };

  const handleViewFile = (label, value) => {
    if (value && value !== "N/A") {
      // Check if it's a real URL (blob or http)
      if (value.startsWith('blob:') || value.startsWith('http')) {
        window.open(value, '_blank');
      } else {
        // If it's a mock filename string, simulate opening or show info
        alert(`Simulating View for ${label}: ${value}\n\nIn the live system, this would open the actual PDF file from the secure storage.`);
      }
    }
  };

  const DocItem = ({ label, value, typeLabel = "PDF" }) => (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl bg-white group transition-all gap-4 ${value && value !== "N/A" ? 'border-slate-200 hover:border-emerald-200 shadow-sm hover:shadow-md' : 'border-slate-100 opacity-60'}`}>
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center transition-colors ${value && value !== "N/A" ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'}`}>
          {label.toLowerCase().includes('photo') || label.toLowerCase().includes('photograph') ? <Camera size={18} /> : <FileText size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-700 truncate">{label}</p>
          <p className="text-[10px] text-slate-400 font-medium italic truncate">
            {value && value !== "N/A" ? getFileName(value) : `No ${typeLabel} attached`}
          </p>
        </div>
      </div>
      {value && value !== "N/A" && (
        <button
          onClick={(e) => { e.stopPropagation(); handleViewFile(label, value); }}
          className="shrink-0 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-emerald-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-center"
        >
          View {typeLabel}
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-500 border border-slate-200">
        {/* Header - White Minimalist */}
        <div className="flex items-center justify-between px-8 py-6 border-b bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">{item.name}</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium italic">Detailed equipment profile and documentation archive</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-100/80 hover:bg-slate-200 rounded-full transition-all text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">

          {/* Identification Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Info size={16} className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Identification</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-3 space-y-6">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Instrument Nomenclature</p>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700">
                    {item.name}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Operating Department</p>
                  <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700">
                    {item.department}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center p-1.5 border border-slate-100 rounded-2xl bg-white shadow-sm self-center">
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="w-full h-50 object-cover rounded-xl border border-slate-50" />
                ) : (
                  <div className="w-full h-48 flex flex-col items-center justify-center text-slate-200 bg-slate-50 rounded-xl">
                    <Camera size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">No Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column 1: Audit Proofs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 size={16} className="text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Audit Proofs</h3>
              </div>
              <DocItem label="Purchase Order / Agreement" value={item.purchaseOrder} />
              <DocItem label="Bill Receipt" value={item.billReceipt} />
              <DocItem label="Installation Report" value={item.installationReport} />
            </div>

            {/* Column 2: Standards & Documentation */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardCheck size={16} className="text-indigo-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Standards</h3>
              </div>
              <DocItem label="IQ OQ PQ Protocol" value={item.iqOqPq} />
              <DocItem label="User Operations Manual" value={item.userManual} />
              <DocItem label="Equipment Photograph" value={item.photo} typeLabel="Image" />
            </div>
          </div>

          {/* Calibration & Status Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Calendar size={16} className="text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-700">Calibration & Status</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <DocItem label="Latest Calibration Cert" value={item.calibrationCert} />
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Valid Until (Expiry Date)</p>
                  <div className={`px-4 py-3 border rounded-xl font-bold flex items-center justify-between ${isExpired ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    <span>{formatDate(item.expiryDate)}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest">{isExpired ? 'Expired' : 'Compliant'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Maintenance & Observation Logs</p>
                <div className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 min-h-[120px] italic leading-relaxed">
                  {item.maintenanceText || "No maintenance history recorded for this unit."}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-slate-900 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};

const InstrumentList = ({ instruments, onDelete, onEdit }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (instruments.length === 0)
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-xl text-slate-400">
        Registry Empty
      </div>
    );

  return (
    <div className="w-full space-y-4">
      {/* Dense Table Header */}
      <div className="px-6 sm:px-10 py-2 grid grid-cols-12 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 gap-4">
        <div className="col-span-4">Nomenclature</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-2 text-center">Due Date</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {instruments.map((item) => {
        const isExpired = new Date(item.expiryDate) < new Date();

        return (
          <div key={item.id} className="group bg-white rounded-[32px] border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden px-6 sm:px-10 py-6 grid grid-cols-12 items-center gap-4">
            <div className="col-span-4 flex items-center gap-3 sm:gap-6">
              {item.photo ? (
                <img src={item.photo} alt={item.name} className="w-16 h-16 object-cover rounded-2xl shadow-sm border border-slate-50" />
              ) : (
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <FileCheck2 size={24} />
                </div>
              )}
              <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors uppercase italic">{item.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: INST-{item.id.toString().slice(-4)}</p>
              </div>
            </div>

            <div className="col-span-2">
              <span className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl border border-slate-100">
                {item.department}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-2 text-slate-600 font-bold text-sm">
              <Calendar size={14} className="text-emerald-400" />
              {formatDate(item.expiryDate)}
            </div>

            <div className="col-span-1 flex justify-center">
              <div className={`w-3 h-3 rounded-full shadow-sm animate-pulse ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            </div>

            <div className="col-span-3 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-gray-600 transition-all shadow-sm group/btn"
              >
                <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                View
              </button>
              <button
                onClick={() => onEdit(item)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-gray-600 transition-all shadow-sm group/btn"
              >
                <Pencil size={14} className="group-hover/btn:scale-110 transition-transform" />
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="p-2.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}

      <InstrumentDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default InstrumentList;
