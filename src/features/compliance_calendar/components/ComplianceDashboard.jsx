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
  getAllLegalDocuments,
  getExpiringDocuments,
} from "../services/complianceService";

import { formatDueDate, sortByPriority } from "../utils/reminderUtils";

const StatusBadge = ({ type, label }) => {
  const styles = {
    upcoming: "bg-amber-100 text-amber-700",
    overdue: "bg-red-100 text-red-700",
    completed: "bg-emerald-100 text-emerald-700",
    expiring: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}
    >
      {label}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-slate-200 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-indigo-200 group cursor-pointer">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500 group-hover:text-slate-600 transition-colors">
          {label}
        </p>
        <p className="text-2xl font-semibold text-slate-900 mt-1 group-hover:text-indigo-600 transition-colors">
          {value}
        </p>
      </div>
      <Icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-500 transition-colors" />
    </div>
  </div>
);

const ComplianceDashboard = () => {
  const [stats, setStats] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [overdueEvents, setOverdueEvents] = useState([]);
  const [expiringDocs, setExpiringDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [allEvents, upcoming, overdue, , expiring] = await Promise.all([
        getAllEvents(),
        getUpcomingEvents(30),
        getOverdueEvents(),
        getAllLegalDocuments(),
        getExpiringDocuments(30),
      ]);

      setStats({
        total: allEvents.length,
        upcoming: upcoming.length,
        overdue: overdue.length,
        completed: allEvents.filter((e) => e.status === "completed").length,
      });

      setUpcomingEvents(sortByPriority(upcoming).slice(0, 5));
      setOverdueEvents(sortByPriority(overdue).slice(0, 5));
      setExpiringDocs(expiring.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="h-10 w-10 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPI Summary */}
      <section>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Compliance Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Alerts */}
      {(overdueEvents.length > 0 || expiringDocs.length > 0) && (
        <section className="border border-red-200 bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 font-medium">
            <AlertTriangle size={18} />
            Immediate Attention Required
          </div>
          <p className="text-sm text-red-600 mt-1">
            {overdueEvents.length} overdue events and {expiringDocs.length}{" "}
            documents nearing expiry.
          </p>
        </section>
      )}

      {/* Events */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Upcoming Events
          </h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming events.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-start p-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDueDate(event.dueDate)}
                    </p>
                  </div>
                  <StatusBadge type="upcoming" label="Upcoming" />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Overdue */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Overdue Events
          </h3>
          {overdueEvents.length === 0 ? (
            <p className="text-sm text-emerald-600">No overdue events.</p>
          ) : (
            <ul className="space-y-3">
              {overdueEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-start p-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {event.title}
                    </p>
                    <p className="text-xs text-red-600">
                      {formatDueDate(event.dueDate)}
                    </p>
                  </div>
                  <StatusBadge type="overdue" label="Overdue" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Expiring Documents */}
      {expiringDocs.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Documents Nearing Expiry
          </h3>
          <ul className="space-y-3">
            {expiringDocs.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-start p-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {doc.documentName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {doc.documentType} · Expires {doc.expiryDate}
                  </p>
                </div>
                <StatusBadge type="expiring" label="Expiring" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default ComplianceDashboard;
