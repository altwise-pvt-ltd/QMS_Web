import React from "react";
import { User, Mail, ShieldCheck } from "lucide-react";
import { EMPLOYEES } from "../emp_data";
import ImageWithFallback from "../../../components/ui/ImageWithFallback";

/**
 * DepartmentView - Displays a list of employees for a specific department
 *
 * @param {Object} props
 * @param {string|number} props.deptId - The ID of the department to filter employees for
 */
export const DepartmentView = ({ deptId }) => {
  const filteredEmployees = EMPLOYEES.filter((emp) => emp.deptId === deptId);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Team Members
        </h5>
        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
          {filteredEmployees.length} Staff
        </span>
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="space-y-3">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group"
            >
              <ImageWithFallback
                src={
                  emp.avatar || `https://ui-avatars.com/api/?name=${emp.name}`
                }
                alt={emp.name}
                className="w-10 h-10 rounded-xl border-2 border-white shadow-sm"
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
          <p className="text-xs text-slate-400 font-medium">
            No team members assigned yet
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentView;
