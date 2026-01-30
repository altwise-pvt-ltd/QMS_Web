import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Calendar,
  Building2,
  FileCheck2,
  X,
  ClipboardCheck,
  History,
  FileSearch,
  UserCircle
} from "lucide-react";

const InstrumentDetailModal = ({ item, onClose }) => {
  if (!item) return null;
  const isExpired = new Date(item.expiryDate) < new Date();

  const DocItem = ({ label, value }) => (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
          <FileText size={18} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider leading-none mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{value !== "N/A" ? value : "No Document"}</p>
        </div>
      </div>
      {value !== "N/A" && (
        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <Download size={18} />
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-500 border border-white/20">
        <div className="relative h-48 bg-indigo-600 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-indigo-600 rounded-2xl transition-all flex items-center justify-center backdrop-blur-md border border-white/20 z-10"
          >
            <X size={24} />
          </button>

          <div className="absolute bottom-[-40px] left-12 flex items-end gap-8">
            {item.photo ? (
              <img src={item.photo} alt={item.name} className="w-40 h-40 object-cover rounded-[32px] border-4 border-white shadow-2xl shadow-indigo-500/20 bg-white" />
            ) : (
              <div className="w-40 h-40 bg-white rounded-[32px] border-4 border-white shadow-2xl flex items-center justify-center text-slate-200">
                <FileCheck2 size={64} />
              </div>
            )}
            <div className="pb-12 space-y-1">
              <h3 className="text-3xl font-black text-white tracking-tight uppercase italic">{item.name}</h3>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/10">
                  {item.department}
                </span>
                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest ${isExpired ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {isExpired ? 'Expired' : 'Compliant'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-12 pt-20 pb-12 custom-scrollbar grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Biodata & Stats */}
          <div className="lg:col-span-4 space-y-10">
            <div className="space-y-6">
              <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <UserCircle size={16} /> Technical Biodata
              </h5>
              <div className="space-y-4">
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Registered Date</p>
                  <p className="font-bold text-slate-700">Jan 17, 2026</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Certification Expiry</p>
                  <p className={`font-bold ${isExpired ? 'text-rose-600' : 'text-slate-700'}`}>{item.expiryDate || "N/A"}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Current Status</p>
                  <p className={`font-bold ${isExpired ? 'text-rose-600' : 'text-emerald-600'}`}>{isExpired ? 'Needs Calibration' : 'Operational'}</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-indigo-50/50 rounded-[32px] border border-indigo-100 space-y-4">
              <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">Export Dashboard</h5>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl shadow-indigo-100 hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
                <Download size={16} /> Download Full Bio
              </button>
            </div>
          </div>

          {/* Right Column: Documents & Logs */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <FileSearch size={16} /> Document Archive
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocItem label="Purchase Order" value={item.purchaseOrder} />
                <DocItem label="Bill Receipt" value={item.billReceipt} />
                <DocItem label="Installation Report" value={item.installationReport} />
                <DocItem label="IQ/OQ/PQ Protocol" value={item.iqOqPq} />
                <DocItem label="Operations Manual" value={item.userManual} />
                <DocItem label="Calibration Cert" value={item.calibrationCert} />
              </div>
            </div>

            <div className="space-y-6">
              <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <History size={16} /> Maintenance Log
              </h5>
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-slate-600 font-medium italic leading-relaxed">
                  {item.maintenanceText || "No maintenance history recorded for this unit."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InstrumentList = ({ instruments }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  if (instruments.length === 0)
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-xl text-slate-400">
        Registry Empty
      </div>
    );

  return (
    <div className="w-full">
      {/* Dense Table Header */}
      <div className="px-10 py-2 grid grid-cols-12 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100 gap-4">
        <div className="col-span-5">Nomenclature</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-2 text-center">Due Date</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {instruments.map((item) => {
        const isExpired = new Date(item.expiryDate) < new Date();

        return (
          <div key={item.id} className="group bg-white rounded-[32px] border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden px-10 py-6 grid grid-cols-12 items-center gap-4">
            <div className="col-span-5 flex items-center gap-6">
              {item.photo ? (
                <img src={item.photo} alt={item.name} className="w-16 h-16 object-cover rounded-2xl shadow-sm border border-slate-50" />
              ) : (
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <FileCheck2 size={24} />
                </div>
              )}
              <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase italic">{item.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: INST-{item.id.toString().slice(-4)}</p>
              </div>
            </div>

            <div className="col-span-2">
              <span className="px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-xl border border-slate-100">
                {item.department}
              </span>
            </div>

            <div className="col-span-2 flex items-center gap-2 text-slate-600 font-bold text-sm">
              <Calendar size={14} className="text-indigo-400" />
              {item.expiryDate || "Not Set"}
            </div>

            <div className="col-span-1">
              <div className={`w-3 h-3 rounded-full shadow-sm animate-pulse ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            </div>

            <div className="col-span-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedItem(item)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-sm group/btn"
              >
                <Eye size={14} className="group-hover/btn:scale-110 transition-transform" />
                View Profile
              </button>
              <button className="p-2.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-xl transition-all border border-transparent hover:border-rose-100">
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
