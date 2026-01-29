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
    UserCircle,
    Plus,
    Pencil,
    ArrowRight,
    Settings,
    Printer,
    Camera
} from "lucide-react";

/**
 * Detail Modal for Instrument Biodata
 */
const InstrumentDetailModal = ({ item, onClose }) => {
    if (!item) return null;
    const isExpired = new Date(item.expiryDate) < new Date();

    const DocItem = ({ label, value }) => (
        <div className="flex items-center justify-between p-4 bg-indigo-50/40 border border-indigo-100/50 rounded-[22px] hover:border-indigo-200 transition-all group">
            <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${value !== "N/A" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                    <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-indigo-900 tracking-tight">{label}</p>
                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mt-0.5">
                        {value !== "N/A" ? "CANONICAL VIEW" : "NOT ATTACHED"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <button
                    title="Add New"
                    className="w-10 h-10 flex items-center justify-center bg-white text-indigo-500 hover:text-indigo-700 hover:shadow-lg rounded-xl border border-indigo-100 shadow-sm transition-all"
                >
                    <Plus size={18} strokeWidth={3} />
                </button>

                <button
                    title="Edit"
                    disabled={value === "N/A"}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl border border-indigo-100 shadow-sm transition-all
                              ${value !== "N/A"
                            ? "bg-white text-indigo-500 hover:text-indigo-700 hover:shadow-lg"
                            : "bg-slate-50 text-slate-300 cursor-not-allowed"
                        }`}
                >
                    <Pencil size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
                {/* Simplified Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                            {item.name}
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-widest ${isExpired ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {isExpired ? 'Expired' : 'Compliant'}
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">{item.department} • Instrument Profile</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body Area */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/30 custom-scrollbar">

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Profile Photo & Basic Specs */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
                                {item.photo ? (
                                    <img src={item.photo} alt={item.name} className="w-full aspect-square object-cover rounded-xl" />
                                ) : (
                                    <div className="w-full aspect-square bg-slate-50 rounded-xl flex flex-col items-center justify-center text-slate-300">
                                        <Camera size={48} strokeWidth={1.5} />
                                        <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No Photo</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div className="p-4 bg-white rounded-xl border border-slate-200 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">ID Reference</span>
                                    <span className="text-sm font-bold text-slate-700">INST-{item.id.toString().slice(-4)}</span>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Calibration</p>
                                    <p className={`text-lg font-black ${isExpired ? 'text-rose-600' : 'text-slate-800'}`}>
                                        {item.expiryDate || "Not Set"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                <FileSearch size={16} className="text-indigo-600" />
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Documentation Registry</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <DocItem label="Purchase Order" value={item.purchaseOrder} />
                                <DocItem label="Bill Receipt" value={item.billReceipt} />
                                <DocItem label="Installation Report" value={item.installationReport} />
                                <DocItem label="IQ / OQ / PQ Protocol" value={item.iqOqPq} />
                                <DocItem label="User Manual" value={item.userManual} />
                                <DocItem label="Calibration Cert" value={item.calibrationCert} />
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Log */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <History size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-700">Maintenance & Handling Notes</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed min-h-[100px]">
                            {item.maintenanceText || "No maintenance history recorded for this equipment."}
                        </p>
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                    <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Printer size={16} /> Print Profile
                    </button>
                    <button className="flex items-center gap-2 px-8 py-2 bg-slate-900 text-black rounded-lg text-sm font-bold hover:bg-black transition-all active:scale-95">
                        <Download size={16} /> Export Dossier
                    </button>
                </div>
            </div>
        </div>
    );
};

const InstrumentList = ({ instruments }) => {
    const [selectedItem, setSelectedItem] = useState(null);

    if (instruments.length === 0) {
        return (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-20 text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-400 mx-auto mb-6">
                    <FileCheck2 size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">Registry Empty</h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">Add medical instruments to start tracking their calibration lifecycle.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in duration-700">
            {/* Header Row for Table-like feel */}
            <div className="px-10 py-4 grid grid-cols-12 gap-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
                <div className="col-span-5 flex items-center gap-12">
                    <span className="ml-24">Instrument Nomenclature</span>
                </div>
                <div className="col-span-2">Department</div>
                <div className="col-span-2">Calibration Due</div>
                <div className="col-span-1">Status</div>
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
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-black transition-all shadow-sm group/btn"
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

            {/* Instrument Detail Modal */}
            <InstrumentDetailModal
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
            />
        </div>
    );
};

export default InstrumentList;
