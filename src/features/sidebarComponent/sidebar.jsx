import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  ClipboardCheck,
  Users,
  Box,
  Settings,
  LogOut,
  ChevronDown,
  Presentation,
  Calendar,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Building2,
  Activity,
  ClipboardList,
  Briefcase,
  Truck,
  ShieldAlert,
} from "lucide-react";

/**
 * Sidebar component that provides navigation across the application.
 * It also displays the current user's profile and provides a sign-out mechanism.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isCollapsed - Whether the sidebar is in a collapsed state.
 * @param {Function} props.toggleSidebar - Function to toggle the collapsed state.
 */
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  // Extract user data and logout function from the global AuthContext
  const { user, logout } = useAuth();

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const location = useLocation();

  /**
   * Helper to check if a specific navigation path is currently active.
   * @param {string} path - The path to check.
   * @returns {boolean} True if the path matches the current location.
   */
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const isDocsRoute = location.pathname.startsWith("/documents");

  // Automatically close submenus (like Documents) when the sidebar is collapsed
  useEffect(() => {
    if (isCollapsed) setIsDocsOpen(false);
  }, [isCollapsed]);

  /**
   * Generates CSS classes for menu items based on their active/inactive state.
   * @param {string} path - The path associated with the menu item.
   * @returns {string} Tailwind CSS class string.
   */
  const menuItemClass = (path) =>
    `flex items-center px-3 py-2.5 rounded-xl group transition-all duration-300 relative overflow-hidden ${isActive(path)
      ? "bg-indigo-100 text-indigo-700 shadow-sm"
      : "text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-sm hover:scale-[1.02]"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen 
  bg-white text-slate-700 border-r border-indigo-100 shadow-xl
  transition-all duration-300 ease-in-out overflow-x-hidden
  ${isCollapsed ? "w-20" : "w-72"}`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col transition-all duration-300">
        {/* --- Logo Area with Animation --- */}
        <div
          onClick={toggleSidebar}
          className={`flex items-center pt-6 mb-8 px-4 cursor-pointer group/logo transition-all duration-300 ${isCollapsed ? "gap-0" : "gap-3"}`}
          title="Click to toggle sidebar"
        >
          <div className="min-w-10 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/50 group-hover/logo:shadow-indigo-500/80 group-hover/logo:scale-110 transition-all duration-300">
            Q
          </div>
          <span
            className={`text-2xl font-bold bg-indigo-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
          >
            QualiFlow
          </span>
        </div>

        {/* --- Scrollable Main Navigation --- */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 custom-scrollbar">
          <ul className="space-y-2 font-medium pb-4">
            {/* 1. Dashboard */}
            <li>
              <Link to="/dashboard" className={menuItemClass("/dashboard")}>
                {isActive("/dashboard") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
                )}
                <LayoutDashboard className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Dashboard
                </span>
              </Link>
            </li>

            {/* 2. Documents */}
            <li>
              <Link to="/documents" className={menuItemClass("/documents")}>
                {isActive("/documents") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
                )}
                <FileText className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Documents
                </span>
              </Link>
            </li>

            {/* 3. CAPA & Incidents */}
            <li>
              <Link to="/capa" className={menuItemClass("/capa")}>
                <ClipboardList className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  CAPA & Incidents
                </span>
              </Link>
            </li>

            {/* Entries Management */}
            <li>
              <Link
                to="/entries-management"
                className={menuItemClass("/entries-management")}
              >
                <ClipboardList className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Entries Management
                </span>
              </Link>
            </li>

            {/* 4. Compliance Calendar */}
            <li>
              <Link to="/compliance" className={menuItemClass("/compliance")}>
                <Calendar className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Compliance Calendar
                </span>
              </Link>
            </li>

            {/* 5. Management Review */}
            <li>
              <Link to="/mrm" className={menuItemClass("/mrm")}>
                {isActive("/mrm") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
                )}
                <Presentation className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Management Review
                </span>
              </Link>
            </li>

            {/* 6. Staff */}
            <li>
              <Link to="/staff" className={menuItemClass("/staff")}>
                {isActive("/staff") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
                )}
                <Users className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Staff
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/quality-indicators"
                className={menuItemClass("/quality-indicators")}
              >
                <BarChart3 className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Quality Indicators
                </span>
              </Link>
            </li>

            <li>
              <Link
                to="/risk-indicators"
                className={menuItemClass("/risk-indicators")}
              >
                <AlertTriangle className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Risk Indicators
                </span>
              </Link>
            </li>

            {/* 8. Training */}
            <li>
              <Link to="/training" className={menuItemClass("/training")}>
                <GraduationCap className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Training
                </span>
              </Link>
            </li>

            {/* 9. Department */}
            <li>
              <Link to="/department" className={menuItemClass("/department")}>
                <Building2 className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Department
                </span>
              </Link>
            </li>

            {/* 10. Instrument Calibration */}
            <li>
              <Link to="/instrument" className={menuItemClass("/instrument")}>
                <Activity className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Instrument Calibration
                </span>
              </Link>
            </li>

            {/* 11. Vendor Management */}
            <li>
              <Link to="/vendor" className={menuItemClass("/vendor")}>
                <Truck className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Vendor Management
                </span>
              </Link>
            </li>

            {/* 12. Risk Assessment */}
            <li>
              <Link
                to="/risk-assessment"
                className={menuItemClass("/risk-assessment")}
              >
                <ShieldAlert className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Risk Assessment
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* --- Static Bottom Section --- */}
        <div className="p-4 border-t-2 border-indigo-100 space-y-4 bg-white">
          {/* User Profile Card */}
          {!isCollapsed && user && (
            <div className="px-2 py-3 bg-indigo-50 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <img
                src={
                  user.avatar || "https://ui-avatars.com/api/?name=" + user.name
                }
                alt={user.name}
                className="w-10 h-10 rounded-lg shadow-sm border border-white"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user.role || "Administrator"}
                </p>
              </div>
            </div>
          )}

          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/settings" className={menuItemClass("/settings")}>
                <Settings className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Settings
                </span>
              </Link>
            </li>
            <li>
              <button
                onClick={logout}
                className="w-full flex items-center px-3 py-2.5 rounded-xl group transition-all duration-300 text-rose-600 hover:bg-linear-to-r hover:from-rose-50 hover:to-rose-100 hover:shadow-md hover:scale-[1.02] relative overflow-hidden"
              >
                <LogOut className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1" />
                <span
                  className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                      ? "w-0 opacity-0 ml-0"
                      : "w-auto opacity-100 ms-3"
                    }`}
                >
                  Sign Out
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
