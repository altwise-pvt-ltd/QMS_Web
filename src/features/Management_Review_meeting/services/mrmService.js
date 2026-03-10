import { db } from "../../../db/index";
import api from "../../../auth/api";

// ==================== MEETINGS ====================

/**
 * Create a new MRM meeting
 */
export const createMeeting = async (meetingData) => {
  try {
    // 1. Prepare data for the backend API
    const apiPayload = {
      meetingTitle: meetingData.title,
      // The backend requires ISO format (YYYY-MM-DD) for the date field
      meetingDate: meetingData.date ? new Date(meetingData.date).toISOString() : new Date().toISOString(),
      // Time format HH:mm:ss is accepted
      meetingTime: meetingData.time ? `${meetingData.time}:00` : "00:00:00",
      location: meetingData.location || "",
      agenda: meetingData.agenda || "",
      staffIds: (meetingData.invitedAttendees || []).map(u => Number(u.id)).filter(id => !isNaN(id)),
    };

    console.log("🚀 Creating Meeting with Payload:", apiPayload);

    // 2. Call backend API
    const response = await api.post("/ManagementReviewMeetings/CreateMeeting", apiPayload);
    const backendData = response.data;
    console.log("✅ Meeting created on backend:", backendData);

    // 3. Save to local IndexedDB for offline/viewing
    // Map backend response if it returns an ID, otherwise use Dexie auto-increment
    const localData = {
      ...meetingData,
      backendId: backendData.id || backendData.meetingId, // Store backend ID reference
      createdAt: new Date().toISOString(),
      status: meetingData.status || "Scheduled", // Default to scheduled when creating
    };

    const localId = await db.mrm_meetings.add(localData);

    return { ...localData, id: localId };
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("❌ Backend Validation Error:", error.response.data);
    }
    console.error("Error creating meeting:", error);
    throw error;
  }
};

/**
 * Get all meetings
 */
export const getAllMeetings = async () => {
  try {
    // 1. Fetch from backend
    const response = await api.get("/ManagementReviewMeetings/GetAllMeetings");
    const backendMeetings = response.data || [];

    // 2. Map backend fields to frontend fields
    const mappedMeetings = backendMeetings.map((m) => {
      // 1. Handle Date: Convert to YYYY-MM-DD for <input type="date">
      let displayDate = m.meetingDate || "";
      if (displayDate.includes("T")) {
        // Handle ISO string from backend: 2026-02-27T09:00:00Z -> 2026-02-27
        displayDate = displayDate.split("T")[0];
      } else if (displayDate.includes("/")) {
        // Handle DD/MM/YYYY if backend sends it
        const parts = displayDate.split("/");
        if (parts.length === 3) {
          displayDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      // 2. Handle Time: Convert to HH:mm for <input type="time">
      let displayTime = m.meetingTime || "";
      if (displayTime.includes(":")) {
        const parts = displayTime.split(":");
        if (parts.length >= 2) {
          displayTime = `${parts[0]}:${parts[1]}`;
        }
      }

      return {
        id: m.meetingId || m.id,
        backendId: m.meetingId || m.id,
        title: m.meetingTitle,
        date: displayDate,
        time: displayTime,
        location: m.location,
        agenda: m.agenda,
        status: m.status || "Scheduled",
        createdAt: m.createdAt || new Date().toISOString(),
        invitedAttendees: m.staffIds ? m.staffIds.map(id => ({ id })) : [],
      };
    });

    // 3. Sync with local IndexedDB (optional but recommended for persistence)
    // For simplicity, we'll clear and re-add or just return the mapped data
    // await db.mrm_meetings.clear();
    // await db.mrm_meetings.bulkAdd(mappedMeetings);

    return mappedMeetings;
  } catch (error) {
    console.error("Error fetching meetings from backend:", error);
    // Fallback to local if backend fails
    return await db.mrm_meetings.toArray();
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

// =============================================
// mrmService.js — Fixed saveActionItems & getActionItems
// =============================================

/**
 * Save action items for a meeting.
 * - Single item (no id)  → POST (create)
 * - Single item (has id) → PUT (update)
 * - Array               → bulk replace (used for reorder/delete only)
 */
export const saveActionItems = async (meetingId, actionItems) => {
  try {
    const isSingleItem = !Array.isArray(actionItems);
    const items = isSingleItem ? [actionItems] : actionItems;

    // ── SINGLE ITEM: CREATE or UPDATE ──────────────────────────────────────
    if (isSingleItem) {
      const item = items[0];
      const isUpdate = !!item.id && !String(item.id).startsWith("local_");

      const apiPayload = {
        meetingId: Number(meetingId),
        description: item.task,
        taskDetails: item.description || "",
        dueDate: item.dueDate
          ? new Date(item.dueDate).toISOString()
          : new Date().toISOString(),
      };

      if (isUpdate) {
        // PUT — update existing record
        console.log("✏️ Updating Action Item:", item.id, apiPayload);
        await api.put(
          `/ManagementReviewMeetings/UpdateManagementReviewActionItem/${item.id}`,
          apiPayload
        );

        await db.mrm_action_items.update(item.id, {
          task: item.task,
          description: item.description,
          dueDate: item.dueDate,
        });

        return { ...item };
      } else {
        // POST — create new record
        console.log("🚀 Creating Action Item:", apiPayload);
        const response = await api.post(
          "/ManagementReviewMeetings/CreateManagementReviewActionItems",
          { actionItems: [apiPayload] }
        );

        const backendId =
          response.data?.actionItemId ||
          response.data?.[0]?.actionItemId ||
          null;

        const newLocalItem = {
          id: backendId || `local_${Date.now()}_${Math.random()}`,
          meetingId,
          task: item.task,
          description: item.description,
          dueDate: item.dueDate,
          createdAt: new Date().toISOString(),
        };

        if (item.id && String(item.id).startsWith("local_")) {
          // Replace temporary local record
          await db.mrm_action_items.delete(item.id);
        }
        await db.mrm_action_items.add(newLocalItem);

        return newLocalItem;
      }
    }

    // ── ARRAY: Bulk Save / Reorder ───────────────────────────────────────────
    // 1. Identify new items that need to be created on backend
    const newItems = items.filter(item => !item.id || String(item.id).startsWith("local_"));

    if (newItems.length > 0) {
      const apiPayloads = newItems.map(item => ({
        meetingId: Number(meetingId),
        description: item.task,
        taskDetails: item.description || "",
        dueDate: item.dueDate
          ? new Date(item.dueDate).toISOString()
          : new Date().toISOString(),
      }));

      console.log("🚀 Bulk Creating Action Items:", apiPayloads);
      await api.post(
        "/ManagementReviewMeetings/CreateManagementReviewActionItems",
        { actionItems: apiPayloads }
      );
    }

    // 2. Sync local IndexedDB for the whole meeting
    console.log("🔄 Bulk-updating local cache for meetingId:", meetingId);
    await db.mrm_action_items.where("meetingId").equals(meetingId).delete();

    const itemsToAdd = items.map((item) => ({
      id: item.id || `local_${Date.now()}_${Math.random()}`,
      meetingId,
      task: item.task,
      description: item.description,
      dueDate: item.dueDate,
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    await db.mrm_action_items.bulkAdd(itemsToAdd);
    return itemsToAdd;
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Backend Action Items Error:", error.response.data);
    }
    console.error("Error saving action items:", error);
    throw error;
  }
};

/**
 * Get action items for a meeting.
 * Always treats the backend as the source of truth.
 * Syncs IndexedDB from backend to prevent stale/duplicate local data.
 */
export const getActionItems = async (meetingId) => {
  try {
    const response = await api.get(
      `/ManagementReviewMeetings/ActionItemsByMeetingId/${meetingId}`
    );
    const backendItems = response.data || [];

    const mappedItems = backendItems.map((item) => ({
      id: item.actionItemId,
      meetingId: meetingId,
      task: item.description,
      description: item.taskDetails,
      dueDate: item.dueDate ? item.dueDate.split("T")[0] : "",
      status: item.status || "Pending",
      createdAt: item.createdAt || new Date().toISOString(),
    }));

    // ── Sync local IndexedDB with backend truth (prevents stale dupes) ──────
    await db.mrm_action_items.where("meetingId").equals(meetingId).delete();
    if (mappedItems.length > 0) {
      await db.mrm_action_items.bulkAdd(mappedItems);
    }

    return mappedItems;
  } catch (error) {
    console.error("Error fetching action items from backend:", error);
    // Fallback to local IndexedDB only if backend is truly unreachable
    return await db.mrm_action_items
      .where("meetingId")
      .equals(meetingId)
      .toArray();
  }
};
// ==================== MINUTES ====================

/**
 * Save minutes for a meeting
 */
export const saveMinutes = async (meetingId, minutesData) => {
  try {
    // 1. Identify ONLY new items (those without a backend ID)
    // This prevents re-sending items that are already in the database
    // 1. Identify ONLY new items (those without a backend ID)
    // New items have local numeric IDs (Date.now()) or start with "local_"
    const newItems = (minutesData.agendaItems || []).filter(
      (item) => !item.id || String(item.id).startsWith("local_") || (typeof item.id === 'number' && item.id > 1000000000000)
    );

    if (newItems.length === 0) {
      console.log("ℹ️ No new minutes to save.");
      return await getMinutes(meetingId);
    }

    // 2. Prepare payload for new items only
    const apiPayload = newItems.map((item) => ({
      meetingId: Number(meetingId),
      agendaItem: item.input,
      discussionAndReview: item.activity,
      responsibility: item.responsibility,
      currentStatus: item.status || "Active",
    }));

    console.log("🚀 Saving NEW Minutes with Payload:", apiPayload);

    // 3. Call backend API
    await api.post("/ManagementReviewMeetings/CreateMultipleMinutes", apiPayload);

    // 4. Refresh data from backend to get fresh IDs and avoid duplicates
    return await getMinutes(meetingId);
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("❌ Backend Minutes Error:", error.response.data);
    }
    console.error("Error saving minutes:", error);
    throw error;
  }
};

/**
 * Get minutes for a meeting
 */
export const getMinutes = async (meetingId) => {
  try {
    const response = await api.get(`/ManagementReviewMeetings/4?meetingId=${meetingId}`);
    const backendMinutes = response.data || [];

    if (backendMinutes.length === 0) return { agendaItems: [] };

    // 🚀 Robust Deduplication Logic (By content and ID)
    const seen = new Set();
    const uniqueItems = [];

    backendMinutes.forEach((m) => {
      // Create a unique key based on content to catch exact duplicates in DB
      const contentKey = `${m.agendaItem}-${m.discussionAndReview}-${m.responsibility}`.toLowerCase().trim();

      if (!seen.has(m.minutesId) && !seen.has(contentKey)) {
        seen.add(m.minutesId);
        seen.add(contentKey);
        uniqueItems.push({
          id: m.minutesId,
          input: m.agendaItem,
          activity: m.discussionAndReview,
          responsibility: m.responsibility,
          status: m.currentStatus,
        });
      }
    });

    // Sort by ID to keep order consistent
    const sortedItems = uniqueItems.sort((a, b) => a.id - b.id);

    return { agendaItems: sortedItems };
  } catch (error) {
    console.error("Error fetching minutes from backend:", error);
    const local = await db.mrm_minutes.where("meetingId").equals(meetingId).first();
    return local || { agendaItems: [] };
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
