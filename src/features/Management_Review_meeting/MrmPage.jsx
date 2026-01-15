// src/features/mrm/MrmPage.jsx
import React, { useState } from "react";
import { useMrm } from "./hooks/useMrm";
import MrmList from "./components/MrmList";
import CreateMeetingPage from "./pages/CreateMeetingPage";
import ActionItemsPage from "./pages/ActionItemsPage";
import MinutesOfMeeting from "./components/MinutesOfMeeting";

const MrmPage = () => {
  const { meetings, createMeeting, updateMeeting } = useMrm();
  const [view, setView] = useState("LIST"); // 'LIST', 'CREATE', 'ACTIONS', or 'MINUTES'
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const handleCreateNew = () => {
    setSelectedMeeting(null);
    setView("CREATE");
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setView("ACTIONS"); // Go to Action Items when clicking a meeting
  };

  const handleSaveMeeting = (data) => {
    if (selectedMeeting) {
      updateMeeting(selectedMeeting.id, data);
    } else {
      const newMeeting = createMeeting(data);
      setSelectedMeeting(newMeeting);
      setView("ACTIONS"); // After creating, go to action items
      return;
    }
    setView("LIST");
  };

  const handleSaveActions = (updatedMeeting) => {
    updateMeeting(updatedMeeting.id, updatedMeeting);
    setView("LIST");
  };

  const handleSaveMinutes = (minutesData) => {
    // Save the minutes data to the meeting
    updateMeeting(selectedMeeting.id, {
      ...selectedMeeting,
      minutes: minutesData,
    });
    setView("LIST");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {view === "LIST" && (
        <MrmList
          meetings={meetings}
          onCreate={handleCreateNew}
          onSelect={handleSelectMeeting}
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
          onNext={() => setView("MINUTES")}
        />
      )}

      {view === "MINUTES" && selectedMeeting && (
        <MinutesOfMeeting
          onSave={handleSaveMinutes}
          onBack={() => setView("LIST")}
        />
      )}
    </div>
  );
};

export default MrmPage;
