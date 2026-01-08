import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Shield,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";

// Imports from your new Utils folder
import BentoCard from "./utils/BentoCard";
import HealthScoreWidget from "./widgets/HealthScoreWidget";
import TaskListWidget from "./widgets/TaskListWidget";
import CapaChartWidget from "./widgets/CapaChartWidget";
import ActivityFeedWidget from "./widgets/ActivityFeedWidget";
import TrainingComplianceWidget from "./widgets/TrainingComplianceWidget";
import RiskWidget from "./widgets/RiskWidget";
import DeviationsWidget from "./widgets/DeviationsWidget";
import AuditReadinessWidget from "./widgets/AuditReadinessWidget";
import DocumentStatusWidget from "./widgets/DocumentStatusWidget";

const QMSDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Quality Overview
          </h1>
          <p className="text-slate-500">Welcome back, Quality Manager</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-sm font-medium shadow-sm">
            <Calendar className="w-4 h-4" /> Date Range
          </button>
          <button
            onClick={() => navigate("/incidents/new")}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-indigo-300/50 text-sm font-medium"
          >
            <FileText className="w-4 h-4" /> New Incident
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-auto">
        {/* 1. HERO - System Health (2x2) */}
        <BentoCard
          title="Overall Health"
          icon={Activity}
          className="md:col-span-2 md:row-span-2"
        >
          <HealthScoreWidget />
        </BentoCard>

        {/* 2. Training Compliance (1x1) */}
        <BentoCard title="Training" icon={Users}>
          <TrainingComplianceWidget />
        </BentoCard>

        {/* 3. Document Status (1x1) */}
        <BentoCard title="Document Status" icon={FileText}>
          <DocumentStatusWidget action={""} />
        </BentoCard>

        {/* 4. Upcoming Audit (1x2 Vertical)   */}
        <BentoCard
          title="Next Audit"
          icon={Clock}
          className="bg-linear-to-br from-indigo-500 to-purple-600 text-white border-none row-span-2"
        >
          <div className="flex flex-col h-full justify-center items-center text-center text-white">
            <div className="text-sm opacity-80 uppercase tracking-wide">
              ISO 9001
            </div>
            <div className="text-3xl font-bold mt-1">12 Days</div>
            <div className="text-sm opacity-80 mt-2">Oct 15, 2025</div>
          </div>
        </BentoCard>

        {/* 5. My Tasks (1x2 Vertical) */}
        <BentoCard
          title="My Actions"
          icon={CheckCircle}
          className="xl:col-span-1 xl:row-span-2 md:col-span-1 md:row-span-2"
          action={
            <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-bold">
              3 Urgent
            </span>
          }
        >
          <TaskListWidget />
        </BentoCard>

        {/* 6. Incident Trends (2x1 Wide) */}
        <BentoCard
          title="Incident Trends"
          icon={TrendingUp}
          className="md:col-span-2 xl:col-span-2"
        >
          <CapaChartWidget />
        </BentoCard>

        {/* 7. Activity Feed (1x2 Vertical) */}
        <BentoCard
          title="Recent Activity"
          icon={Clock}
          className="xl:col-span-1 xl:row-span-2 md:col-span-1 md:row-span-2"
        >
          <ActivityFeedWidget />
        </BentoCard>

        {/* 8. Risk Assessment (1x1) */}
        <BentoCard title="Risk Assessment" icon={Shield}>
          <RiskWidget />
        </BentoCard>

        {/* 9. Deviations (1x1) */}
        <BentoCard title="Deviations" icon={AlertCircle}>
          <DeviationsWidget />
        </BentoCard>

        {/* 10. Audit Readiness (1x1) */}
        <BentoCard title="Audit Readiness" icon={ClipboardCheck}>
          <AuditReadinessWidget />
        </BentoCard>

        {/* 11. Supplier Quality (1x1) */}
        <BentoCard title="Supplier Quality" icon={AlertTriangle}>
          <div className="flex flex-col h-full justify-center">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-bold text-slate-800">89%</span>
              <span className="text-xs text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                Warning
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Vendor B requires review
            </p>
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default QMSDashboard;
