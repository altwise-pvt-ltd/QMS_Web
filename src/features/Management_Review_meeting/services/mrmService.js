import { db } from "../../../db/index";

// ==================== MEETINGS ====================

/**
 * Create a new MRM meeting
 */
export const createMeeting = async (meetingData) => {
  try {
    // Strip id if it exists (especially if undefined) to allow ++id auto-increment
    const { id, ...cleanData } = meetingData;

    const newId = await db.mrm_meetings.add({
      ...cleanData,
      createdAt: new Date().toISOString(),
      status: cleanData.status || "Draft",
    });
    return { id: newId, ...cleanData };
  } catch (error) {
    console.error("Error creating meeting:", error);
    throw error;
  }
};

/**
 * Get all meetings
 */
export const getAllMeetings = async () => {
  try {
    const meetings = await db.mrm_meetings.toArray();
    return meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
};

/**
 * Get a single meeting by ID
 */
export const getMeetingById = async (id) => {
  try {
    return await db.mrm_meetings.get(id);
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return null;
  }
};

/**
 * Update a meeting
 */
export const updateMeeting = async (id, updates) => {
  try {
    await db.mrm_meetings.update(id, updates);
    return await getMeetingById(id);
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw error;
  }
};

/**
 * Delete a meeting
 */
export const deleteMeeting = async (id) => {
  try {
    await db.mrm_meetings.delete(id);
    // Also delete related action items, minutes, and attendance
    await db.mrm_action_items.where("meetingId").equals(id).delete();
    await db.mrm_minutes.where("meetingId").equals(id).delete();
    await db.mrm_attendance.where("meetingId").equals(id).delete();
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw error;
  }
};

// ==================== ACTION ITEMS ====================

/**
 * Save action items for a meeting
 */
export const saveActionItems = async (meetingId, actionItems) => {
  try {
    // Delete existing action items for this meeting
    await db.mrm_action_items.where("meetingId").equals(meetingId).delete();

    // Add new action items
    const itemsToAdd = actionItems.map((item) => ({
      meetingId,
      task: item.task,
      description: item.description,
      dueDate: item.dueDate,
      createdAt: new Date().toISOString(),
    }));

    await db.mrm_action_items.bulkAdd(itemsToAdd);
    return itemsToAdd;
  } catch (error) {
    console.error("Error saving action items:", error);
    throw error;
  }
};

/**
 * Get action items for a meeting
 */
export const getActionItems = async (meetingId) => {
  try {
    return await db.mrm_action_items
      .where("meetingId")
      .equals(meetingId)
      .toArray();
  } catch (error) {
    console.error("Error fetching action items:", error);
    return [];
  }
};

// ==================== MINUTES ====================

/**
 * Save minutes for a meeting
 */
export const saveMinutes = async (meetingId, minutesData) => {
  try {
    // Check if minutes already exist for this meeting
    const existing = await db.mrm_minutes
      .where("meetingId")
      .equals(meetingId)
      .first();

    if (existing) {
      // Update existing minutes
      await db.mrm_minutes.update(existing.id, {
        agendaItems: minutesData.agendaItems,
        createdAt: new Date().toISOString(),
      });
      return { ...existing, agendaItems: minutesData.agendaItems };
    } else {
      // Create new minutes
      const id = await db.mrm_minutes.add({
        meetingId,
        agendaItems: minutesData.agendaItems,
        createdAt: new Date().toISOString(),
      });
      return { id, meetingId, ...minutesData };
    }
  } catch (error) {
    console.error("Error saving minutes:", error);
    throw error;
  }
};

/**
 * Get minutes for a meeting
 */
export const getMinutes = async (meetingId) => {
  try {
    return await db.mrm_minutes.where("meetingId").equals(meetingId).first();
  } catch (error) {
    console.error("Error fetching minutes:", error);
    return null;
  }
};

// ==================== ATTENDANCE ====================

/**
 * Save attendance for a meeting
 */
export const saveAttendance = async (meetingId, attendanceData) => {
  try {
    // Delete existing attendance for this meeting
    await db.mrm_attendance.where("meetingId").equals(meetingId).delete();

    // Add new attendance
    const itemsToAdd = attendanceData.map((item) => ({
      meetingId,
      userId: item.userId || item.id,
      username: item.username,
      role: item.role || "",
      department: item.department || "",
      status: item.status || "Present",
      createdAt: new Date().toISOString(),
    }));

    await db.mrm_attendance.bulkAdd(itemsToAdd);
    return itemsToAdd;
  } catch (error) {
    console.error("Error saving attendance:", error);
    throw error;
  }
};

/**
 * Get attendance for a meeting
 */
export const getAttendance = async (meetingId) => {
  try {
    return await db.mrm_attendance
      .where("meetingId")
      .equals(meetingId)
      .toArray();
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return [];
  }
};

// ==================== COMPLETE MEETING DATA ====================

/**
 * Get complete meeting data (meeting + action items + minutes)
 */
export const getCompleteMeetingData = async (meetingId) => {
  try {
    const [meeting, actionItems, minutes, attendance] = await Promise.all([
      getMeetingById(meetingId),
      getActionItems(meetingId),
      getMinutes(meetingId),
      getAttendance(meetingId),
    ]);

    return {
      meeting,
      actionItems,
      minutes,
      attendance,
    };
  } catch (error) {
    console.error("Error fetching complete meeting data:", error);
    return null;
  }
};
