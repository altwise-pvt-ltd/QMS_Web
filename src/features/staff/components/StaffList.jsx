import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  MoreVertical,
  Briefcase,
  Edit,
  ClipboardCheck,
  Trash2,
} from "lucide-react";
import { db } from "../../../db";

const StaffList = ({ onAddNew, onEdit, onCompetence }) => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await db.staff.toArray();
      if (data.length === 0) {
        const initialStaff = [
          {
            name: "Alice Johnson",
            role: "QA Lead",
            dept: "Quality",
            status: "Competent",
            joinDate: "2022-01-01",
          },
          {
            name: "Bob Smith",
            role: "Developer",
            dept: "Engineering",
            status: "Needs Training",
            joinDate: "2024-05-01",
          },
          {
            name: "Charlie Davis",
            role: "HR Manager",
            dept: "HR",
            status: "Competent",
            joinDate: "2022-04-22",
          },
        ];
        await db.staff.bulkAdd(initialStaff);
        const seededData = await db.staff.toArray();
        setStaffData(seededData);
      } else {
        setStaffData(data);
      }
    } catch (error) {
      console.error("Error loading staff:", error);
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
      className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col"
      style={{ minHeight: "400px" }}
    >
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Staff Directory</h2>
          <p className="text-sm text-gray-500">
            Manage employees, competence, and documents.
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="bg-blue-600 text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md transition-all"
        >
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      <div className="overflow-visible p-2 flex-1">
        {loading ? (
          <div className="p-20 text-center text-slate-400 font-medium">
            Syncing with directory...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Join Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {staffData.map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-blue-50/50 transition-colors border-b border-gray-50 group"
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {staff.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {staff.role} • ID: {staff.id}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                      {staff.dept}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        staff.status === "Competent"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-500">
                      {staff.joinDate}
                    </span>
                  </td>

                  <td className="p-4 text-right relative">
                    <button
                      onClick={(e) => toggleMenu(e, staff.id)}
                      className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {openMenuId === staff.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-8 top-8 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onCompetence && onCompetence(staff);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                        >
                          <ClipboardCheck size={16} /> Competence
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                            onEdit && onEdit(staff);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors border-t border-gray-100"
                        >
                          <Edit size={16} /> Edit
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
    </div>
  );
};

export default StaffList;
