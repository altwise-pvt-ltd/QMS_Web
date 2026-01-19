import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Calendar,
  TrendingUp,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { getAllEvents } from "../compliance_calendar/services/complianceService";
import { db } from "../../db";
import TrainingMatrix from "./components/TrainingMatrix";
import ScheduleTrainingModal from "./components/ScheduleTrainingModal";

const Training = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const allEvents = await getAllEvents();
      const eventTypes = await db.compliance_event_types.toArray();
      const trainingType = eventTypes.find((t) => t.name === "Training");

      if (trainingType) {
        const trainingEvents = allEvents.filter(
          (e) => e.eventTypeId === trainingType.id,
        );
        setTrainings(
          trainingEvents.sort(
            (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
          ),
        );
      }
    } catch (error) {
      console.error("Error fetching trainings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrainings = trainings.filter((t) => {
    const matchesSearch = t.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || t.status === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: trainings.length,
    upcoming: trainings.filter((t) => t.status === "pending").length,
    inProgress: trainings.filter((t) => t.status === "in-progress").length,
    completed: trainings.filter((t) => t.status === "completed").length,
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
      <div
        className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${color}`}
      ></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <GraduationCap className="text-indigo-600" size={32} />
            Training Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            Personnel competency and training schedules
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-gray-600 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all outline-none"
        >
          <Plus size={20} />
          Schedule Training
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Modules"
          value={stats.total}
          icon={GraduationCap}
          color="bg-indigo-500"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcoming}
          icon={Clock}
          color="bg-amber-500"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Training Schedule */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-xl font-bold text-slate-800">
                Training Schedule
              </h2>
              <div className="relative w-full sm:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search trainings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Training Module
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center text-nowrap">
                    Due Date
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                    Status
                  </th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-20 text-center text-slate-400 font-medium"
                    >
                      Synced with Compliance Calendar...
                    </td>
                  </tr>
                ) : filteredTrainings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-20 text-center text-slate-400 font-medium"
                    >
                      No training events found in calendar
                    </td>
                  </tr>
                ) : (
                  filteredTrainings.map((training) => (
                    <tr
                      key={training.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <GraduationCap size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {training.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              Scheduled by: {training.assignedTo}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span className="text-sm font-bold text-slate-700">
                          {new Date(training.dueDate).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            training.status === "completed"
                              ? "bg-emerald-50 text-emerald-600"
                              : training.status === "in-progress"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {training.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-gray-600 transition-all shadow-sm">
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competency Matrix */}
        <div className="xl:col-span-1">
          <TrainingMatrix />
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleTrainingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchTrainings();
        }}
      />
    </div>
  );
};

export default Training;
