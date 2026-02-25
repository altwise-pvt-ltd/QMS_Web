import React, { useState } from "react";
import {
    Plus,
    Search,
    Filter,
    Zap,
    FileCheck2,
    Activity,
    Clock,
    AlertCircle,
    Microscope,
} from "lucide-react";
import { useEffect } from "react";
import InstrumentForm from "./components/Instrumentform";
import InstrumentList from "./components/Instrument_list";
import instrumentService from "./services/instrumentService";

const Instrument = () => {
    const [instruments, setInstruments] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingInstrument, setEditingInstrument] = useState(null);

    const fetchInstruments = async () => {
        try {
            setLoading(true);
            const response = await instrumentService.getInstruments();

            // Normalize API response to match local state expectations
            // The API uses 'instrumentNomenclature' and 'equipmentPhotographFilePath'
            const data = Array.isArray(response) ? response : (response?.data || []);
            const baseUrl = "https://qmsapi.altwise.in/"; // Base URL for uploaded files

            const formatFilePath = (path) => {
                if (!path || path === "N/A") return "N/A";
                if (typeof path !== 'string') return "N/A";
                if (path.startsWith("http")) return path;

                // Handle Windows absolute paths or messy strings returned by some API versions
                let cleanPath = path;
                const markers = ["UploadedInstruments/", "Upload/", "Uploads/"];
                for (const marker of markers) {
                    if (path.includes(marker)) {
                        cleanPath = path.substring(path.indexOf(marker));
                        break;
                    }
                }

                // Remove leading slash if it exists to avoid double slash
                cleanPath = cleanPath.startsWith("/") ? cleanPath.substring(1) : cleanPath;
                return `${baseUrl}${cleanPath}`;
            };

            const normalizedData = data.map(item => ({
                ...item,
                id: item.instrumentCalibrationId || item.id || Date.now(),
                name: item.instrumentNomenclature || item.instrumentName || item.name || "Unnamed Instrument",
                department: item.operatingDepartment || item.departmentName || item.department || "General",
                expiryDate: item.expiryDate || item.nextCalibrationDate || "",
                // Document mappings for the detail view - Use *FilePath for full URLs or helper for messy paths
                photo: formatFilePath(item.equipmentPhotographFilePath || item.equipmentPhotographFileName),
                purchaseOrder: formatFilePath(item.purchaseOrderFilePath || item.purchaseOrderFileName),
                billReceipt: formatFilePath(item.billReceiptFilePath || item.billReceiptFileName),
                installationReport: formatFilePath(item.installationReportFilePath || item.installationReportFileName),
                iqOqPq: formatFilePath(item.iqOqPqProtocolFilePath || item.iqOqPqProtocolFileName),
                userManual: formatFilePath(item.userOperationsManualFilePath || item.userOperationsManualFileName),
                calibrationCert: formatFilePath(item.latestCalibrationCertFilePath || item.latestCalibrationCertFileName),
                maintenanceText: item.preventiveMaintenanceNotes || ""
            }));

            setInstruments(normalizedData);
        } catch (error) {
            console.error("Error fetching instruments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInstrument = async (id) => {
        if (!window.confirm("Are you sure you want to delete this instrument?")) return;
        try {
            await instrumentService.deleteInstrument(id);
            alert("Instrument deleted successfully!");
            fetchInstruments();
        } catch (error) {
            console.error("Error deleting instrument:", error);
            alert("Failed to delete instrument.");
        }
    };

    useEffect(() => {
        fetchInstruments();
    }, []);

    const handleAddInstrument = () => {
        fetchInstruments();
    };

    const handleEditInstrument = (instrument) => {
        setEditingInstrument(instrument);
        setIsFormOpen(true);
    };

    const filteredInstruments = instruments.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const totalInstruments = instruments.length;
    const pendingCalibrations = instruments.filter(inst => {
        if (!inst.expiryDate) return false;
        const expiry = new Date(inst.expiryDate);
        const today = new Date();
        const diff = (expiry - today) / (1000 * 60 * 60 * 24);
        return diff < 30; // within 30 days
    }).length;

    const activeCount = instruments.filter(inst => (inst.status || "Active") === "Active").length;

    const stats = [
        { label: "Total Assets", value: totalInstruments, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Calibration Due", value: pendingCalibrations, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Active Status", value: activeCount, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Elegant Header */}
            <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Microscope className="text-indigo-600" size={32} />
                            Instrument Calibration
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium text-lg">Monitor, register, and maintain biomedical instrument standards.</p>
                    </div>

                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="group flex items-center justify-center gap-2 px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black shadow-2xl shadow-indigo-200 hover:bg-slate-900 "
                    >
                        <Plus className="group-hover:rotate-180 transition-transform duration-500" size={24} />
                        Register New Instrument
                    </button>
                </div>

                {/* Performance Stats Overlay */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                            <div className={`absolute -right-4 -top-4 w-32 h-32 rounded-full ${stat.bg} opacity-20 group-hover:scale-110 transition-transform duration-700`}></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    <stat.icon size={28} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* List Control Panel */}
            <div className="bg-slate-50/50 p-10 rounded-[48px] border border-slate-100 shadow-inner space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative flex-1 w-full max-w-xl group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by instrument name or department..."
                            className="w-full pl-16 pr-8 py-5 bg-white border border-slate-100 rounded-[28px] shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-semibold italic text-slate-800 whitespace-nowrap overflow-hidden"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <Filter size={16} />
                            All Departments
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {filteredInstruments.length} Items Found
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-slate-400 font-bold animate-pulse">
                        Synchronizing with Calibration Database...
                    </div>
                ) : (
                    <InstrumentList
                        instruments={filteredInstruments}
                        onDelete={handleDeleteInstrument}
                        onEdit={handleEditInstrument}
                    />
                )}
            </div>

            <InstrumentForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingInstrument(null);
                }}
                onAdd={handleAddInstrument}
                editingInstrument={editingInstrument}
            />
        </div>
    );
};

export default Instrument;
