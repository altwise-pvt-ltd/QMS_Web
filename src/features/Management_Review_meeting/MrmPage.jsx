// src/features/mrm/MrmPage.jsx
import React, { useState, useEffect } from "react";
import { useMrm } from "./hooks/useMrm";
import MrmList from "./components/MrmList";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import ActionItemsPage from "./pages/ActionItemsPage";
import MinutesOfMeeting from "./components/MinutesOfMeeting";
import AttendanceSelection from "./components/AttendanceSelection";
import MrmPdfView from "./components/MrmPdfView";
import MinutesOfMeetingPreview from "./components/MinutesOfMeetingPreview";


import { Skeleton } from "../../components/ui/Skeleton";

const MrmSkeleton = () => (
  <div className="p-8 space-y-4">
    <div className="flex justify-between items-center mb-8">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-48 rounded-2xl" />
      ))}
    </div>
  </div>
);

const MrmPage = () => {
  const {
    meetings,
    loading,
    staffList,
    createMeeting,
    updateMeeting,
    saveActionItems,
    getActionItems,
    deleteActionItem,
    saveMinutes,
    getMinutes,
    deleteMinutes,
    saveAttendance,
    getAttendance,
    updateAttendeeStatus,
  } = useMrm();

  const [view, setView] = useState("LIST"); // 'LIST', 'CREATE', 'ACTIONS', 'MINUTES', 'ATTENDANCE', 'PDF_VIEW', 'MINUTES_PREVIEW'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [tempMinutes, setTempMinutes] = useState(null); // To store minutes before attendance is finalized
  const [pdfData, setPdfData] = useState({
    meeting: null,
    actionItems: [],
    minutes: null,
    attendance: [],
  });
  const [previewData, setPreviewData] = useState({
    meeting: null,
    actionItems: [],
    minutes: null,
    attendance: [],
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedView = localStorage.getItem("mrm_current_view");
      const savedMeeting = localStorage.getItem("mrm_selected_meeting");

      if (savedView && savedView !== "LIST") {
        setView(savedView);
      }
      if (savedMeeting) {
        setSelectedMeeting(JSON.parse(savedMeeting));
      }
    } catch (e) {
      console.error("Failed to restore MRM state:", e);
    }

    // 🔥 Reset state when navigating away from this module
    return () => {
      console.log("Leaving MRM module, clearing flow state...");
      localStorage.removeItem("mrm_current_view");
      localStorage.removeItem("mrm_selected_meeting");
    };
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mrm_current_view", view);
    if (selectedMeeting) {
      localStorage.setItem("mrm_selected_meeting", JSON.stringify(selectedMeeting));
    } else {
      localStorage.removeItem("mrm_selected_meeting");
    }
  }, [view, selectedMeeting]);

  const clearFlowState = () => {
    localStorage.removeItem("mrm_current_view");
    localStorage.removeItem("mrm_selected_meeting");
    setSelectedMeeting(null);
    setView("LIST");
  };

  // Seed sample data on first mount - REMOVED TO ENSURE BACKEND ONLY DATA
  /* useEffect(() => {
    const initData = async () => {
      try {
        await seedMrmData();
      } catch (error) {
        console.error("Error initializing MRM data:", error);
      }
    };
    initData();
  }, []); */

  const handleCreateNew = () => {
    setSelectedMeeting(null);
    setView("CREATE");
  };

  const handleCancelCreate = () => {
    clearFlowState();
  };

  const handleSelectMeeting = async (meeting) => {
    setSelectedMeeting(meeting);
    // Load existing action items for this meeting
    const existingActions = await getActionItems(meeting.id);
    setSelectedMeeting({ ...meeting, actionItems: existingActions });
    setView("ACTIONS"); // Go to Action Items when clicking a meeting
  };

  const handleViewPdf = async (meeting) => {
    // Load complete meeting data
    const [actions, mins, att] = await Promise.all([
      getActionItems(meeting.id),
      getMinutes(meeting.id),
      getAttendance(meeting.id),
    ]);

    setPdfData({
      meeting,
      actionItems: actions || [],
      minutes: mins,
      attendance: att || [],
    });
    setView("PDF_VIEW");
  };

  const handleViewMinutesPreview = async (meeting) => {
    // Load complete meeting data for preview
    const [actions, mins, att] = await Promise.all([
      getActionItems(meeting.id),
      getMinutes(meeting.id),
      getAttendance(meeting.id),
    ]);

    setPreviewData({
      meeting,
      actionItems: actions || [],
      minutes: mins,
      attendance: att || [],
    });
    setView("MINUTES_PREVIEW");
  };

  const handleSaveMeeting = async (data) => {
    if (selectedMeeting) {
      // Update existing meeting
      const updated = await updateMeeting(selectedMeeting.id, data);
      setSelectedMeeting(updated);
      setView("ACTIONS"); // Go back to actions after updating details
      console.log("Meeting details updated successfully");
    } else {
      // Create new meeting
      const newMeeting = await createMeeting(data);
      setSelectedMeeting(newMeeting);
      setView("ACTIONS"); // After creating, go to action items
    }
  };

  const handleEditMeeting = () => {
    setView("CREATE");
  };

  const handleSaveActions = async (actionItems) => {
    try {
      // Save action items to IndexedDB
      const result = await saveActionItems(selectedMeeting, actionItems);

      // Update meeting status if needed
      await updateMeeting(selectedMeeting.id, {
        ...selectedMeeting,
        status: "In Progress",
      });

      console.log("Action items saved successfully");
      return result;
    } catch (error) {
      console.error("Error saving action items:", error);
      return null;
    }
  };

  const handleDeleteActionItem = async (id) => {
    try {
      await deleteActionItem(id);
      console.log("Action item deleted successfully");
    } catch (error) {
      console.error("Error deleting action item:", error);
      throw error; // 🚀 RE-THROW so UI knows it failed
    }
  };

  const handleNextToMinutes = async () => {
    // Load existing minutes if any         
    const existingMinutes = await getMinutes(selectedMeeting.id);
    if (existingMinutes) {
      setSelectedMeeting({
        ...selectedMeeting,
        minutes: existingMinutes,
      });
    }
    setView("MINUTES");
  };

  const handleSaveMinutes = async (minutesData, shouldNavigate = true) => {
    try {
      // 1. Save to Backend immediately
      const mId = selectedMeeting.backendId || selectedMeeting.id;
      const updatedData = await saveMinutes(mId, minutesData);

      // 2. Load existing attendance if any for initial state
      const existingAttendance = await getAttendance(mId);

      // Batch updates to selectedMeeting
      setSelectedMeeting({
        ...selectedMeeting,
        attendance: existingAttendance,
      });

      // 3. Update local sync state
      setTempMinutes(updatedData);

      // 4. Move to next step if requested
      if (shouldNavigate) setView("ATTENDANCE");
      console.log("Minutes saved to backend successfully");
      return updatedData; // Return the fresh list to the UI
    } catch (error) {
      console.error("Failed to save minutes to backend:", error);
      alert("Failed to save minutes to server. Please check your connection.");
    }
  };

  const handleNextToAttendance = async () => {
    const mId = selectedMeeting.backendId || selectedMeeting.id;
    const existingAttendance = await getAttendance(mId);

    setSelectedMeeting({
      ...selectedMeeting,
      attendance: existingAttendance,
    });

    setView("ATTENDANCE");
  };

  const handleDeleteMinutes = async (id) => {
    try {
      await deleteMinutes(id);
      console.log("Minutes deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting minutes:", error);
      return false;
    }
  };

  const handleFinalizeMeeting = async (attendanceData) => {
    try {
      const mId = selectedMeeting.backendId || selectedMeeting.id;

      // 1. Save Minutes (if there are any temp minutes)
      if (tempMinutes) {
        await saveMinutes(mId, tempMinutes);
      }

      // 2. Save Attendance via API
      await updateAttendeeStatus(mId, attendanceData);

      // 3. Complete Meeting
      await updateMeeting(selectedMeeting.id, {
        ...selectedMeeting,
        status: "Completed",
      });

      console.log("Meeting finalized successfully");
      clearFlowState();
    } catch (error) {
      console.error("Error finalizing meeting:", error);
      alert("Failed to finalize meeting. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {loading ? (
        <MrmSkeleton />
      ) : (
        <>
          {view === "LIST" && (
            <MrmList
              meetings={meetings}
              onCreate={handleCreateNew}
              onSelect={handleSelectMeeting}
              onViewPdf={handleViewPdf}
              onViewMinutesPreview={handleViewMinutesPreview}
            />
          )}

          {view === "CREATE" && (
            <CreateMeetingPage
              initialData={selectedMeeting}
              onSave={handleSaveMeeting}
              onCancel={handleCancelCreate}
            />
          )}

          {view === "ACTIONS" && selectedMeeting && (
            <ActionItemsPage
              meeting={selectedMeeting}
              onSave={handleSaveActions}
              onDelete={handleDeleteActionItem}
              onBack={handleCancelCreate}
              onNext={handleNextToMinutes}
              onEditMeeting={handleEditMeeting}
            />
          )}

          {view === "MINUTES" && selectedMeeting && (
            <MinutesOfMeeting
              meeting={selectedMeeting}
              onSave={handleSaveMinutes}
              onDelete={handleDeleteMinutes}
              onBack={() => setView("ACTIONS")}
              onNext={handleNextToAttendance}
              onEditMeeting={handleEditMeeting}
            />
          )}

          {view === "ATTENDANCE" && selectedMeeting && (
            <AttendanceSelection
              meeting={selectedMeeting}
              initialAttendance={selectedMeeting.attendance}
              staffList={staffList}
              onSave={handleFinalizeMeeting}
              onBack={() => setView("MINUTES")}
            />
          )}

          {view === "PDF_VIEW" && (
            <MrmPdfView
              meeting={pdfData.meeting}
              actionItems={pdfData.actionItems}
              minutes={pdfData.minutes}
              attendance={pdfData.attendance}
              onBack={() => setView("LIST")}
            />
          )}

          {view === "MINUTES_PREVIEW" && (
            <MinutesOfMeetingPreview
              meeting={previewData.meeting}
              actionItems={previewData.actionItems}
              minutes={previewData.minutes}
              attendance={previewData.attendance}
              onBack={() => setView("LIST")}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MrmPage;
