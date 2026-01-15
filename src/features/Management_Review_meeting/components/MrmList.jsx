// src/features/mrm/components/MrmList.jsx
import React from "react";
import { Plus, Calendar, CheckCircle, Clock } from "lucide-react";

const MrmList = ({ meetings, onSelect, onCreate }) => {
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Management Reviews
          </h1>
          <p className="text-gray-500">ISO 9001:2015 Clause 9.3 Compliance</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 text-black px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} /> Schedule New MRM
        </button>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelect(meeting)}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-full ${
                  meeting.status === "Closed"
                    ? "bg-green-50 text-green-600"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {meeting.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {meeting.date}
                  </span>
                  <span>•</span>
                  <span>{meeting.agenda}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(
                  meeting.status
                )}`}
              >
                {meeting.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MrmList;
