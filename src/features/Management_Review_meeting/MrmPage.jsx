// src/features/mrm/MrmPage.jsx
import React, { useState, useEffect } from "react";
import { useMrm } from "./hooks/useMrm";
import MrmList from "./components/MrmList";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import ActionItemsPage from "./pages/ActionItemsPage";
import MinutesOfMeeting from "./components/MinutesOfMeeting";
import MrmPdfView from "./components/MrmPdfView";
import { seedMrmData } from "./utils/seedData";

const MrmPage = () => {
  const {
    meetings,
    createMeeting,
    updateMeeting,
    saveActionItems,
    getActionItems,
    saveMinutes,
    getMinutes,
  } = useMrm();

  const [view, setView] = useState("LIST"); // 'LIST', 'CREATE', 'ACTIONS', 'MINUTES', 'PDF_VIEW'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [pdfData, setPdfData] = useState({
    meeting: null,
    actionItems: [],
    minutes: null,
  });

  // Seed sample data on first mount
  useEffect(() => {
    const initData = async () => {
      try {
        await seedMrmData();
      } catch (error) {
        console.error("Error initializing MRM data:", error);
      }
    };
    initData();
  }, []);

  const handleCreateNew = () => {
    setSelectedMeeting(null);
    setView("CREATE");
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
    const [actions, mins] = await Promise.all([
      getActionItems(meeting.id),
      getMinutes(meeting.id),
    ]);

    setPdfData({
      meeting,
      actionItems: actions || [],
      minutes: mins,
    });
    setView("PDF_VIEW");
  };

  const handleSaveMeeting = async (data) => {
    if (selectedMeeting) {
      await updateMeeting(selectedMeeting.id, data);
    } else {
      const newMeeting = await createMeeting(data);
      setSelectedMeeting(newMeeting);
      setView("ACTIONS"); // After creating, go to action items
      return;
    }
    setView("LIST");
  };

  const handleSaveActions = async (actionItems) => {
    try {
      // Save action items to IndexedDB
      await saveActionItems(selectedMeeting.id, actionItems);

      // Update meeting status if needed
      await updateMeeting(selectedMeeting.id, {
        status: "In Progress",
      });

      console.log("Action items saved successfully");
    } catch (error) {
      console.error("Error saving action items:", error);
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

  const handleSaveMinutes = async (minutesData) => {
    try {
      // Save the minutes data to IndexedDB
      await saveMinutes(selectedMeeting.id, minutesData);

      // Update meeting status to completed
      await updateMeeting(selectedMeeting.id, {
        status: "Completed",
      });

      console.log("Minutes saved successfully");
      setView("LIST");
    } catch (error) {
      console.error("Error saving minutes:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "LIST" && (
        <MrmList
          meetings={meetings}
          onCreate={handleCreateNew}
          onSelect={handleSelectMeeting}
          onViewPdf={handleViewPdf}
        />
      )}

      {view === "CREATE" && (
        <CreateMeetingPage
          initialData={selectedMeeting}
          onSave={handleSaveMeeting}
          onCancel={() => setView("LIST")}
        />
      )}

      {view === "ACTIONS" && selectedMeeting && (
        <ActionItemsPage
          meeting={selectedMeeting}
          onSave={handleSaveActions}
          onBack={() => setView("LIST")}
          onNext={handleNextToMinutes}
        />
      )}

      {view === "MINUTES" && selectedMeeting && (
        <MinutesOfMeeting
          meeting={selectedMeeting}
          onSave={handleSaveMinutes}
          onBack={() => setView("ACTIONS")}
        />
      )}

      {view === "PDF_VIEW" && (
        <MrmPdfView
          meeting={pdfData.meeting}
          actionItems={pdfData.actionItems}
          minutes={pdfData.minutes}
          onBack={() => setView("LIST")}
        />
      )}
    </div>
  );
};

export default MrmPage;
