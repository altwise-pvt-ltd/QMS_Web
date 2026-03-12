import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import * as mrmService from "../services/mrmService";
import staffService from "../../staff/services/staffService";

const MrmContext = createContext();

export const MrmProvider = ({ children }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [deptMap, setDeptMap] = useState({});
  const initialLoadRef = useRef(false);

  const loadMeetings = useCallback(async (force = false) => {
    // Prevent multiple initial loads
    if (initialLoadRef.current && !force) return;
    initialLoadRef.current = true;

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
      const mappedStaff = staffListRaw.map(s => ({
        id: s.staffId,
        username: `${s.firstName || ""} ${s.lastName || ""}`.trim() || `Staff ${s.staffId}`,
        email: s.workEmail || "No Email",
        role: s.jobTitle || "No Role",
        department: dMap[s.departmentId] || "General",
      }));
      setStaffList(mappedStaff);

      const enrichedMeetings = mrmData.map((m) => ({
        ...m,
        invitedAttendees: (m.invitedAttendees || []).map((att) => {
          const staffId = Number(att.id || att.staffId || att.userId);
          const staff = staffListRaw.find((s) => s.staffId === staffId);
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
      console.error("Error loading meetings in Context:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  // Wrapped actions that update global state
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

  return (
    <MrmContext.Provider
      value={{
        meetings,
        loading,
        staffList,
        deptMap,
        createMeeting,
        updateMeeting,
        deleteMeeting,
        saveActionItems: mrmService.saveActionItems,
        getActionItems: mrmService.getActionItems,
        deleteActionItem: mrmService.deleteActionItem,
        saveMinutes: mrmService.saveMinutes,
        getMinutes: mrmService.getMinutes,
        deleteMinutes: mrmService.deleteMinutes,
        saveAttendance: mrmService.saveAttendance,
        getAttendance: mrmService.getAttendance,
        updateAttendeeStatus: mrmService.updateAttendeeStatus,
        getCompleteMeetingData: mrmService.getCompleteMeetingData,
        refreshMeetings: () => loadMeetings(true),
      }}
    >
      {children}
    </MrmContext.Provider>
  );
};

export const useMrmContext = () => {
  const context = useContext(MrmContext);
  if (!context) {
    throw new Error("useMrmContext must be used within an MrmProvider");
  }
  return context;
};
