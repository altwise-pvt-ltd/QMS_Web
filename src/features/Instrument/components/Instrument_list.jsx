import React, { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Calendar,
  FileCheck2,
  X,
  History,
  FileSearch,
  UserCircle,
} from "lucide-react";

const InstrumentDetailModal = ({ item, onClose }) => {
  if (!item) return null;
  const isExpired = new Date(item.expiryDate) < new Date();

  const DocItem = ({ label, value }) => (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <FileText size={16} className="text-slate-400 shrink-0" />
        <div className="truncate">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            {label}
          </p>
          <p className="text-xs font-semibold text-slate-700 truncate">
            {value !== "N/A" ? value : "Missing"}
          </p>
        </div>
      </div>
      {value !== "N/A" && (
        <button className="p-1.5 text-slate-400 hover:text-indigo-600">
          <Download size={14} />
        </button>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Compact Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-2o h-20 bg-white border rounded-lg flex items-center justify-center overflow-hidden">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt=""
                  className="object-cover w-full h-full"
                />
              ) : (
                <FileCheck2 className="text-slate-300" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {item.name}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {item.department} • ID: {item.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Column */}
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold text-indigo-600 uppercase flex items-center gap-2">
              <UserCircle size={14} /> Status Info
            </h5>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Expiry
                </p>
                <p
                  className={`text-sm font-bold ${isExpired ? "text-red-600" : "text-slate-700"}`}
                >
                  {item.expiryDate || "N/A"}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg border flex items-center justify-between ${isExpired ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-tight">
                  Condition
                </span>
                <span className="text-[10px] font-black uppercase tracking-tighter">
                  {isExpired ? "Out of Service" : "Operational"}
                </span>
              </div>
            </div>
            <button className="w-full py-2.5 bg-slate-800 text-gray-500 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
              <Download size={14} /> Full Export
            </button>
          </div>

          {/* Docs & Logs Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Restored Document Vault with all 6 items */}
            <section>
              <h5 className="text-[10px] font-bold text-indigo-600 uppercase mb-3 flex items-center gap-2">
                <FileSearch size={14} /> Document Vault
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <DocItem label="Purchase Order" value={item.purchaseOrder} />
                <DocItem label="Bill Receipt" value={item.billReceipt} />
                <DocItem label="Installation" value={item.installationReport} />
                <DocItem label="IQ/OQ/PQ" value={item.iqOqPq} />
                <DocItem label="User Manual" value={item.userManual} />
                <DocItem label="Calib. Cert" value={item.calibrationCert} />
              </div>
            </section>

            <section>
              <h5 className="text-[10px] font-bold text-indigo-600 uppercase mb-3 flex items-center gap-2">
                <History size={14} /> Maintenance
              </h5>
              <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500 italic leading-relaxed">
                  {item.maintenanceText || "No active logs found."}
                </p>
              </div>
            </section>
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
      <div className="px-4 py-2 grid grid-cols-12 text-[10px] font-bold uppercase text-slate-400 border-b border-slate-100">
        <div className="col-span-6">Nomenclature</div>
        <div className="col-span-2">Department</div>
        <div className="col-span-2 text-center">Due Date</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      <div className="divide-y divide-slate-50">
        {instruments.map((item) => {
          const isExpired = new Date(item.expiryDate) < new Date();
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="col-span-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                  {item.photo ? (
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FileCheck2 size={16} className="text-slate-300" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${isExpired ? "bg-red-500" : "bg-emerald-500"}`}
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 leading-none mb-1 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-mono">
                      ID-{item.id.toString().slice(-4)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase tracking-tighter">
                  {item.department}
                </span>
              </div>
              <div className="col-span-2 text-center text-xs font-medium text-slate-600">
                {item.expiryDate || "-"}
              </div>
              <div className="col-span-2 flex justify-end gap-1">
                <button
                  onClick={() => setSelectedItem(item)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Eye size={16} />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <InstrumentDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default InstrumentList;
