import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getDashboardTasks } from "../services/taskWidgetService";
import { formatDueDate } from "../../compliance_calendar/utils/reminderUtils";

const PRIORITY_STYLES = {
  high: { dot: "bg-rose-500", text: "text-rose-600" },
  medium: { dot: "bg-amber-400", text: "text-amber-600" },
  low: { dot: "bg-emerald-400", text: "text-slate-500" },
};

export const TaskListWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const dashboardTasks = await getDashboardTasks(5);
      setTasks(dashboardTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "in-progress":
        return <Clock className="w-3.5 h-3.5" />;
      default:
        return <Calendar className="w-3.5 h-3.5" />;
    }
  };

  const handleViewAll = () => {
    navigate("/compliance");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 border-2 border-slate-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500">No upcoming compliance tasks</p>
        <button
          onClick={handleViewAll}
          className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View Compliance Calendar →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => {
        const priorityStyle =
          PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.low;

        return (
          <div
            key={task.id}
            onClick={handleViewAll}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Priority Indicator */}
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${priorityStyle.dot}`}
              />

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {task.title}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-slate-400">
                    {getTypeIcon(task.status)}
                  </span>
                  <p className="text-xs text-slate-400 capitalize">
                    {task.status.replace("-", " ")}
                  </p>
                </div>
              </div>

              {/* Due Date */}
              <span
                className={`text-xs shrink-0 font-medium ${
                  task.isOverdue ? "text-red-600" : priorityStyle.text
                }`}
              >
                {formatDueDate(task.dueDate)}
              </span>
            </div>
          </div>
        );
      })}
      <button
        onClick={handleViewAll}
        className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium py-2 rounded-lg transition-colors"
      >
        View Compliance Calendar →
      </button>
    </div>
  );
};

export default TaskListWidget;
