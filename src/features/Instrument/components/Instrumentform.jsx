import React, { useState } from "react";
import {
    X,
    Upload,
    FileText,
    Calendar,
    Camera,
    Building2,
    CheckCircle2,
    AlertCircle,
    Info,
    ClipboardCheck
} from "lucide-react";
import { useEffect } from "react";
import { getDepartments } from "../../department/services/departmentService";
import instrumentService from "../services/instrumentService";

const InstrumentForm = ({ isOpen, onClose, onAdd, editingInstrument }) => {
    const [formData, setFormData] = useState({
        name: "",
        department: "",
        photo: null,
        purchaseOrder: null,
        billReceipt: null,
        installationReport: null,
        iqOqPq: null,
        userManual: null,
        calibrationCert: null,
        maintenanceText: "",
        expiryDate: ""
    });

    const [departments, setDepartments] = useState([]);

    const resetForm = () => {
        setFormData({
            name: "",
            department: "",
            photo: null,
            purchaseOrder: null,
            billReceipt: null,
            installationReport: null,
            iqOqPq: null,
            userManual: null,
            calibrationCert: null,
            maintenanceText: "",
            expiryDate: ""
        });
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const depts = await getDepartments();
                setDepartments(depts);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (editingInstrument) {
            setFormData({
                name: editingInstrument.name || "",
                department: editingInstrument.department || "",
                photo: editingInstrument.photo || null,
                purchaseOrder: editingInstrument.purchaseOrder || null,
                billReceipt: editingInstrument.billReceipt || null,
                installationReport: editingInstrument.installationReport || null,
                iqOqPq: editingInstrument.iqOqPq || null,
                userManual: editingInstrument.userManual || null,
                calibrationCert: editingInstrument.calibrationCert || null,
                maintenanceText: editingInstrument.maintenanceText || "",
                expiryDate: (editingInstrument.expiryDate || "").split('T')[0]
            });
        } else {
            resetForm();
        }
    }, [editingInstrument, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Comprehensive Validation
        const missingFields = [];
        if (!formData.name) missingFields.push("Instrument Nomenclature");
        if (!formData.department) missingFields.push("Operating Department");
        if (!formData.maintenanceText) missingFields.push("Maintenance Notes");
        if (!formData.expiryDate) missingFields.push("Expiry Date");

        // File Validations
        if (!formData.purchaseOrder) missingFields.push("Purchase Order");
        if (!formData.billReceipt) missingFields.push("Bill Receipt");
        if (!formData.installationReport) missingFields.push("Installation Report");
        if (!formData.iqOqPq) missingFields.push("IQ/OQ/PQ Protocol");
        if (!formData.userManual) missingFields.push("User Manual");
        if (!formData.photo) missingFields.push("Equipment Photograph");
        if (!formData.calibrationCert) missingFields.push("Calibration Certificate");

        if (missingFields.length > 0) {
            alert(`Please provide the following required information:\n\n• ${missingFields.join("\n• ")}`);
            return;
        }

        try {
            const payload = new FormData();
            payload.append("InstrumentNomenclature", formData.name);
            payload.append("OperatingDepartment", formData.department);
            payload.append("PreventiveMaintenanceNotes", formData.maintenanceText);
            payload.append("ExpiryDate", formData.expiryDate);
            payload.append("Status", "Active");

            if (formData.photo) payload.append("EquipmentPhotographFile", formData.photo);
            if (formData.purchaseOrder) payload.append("PurchaseOrderFile", formData.purchaseOrder);
            if (formData.billReceipt) payload.append("BillReceiptFile", formData.billReceipt);
            if (formData.installationReport) payload.append("InstallationReportFile", formData.installationReport);
            if (formData.iqOqPq) payload.append("IqOqPqProtocolFile", formData.iqOqPq);
            if (formData.userManual) payload.append("UserOperationsManualFile", formData.userManual);
            if (formData.calibrationCert) payload.append("LatestCalibrationCert", formData.calibrationCert);

            if (editingInstrument) {
                payload.append("InstrumentCalibrationId", editingInstrument.instrumentCalibrationId);
                await instrumentService.updateInstrumentCalibration(editingInstrument.instrumentCalibrationId, payload);
                alert("Instrument updated successfully!");
            } else {
                await instrumentService.createInstrument(payload);
                alert("Instrument registered successfully!");
            }

            onAdd();
            resetForm();
            onClose();
        } catch (error) {
            console.error("Failed to register instrument:", error);
            const errorData = error.response?.data;
            const errorMessage = errorData?.errors
                ? Object.entries(errorData.errors)
                    .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                    .join("\n")
                : errorData?.title || "Failed to register instrument. Please ensure all required fields and documents are provided.";
            alert(`Registration Error:\n${errorMessage}`);
        }
    };

    const VerticalFileField = ({ label, field, hint, accept = ".pdf,image/*", typeLabel = "PDF", required = false }) => (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg bg-white group hover:border-indigo-200 transition-all gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-lg shrink-0 flex items-center justify-center transition-colors ${formData[field] ? 'bg-emerald-100 text-emerald-600' : (required ? 'bg-rose-50 text-rose-400' : 'bg-slate-100 text-slate-400')}`}>
                    {field === 'photo' ? <Camera size={18} /> : <Upload size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-700 truncate">{label} {required && <span className="text-rose-500">*</span>}</p>
                    <p className="text-[10px] text-slate-400 font-medium italic truncate">
                        {formData[field] instanceof File ? formData[field].name : (formData[field] ? 'File attached' : (hint || `No ${typeLabel} attached`))}
                    </p>
                </div>
            </div>
            <label className={`shrink-0 px-4 py-2 border rounded-md text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all text-center ${formData[field] ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-600'}`}>
                {formData[field] ? `Change ${typeLabel}` : `Add ${typeLabel}`}
                <input type="file" accept={accept} className="hidden" onChange={(e) => handleFileChange(e, field)} />
            </label>
        </div>
    );

    return (
        <div className="fixed inset-0 z-100 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden border border-slate-200">
                {/* Header - CAPA Style */}
                <div className="flex items-center justify-between px-8 py-5 border-b bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{editingInstrument ? 'Edit Instrument' : 'New Instrument Registration'}</h2>
                        <p className="text-sm text-slate-500 mt-0.5">{editingInstrument ? 'Update equipment biodata and documentation' : 'Define equipment biodata and documentation'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Body */}
                <form id="instrument-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">

                    {/* Basic Information Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Info size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Identification</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 block">Instrument Nomenclature <span className="text-rose-500">*</span></label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Sysmex XN-1000"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-800"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 block">Operating Department <span className="text-rose-500">*</span></label>
                                <select
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all bg-white font-medium text-slate-800"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                >
                                    <option value="" disabled>Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept.id || dept.departmentId} value={dept.departmentName || dept.name}>
                                            {dept.departmentName || dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Documentation Section - Vertical Grouping as requested */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Column 1: Core Docs */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FileText size={16} className="text-indigo-600" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Audit Proofs</h3>
                            </div>
                            <VerticalFileField label="Purchase Order / Agreement" field="purchaseOrder" required />
                            <VerticalFileField label="Bill Receipt" field="billReceipt" required />
                            <VerticalFileField label="Installation Report" field="installationReport" required />
                        </div>

                        {/* Column 2: Manuals & Standards */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <ClipboardCheck size={16} className="text-indigo-600" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Standards</h3>
                            </div>
                            <VerticalFileField label="IQ OQ PQ Protocol" field="iqOqPq" required />
                            <VerticalFileField label="User Operations Manual" field="userManual" required />
                            <VerticalFileField label="Equipment Photograph" field="photo" hint="Upload image only" accept="image/*" typeLabel="Image" required />
                        </div>
                    </div>

                    {/* Calibration & Maintenance Section */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Calendar size={16} className="text-indigo-600" />
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-700">Calibration Cycle</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <VerticalFileField label="Latest Calibration Cert" field="calibrationCert" required />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 block">Valid Until (Expiry Date) <span className="text-rose-500">*</span></label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-800"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                    <p className="text-[10px] text-amber-600 flex items-center gap-1 font-medium italic">
                                        <AlertCircle size={10} /> Reminder will be sent before this date.
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 block">Preventive Maintenance Notes <span className="text-rose-500">*</span></label>
                                <textarea
                                    required
                                    placeholder="Enter details about maintenance schedule, handling instructions etc..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium text-slate-800 h-full min-h-[140px] resize-none"
                                    value={formData.maintenanceText}
                                    onChange={(e) => setFormData({ ...formData, maintenanceText: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer Action - CAPA Style */}
                <div className="px-8 py-5 border-t bg-slate-50 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
                    >
                        Discard
                    </button>
                    <button
                        form="instrument-form"
                        type="submit"
                        className="px-10 py-2.5 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-black transition-all shadow-sm active:scale-95 uppercase tracking-widest"
                    >
                        {editingInstrument ? 'Update Changes' : 'Submit Registration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstrumentForm;
