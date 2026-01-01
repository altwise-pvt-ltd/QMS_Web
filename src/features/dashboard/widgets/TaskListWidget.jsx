import React from "react";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export const TaskListWidget = () => {
  const tasks = [
    {
      id: 1,
      title: "Review SOP-102 v4",
      due: "Today",
      type: "Approval",
      priority: "high",
    },
    {
      id: 2,
      title: "Internal Audit: Warehouse",
      due: "Tomorrow",
      type: "Audit",
      priority: "medium",
    },
    {
      id: 3,
      title: "Sign-off CAPA #4291",
      due: "Oct 24",
      type: "CAPA",
      priority: "low",
    },
    {
      id: 4,
      title: "Update Training Records",
      due: "Oct 28",
      type: "Training",
      priority: "medium",
    },
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case "Approval":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "Audit":
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-2.5">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer group"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Priority Indicator */}
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                task.priority === "high"
                  ? "bg-rose-500"
                  : task.priority === "medium"
                  ? "bg-amber-400"
                  : "bg-emerald-400"
              }`}
            />

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {task.title}
                </p>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-slate-400">{getTypeIcon(task.type)}</span>
                <p className="text-xs text-slate-400">{task.type}</p>
              </div>
            </div>

            {/* Due Date - Simple Text */}
            <span className="text-xs text-slate-500 flex-shrink-0">
              {task.due}
            </span>
          </div>
        </div>
      ))}
      <button className="w-full mt-3 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-medium py-2 rounded-lg transition-colors">
        View all 12 tasks →
      </button>
    </div>
  );
};

export default TaskListWidget;
