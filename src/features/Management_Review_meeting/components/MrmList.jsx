// src/features/mrm/components/MrmList.jsx
import React, { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import MeetingViewModal from "./MeetingViewModal";
import { useMrm } from "../hooks/useMrm";

const MrmList = ({
  meetings,
  onSelect,
  onCreate,
  onViewPdf,
  onViewMinutesPreview,
}) => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedMeetingForView, setSelectedMeetingForView] = useState(null);
  const { getActionItems, getMinutes } = useMrm();

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Scheduled":
        return "bg-blue-100 text-blue-800";
      case "Planned":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      case "Closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewMeeting = (meeting) => {
    setSelectedMeetingForView(meeting);
    setViewModalOpen(true);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="text-indigo-600" size={32} />
            Management Reviews
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-lg">
            ISO 9001:2015 Clause 9.3 - Management Review Meetings
          </p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-gray-600 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95 transition-all text-sm"
        >
          <Plus size={20} />
          New Meeting
        </button>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex justify-between items-center group"
          >
            <div className="flex items-center gap-4">
              <div>
                <h3 className="font-bold text-gray-800">{meeting.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    {meeting.date}
                  </span>
                  <span>•</span>
                  <span>{meeting.agenda}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                  meeting.status,
                )}`}
              >
                {meeting.status}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onViewMinutesPreview) {
                      onViewMinutesPreview(meeting);
                    }
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 hover:text-blue-600 transition-colors shadow-sm font-medium"
                >
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(meeting);
                  }}
                  className="bg-blue-600 text-gray-600 px-4 py-2 rounded-lg hover:bg-blue-700
                  hover:text-green-400
                  transition-colors shadow-sm font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      <MeetingViewModal
        meeting={selectedMeetingForView}
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        getActionItems={getActionItems}
        getMinutes={getMinutes}
        onViewPdf={onViewPdf}
      />
    </div>
  );
};

export default MrmList;

