import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import staffService from "../staff/services/staffService";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { sidebarConfig } from "./sidebarConfig";

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
  const location = useLocation();

  const [isDocsOpen, setIsDocsOpen] = useState(false);

  /**
   * Helper to check if a specific navigation path is currently active.
   * @param {string} path - The path to check.
   * @returns {boolean} True if the path matches the current location.
   */
  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

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
    `flex items-center px-3 py-2.5 rounded-xl group transition-all duration-300 relative overflow-hidden ${isCollapsed ? "justify-center" : ""
    } ${isActive(path)
      ? "bg-indigo-100 text-indigo-700 shadow-sm"
      : "text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-sm hover:scale-[1.02]"
    }`;

  // Filter sidebar items based on user roles
  const filteredSidebarItems = sidebarConfig.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role);
  });

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen 
  bg-white text-slate-700 border-r border-indigo-100 shadow-xl
  transition-all duration-300 ease-in-out overflow-x-hidden
  ${isCollapsed ? "w-21.25" : "w-73.25"}`}
      aria-label="Sidebar"
    >
      <div className="h-full flex flex-col transition-all duration-300">
        {/* --- Logo Area with Animation --- */}
        <div
          onClick={toggleSidebar}
          className={`flex items-center pt-6 mb-8 cursor-pointer group/logo transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "gap-3 px-4"
            }`}
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
            {filteredSidebarItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={menuItemClass(item.path)}>
                  {isActive(item.path) && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full"></span>
                  )}
                  <item.icon className="min-w-5 w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-300 font-medium ${isCollapsed
                        ? "w-0 opacity-0 ml-0"
                        : "w-auto opacity-100 ms-3"
                      }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Static Bottom Section --- */}
        <div className="p-4 border-t-2 border-indigo-100 space-y-4 bg-white">
          {/* User Profile Card */}
          {user && (
            <div
              className={`px-2 py-3 bg-indigo-50 rounded-xl flex items-center transition-all animate-in fade-in slide-in-from-bottom-2 duration-500 ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <ImageWithFallback
                src={
                  staffService.getAssetUrl(user.avatar) ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`
                }
                alt={user.name}
                className="w-10 h-10 rounded-lg shadow-sm border border-white object-cover"
              />
              <div
                className={`flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"}`}
              >
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

