import {
  getUpcomingEvents,
  getOverdueEvents,
} from "../../compliance_calendar/services/complianceService";
import { daysUntilDue } from "../../compliance_calendar/utils/reminderUtils";

/**
 * Get dashboard tasks from compliance calendar
 * Combines overdue and upcoming events, sorted by priority
 * @param {number} limit - Maximum number of tasks to return (default: 5)
 * @returns {Promise<Array>} Array of tasks with priority and overdue status
 */
export const getDashboardTasks = async (limit = 5) => {
  const [upcoming, overdue] = await Promise.all([
    getUpcomingEvents(30),
    getOverdueEvents(),
  ]);

  // Combine overdue and upcoming events with priority calculation
  const allTasks = [
    // Overdue events always have high priority
    ...overdue.map((e) => ({ ...e, isOverdue: true, priority: "high" })),

    // Upcoming events with calculated priority
    ...upcoming
      .filter((e) => e.status !== "completed")
      .map((e) => {
        const days = daysUntilDue(e.dueDate);
        return {
          ...e,
          isOverdue: false,
          priority: days <= 3 ? "high" : days <= 7 ? "medium" : "low",
        };
      }),
  ];

  // Sort by priority and due date
  return allTasks
    .sort((a, b) => {
      // Overdue tasks first
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Finally by due date (earliest first)
      return new Date(a.dueDate) - new Date(b.dueDate);
    })
    .slice(0, limit);
};

/**
 * Get task statistics for dashboard summary
 * @returns {Promise<Object>} Object with task counts
 */
export const getTaskStats = async () => {
  const [upcoming, overdue] = await Promise.all([
    getUpcomingEvents(30),
    getOverdueEvents(),
  ]);

  const pendingTasks = upcoming.filter((e) => e.status === "pending").length;
  const inProgressTasks = upcoming.filter(
    (e) => e.status === "in-progress"
  ).length;

  return {
    total: upcoming.length + overdue.length,
    overdue: overdue.length,
    pending: pendingTasks,
    inProgress: inProgressTasks,
    upcoming: upcoming.length,
  };
};
