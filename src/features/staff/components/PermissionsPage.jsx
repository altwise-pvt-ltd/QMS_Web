import React, { useState } from "react";
import {
  Search,
  Shield,
  MoreVertical,
  Edit3,
  Lock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Save,
  User,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Mock Data ---
const INITIAL_USERS = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    email: "sarah.c@labqms.com",
    role: "Quality Manager",
    dept: "Quality Assurance",
    status: "Active",
    avatar: "SC",
  },
  {
    id: 2,
    name: "James Wilson",
    email: "j.wilson@labqms.com",
    role: "Lab Technician",
    dept: "Microbiology",
    status: "Active",
    avatar: "JW",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "elena.r@labqms.com",
    role: "Auditor",
    dept: "Compliance",
    status: "Inactive",
    avatar: "ER",
  },
];

const PERMISSION_MODULES = [
  {
    name: "Document Control (SOPs)",
    description: "Manage standard operating procedures and policies.",
    rights: [
      { id: "doc_view", label: "View Documents" },
      { id: "doc_create", label: "Create/Edit Drafts" },
      { id: "doc_approve", label: "Final Approval Authority", danger: true },
      { id: "doc_archive", label: "Archive/Obsolete" },
    ],
  },
  {
    name: "CAPA & Non-Conformance",
    description: "Handle corrective actions and root cause analysis.",
    rights: [
      { id: "capa_initiate", label: "Initiate Ticket" },
      { id: "capa_investigate", label: "Perform Investigation" },
      { id: "capa_close", label: "Close Out CAPA", danger: true },
    ],
  },
  {
    name: "User Management",
    description: "Administer system users and settings.",
    rights: [
      { id: "user_manage", label: "Manage Accounts", danger: true },
      { id: "audit_logs", label: "View Audit Logs" },
    ],
  },
];

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Component ---
const PermissionsPage = ({ staff = null, standalone = true }) => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUser, setSelectedUser] = useState(staff || null);
  const [activePermissions, setActivePermissions] = useState([
    "doc_view",
    "capa_initiate",
  ]); // Mock existing permissions

  // Toggle a specific permission ID
  const togglePermission = (id) => {
    setActivePermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  // If we are in non-standalone mode (embedded in StaffModule), return just the drawer content or adapted UI
  return (
    <div
      className={cn(
        "bg-slate-50 flex gap-6 font-sans text-slate-800",
        standalone ? "min-h-screen p-6" : "h-full",
      )}
    >
      {/* --- LEFT PANEL: User List --- */}
      {standalone && (
        <div
          className={cn(
            "flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col transition-all duration-500",
            selectedUser ? "w-1/2" : "w-full",
          )}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Staff Directory
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Manage access rights and roles
              </p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-100 flex items-center gap-2">
              <User size={16} /> Add Staff
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-4 bg-slate-50/50 flex gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, email or role..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Table List */}
          <div className="overflow-y-auto flex-1 p-2">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={cn(
                  "group flex items-center justify-between p-4 mb-2 rounded-xl cursor-pointer border transition-all",
                  selectedUser?.id === user.id
                    ? "bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200"
                    : "bg-white border-transparent hover:border-slate-200 hover:shadow-md",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                      selectedUser?.id === user.id
                        ? "bg-indigo-200 text-indigo-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {user.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700">{user.name}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="hidden md:block px-2 py-1 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                  <ChevronRight
                    size={18}
                    className={cn(
                      "transition-transform text-slate-300",
                      selectedUser?.id === user.id
                        ? "rotate-90 text-indigo-500"
                        : "group-hover:translate-x-1",
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- RIGHT PANEL: Permission Drawer --- */}
      {selectedUser && (
        <div
          className={cn(
            "bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col transition-all duration-300",
            standalone
              ? "w-[450px] animate-in slide-in-from-right-10"
              : "flex-1 max-w-4xl mx-auto",
          )}
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg shadow-lg shadow-indigo-200">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedUser.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        selectedUser.status === "Active"
                          ? "bg-emerald-500"
                          : "bg-slate-300",
                      )}
                    />
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedUser.role} • {selectedUser.dept}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                Reset Password
              </button>
              <button className="flex-1 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border-rose-200 shadow-sm transition-all">
                Deactivate User
              </button>
            </div>
          </div>

          {/* Permissions Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {PERMISSION_MODULES.map((module, idx) => (
              <div key={idx}>
                <div className="mb-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Shield size={14} className="text-indigo-500" />
                    {module.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {module.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {module.rights.map((right) => {
                    const isEnabled = activePermissions.includes(right.id);
                    return (
                      <label
                        key={right.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                          isEnabled
                            ? "bg-indigo-50/50 border-indigo-200"
                            : "bg-white border-slate-100 hover:border-slate-200",
                        )}
                      >
                        <span
                          className={cn(
                            "text-sm font-medium",
                            right.danger && "text-rose-600",
                          )}
                        >
                          {right.label}
                        </span>

                        <div className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isEnabled}
                            onChange={() => togglePermission(right.id)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-white rounded-b-2xl">
            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-gray-600 rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
              <Save size={18} />
              Save Permissions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsPage;
