import React from "react";
import { User, Fingerprint, Building2, Briefcase, Phone } from "lucide-react";

const EmployeeIdentification = ({ formData, handleInputChange }) => {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
      
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          1. Employee Identification
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { label: "Full Legal Name", name: "employeeName", value: formData.employeeName, icon: User, required: true },
          { label: "Employee System ID", name: "employeeId", value: formData.employeeId, icon: Fingerprint, required: true },
          { label: "Mapped Department", name: "department", value: formData.department, icon: Building2, readOnly: true, placeholder: "No Dept Assigned" },
          { label: "Designated Job Title", name: "jobTitle", value: formData.jobTitle, icon: Briefcase, readOnly: true },
          { label: "Contact Mobile", name: "mobileNumber", value: formData.mobileNumber, icon: Phone, readOnly: true, placeholder: "+91 00000 00000" },
        ].map((field, idx) => (
          <div key={idx} className="space-y-2 group">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
              <field.icon size={14} />
              {field.label} {field.required && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="text"
              name={field.name}
              required={field.required}
              value={field.value}
              onChange={field.readOnly ? undefined : handleInputChange}
              readOnly={field.readOnly}
              placeholder={field.placeholder}
              className={`w-full px-5 py-3.5 rounded-2xl text-sm font-bold transition-all border outline-hidden ${
                field.readOnly 
                ? "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed" 
                : "bg-white border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 shadow-xs"
              }`}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmployeeIdentification;
