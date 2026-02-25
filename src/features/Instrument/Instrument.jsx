import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Zap,
  Activity,
  Clock,
  Microscope,
} from "lucide-react";
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
      const data = await instrumentService.getInstruments();

      // Normalize API response
      const baseUrl = "https://qmsapi.altwise.in/";

      const formatFilePath = (path) => {
        if (!path || path === "N/A") return "N/A";
        if (typeof path !== "string") return "N/A";
        if (path.startsWith("http")) return path;

        let cleanPath = path;
        const markers = ["UploadedInstruments/", "Upload/", "Uploads/"];
        for (const marker of markers) {
          if (path.includes(marker)) {
            cleanPath = path.substring(path.indexOf(marker));
            break;
          }
        }
        cleanPath = cleanPath.startsWith("/") ? cleanPath.substring(1) : cleanPath;
        return `${baseUrl}${cleanPath}`;
      };

      const normalizedData = data.map((item) => ({
        ...item,
        id: item.instrumentCalibrationId || item.id || Date.now(),
        name: item.instrumentNomenclature || item.instrumentName || item.name || "Unnamed Instrument",
        department: item.operatingDepartment || item.departmentName || item.department || "General",
        expiryDate: item.expiryDate || item.nextCalibrationDate || "",
        photo: formatFilePath(item.equipmentPhotographFilePath || item.equipmentPhotographFileName),
        purchaseOrder: formatFilePath(item.purchaseOrderFilePath || item.purchaseOrderFileName),
        billReceipt: formatFilePath(item.billReceiptFilePath || item.billReceiptFileName),
        installationReport: formatFilePath(item.installationReportFilePath || item.installationReportFileName),
        iqOqPq: formatFilePath(item.iqOqPqProtocolFilePath || item.iqOqPqProtocolFileName),
        userManual: formatFilePath(item.userOperationsManualFilePath || item.userOperationsManualFileName),
        calibrationCert: formatFilePath(item.latestCalibrationCertFilePath || item.latestCalibrationCertFileName),
        maintenanceText: item.preventiveMaintenanceNotes || "",
      }));

      setInstruments(normalizedData);
    } catch (error) {
      console.error("Error fetching instruments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  const handleDeleteInstrument = async (id) => {
    if (!window.confirm("Are you sure you want to delete this instrument?")) return;
    try {
      await instrumentService.deleteInstrument(id);
      fetchInstruments();
    } catch (error) {
      console.error("Error deleting instrument:", error);
    }
  };

  const handleEditInstrument = (instrument) => {
    setEditingInstrument(instrument);
    setIsFormOpen(true);
  };

  const filteredInstruments = useMemo(() => {
    return instruments.filter(
      (inst) =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [instruments, searchTerm]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = instruments.length;
    const active = instruments.filter((inst) => (inst.status || "Active") === "Active").length;

    // Simple logic for "Calibration Due": check if expiry date is within 30 days or past
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const due = instruments.filter((inst) => {
      if (!inst.expiryDate) return false;
      const expDate = new Date(inst.expiryDate);
      return expDate <= thirtyDaysLater;
    }).length;

    return [
      { label: "Total Assets", value: total, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50" },
      { label: "Calibration Due", value: due, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Active Status", value: active, icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];
  }, [instruments]);

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Microscope className="text-indigo-600" size={32} />
            Instrument Calibration
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Monitor, register, and maintain biomedical instrument standards.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-gray-600 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm"
        >
          <Plus className="group-hover:rotate-180 transition-transform duration-500" size={20} />
          Register Instrument
        </button>
      </div>

      {/* Performance Stats Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
          >
            <div className="flex items-center gap-5 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {stat.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* List Control Panel */}
      <div className="bg-slate-50/50 p-6 md:p-8 rounded-[40px] border border-slate-100 shadow-inner space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative flex-1 w-full max-w-xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by instrument name or department..."
              className="w-full pl-16 pr-8 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-semibold text-slate-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
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
        onAdd={fetchInstruments}
        editingInstrument={editingInstrument}
      />
    </div>
  );
};

export default Instrument;

