import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  MoreVertical, 
  Edit, 
  ClipboardCheck, 
  Shield, 
  Search,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText
} from "lucide-react";
import staffService from "../services/staffService";
import { Skeleton } from "../../../components/ui/Skeleton";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";
import CustomPagination from "../../../components/ui/CustomPagination";

const StaffList = ({ onAddNew, onEdit, onCompetence, onPermissions }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);

      // Fetch both staff and departments in parallel
      const [staffRes, deptsRes] = await Promise.all([
        staffService.getAllStaff(),
        staffService.getAllDepartments(),
      ]);

      const staffFromServer = staffRes.data || [];
      const deptsFromServer = deptsRes.data || [];

      // Create a map for quick department name lookup
      const deptMap = {};
      deptsFromServer.forEach((d) => {
        deptMap[d.departmentId] = d.departmentName;
      });

      // Map server staff to frontend format
      const mappedStaff = staffFromServer.map((s) => ({
        id: s.staffId,
        firstName: s.firstName,
        lastName: s.lastName,
        name: `${s.firstName || ""} ${s.lastName || ""}`.trim() || "Unnamed",
        email: s.workEmail,
        mobileNumber: s.mobileNumber,
        role: s.jobTitle || "No Role",
        dept: deptMap[s.departmentId] || `Dept ${s.departmentId}`,
        deptId: s.departmentId,
        status:
          s.status ||
          (s.staffAssessmentCompetenceStatus ? "Competent" : "Needs Review"),
        joinDate: s.createdDate ? s.createdDate.split("T")[0] : "N/A",
        photo: staffService.getAssetUrl(s.staffPassportPhotoPath),
        resume: staffService.getAssetUrl(s.staffResumePath),
      }));

      setStaffData(mappedStaff);
    } catch (error) {
      console.error("Error loading staff from server:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Stats calculation
  const totalStaff = staffData.length;
  const competentCount = staffData.filter(s => s.status === "Competent").length;
  const reviewNeededCount = totalStaff - competentCount;

  const filteredStaff = staffData.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Workforce", value: totalStaff, icon: Users, color: "indigo" },
          { label: "Competent Certified", value: competentCount, icon: CheckCircle2, color: "emerald" },
          { label: "Review Required", value: reviewNeededCount, icon: AlertCircle, color: "amber" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`p-3 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Employee Registry
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Found {filteredStaff.length} matching profiles
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name, role or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-hidden"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-6 pb-6 border-b border-slate-50 last:border-0">
                  <Skeleton className="h-14 w-14 rounded-2xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-8 w-24 rounded-xl" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest bg-slate-50/50">
                  <th className="px-8 py-5 text-left border-b border-slate-100">Personnel Info</th>
                  <th className="px-6 py-5 text-left border-b border-slate-100">Department</th>
                  <th className="px-6 py-5 text-left border-b border-slate-100">Competence</th>
                  <th className="px-6 py-5 text-left border-b border-slate-100">Registered On</th>
                  <th className="px-8 py-5 text-right border-b border-slate-100 whitespace-nowrap">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                    onClick={() => onCompetence && onCompetence(staff)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                          {staff.photo ? (
                            <ImageWithFallback
                              src={staff.photo}
                              alt={staff.name}
                              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm group-hover:shadow-md transition-all"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg border border-indigo-100">
                              {staff.name.charAt(0)}
                            </div>
                          )}
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${staff.status === 'Competent' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {staff.name}
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                            {staff.role} • <span className="text-indigo-400">#{staff.id}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider border border-slate-200 group-hover:bg-white transition-colors">
                        {staff.dept}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xs ${
                        staff.status === "Competent"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {staff.status === "Competent" ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {staff.status}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-xs font-bold text-slate-600">
                        {staff.joinDate}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">Standard Format</p>
                    </td>

                    <td className="px-8 py-5 text-right relative">
                      <button
                        onClick={(e) => toggleMenu(e, staff.id)}
                        className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-transparent hover:border-slate-100"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openMenuId === staff.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-12 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden ring-4 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Options</p>
                          </div>
                          {[
                            { label: "Competence", icon: ClipboardCheck, onClick: onCompetence, color: "indigo" },
                            { label: "Edit Profile", icon: Edit, onClick: onEdit, color: "slate" },
                            { label: "Permissions", icon: Shield, onClick: onPermissions, color: "emerald" },
                          ].map((item, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                item.onClick && item.onClick(staff);
                              }}
                              className={`w-full text-left px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-${item.color}-50 hover:text-${item.color}-600 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-0`}
                            >
                              <item.icon size={18} /> {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && filteredStaff.length > itemsPerPage && (
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-center">
            <CustomPagination
              count={Math.ceil(filteredStaff.length / itemsPerPage)}
              page={currentPage}
              onChange={(e, p) => setCurrentPage(p)}
            />
          </div>
        )}
        
        {!loading && filteredStaff.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="p-6 bg-slate-50 rounded-full mb-4">
              <Search className="text-slate-300" size={48} />
            </div>
            <h3 className="text-xl font-black text-slate-800">No staff found</h3>
            <p className="text-slate-500 max-w-xs mt-2 underline cursor-pointer" onClick={() => setSearchQuery("")}>
              Try adjusting your search terms or clear filters to see all employees.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffList;
