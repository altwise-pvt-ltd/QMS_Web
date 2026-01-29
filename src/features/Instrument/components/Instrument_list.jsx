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

    const DocItem = ({ label, value, field }) => (
        <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-[28px] hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${value !== "N/A" ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
                    <FileText size={24} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.15em] mb-1">{label}</p>
                    <p className={`text-base font-bold truncate ${value !== "N/A" ? 'text-slate-800' : 'text-slate-400 italic'}`}>
                        {value !== "N/A" ? value : "Pending Documentation"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {value === "N/A" ? (
                    <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all" title="Upload Document">
                        <Plus size={18} strokeWidth={3} />
                    </button>
                ) : (
                    <>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 rounded-xl transition-all" title="Edit Document">
                            <Pencil size={18} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all" title="Delete Document">
                            <Trash2 size={18} />
                        </button>
                    </>
                )}
                <button className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${value !== "N/A" ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 cursor-not-allowed'}`}>
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500 border border-slate-200">
                {/* Header Section */}
                <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                            <FileSearch size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2 uppercase italic">
                                {item.name}
                                <span className="text-xs font-black not-italic bg-indigo-600 text-black px-2 py-0.5 rounded-full uppercase ml-2 tracking-widest shadow-sm">BIO</span>
                            </h2>
                            <p className="text-sm font-bold text-slate-500 mt-0.5">{item.department} • Ref: INST-{item.id.toString().slice(-4)}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-800 rounded-2xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-slate-50/50 custom-scrollbar">

                    {/* Top Row: Visual Profile & Technical Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Left: Prominent Image */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="relative group">
                                {item.photo ? (
                                    <img src={item.photo} alt={item.name} className="w-full aspect-square object-cover rounded-[40px] border-8 border-white shadow-2xl shadow-indigo-500/10" />
                                ) : (
                                    <div className="w-full aspect-square bg-white rounded-[40px] border-8 border-white shadow-2xl flex flex-col items-center justify-center text-slate-200">
                                        <Camera size={80} strokeWidth={1} />
                                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest mt-4">No Profile Image</p>
                                    </div>
                                )}
                                <div className="absolute top-6 left-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${isExpired ? 'bg-rose-500 text-black' : 'bg-emerald-500 text-black'}`}>
                                        {isExpired ? 'Expired' : 'Compliant'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 bg-indigo-600 rounded-[32px] text-black shadow-xl shadow-indigo-200">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Internal Metrics</h5>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-indigo-500 pb-3">
                                        <span className="text-xs font-bold">Calibration Lifecycle</span>
                                        <span className="text-xl font-black">2.4Y</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-indigo-500 pb-3">
                                        <span className="text-xs font-bold">Operational Status</span>
                                        <span className="text-base font-black">98% UP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Technical Stats & Documents */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Technical Specs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered Date</p>
                                    <p className="font-black text-slate-800 text-lg">Jan 17, 2026</p>
                                </div>
                                <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calibration Due</p>
                                    <p className={`font-black text-lg ${isExpired ? 'text-rose-600' : 'text-indigo-600'}`}>{item.expiryDate || "Not Set"}</p>
                                </div>
                                <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Handle By</p>
                                    <p className="font-black text-slate-800 text-lg italic">Lab Tech-04</p>
                                </div>
                            </div>

                            {/* Document Archive - Re-styled as requested List View */}
                            <div className="space-y-4">
                                <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-3 ml-2">
                                    <FileSearch size={18} /> Central Document Repository
                                </h5>
                                <div className="space-y-3">
                                    <DocItem label="Purchase Order / Agreement" value={item.purchaseOrder} />
                                    <DocItem label="Bill Receipt & Tax Invoice" value={item.billReceipt} />
                                    <DocItem label="Installation & Training Report" value={item.installationReport} />
                                    <DocItem label="IQ / OQ / PQ Protocol" value={item.iqOqPq} />
                                    <DocItem label="User Operations Manual" value={item.userManual} />
                                    <DocItem label="Latest Calibration Certificate" value={item.calibrationCert} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Narrative */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-2">
                            <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-3">
                                <History size={18} /> Continuous Maintenance History
                            </h5>
                            <button className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Add Log Entry</button>
                        </div>
                        <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-inner relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 -mr-16 -mt-16 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                            <p className="text-slate-600 font-bold italic leading-loose text-lg relative z-10">
                                "{item.maintenanceText || "No active maintenance narrative recorded for this unit. System waiting for first calibration lifecycle entry."}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Section - Action Bar */}
                <div className="px-10 py-6 border-t border-slate-100 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-md">
                                    <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-black text-[10px] font-black shadow-md">+4</div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shared with Technical Staff</span>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                            <Printer size={16} /> Print Bio
                        </button>
                        <button className="flex items-center gap-2 px-10 py-3 bg-slate-900 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95">
                            <Download size={16} /> Export Dossier
                        </button>
                    </div>
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
