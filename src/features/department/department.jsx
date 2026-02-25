import React, { useState, useEffect } from "react";
import {
  Building2,
  Plus,
  Search,
  Users2,
} from "lucide-react";
import DepartmentCards from "./component/department_cards";
import DepartmentView from "./component/department_view";
import AddDepartment from "./component/add_department";
import { getDepartments, deleteDepartment } from "./services/departmentService";
import staffService from "../staff/services/staffService";
import CustomPagination from "../../components/ui/CustomPagination";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedDeptName, setSelectedDeptName] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const [deptData, staffRes] = await Promise.all([
        getDepartments(),
        staffService.getAllStaff(),
      ]);

      const allStaff = staffRes.data || [];

      if (deptData && deptData.length > 0) {
        const mappedDepts = deptData.map((dept) => {
          const staffInDept = allStaff.filter(
            (s) => s.departmentId === dept.departmentId,
          );

          return {
            id: dept.departmentId,
            name: dept.departmentName,
            head: dept.headOfDepartmentName || "Not Assigned",
            employeeCount: staffInDept.length,
            icon: "Building2",
            color: "indigo",
          };
        });
        setDepartments(mappedDepts);

        if (mappedDepts.length > 0 && !selectedDeptId) {
          setSelectedDeptId(mappedDepts[0].id);
          setSelectedDeptName(mappedDepts[0].name);
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

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleAddDepartment = (newDept) => {
    if (editingDepartment) {
      setDepartments(
        departments.map((d) => (d.id === newDept.id ? newDept : d)),
      );
      if (selectedDeptId === newDept.id) {
        setSelectedDeptName(newDept.name);
      }
    } else {
      setDepartments([newDept, ...departments]);
      if (departments.length === 0) {
        setSelectedDeptId(newDept.id);
        setSelectedDeptName(newDept.name);
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDepartment(dept);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete the "${name}" department? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteDepartment(id);
        const updatedDepts = departments.filter((d) => d.id !== id);
        setDepartments(updatedDepts);
        if (selectedDeptId === id) {
          const firstNext = updatedDepts[0];
          setSelectedDeptId(firstNext?.id || null);
          setSelectedDeptName(firstNext?.name || "");
        }
        alert("Department deleted successfully");
      } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete department. Please try again.");
      }
    }
  };

  const filteredDepartments = departments.filter((dept) =>
    (dept.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  const stats = [
    {
      label: "Total Departments",
      value: departments.length,
      icon: Building2,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Onboarded Staff",
      value: departments.reduce((acc, curr) => acc + curr.employeeCount, 0),
      icon: Users2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700 pb-20 bg-slate-50/30">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3 uppercase">
            <Building2 className="text-indigo-600" size={32} />
            Departmental Hub
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg italic">
            Manage hospital units and staffing roster
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-gray-600 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm"
        >
          <Plus size={20} /> Add Department
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className={`absolute -right-3 -top-3 w-24 h-24 rounded-full ${stat.bg} opacity-10 group-hover:scale-110 transition-transform duration-500`}></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roster & Controls Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Active Departments</h2>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Click on a card below to switch the roster view</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search departments..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 shadow-sm transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {totalPages > 1 && (
                <CustomPagination
                  count={totalPages}
                  page={page}
                  onChange={(e, v) => setPage(v)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="p-10 bg-white">
          {filteredDepartments.length > 0 ? (
            <div className="space-y-16">
              <DepartmentCards
                departments={paginatedDepartments}
                selectedId={selectedDeptId}
                onSelect={(id) => {
                  setSelectedDeptId(id);
                  const dept = departments.find(d => d.id === id);
                  if (dept) setSelectedDeptName(dept.name);
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              <div className="pt-10 border-t border-slate-50 animate-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Users2 size={28} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                      {selectedDeptName || "Departmental"} Roster
                    </h3>
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Roster View: {selectedDeptName}
                    </p>
                  </div>
                </div>
                <DepartmentView deptId={selectedDeptId} deptName={selectedDeptName} />
              </div>
            </div>
          ) : (
            <div className="py-24 text-center">
              <Building2 className="w-20 h-20 text-slate-100 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">No departments found</h3>
              <p className="text-slate-400 text-sm font-medium">Try adjusting your search criteria or add a new department hub</p>
            </div>
          )}
        </div>
      </div>

      <AddDepartment
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDepartment(null);
        }}
        onAdd={fetchDepartments} // Refresh after add/edit
        editingData={editingDepartment}
      />
    </div>
  );
};

export default Department;
