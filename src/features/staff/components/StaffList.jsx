import React, { useState, useEffect, useRef } from "react";
import { Plus, MoreVertical, Edit, ClipboardCheck, Shield } from "lucide-react";
import { db } from "../../../db";
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
      // Fallback to local DB if available
      const localData = await db.staff.toArray();
      if (localData.length > 0) setStaffData(localData);
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

  return (
    <div
      className="bg-white rounded-[32px] border border-slate-100 shadow-sm h-full flex flex-col overflow-hidden"
      style={{ minHeight: "400px" }}
    >
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded-full" />
            Staff Directory
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage employees, competence, and documents.
          </p>
        </div>

      </div>

      <div className="overflow-visible p-4 flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-4 border-b border-slate-50 pb-4"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-50" />
                  <Skeleton className="h-3 w-37.5" />
                </div>
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                <th className="p-4">Employee</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4">Join Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {staffData
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group"
                  >
                    <td className="p-4 flex items-center gap-3">
                      {staff.photo ? (
                        <ImageWithFallback
                          src={staff.photo}
                          alt={staff.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-black">
                          {staff.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-800">
                          {staff.name}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                          {staff.role} • ID: {staff.id}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider border border-slate-200">
                        {staff.dept}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${staff.status === "Competent"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-100"
                          }`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold text-slate-500">
                        {staff.joinDate}
                      </span>
                    </td>

                    <td className="p-4 text-right relative">
                      <button
                        onClick={(e) => toggleMenu(e, staff.id)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenuId === staff.id && (
                        <div
                          ref={menuRef}
                          className="absolute right-10 top-10 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onCompetence && onCompetence(staff);
                            }}
                            className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                          >
                            <ClipboardCheck size={16} /> Competence
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onEdit && onEdit(staff);
                            }}
                            className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors border-t border-slate-50"
                          >
                            <Edit size={16} /> Edit Profile
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onPermissions && onPermissions(staff);
                            }}
                            className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 transition-colors border-t border-slate-50"
                          >
                            <Shield size={16} /> Permissions
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && staffData.length > itemsPerPage && (
        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-center">
          <CustomPagination
            count={Math.ceil(staffData.length / itemsPerPage)}
            page={currentPage}
            onChange={(e, p) => setCurrentPage(p)}
          />
        </div>
      )}
    </div>
  );
};

export default StaffList;

