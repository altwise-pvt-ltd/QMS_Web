import React, { useState, useEffect } from "react";
import {
    Building2,
    LayoutDashboard,
    Plus,
    Search,
    Filter,
    BarChart3,
    Users2,
    Settings2
} from "lucide-react";
import { DEPARTMENTS } from "./emp_data";
import DepartmentCards from "./component/department_cards";
import DepartmentView from "./component/department_view";
import AddDepartment from "./component/add_department";
import api from "../../auth/api";

const Department = () => {
    const [departments, setDepartments] = useState(DEPARTMENTS);
    const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0]?.id);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await api.get("/Department/GetAllDepartments");
            if (response.data && response.data.length > 0) {
                const mappedDepts = response.data.map(dept => ({
                    id: dept.departmentId,
                    name: dept.departmentName,
                    head: dept.headOfDepartmentName,
                    employeeCount: 0,
                    icon: "Building2",
                    color: "indigo"
                }));
                setDepartments(mappedDepts);
                if (mappedDepts.length > 0 && !selectedDeptId) {
                    setSelectedDeptId(mappedDepts[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddDepartment = (newDept) => {
        if (editingDepartment) {
            setDepartments(departments.map(d => d.id === newDept.id ? newDept : d));
        } else {
            setDepartments([newDept, ...departments]);
            if (departments.length === 0) {
                setSelectedDeptId(newDept.id);
            }
        }
    };

    const handleEdit = (dept) => {
        setEditingDepartment(dept);
        setIsAddModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete the "${name}" department? This action cannot be undone.`)) {
            try {
                // Changing from api.get to api.delete as the server returned 405 Method Not Allowed
                await api.delete(`/Department/DeleteDepartment/${id}`);
                setDepartments(departments.filter(d => d.id !== id));
                if (selectedDeptId === id) {
                    setSelectedDeptId(departments.find(d => d.id !== id)?.id);
                }
                alert("Department deleted successfully");
            } catch (error) {
                console.error("Delete failed", error);
                alert("Failed to delete department. Please try again.");
            }
        }
    };

    const filteredDepartments = departments.filter(dept =>
        (dept.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats for overview
    const stats = [
        { label: "Total Departments", value: departments.length, icon: Building2, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Onboarded Staff", value: departments.reduce((acc, curr) => acc + curr.employeeCount, 0), icon: Users2, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Building2 className="text-indigo-600" />
                            Departmental Hub
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">Manage hospital units and staffing roster</p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                        <div className={`absolute -right-3 -top-3 w-24 h-24 rounded-full ${stat.bg} opacity-10 group-hover:scale-110 transition-transform duration-500`}></div>
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls & Grid */}
            <div className="bg-slate-50/50 p-8 rounded-[40px] border border-slate-100 shadow-inner">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Active Departments</h2>
                        <p className="text-xs text-slate-400 font-medium">Click on a card below to switch the roster view</p>
                    </div>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-black rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                        Add Department
                    </button>
                </div>

                {filteredDepartments.length > 0 ? (
                    <div className="space-y-12">
                        <DepartmentCards
                            departments={filteredDepartments}
                            selectedId={selectedDeptId}
                            onSelect={setSelectedDeptId}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 animate-in slide-in-from-bottom-8 duration-500">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                    <Users2 size={24} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Departmental Roster</h3>
                                    <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">
                                        Active Team: {departments.find(d => d.id === selectedDeptId)?.name}
                                    </p>
                                </div>
                            </div>
                            <DepartmentView deptId={selectedDeptId} />
                        </div>
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No departments found</h3>
                        <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>

            <AddDepartment
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingDepartment(null);
                }}
                onAdd={handleAddDepartment}
                editingData={editingDepartment}
            />
        </div>
    );
};

export default Department;
