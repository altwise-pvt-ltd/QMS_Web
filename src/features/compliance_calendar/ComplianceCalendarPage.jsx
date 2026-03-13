import React, { useState, useEffect } from "react";
import {
  Calendar,
  List,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";


import ComplianceDashboard from "./components/ComplianceDashboard";
import EventList from "./components/EventList";
import EventCalendar from "./components/EventCalendar";


const ComplianceCalendarPage = () => {
  const [activeView, setActiveView] = useState("dashboard");

  const views = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "calendar", label: "Compliance Calendar", icon: CalendarDays },
    { id: "events", label: "Events & Obligations", icon: List },
  ];


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Application Header */}
      <header className="pt-4 md:pt-6 pb-2 sticky top-0 z-20 bg-slate-50/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 md:p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100">
                  <Calendar className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                    Compliance Management
                  </h1>
                  <p className="text-slate-500 mt-1 font-medium text-sm md:text-lg leading-relaxed">
                    Calendar & Regulatory Tracking
                  </p>
                </div>
              </div>
            </div>

            {/* Module Navigation - Pill Style */}
            <nav className="flex flex-wrap gap-2">
              {views.map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.id;

                return (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-xl border transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-50/50 border-indigo-600 text-indigo-600 shadow-sm shadow-indigo-100/50"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        isActive ? "text-indigo-600" : "text-slate-400"
                      }
                    />
                    {view.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="mt-4 md:mt-6 pb-6 md:pb-8 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl md:rounded-[2.5rem] shadow-sm shadow-slate-200/40 p-5 md:p-8">
            {activeView === "dashboard" && <ComplianceDashboard />}
            {activeView === "calendar" && <EventCalendar />}
            {activeView === "events" && <EventList />}
          </div>

        </div>
      </main>
    </div>
  );
};

export default ComplianceCalendarPage;
