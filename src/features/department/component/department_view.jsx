import React, { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { getDepartmentWiseStaff } from "../services/departmentService";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";

/**
 * DepartmentView - Displays a list of employees for a specific department
 *
 * @param {Object} props
 * @param {string|number} props.deptId - The ID of the department to filter employees for
 */
export const DepartmentView = ({ deptId, deptName }) => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDepartmentStaff = async () => {
            // Must have either ID or Name to fetch
            if (!deptId && !deptName) return;

            try {
                setLoading(true);
                setError(null);
                setStaff([]); // Reset immediately on change

                // Fetch the full department-wise staff list
                const responseData = await getDepartmentWiseStaff();

                // The API returns an array: [{ departmentId, departmentName, staffList: [] }, ...]
                const fullList = Array.isArray(responseData) ? responseData : (responseData?.value || []);

                // Find the specific department we need using the ID
                const targetDept = fullList.find(d => String(d.departmentId) === String(deptId));

                let rawStaff = [];
                if (targetDept && targetDept.staffList) {
                    rawStaff = targetDept.staffList;
                } else if (deptName) {
                    // Fallback to name search if ID doesn't match
                    const cleanName = deptName.trim().toLowerCase();
                    const nameMatch = fullList.find(d => d.departmentName?.trim().toLowerCase() === cleanName);
                    if (nameMatch && nameMatch.staffList) {
                        rawStaff = nameMatch.staffList;
                    }
                }

                // Map raw data to consistent staff format
                const mappedStaff = rawStaff.map((emp, idx) => ({
                    id: emp.staffId || emp.id || `staff-${idx}`,
                    firstName: emp.firstName,
                    lastName: emp.lastName,
                    name: emp.fullName || emp.staffName || emp.name ||
                        ((emp.firstName || emp.lastName) ? `${emp.firstName || ""} ${emp.lastName || ""}`.trim() : "Unknown Member"),
                    role: emp.jobTitle || emp.role || emp.designation || "Staff Member",
                    email: emp.workEmail || emp.email || emp.professionalEmail,
                    avatar: emp.profilePicturePath || emp.avatar || emp.photoPath
                }));

                setStaff(mappedStaff);
            } catch (err) {
                console.error("Error fetching department staff:", err);
                setError("Failed to load department staff");
            } finally {
                setLoading(false);
            }
        };

        fetchDepartmentStaff();
    }, [deptId, deptName]);

    if (loading) {
        return (
            <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-indigo-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Synchronizing Roster...</p>
            </div>
        );
    }

    return (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {deptName || "Department"} Roster
                </h5>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                    {staff.length} Staff
                </span>
            </div>

            {error && (
                <p className="text-xs text-red-500 text-center py-4 font-medium">{error}</p>
            )}

            {staff.length > 0 ? (
                <div className="space-y-3">
                    {staff.map(emp => (
                        <div key={emp.id} className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group">
                            <ImageWithFallback
                                src={emp.avatar}
                                alt={emp.name}
                                className="w-10 h-10 rounded-xl border-2 border-white shadow-sm object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                                    {emp.name}
                                </p>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-slate-500 font-medium truncate flex items-center gap-1">
                                        <ShieldCheck size={10} className="text-emerald-500" />
                                        {emp.role}
                                    </p>
                                </div>
                            </div>
                            <a
                                href={`mailto:${emp.email}`}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all"
                                title={emp.email}
                            >
                                <Mail size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-50" />
                    <p className="text-xs text-slate-400 font-medium">No team members assigned yet</p>
                </div>
            )}
        </div>
    );
};

export default DepartmentView;
