import { useState, useEffect } from "react";
import * as mrmService from "../services/mrmService";
import staffService from "../../staff/services/staffService";

export const useMrm = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [deptMap, setDeptMap] = useState({});

  // Load meetings from IndexedDB on mount
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const [mrmData, staffRes, deptsRes] = await Promise.all([
        mrmService.getAllMeetings(),
        staffService.getAllStaff(),
        staffService.getAllDepartments(),
      ]);

      const staffListRaw = staffRes.data || [];
      const deptsList = deptsRes.data || [];
      const dMap = {};
      deptsList.forEach((d) => {
        dMap[d.departmentId] = d.departmentName;
      });

      setDeptMap(dMap);
      setStaffList(staffListRaw.map(s => ({
        id: s.staffId,
        username: `${s.firstName || ""} ${s.lastName || ""}`.trim() || `Staff ${s.staffId}`,
        email: s.workEmail || "No Email",
        role: s.jobTitle || "No Role",
        department: dMap[s.departmentId] || "General",
      })));

      const enrichedMeetings = mrmData.map((m) => ({
        ...m,
        invitedAttendees: (m.invitedAttendees || []).map((att) => {
          const staff = staffListRaw.find((s) => s.staffId === Number(att.id || att.staffId || att.userId));
          if (staff) {
            return {
              id: staff.staffId,
              username: `${staff.firstName || ""} ${staff.lastName || ""}`.trim() || `Staff ${staff.staffId}`,
              email: staff.workEmail || "No Email",
              role: staff.jobTitle || "No Role",
              department: dMap[staff.departmentId] || "General",
            };
          }
          return att;
        }),
      }));

      setMeetings(enrichedMeetings);
    } catch (error) {
      console.error("Error loading meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  const createMeeting = async (data) => {
    try {
      const newMeeting = await mrmService.createMeeting(data);
      setMeetings((prev) => [...prev, newMeeting]);
      return newMeeting;
    } catch (error) {
      console.error("Error creating meeting:", error);
      throw error;
    }
  };

  const updateMeeting = async (id, updatedFields) => {
    try {
      const updated = await mrmService.updateMeeting(id, updatedFields);
      setMeetings((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m)),
      );
      return updated;
    } catch (error) {
      console.error("Error updating meeting:", error);
      throw error;
    }
  };

  const deleteMeeting = async (id) => {
    try {
      await mrmService.deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting meeting:", error);
      throw error;
    }
  };

  // Action Items methods
  const saveActionItems = async (meeting, actionItems) => {
    try {
      return await mrmService.saveActionItems(meeting, actionItems);
    } catch (error) {
      console.error("Error saving action items:", error);
      throw error;
    }
  };

  const getActionItems = async (meetingId) => {
    try {
      return await mrmService.getActionItems(meetingId);
    } catch (error) {
      console.error("Error getting action items:", error);
      return [];
    }
  };

  const deleteActionItem = async (id) => {
    try {
      return await mrmService.deleteActionItem(id);
    } catch (error) {
      console.error("Error deleting action item:", error);
      throw error;
    }
  };

  // Minutes methods
  const saveMinutes = async (meetingId, minutesData) => {
    try {
      return await mrmService.saveMinutes(meetingId, minutesData);
    } catch (error) {
      console.error("Error saving minutes:", error);
      throw error;
    }
  };

  const getMinutes = async (meetingId) => {
    try {
      return await mrmService.getMinutes(meetingId);
    } catch (error) {
      console.error("Error getting minutes:", error);
      return null;
    }
  };

  const deleteMinutes = async (id) => {
    try {
      return await mrmService.deleteMinutes(id);
    } catch (error) {
      console.error("Error deleting minutes:", error);
      throw error;
    }
  };

  // Attendance methods
  const saveAttendance = async (meetingId, attendanceData) => {
    try {
      return await mrmService.saveAttendance(meetingId, attendanceData);
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  };

  const getAttendance = async (meetingId) => {
    try {
      return await mrmService.getAttendance(meetingId);
    } catch (error) {
      console.error("Error getting attendance:", error);
      return [];
    }
  };

  const updateAttendeeStatus = async (meetingId, attendanceData) => {
    try {
      return await mrmService.updateAttendeeStatus(meetingId, attendanceData);
    } catch (error) {
      console.error("Error updating attendee status:", error);
      throw error;
    }
  };

  // Get complete meeting data
  const getCompleteMeetingData = async (meetingId) => {
    try {
      return await mrmService.getCompleteMeetingData(meetingId);
    } catch (error) {
      console.error("Error getting complete meeting data:", error);
      return null;
    }
  };

  return {
    meetings,
    loading,
    staffList,
    deptMap,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    saveActionItems,
    getActionItems,
    deleteActionItem,
    saveMinutes,
    getMinutes,
    deleteMinutes,
    saveAttendance,
    getAttendance,
    updateAttendeeStatus,
    getCompleteMeetingData,
    refreshMeetings: loadMeetings,
  };
};
