/**
 * Utility functions for compliance calendar reminders and alerts
 */

/**
 * Calculate days until a due date
 */
export const daysUntilDue = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Determine alert level based on days until due
 * @returns {string} 'success' | 'warning' | 'danger'
 */
export const getAlertLevel = (dueDate) => {
  const days = daysUntilDue(dueDate);

  if (days < 0) return "danger"; // Overdue
  if (days <= 3) return "danger"; // Critical (3 days or less)
  if (days <= 7) return "warning"; // Warning (4-7 days)
  return "success"; // Good (>7 days)
};

/**
 * Get alert color based on level
 */
export const getAlertColor = (dueDate) => {
  const level = getAlertLevel(dueDate);
  const colors = {
    success: "green",
    warning: "yellow",
    danger: "red",
  };
  return colors[level];
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: "gray",
    "in-progress": "blue",
    completed: "green",
    overdue: "red",
    cancelled: "gray",
  };
  return colors[status] || "gray";
};

/**
 * Format due date with relative time
 */
export const formatDueDate = (dueDate) => {
  const days = daysUntilDue(dueDate);
  const date = new Date(dueDate).toLocaleDateString();

  if (days < 0) {
    return `${date} (${Math.abs(days)} days overdue)`;
  } else if (days === 0) {
    return `${date} (Due today)`;
  } else if (days === 1) {
    return `${date} (Due tomorrow)`;
  } else if (days <= 7) {
    return `${date} (${days} days left)`;
  }
  return date;
};

/**
 * Check if event should show reminder
 */
export const shouldShowReminder = (dueDate, reminderDays = 7) => {
  const days = daysUntilDue(dueDate);
  return days >= 0 && days <= reminderDays;
};

/**
 * Check if document is expiring soon
 */
export const isExpiringSoon = (expiryDate, thresholdDays = 30) => {
  const days = daysUntilDue(expiryDate);
  return days >= 0 && days <= thresholdDays;
};

/**
 * Check if document is expired
 */
export const isExpired = (expiryDate) => {
  return daysUntilDue(expiryDate) < 0;
};

/**
 * Get priority level for sorting
 */
export const getPriorityLevel = (dueDate, status) => {
  if (status === "completed") return 4;
  if (status === "cancelled") return 5;

  const days = daysUntilDue(dueDate);
  if (days < 0) return 0; // Overdue - highest priority
  if (days <= 3) return 1; // Critical
  if (days <= 7) return 2; // Warning
  return 3; // Normal
};

/**
 * Sort events by priority (overdue first, then by due date)
 */
export const sortByPriority = (events) => {
  return [...events].sort((a, b) => {
    const priorityA = getPriorityLevel(a.dueDate, a.status);
    const priorityB = getPriorityLevel(b.dueDate, b.status);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // Same priority, sort by due date
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
};

/**
 * Calculate next occurrence for recurring events
 */
export const calculateNextOccurrence = (lastDate, frequency) => {
  const date = new Date(lastDate);

  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "half-yearly":
      date.setMonth(date.getMonth() + 6);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      return null; // One-time event
  }

  return date.toISOString().split("T")[0];
};
