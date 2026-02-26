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
  LayoutDashboard as DashboardIcon,
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
import NextAuditWidget from "./widgets/NextAuditWidget";
import SupplierQualityWidget from "./widgets/SupplierQualityWidget";

const QMSDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-8 lg:p-12 w-full min-h-screen bg-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <DashboardIcon className="text-indigo-600" size={32} />
            Quality Overview
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">Welcome back, Quality Manager</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-indigo-300/50 text-sm font-medium">
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
          <NextAuditWidget />
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
          <SupplierQualityWidget />
        </BentoCard>
      </div>
    </div>
  );
};

export default QMSDashboard;

