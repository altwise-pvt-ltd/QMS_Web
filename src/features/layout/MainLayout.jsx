import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebarComponent/sidebar";
import { AlertProvider } from "../../services/alert/AlertProvider";

const MainLayout = () => {
  // State is managed here so both Sidebar and Content can react to it
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Global Alert Provider */}
      <AlertProvider />

      {/* Pass state and toggle function to Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

      {/* Adjust margin based on collapsed state */}
      <div
        className={`flex-1 p-4 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "ml-20" : "ml-72"
          }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
