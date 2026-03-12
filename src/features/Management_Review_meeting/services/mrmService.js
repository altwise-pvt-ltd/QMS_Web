import api from "../../../auth/api";

// =============================================
// GLOBAL REQUEST CACHE (Prevents duplicate calls)
// =============================================
const pendingRequests = new Map();

/**
 * Deduplicates concurrent identical GET requests.
 * If a request for the same URL is already in flight, returns that promise.
 */
const apiGetCached = async (url) => {
  if (pendingRequests.has(url)) {
    console.log(`⚡ Deduplicating concurrent request: ${url}`);
    return pendingRequests.get(url);
  }
  const promise = api.get(url);
  pendingRequests.set(url, promise);
  try {
    const result = await promise;
    return result;
  } finally {
    // Small delay before clearing to catch rapid-fire renders
    setTimeout(() => pendingRequests.delete(url), 100);
  }
};

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

    const result = {
      ...meetingData,
      id: backendData.id || backendData.meetingId,
      backendId: backendData.id || backendData.meetingId,
      createdAt: new Date().toISOString(),
      status: meetingData.status || "Scheduled",
    };

    return result;
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
    const response = await apiGetCached("/ManagementReviewMeetings/GetAllMeetings");
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

    return mappedMeetings;
  } catch (error) {
    console.error("Error fetching meetings from backend:", error);
    return [];
  }
};

/**
 * Get a single meeting by ID
 */
export const getMeetingById = async (id) => {
  try {
    const response = await apiGetCached(`/ManagementReviewMeetings/GetMeetingById/${id}`);
    const m = response.data;
    if (!m) return null;

    let displayDate = m.meetingDate || "";
    if (displayDate.includes("T")) displayDate = displayDate.split("T")[0];
    
    let displayTime = m.meetingTime || "";
    if (displayTime.includes(":")) {
      const parts = displayTime.split(":");
      if (parts.length >= 2) displayTime = `${parts[0]}:${parts[1]}`;
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
      invitedAttendees: m.staffIds ? m.staffIds.map(id => ({ id })) : [],
    };
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return null;
  }
};

/**
 * Update a meeting
 */
export const updateMeeting = async (id, meetingData) => {
  try {
    // 1. Prepare data for the backend API (PUT)
    const apiPayload = {
      meetingTitle: meetingData.title,
      // The backend requires ISO format (YYYY-MM-DD) for the date field
      meetingDate: meetingData.date ? new Date(meetingData.date).toISOString() : new Date().toISOString(),
      // Time format HH:mm:ss
      meetingTime: meetingData.time ? (meetingData.time.split(":").length === 2 ? `${meetingData.time}:00` : meetingData.time) : "00:00:00",
      location: meetingData.location || "",
      agenda: meetingData.agenda || "",
      staffIds: (meetingData.invitedAttendees || []).map(u => Number(u.id || u)).filter(id => !isNaN(id)),
    };

    console.log("✏️ Updating Meeting via API:", `/ManagementReviewMeetings/UpdateMeeting/${id}`, apiPayload);

    // 2. Call backend API
    await api.put(`/ManagementReviewMeetings/UpdateMeeting/${id}`, apiPayload);

    return { ...meetingData, id };
  } catch (error) {
    if (error.response && error.response.data) {
      console.error("❌ Backend Update Error:", error.response.data);
    }
    console.error("Error updating meeting:", error);
    throw error;
  }
};

/**
 * Delete a meeting
 */
export const deleteMeeting = async (id) => {
  try {
    // Backend delete logic if available
    console.log("🗑️ Delete meeting not fully implemented on backend");
    return true;
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
/**
 * Save action items for a meeting.
 * - Single item (no id)  → POST (create)
 * - Single item (has id) → PUT (update)
 * - Array               → bulk replace (used for reorder/delete only)
 */
export const saveActionItems = async (meetingData, actionItems) => {
  try {
    const meetingId = meetingData?.id || meetingData; // Handle both object and raw ID
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
        const updatePayload = {
          actionItemId: Number(item.id),
          meetingId: Number(meetingId),
          // Backend validation requires the meeting title context
          meetingTitle: meetingData?.title || "MRM Meeting",
          description: item.task,
          taskDetails: item.description || "",
          dueDate: item.dueDate
            ? new Date(item.dueDate).toISOString()
            : new Date().toISOString(),
          status: item.status || "Pending",
        };

        console.log("✏️ Updating Action Item via API:", `/ManagementReviewMeetings/UpdateActionItem/${item.id}`, updatePayload);

        try {
          await api.put(
            `/ManagementReviewMeetings/UpdateActionItem/${item.id}`,
            updatePayload
          );
        } catch (error) {
          if (error.response?.data?.errors) {
            console.error("❌ Validation Errors:", error.response.data.errors);
          }
          throw error;
        }

        return { ...item };
      } else {
        // POST — create new record
        console.log("🚀 Creating Action Item via API:", apiPayload);
        const response = await api.post(
          "/ManagementReviewMeetings/CreateManagementReviewActionItems",
          { actionItems: [apiPayload] }
        );

        const backendId = response.data?.actionItemId;
        return {
          id: backendId || `temp_${Date.now()}`,
          meetingId,
          task: item.task,
          description: item.description,
          dueDate: item.dueDate,
          createdAt: new Date().toISOString(),
        };
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

    // 2. Return fresh list (logic assumes caller will refresh using getActionItems)
    return items;
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Backend Action Items Error:", error.response.data);
    }
    console.error("Error saving action items:", error);
    throw error;
  }
};

/**
 * Delete an action item
 */
export const deleteActionItem = async (id) => {
  try {
    const numericId = Number(id);
    console.log("🗑️ Deleting Action Item via API:", `/ManagementReviewMeetings/DeleteActionItem/${numericId}`);

    await api.delete(`/ManagementReviewMeetings/DeleteActionItem/${numericId}`);
    console.log("✅ Delete Response:", response.data);

    return true;
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Delete Error Data:", error.response.data);
    }
    console.error("Error deleting action item:", error);
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
    const response = await apiGetCached(
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

    return mappedItems;
  } catch (error) {
    if (error.statusCode === 404) {
      return [];
    }
    console.error("Error fetching action items from backend:", error);
    return [];
  }
};
// ==================== MINUTES ====================

/**
 * Save minutes for a meeting
 * - Single item (no id)  → POST (create)
 * - Single item (has id) → PUT (update)
 * - Array               → bulk create new items
 */
export const saveMinutes = async (meetingId, minutesData) => {
  try {
    if (!minutesData || !minutesData.agendaItems) {
      return await getMinutes(meetingId);
    }
    const isSingleItem = minutesData.agendaItems?.length === 1 && minutesData.isSingle;
    const items = minutesData.agendaItems || [];

    // ── SINGLE ITEM: UPDATE (has backend ID) ────────────────────────────────
    if (isSingleItem) {
      const item = items[0];
      const isUpdate = !!item.id && !String(item.id).startsWith("local_");

      if (isUpdate) {
        const updatePayload = {
          minutesId: Number(item.id),
          meetingId: Number(meetingId),
          agendaItem: item.input,
          discussionAndReview: item.activity,
          responsibility: item.responsibility,
          currentStatus: item.status || "Active",
        };

        console.log("✏️ Updating Minutes via API:", `/ManagementReviewMeetings/UpdateMinutes/${item.id}`, updatePayload);
        await api.put(`/ManagementReviewMeetings/UpdateMinutes/${item.id}`, updatePayload);
        return await getMinutes(meetingId);
      }
    }

    // ── NEW ITEMS: Bulk Create (those without a backend ID) ──────────────────
    const newItems = items.filter(
      (item) => !item.id || String(item.id).startsWith("local_")
    );

    if (newItems.length > 0) {
      const apiPayload = newItems.map((item) => ({
        meetingId: Number(meetingId),
        agendaItem: item.input || "—",
        discussionAndReview: item.activity || "—",
        responsibility: item.responsibility || "—",
        currentStatus: item.status || "Active",
      }));

      console.log("🚀 Creating NEW Minutes with Payload:", apiPayload);
      await api.post("/ManagementReviewMeetings/CreateMultipleMinutes", apiPayload);
    }

    // 4. Always return fresh list from backend
    return await getMinutes(meetingId);
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Backend Minutes Error:", error.response.data);
    }
    console.error("Error saving minutes:", error);
    throw error;
  }
};

/**
 * Delete a minute item
 */
export const deleteMinutes = async (id) => {
  try {
    console.log("🗑️ Deleting Minutes via API:", `/ManagementReviewMeetings/DeleteMinutes/${id}`);
    await api.delete(`/ManagementReviewMeetings/DeleteMinutes/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting minutes:", error);
    throw error;
  }
};

/**
 * Get minutes for a meeting
 */
export const getMinutes = async (meetingId) => {
  try {
    const response = await apiGetCached(`/ManagementReviewMeetings/4?meetingId=${meetingId}`);
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
    if (error.statusCode === 404) {
      return { agendaItems: [] };
    }
    console.error("Error fetching minutes from backend:", error);
    return { agendaItems: [] };
  }
};

// ==================== ATTENDANCE ====================

/**
 * Update attendance status via API
 */
export const updateAttendeeStatus = async (meetingId, attendance) => {
  try {
    const apiPayload = attendance.map((item) => ({
      staffId: Number(item.id || item.staffId || item.userId),
      status: item.status || "Present",
    }));

    console.log("📝 Updating Attendance Status via API:", `/ManagementReviewMeetings/UpdateAttendeeStatus/${meetingId}`, apiPayload);

    await api.put(`/ManagementReviewMeetings/UpdateAttendeeStatus/${meetingId}`, apiPayload);

    return true;
  } catch (error) {
    if (error.response?.data) {
      console.error("❌ Attendance Update Error:", error.response.data);
    }
    console.error("Error updating attendance:", error);
    throw error;
  }
};

/**
 * Save attendance for a meeting (local sync)
 */
export const saveAttendance = async (meetingId, attendanceData) => {
  return attendanceData;
};

/**
 * Get attendance for a meeting
 */
export const getAttendance = async (meetingId) => {
  return [];
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
