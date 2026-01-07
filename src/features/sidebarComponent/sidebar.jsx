import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const isDocsRoute = location.pathname.startsWith("/documents");

  // Auto-close submenus when sidebar collapses
  useEffect(() => {
    if (isCollapsed) setIsDocsOpen(false);
  }, [isCollapsed]);

  // Common class for menu items with enhanced styling
  const menuItemClass = (path) =>
    `flex items-center px-3 py-2.5 rounded-xl group transition-all duration-300 relative overflow-hidden ${
      isActive(path)
        ? "bg-indigo-100 text-indigo-700 shadow-sm"
        : "text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-sm hover:scale-[1.02]"
    }`;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen 
  bg-white text-slate-700 border-r border-indigo-100 shadow-xl
  transition-all duration-300 ease-in-out
  ${isCollapsed ? "w-20" : "w-72"}`}
      aria-label="Sidebar"
    >
      <div className="h-full px-4 py-6 overflow-y-auto flex flex-col">
        {/* --- Logo Area with Animation --- */}
        <div
          onClick={toggleSidebar}
          className="flex items-center gap-3 mb-8 px-2 cursor-pointer group/logo"
          title="Click to toggle sidebar"
        >
          <div className="min-w-10 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-indigo-500/50 group-hover/logo:shadow-indigo-500/80 group-hover/logo:scale-110 transition-all duration-300">
            Q
          </div>
          <span
            className={`text-2xl font-bold bg-indigo-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            QualiFlow
          </span>
        </div>

        {/* --- Main Navigation --- */}
        <ul className="space-y-2 font-medium flex-1">
          {/* 1. Dashboard */}
          <li>
            <Link to="/dashboard" className={menuItemClass("/dashboard")}>
              {/* Active indicator bar */}
              {isActive("/dashboard") && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
              )}
              <LayoutDashboard className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span
                className={`ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Dashboard
              </span>

              {/* Enhanced Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-indigo-600 text-white shadow-xl border border-indigo-500 text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap transition-all duration-300 group-hover:ml-2">
                  Dashboard
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-indigo-600"></span>
                </div>
              )}
            </Link>
          </li>

          {/* 2. Documents (Enhanced Dropdown) */}
          <li>
            <button
              type="button"
              onClick={() => !isCollapsed && setIsDocsOpen(!isDocsOpen)}
              className={`flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isDocsRoute
                  ? "bg-indigo-100 text-indigo-400 shadow-md scale-[1.02]"
                  : "text-slate-600 hover:bg-indigo-100 hover:text-indigo-400 hover:shadow-md hover:scale-[1.02]"
              }`}
            >
              <FileText
                className={`min-w-5 w-5 h-5 transition-all duration-300 ${
                  isDocsOpen
                    ? "scale-110 rotate-3"
                    : "group-hover:scale-110 group-hover:rotate-3"
                }`}
              />
              <span
                className={`flex-1 ms-3 text-left whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Documents
              </span>
              {!isCollapsed && (
                <ChevronDown
                  className={`w-4 h-4 transition-all duration-300 ${
                    isDocsOpen ? "rotate-180 text-indigo-600" : "text-slate-400"
                  }`}
                />
              )}
            </button>

            {/* Submenu with slide animation */}
            <ul
              className={`overflow-hidden transition-all duration-300 ${
                isDocsOpen && !isCollapsed ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <li className="ml-2 border-l-2 border-indigo-200 pl-4 py-1">
                <Link
                  to="/documents/saved"
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-600 rounded-lg transition-all duration-300 hover:text-indigo-700 hover:bg-indigo-50 hover:translate-x-1 group/sub"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mr-3 group-hover/sub:bg-indigo-600 group-hover/sub:scale-150 transition-all duration-300"></span>
                  <span className="font-medium">Saved Documents</span>
                </Link>
              </li>
              <li className="ml-2 border-l-2 border-indigo-200 pl-4 py-1">
                <Link
                  to="/documents/sops"
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-600 rounded-lg transition-all duration-300 hover:text-indigo-700 hover:bg-indigo-50 hover:translate-x-1 group/sub"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mr-3 group-hover/sub:bg-indigo-600 group-hover/sub:scale-150 transition-all duration-300"></span>
                  <span className="font-medium">SOPs</span>
                </Link>
              </li>
              <li className="ml-2 border-l-2 border-indigo-200 pl-4 py-1">
                <Link
                  to="/documents/policies"
                  className="flex items-center w-full px-3 py-2 text-sm text-slate-600 rounded-lg transition-all duration-300 hover:text-indigo-700 hover:bg-indigo-50 hover:translate-x-1 group/sub"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 mr-3 group-hover/sub:bg-indigo-600 group-hover/sub:scale-150 transition-all duration-300"></span>
                  <span className="font-medium">Policies</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* 3. CAPA with enhanced badge */}
          <li>
            <Link to="/capa" className={menuItemClass("/capa")}>
              {isActive("/capa") && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
              )}
              <AlertTriangle className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span
                className={`flex-1 ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                CAPA & Incidents
              </span>
              {!isCollapsed && (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-linear-to-r from-rose-500 to-rose-600 rounded-full shadow-lg shadow-rose-500/50 animate-pulse"></span>
              )}
            </Link>
          </li>

          {/* 4. Audits */}
          <li>
            <Link to="/audits" className={menuItemClass("/audits")}>
              {isActive("/audits") && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
              )}
              <ClipboardCheck className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span
                className={`flex-1 ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Audits
              </span>
            </Link>
          </li>

          {/* 5. Training */}
          <li>
            <Link to="/training" className={menuItemClass("/training")}>
              {isActive("/training") && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
              )}
              <Users className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span
                className={`flex-1 ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Training
              </span>
            </Link>
          </li>

          {/* 6. Suppliers */}
          <li>
            <Link to="/suppliers" className={menuItemClass("/suppliers")}>
              {isActive("/suppliers") && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
              )}
              <Box className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
              <span
                className={`flex-1 ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              >
                Suppliers
              </span>
            </Link>
          </li>
        </ul>

        {/* --- Bottom Section with Divider --- */}
        <div className="pt-4 mt-4 border-t-2 border-indigo-100">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="/settings" className={menuItemClass("/settings")}>
                {isActive("/settings") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></span>
                )}
                <Settings className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-90" />
                <span
                  className={`ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  Settings
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className="flex items-center px-3 py-2.5 rounded-xl group transition-all duration-300 text-rose-600 hover:bg-linear-to-r hover:from-rose-50 hover:to-rose-100 hover:shadow-md hover:scale-[1.02] relative overflow-hidden"
              >
                <LogOut className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-translate-x-1" />
                <span
                  className={`ms-3 whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${
                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  Sign Out
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
