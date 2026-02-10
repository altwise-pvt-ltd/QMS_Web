import React, { useState } from "react";
import { db } from "../../../db";
import { X, Box, UserCircle, ChevronDown } from "lucide-react";
import api from "../../../auth/api";

/**
 * AddDepartment component - A modal for defining a new department
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility
 * @param {function} props.onClose - Callback to close the modal
 * @param {function} props.onAdd - Callback when a department is successfully created
 * @param {Object} [props.editingData] - Optional data for a department being edited
 */
export const AddDepartment = ({ isOpen, onClose, onAdd, editingData }) => {
    const [formData, setFormData] = useState({
        name: "",
        head: ""
    });
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Populate form if in edit mode
    React.useEffect(() => {
        if (editingData) {
            setFormData({
                name: editingData.name || "",
                head: editingData.head || ""
            });
        } else {
            setFormData({ name: "", head: "" });
        }
    }, [editingData, isOpen]);

    React.useEffect(() => {
        const fetchStaff = async () => {
            try {
                const staff = await db.staff.toArray();
                setStaffList(staff);
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
        };
        if (isOpen) {
            fetchStaff();
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        setLoading(true);
        try {
            // Prepare payload
            const payload = {
                departmentId: editingData ? editingData.id : 0,
                departmentName: formData.name,
                headOfDepartmentName: formData.head || "Not Assigned"
            };

            // Using CreateDepartment for both if no Update endpoint provided, 
            // but usually it's one or the other. I'll stick to the provided pattern.
            const url = "/Department/CreateDepartment";
            const response = await api.post(url, payload);

            if (response.data) {
                const updatedDept = response.data;

                // Map server response to match frontend state
                const transformedDept = {
                    id: updatedDept.departmentId,
                    name: updatedDept.departmentName,
                    head: updatedDept.headOfDepartmentName,
                    employeeCount: editingData ? editingData.employeeCount : 0,
                    icon: editingData ? editingData.icon : "Box",
                    color: editingData ? editingData.color : "indigo"
                };

                onAdd(transformedDept);
                onClose();
            }
        } catch (error) {
            console.error("Error saving department:", error);
            alert(error.response?.data?.message || "Failed to save department. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-black text-slate-800">
                            {editingData ? "Edit Department" : "New Department"}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <p className="text-slate-500 text-sm mb-8">
                        {editingData ? "Update the department details below." : "Establish a new unit within the organization."}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                                Department Name
                            </label>
                            <div className="relative">
                                <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Pathology"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                                    Dept. Head (Optional)
                                </label>
                                <div className="relative">
                                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={18} />
                                    <select
                                        value={formData.head}
                                        onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                                        className="w-full pl-12 pr-10 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800 appearance-none cursor-pointer"
                                    >
                                        <option value="">Not Assigned</option>
                                        {staffList.map((staff) => (
                                            <option key={staff.id} value={staff.name}>
                                                {staff.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-4 bg-indigo-600 text-black font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Saving..." : (editingData ? "Update Dept" : "Create Dept")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddDepartment;
