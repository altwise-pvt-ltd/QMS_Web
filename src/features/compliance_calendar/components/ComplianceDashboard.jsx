import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  CalendarDays,
} from "lucide-react";

import {
  getAllEvents,
  getUpcomingEvents,
  getOverdueEvents,
} from "../services/complianceService";

import { formatDueDate, sortByPriority } from "../utils/reminderUtils";

const StatusBadge = ({ type, label }) => {
  const styles = {
    upcoming: "bg-amber-50 text-amber-600 border-amber-100",
    overdue: "bg-red-50 text-red-600 border-red-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    expiring: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span
      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${styles[type]}`}
    >
      {label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 hover:border-indigo-100 group cursor-pointer relative overflow-hidden">
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase font-black tracking-[0.15em] text-slate-400 group-hover:text-slate-500 transition-colors">
          {label}
        </p>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
        </div>
      </div>
      <p className="text-4xl font-black text-slate-900 group-hover:text-indigo-600 transition-all duration-300 tracking-tight">
        {value}
      </p>
    </div>
  </div>
);

const ComplianceDashboard = () => {
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [overdueEvents, setOverdueEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allEvents, upcoming, overdue] = await Promise.all([
        getAllEvents(),
        getUpcomingEvents(30),
        getOverdueEvents(),
      ]);

      setStats({
        total: allEvents.length,
        upcoming: upcoming.length,
        overdue: overdue.length,
        completed: allEvents.filter((e) => e.status === "completed").length,
      });

      setUpcomingEvents(sortByPriority(upcoming).slice(0, 5));
      setOverdueEvents(sortByPriority(overdue).slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-12 w-12 border-[3px] border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Summary */}
      <section>
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Compliance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={CalendarDays}
            label="Total Events"
            value={stats.total}
          />
          <StatCard
            icon={Clock}
            label="Upcoming (30 Days)"
            value={stats.upcoming}
          />
          <StatCard
            icon={AlertTriangle}
            label="Overdue"
            value={stats.overdue}
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completed}
          />
        </div>
      </section>

      {overdueEvents.length > 0 && (
        <section className="bg-red-50/50 border border-red-100 rounded-2xl p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-center gap-3 text-red-700 font-bold">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <AlertTriangle size={16} />
            </div>
            Immediate Attention Required
          </div>
          <p className="text-sm text-red-600/80 mt-2 ml-10 font-medium">
            <span className="font-bold text-red-700">
              {overdueEvents.length}
            </span>{" "}
            overdue events.
          </p>
        </section>
      )}

      {/* Events */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Upcoming */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            Upcoming Events
          </h3>
          <div className="space-y-1">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-2">
                No upcoming events.
              </p>
            ) : (
              <div className="divide-y divide-slate-50">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group flex justify-between items-center py-3 px-2 hover:bg-slate-50/50 rounded-xl transition-all duration-200"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">
                        {formatDueDate(event.dueDate)}
                      </p>
                    </div>
                    <StatusBadge type="upcoming" label="Upcoming" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Overdue */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            Overdue Events
          </h3>
          <div className="space-y-1">
            {overdueEvents.length === 0 ? (
              <p className="text-sm text-emerald-500 font-medium py-2">
                No overdue events 🎉
              </p>
            ) : (
              <div className="divide-y divide-slate-50">
                {overdueEvents.map((event) => (
                  <div
                    key={event.id}
                    className="group flex justify-between items-center py-3 px-2 hover:bg-red-50/30 rounded-xl transition-all duration-200"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-800 group-hover:text-red-700 transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-red-500/80 mt-1 font-bold">
                        {formatDueDate(event.dueDate)}
                      </p>
                    </div>
                    <StatusBadge type="overdue" label="Overdue" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComplianceDashboard;
