import React, { useState, useEffect } from "react";
import {
  Calendar,
  List,
  LayoutDashboard,
  FileText,
  CalendarDays,
} from "lucide-react";

import ComplianceDashboard from "./components/ComplianceDashboard";
import EventList from "./components/EventList";
import EventCalendar from "./components/EventCalendar";
import DocumentList from "./components/DocumentList";
import { initializeEventTypes } from "./services/complianceService";
import { seedComplianceData } from "./utils/seedData";
import { addExpiryDatesToDocuments } from "./utils/documentMigration";

const ComplianceCalendarPage = () => {
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    const initializeData = async () => {
      await initializeEventTypes();
      await seedComplianceData();
      await addExpiryDatesToDocuments();
    };
    initializeData();
  }, []);

  const views = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "calendar", label: "Compliance Calendar", icon: CalendarDays },
    { id: "events", label: "Events & Obligations", icon: List },
    { id: "documents", label: "Controlled Documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Application Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Compliance Management System
                </h1>
                <p className="text-xs text-slate-500">
                  Calendar & Regulatory Tracking
                </p>
              </div>
            </div>
          </div>

          {/* Module Navigation */}
          <nav className="flex gap-2 mt-2">
            {views.map((view) => {
              const Icon = view.icon;
              const isActive = activeView === view.id;

              return (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-md border transition-all ${
                    isActive
                      ? "bg-slate-50 border-slate-200 border-b-slate-50 text-indigo-600"
                      : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={16} />
                  {view.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Workspace */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
          {activeView === "dashboard" && <ComplianceDashboard />}
          {activeView === "calendar" && <EventCalendar />}
          {activeView === "events" && <EventList />}
          {activeView === "documents" && <DocumentList />}
        </div>
      </main>
    </div>
  );
};

export default ComplianceCalendarPage;
