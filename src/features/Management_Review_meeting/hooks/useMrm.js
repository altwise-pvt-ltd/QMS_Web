import { useState, useEffect } from "react";
import * as mrmService from "../services/mrmService";

export const useMrm = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load meetings from IndexedDB on mount
  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await mrmService.getAllMeetings();
      setMeetings(data);
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
        prev.map((m) => (m.id === id ? { ...m, ...updatedFields } : m))
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
  const saveActionItems = async (meetingId, actionItems) => {
    try {
      return await mrmService.saveActionItems(meetingId, actionItems);
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
    createMeeting,
    updateMeeting,
    deleteMeeting,
    saveActionItems,
    getActionItems,
    saveMinutes,
    getMinutes,
    getCompleteMeetingData,
    refreshMeetings: loadMeetings,
  };
};
